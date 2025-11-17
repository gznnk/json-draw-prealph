import type { FolderTreeRepository } from "./interface";
import type { FolderTree } from "../../models/FolderTree";

/**
 * IndexedDBFolderTreeRepository provides a FolderTreeRepository implementation
 * that persists folder trees to IndexedDB.
 */
export class IndexedDBFolderTreeRepository implements FolderTreeRepository {
	private readonly dbName = "FolderTreeDB";
	private readonly dbVersion = 1;
	private readonly folderTreeStoreName = "folderTrees";
	private readonly handleStoreName = "directoryHandles";

	/**
	 * Opens or creates the IndexedDB database.
	 */
	private async openDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.dbVersion);

			request.onerror = () => {
				reject(new Error("Failed to open IndexedDB"));
			};

			request.onsuccess = () => {
				resolve(request.result);
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				// Create folder trees object store
				if (!db.objectStoreNames.contains(this.folderTreeStoreName)) {
					db.createObjectStore(this.folderTreeStoreName, { keyPath: "id" });
				}

				// Create directory handles object store
				if (!db.objectStoreNames.contains(this.handleStoreName)) {
					db.createObjectStore(this.handleStoreName);
				}
			};
		});
	}

	/**
	 * Saves an array of FolderTree objects to IndexedDB.
	 */
	async saveFolderTrees(folderTrees: FolderTree[]): Promise<void> {
		try {
			const db = await this.openDB();
			const transaction = db.transaction(
				[this.folderTreeStoreName],
				"readwrite",
			);
			const store = transaction.objectStore(this.folderTreeStoreName);

			// Clear existing data
			await new Promise<void>((resolve, reject) => {
				const clearRequest = store.clear();
				clearRequest.onsuccess = () => resolve();
				clearRequest.onerror = () => reject(clearRequest.error);
			});

			// Add new data (excluding handles and rootNode which can't be serialized)
			for (const folderTree of folderTrees) {
				const serializable = {
					id: folderTree.id,
					name: folderTree.name,
					createdAt: folderTree.createdAt,
					updatedAt: folderTree.updatedAt,
				};

				await new Promise<void>((resolve, reject) => {
					const addRequest = store.add(serializable);
					addRequest.onsuccess = () => resolve();
					addRequest.onerror = () => reject(addRequest.error);
				});
			}

			db.close();
		} catch (error) {
			throw new Error(
				`Failed to save folder trees to IndexedDB: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * Retrieves an array of FolderTree objects from IndexedDB.
	 */
	async getFolderTrees(): Promise<FolderTree[]> {
		try {
			const db = await this.openDB();
			const transaction = db.transaction(
				[this.folderTreeStoreName],
				"readonly",
			);
			const store = transaction.objectStore(this.folderTreeStoreName);

			const folderTrees = await new Promise<FolderTree[]>((resolve, reject) => {
				const request = store.getAll();
				request.onsuccess = () => resolve(request.result);
				request.onerror = () => reject(request.error);
			});

			db.close();
			return folderTrees;
		} catch (error) {
			throw new Error(
				`Failed to load folder trees from IndexedDB: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * Saves a FileSystemDirectoryHandle to IndexedDB.
	 */
	async saveDirectoryHandle(
		id: string,
		handle: FileSystemDirectoryHandle,
	): Promise<void> {
		try {
			const db = await this.openDB();
			const transaction = db.transaction([this.handleStoreName], "readwrite");
			const store = transaction.objectStore(this.handleStoreName);

			await new Promise<void>((resolve, reject) => {
				const request = store.put(handle, id);
				request.onsuccess = () => resolve();
				request.onerror = () => reject(request.error);
			});

			db.close();
		} catch (error) {
			throw new Error(
				`Failed to save directory handle to IndexedDB: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * Retrieves a FileSystemDirectoryHandle from IndexedDB.
	 */
	async getDirectoryHandle(
		id: string,
	): Promise<FileSystemDirectoryHandle | null> {
		try {
			const db = await this.openDB();
			const transaction = db.transaction([this.handleStoreName], "readonly");
			const store = transaction.objectStore(this.handleStoreName);

			const handle = await new Promise<FileSystemDirectoryHandle | null>(
				(resolve, reject) => {
					const request = store.get(id);
					request.onsuccess = () => resolve(request.result || null);
					request.onerror = () => reject(request.error);
				},
			);

			db.close();
			return handle;
		} catch (error) {
			throw new Error(
				`Failed to load directory handle from IndexedDB: ${(error as Error).message}`,
			);
		}
	}
}
