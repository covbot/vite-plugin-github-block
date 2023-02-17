import { createBlock } from '@covbot/vite-plugin-github-block/client';
import { react, useBlockContext } from '@covbot/vite-plugin-github-block/react';
import { FileBlockProps } from '@githubnext/blocks';

const SampleComponent = () => {
	const { content } = useBlockContext() as FileBlockProps;

	return (
		<div>
			<h1>Hello, world!</h1>
			{content}
		</div>
	);
};

export default createBlock({
	id: 'file-block',
	description: 'Sample file block',
	matches: ['*'],
	title: 'File Block',
	type: 'file',
	render: react(SampleComponent),
});
