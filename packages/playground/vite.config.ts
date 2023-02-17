import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import githubBlock from '@covbot/vite-plugin-github-block';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), githubBlock()],
});
