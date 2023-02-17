import { createEntrypoint } from '@covbot/vite-plugin-github-block/client';
if (window === window.top) {
	window.location.href = `https://blocks.githubnext.com/?devServer=${encodeURIComponent(window.location.href)}`;
}
export default createEntrypoint(import.meta.glob('./src/blocks/*.ts'));
