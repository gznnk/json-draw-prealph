import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { TextEditorState } from "../../components/core/Textable/TextEditor/TextEditorTypes";

/**
 * Properties for the useShortcutKey hook
 */
export type UseShortcutKeyProps = {
	/** Current state of the SVG canvas focus */
	hasFocus: RefObject<boolean>;
	/** Current state of the text editor */
	textEditorState: TextEditorState;
	/** Handler for deleting selected items */
	onDelete?: () => void;
	/** Handler for selecting all items */
	onSelectAll?: () => void;
	/** Handler for clearing all selections */
	onClearAllSelection?: () => void;
	/** Handler for undo operation */
	onUndo?: () => void;
	/** Handler for redo operation */
	onRedo?: () => void;
	/** Handler for copy operation */
	onCopy?: () => void;
	/** Handler for paste operation */
	onPaste?: () => void;
};

/** * Custom hook to handle keyboard shortcuts for the SVG canvas.
 * This hook manages global keyboard events and dispatches appropriate actions
 * based on the key combinations pressed.
 *
 * @param props - The properties for handling various shortcut operations
 */
export const useShortcutKey = (props: UseShortcutKeyProps): void => {
	// Store props in ref to avoid recreating effect on every prop change
	const propsRef = useRef(props);
	propsRef.current = props;

	useEffect(() => {
		/**
		 * Handle global keydown events for shortcuts
		 */
		const onDocumentKeyDown = (e: KeyboardEvent) => {
			const {
				hasFocus,
				textEditorState,
				onDelete,
				onSelectAll,
				onClearAllSelection,
				onUndo,
				onRedo,
				onCopy,
				onPaste,
			} = propsRef.current;

			// Skip processing if SVG canvas doesn't have focus and text editor is not active
			if (!hasFocus.current && !textEditorState.isActive) {
				return;
			}

			if (e.key === "Escape") {
				// Clear selection when Escape key is pressed
				onClearAllSelection?.();
			}
			if (e.key === "Delete") {
				// Delete selected items when Delete key is pressed
				onDelete?.();
			}
			if (e.ctrlKey) {
				if (e.key === "z") {
					// Undo the last action when Ctrl+Z is pressed
					onUndo?.();
				}
				if (e.key === "y") {
					// Redo the last action when Ctrl+Y is pressed
					onRedo?.();
				}
				if (e.key === "a" && !textEditorState.isActive) {
					// Select all items when Ctrl+A is pressed
					e.preventDefault();
					onSelectAll?.();
				}
				if (e.key === "c" && !textEditorState.isActive) {
					// Copy selected items when Ctrl+C is pressed
					e.preventDefault();
					onCopy?.();
				}
				if (e.key === "v" && !textEditorState.isActive) {
					// Paste items from clipboard when Ctrl+V is pressed
					e.preventDefault();
					onPaste?.();
				}
			}
		};

		// Add event listener for keydown events
		document.addEventListener("keydown", onDocumentKeyDown);

		return () => {
			document.removeEventListener("keydown", onDocumentKeyDown);
		};
	}, []);
};
