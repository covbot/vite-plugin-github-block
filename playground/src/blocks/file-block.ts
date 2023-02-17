import { createBlock } from '@covbot/vite-plugin-github-block/client';

export default createBlock({
	id: 'file-block',
	description: 'Sample file block',
	matches: ['*'],
	title: 'File Block',
	type: 'file',
	render: () => {},
});
