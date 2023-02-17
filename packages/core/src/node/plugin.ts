import { Plugin } from 'vite';
import parseGitConfig from 'parse-git-config';
import type { ServerResponse } from 'node:http';
import { dirname, resolve } from 'node:path';
import { access, constants as fsConstants } from 'node:fs/promises';

const sendJson = (res: ServerResponse, json: unknown) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(json));
};

const VIRTUAL_ENTRYPOINT = '/virtual:entry';

const entrypointHtml = `
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${VIRTUAL_ENTRYPOINT}"></script>
  </body>
</html>
`.trim();

const getJsEntrypoint = (rootDirectory: string, previewUrl: string) =>
	`
import blockEntrypoint from '/@fs/${rootDirectory}/blocks.entry.ts';
import { initEntrypoint } from '@covbot/vite-plugin-github-block/client';

const rootElement = document.getElementById('root');

initEntrypoint(blockEntrypoint, rootElement, ${JSON.stringify(previewUrl)});
`.trim();

const findGitFolder = async (rootDirectory: string) => {
	let current = rootDirectory;
	while (current !== dirname(current)) {
		current = dirname(current);
		try {
			await access(resolve(current, '.git'), fsConstants.R_OK);
			return current;
		} catch {}
	}

	return rootDirectory;
};

const cleanUrl = (url: string): string => url.replace(/#.*$/s, '').replace(/\?.*$/s, '');

const DEFAULT_PREVIEW_URL = 'https://blocks.githubnext.com/githubnext/blocks/blob/main/README.md';

export type Options = {
	/**
	 * @default "https://blocks.githubnext.com/githubnext/blocks/blob/main/README.md"
	 */
	previewUrl?: string;
};

export default function pluginGithubBlock(options: Options = {}): Plugin {
	const previewUrl = options.previewUrl ?? DEFAULT_PREVIEW_URL;
	let rootDirectory: string;

	const plugin: Plugin = {
		name: '@covbot/vite-plugin-github-block',
		resolveId(id) {
			if (id === VIRTUAL_ENTRYPOINT) {
				return '\0' + VIRTUAL_ENTRYPOINT;
			}
		},
		load(id) {
			if (id === '\0' + VIRTUAL_ENTRYPOINT) {
				return getJsEntrypoint(rootDirectory, previewUrl);
			}
		},
		configResolved(config) {
			rootDirectory = config.root;
		},
		configureServer(server) {
			server.middlewares.use((_, response, next) => {
				response.setHeader('Access-Control-Allow-Private-Network', 'true');
				next();
			});

			server.middlewares.use('/git.config.json', async (_, response) => {
				const gitFolder = await findGitFolder(rootDirectory);
				sendJson(response, await parseGitConfig({ path: resolve(gitFolder, '.git', 'config') }));
			});

			server.middlewares.use('/blocks.config.json', async (_, response) => {
				const result = await server.ssrLoadModule(`/@fs/${rootDirectory}/blocks.entry.ts`);

				const blocks = Object.entries(result.default);

				const normalizedBlocks = [];
				for (const [entry, loadBlock] of blocks) {
					const {
						default: { render: _, ...blockMetadata },
					} = typeof loadBlock === 'function' ? await loadBlock() : loadBlock;

					normalizedBlocks.push({
						...blockMetadata,
						entry,
					});
				}

				sendJson(response, normalizedBlocks);
			});

			return () => {
				server.middlewares.use(async (request, response, next) => {
					const url = request.url && cleanUrl(request.url);

					if (!url || !url.endsWith('.html')) {
						next();
						return;
					}

					response.statusCode = 200;
					response.setHeader('Content-Type', 'text/html');
					const transformedHtml = await server.transformIndexHtml(
						request.url,
						entrypointHtml,
						request.originalUrl,
					);
					response.end(transformedHtml);
				});
			};
		},
	};

	return plugin;
}
