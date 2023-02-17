import { createRoot } from 'react-dom/client';
import { ComponentType } from 'react';
import { FileBlockProps, FolderBlockProps } from '@githubnext/blocks';
import { BlockContext } from './BlockContext';

export const reactRenderer = (component: ComponentType) => {
	const InnerComponent = component;
	return (rootElement: HTMLElement, props: FileBlockProps | FolderBlockProps) => {
		const root = createRoot(rootElement);

		root.render(
			<BlockContext.Provider value={props}>
				<InnerComponent />
			</BlockContext.Provider>,
		);
	};
};
