import { BlockDefinition } from './createBlock';

export type BlocksEntrypoint = {};

export function createEntrypoint(blocks: Record<string, () => Promise<unknown | BlockDefinition>>);
export function createEntrypoint(blocks: Record<string, unknown | BlockDefinition>);
export function createEntrypoint(
	blocks: Record<string, (() => Promise<unknown | BlockDefinition>) | unknown | BlockDefinition>,
) {
	return blocks;
}
