import type { FolderNode } from "../../app/models/FolderTree";

/**
 * Node data for react-arborist
 */
export type TreeNode = FolderNode & {
	children?: TreeNode[];
};
