import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		index: './src/node/plugin.ts',
		client: './src/client/index.ts',
	},
	format: ['cjs', 'esm'],
	outExtension({ format }) {
		if (format === 'esm') {
			return {
				js: '.mjs',
			};
		}

		if (format === 'cjs') {
			return {
				js: '.cjs',
			};
		}

		return {
			js: '.js',
		};
	},
});
