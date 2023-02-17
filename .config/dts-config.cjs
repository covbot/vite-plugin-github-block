// @ts-check
const path = require('path');

/**
 * @param {string} relativePath
 * @returns string
 */
function file(relativePath) {
	return path.resolve(__dirname, '..', relativePath);
}

/** @type import('dts-bundle-generator/config-schema').BundlerConfig */
const config = {
	entries: [
		{
			filePath: file('src/node/plugin.ts'),
			outFile: file('dist/index.d.ts'),
		},
		{
			filePath: file('src/client/index.ts'),
			outFile: file('dist/client.d.ts'),
		},
		{
			filePath: file('src/react/index.ts'),
			outFile: file('dist/react.d.ts'),
		},
	],
	compilationOptions: {
		preferredConfigPath: file('.config/tsconfig.node.json'),
	},
};

module.exports = config;
