import { BlockDefinition } from './createBlock';

export type BlocksEntrypoint = {};

export function createEntrypoint(blocks: Record<string, () => Promise<unknown | BlockDefinition>>): BlocksEntrypoint;
export function createEntrypoint(blocks: Record<string, unknown | BlockDefinition>): BlocksEntrypoint;
export function createEntrypoint(
	blocks: Record<string, (() => Promise<unknown | BlockDefinition>) | unknown | BlockDefinition>,
): BlocksEntrypoint {
	return blocks;
}
