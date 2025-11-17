import type { FolderTree } from "../../models/FolderTree";

/**
 * FolderTreeRepository provides an interface for managing folder tree data.
 */
export type FolderTreeRepository = {
	/**
	 * Saves an array of FolderTree objects to storage.
	 */
	saveFolderTrees(folderTrees: FolderTree[]): Promise<void>;

	/**
	 * Retrieves an array of FolderTree objects from storage.
	 */
	getFolderTrees(): Promise<FolderTree[]>;

	/**
	 * Saves a FileSystemDirectoryHandle to IndexedDB.
	 */
	saveDirectoryHandle(
		id: string,
		handle: FileSystemDirectoryHandle,
	): Promise<void>;

	/**
	 * Retrieves a FileSystemDirectoryHandle from IndexedDB.
	 */
	getDirectoryHandle(id: string): Promise<FileSystemDirectoryHandle | null>;
};
