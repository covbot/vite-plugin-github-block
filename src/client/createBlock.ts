export type BlockType = 'file' | 'folder';

export type BlockDefinition = {
	type: BlockType;
	id: string;
	title: string;
	description: string;
	matches: string[];
	example_path?: string;
	render: (element: HTMLElement) => void;
};

export const createBlock = (definition: BlockDefinition) => {
	return definition;
};
