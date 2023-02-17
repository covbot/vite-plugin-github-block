import { FileBlockProps, FolderBlockProps } from '@githubnext/blocks';
import { createSafeContext, useSafeContext } from '@sirse-dev/safe-context';

export const BlockContext = createSafeContext<FileBlockProps | FolderBlockProps>();

export const useBlockContext = () => {
	return useSafeContext(BlockContext);
};
