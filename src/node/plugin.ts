import { Plugin } from 'vite';
import parseGitConfig from 'parse-git-config';
import type { ServerResponse } from 'node:http';

const sendJson = (res: ServerResponse, json: unknown) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(json));
};

const getEntrypointHtml = (rootDir: string) => `
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="">
  </head>
  <body>
    <div id="app">Hello, world!</div>
    <script type="module" src="/@fs/${rootDir}/blocks.entry.ts"></script>
  </body>
</html>
`;

const cleanUrl = (url: string): string => url.replace(/#.*$/s, '').replace(/\?.*$/s, '');

export default function pluginGithubBlock(): Plugin {
	let rootDirectory: string;

	const plugin: Plugin = {
		name: '@covbot/vite-plugin-github-block',
		configResolved(config) {
			rootDirectory = config.root;
		},
		configureServer(server) {
			server.middlewares.use((_, response, next) => {
				response.setHeader('Access-Control-Allow-Private-Network', 'true');
				next();
			});

			server.middlewares.use('/git.config.json', async (_, response) => {
				sendJson(response, await parseGitConfig());
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
						getEntrypointHtml(rootDirectory),
						request.originalUrl,
					);
					response.end(transformedHtml);
				});
			};
		},
	};

	return plugin;
}
