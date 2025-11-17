import { useState, useEffect, useCallback } from "react";

import type { FolderTree, FolderNode } from "../models/FolderTree";
import { createFolderTreeRepository } from "../repository/folder-tree";
import type { FileSystemHandlePermissionDescriptor } from "../types/FileSystemAccess";

const repository = createFolderTreeRepository();

/**
 * Custom hook for managing folder trees with IndexedDB persistence.
 */
export const useFolderTrees = () => {
	const [folderTrees, setFolderTrees] = useState<FolderTree[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Load folder trees from IndexedDB on mount
	useEffect(() => {
		const loadFolderTrees = async () => {
			try {
				const trees = await repository.getFolderTrees();
				setFolderTrees(trees);
			} catch (error) {
				console.error("Failed to load folder trees:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadFolderTrees();
	}, []);

	// Save folder trees to IndexedDB whenever they change
	useEffect(() => {
		if (!isLoading) {
			repository.saveFolderTrees(folderTrees).catch((error) => {
				console.error("Failed to save folder trees:", error);
			});
		}
	}, [folderTrees, isLoading]);

	/**
	 * Opens a directory picker and adds the selected folder to the tree list.
	 */
	const openFolder = useCallback(async () => {
		try {
			// Check if File System Access API is supported
			if (!("showDirectoryPicker" in window)) {
				throw new Error("File System Access API is not supported");
			}

			const handle = await (
				window as typeof window & {
					showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
				}
			).showDirectoryPicker();
			const id = crypto.randomUUID();

			// Save the directory handle
			await repository.saveDirectoryHandle(id, handle);

			// Create new folder tree
			const newTree: FolderTree = {
				id,
				name: handle.name,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};

			setFolderTrees((prev) => [...prev, newTree]);
			return id;
		} catch (error) {
			if ((error as Error).name === "AbortError") {
				// User cancelled the picker
				return null;
			}
			console.error("Failed to open folder:", error);
			throw error;
		}
	}, []);

	/**
	 * Reads a directory recursively and returns a FolderNode tree.
	 */
	const readDirectoryTree = useCallback(
		async (
			dirHandle: FileSystemDirectoryHandle,
			parentPath = "",
		): Promise<FolderNode> => {
			const children: FolderNode[] = [];

			for await (const entry of (
				dirHandle as FileSystemDirectoryHandle & {
					values(): AsyncIterableIterator<FileSystemHandle>;
				}
			).values()) {
				const path = parentPath ? `${parentPath}/${entry.name}` : entry.name;

				if (entry.kind === "directory") {
					const childNode = await readDirectoryTree(
						entry as FileSystemDirectoryHandle,
						path,
					);
					children.push(childNode);
				} else {
					children.push({
						id: path,
						name: entry.name,
						kind: "file",
						handle: entry,
					});
				}
			}

			return {
				id: parentPath || dirHandle.name,
				name: dirHandle.name,
				kind: "directory",
				children,
				handle: dirHandle,
			};
		},
		[],
	);

	/**
	 * Loads the folder tree structure for a given folder tree ID.
	 */
	const loadFolderTree = useCallback(
		async (id: string): Promise<FolderNode | null> => {
			try {
				const handle = await repository.getDirectoryHandle(id);
				if (!handle) {
					return null;
				}

				// Request permission if needed
				const handleWithPermissions = handle as FileSystemDirectoryHandle & {
					queryPermission(
						descriptor?: FileSystemHandlePermissionDescriptor,
					): Promise<PermissionState>;
					requestPermission(
						descriptor?: FileSystemHandlePermissionDescriptor,
					): Promise<PermissionState>;
				};
				const permission = await handleWithPermissions.queryPermission({
					mode: "read",
				});
				if (permission !== "granted") {
					const requestResult = await handleWithPermissions.requestPermission({
						mode: "read",
					});
					if (requestResult !== "granted") {
						throw new Error("Permission denied");
					}
				}

				const tree = await readDirectoryTree(handle);
				return tree;
			} catch (error) {
				console.error("Failed to load folder tree:", error);
				throw error;
			}
		},
		[readDirectoryTree],
	);

	/**
	 * Removes a folder tree from the list.
	 */
	const removeFolder = useCallback((id: string) => {
		setFolderTrees((prev) => prev.filter((tree) => tree.id !== id));
	}, []);

	return {
		folderTrees,
		isLoading,
		openFolder,
		loadFolderTree,
		removeFolder,
	};
};
