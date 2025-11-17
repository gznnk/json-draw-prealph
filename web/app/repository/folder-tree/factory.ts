import { IndexedDBFolderTreeRepository } from "./indexedDBImpl";
import type { FolderTreeRepository } from "./interface";

/**
 * Creates and returns an instance of FolderTreeRepository.
 */
export const createFolderTreeRepository = (): FolderTreeRepository => {
	return new IndexedDBFolderTreeRepository();
};
