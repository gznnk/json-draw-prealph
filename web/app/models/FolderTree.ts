/**
 * Represents a file or directory node in the folder tree
 */
export type FolderNode = {
	id: string;
	name: string;
	kind: "file" | "directory";
	children?: FolderNode[];
	handle?: FileSystemHandle;
};

/**
 * Represents a folder tree with metadata
 */
export type FolderTree = {
	id: string;
	name: string;
	rootHandle?: FileSystemDirectoryHandle;
	rootNode?: FolderNode;
	createdAt: number;
	updatedAt: number;
};
