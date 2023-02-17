import { FileBlockProps, FolderBlockProps } from '@githubnext/blocks';

export type BlockType = 'file' | 'folder';

export type BlockDefinition = {
	type: BlockType;
	id: string;
	title: string;
	description: string;
	matches: string[];
	example_path?: string;
	render: (element: HTMLElement, props: FileBlockProps | FolderBlockProps) => void;
};

export const createBlock = (definition: BlockDefinition) => {
	return definition;
};
