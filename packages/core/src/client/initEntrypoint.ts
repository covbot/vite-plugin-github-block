import { BlocksEntrypoint } from './createEntrypoint';
import { init } from '@githubnext/blocks-runtime';
import { Block, FileBlockProps, FolderBlockProps } from '@githubnext/blocks';
import { BlockDefinition } from './createBlock';

export const initEntrypoint = (entrypoint: BlocksEntrypoint, rootElement: HTMLElement, previewUrl: string) => {
	if (globalThis.window && globalThis.window === globalThis.window.top) {
		globalThis.window.location.href = `${previewUrl}?devServer=${encodeURIComponent(
			globalThis.window.location.href,
		)}`;

		return;
	}

	const loadBlock = async (block: Block) => {
		const blockMetaGetter: (() => Promise<unknown>) | unknown | undefined = entrypoint[block.entry];
		const blockMeta: BlockDefinition = (
			typeof blockMetaGetter === 'function' ? await blockMetaGetter() : blockMetaGetter
		).default;

		const renderer = blockMeta['render'];

		return (props: FileBlockProps | FolderBlockProps) => {
			renderer(rootElement, props);
		};
	};

	init(loadBlock);
};
