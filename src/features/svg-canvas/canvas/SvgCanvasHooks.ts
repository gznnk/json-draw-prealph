// Import React.
import { useCallback, useState } from "react";

// Import types related to SvgCanvas.
import type { PartiallyRequired } from "../../../types/ParticallyRequired";

// Import types related to SvgCanvas.
import type { ConnectLineData } from "../components/shapes/ConnectLine";
import type { GroupData } from "../components/shapes/Group";
import type { Diagram, DiagramType } from "../types/DiagramCatalog";
import {
	PROPAGATION_EVENT_NAME,
	type DiagramTextChangeEvent,
	type DiagramTextEditEvent,
	type ExecuteEvent,
	type NewDiagramEvent,
	type NewItemEvent,
	type PropagationEvent,
	type StackOrderChangeEvent,
	type SvgCanvasResizeEvent,
} from "../types/EventTypes";

// Import components related to SvgCanvas.
import { createTextAreaNodeData } from "../components/nodes/TextAreaNode";
import { createEllipseData } from "../components/shapes/Ellipse";
import { createRectangleData } from "../components/shapes/Rectangle";

// Import functions related to SvgCanvas.
import { isItemableData, newId } from "../utils/Diagram";
import { deepCopy, newEventId } from "../utils/Util";
import {
	addHistory,
	applyRecursive,
	clearMultiSelectSourceRecursive,
	getSelectedItems,
	removeGroupedRecursive,
	saveCanvasDataToLocalStorage,
	ungroupSelectedGroupsRecursive,
} from "./SvgCanvasFunctions";

// Imports related to this component.
import { createLLMNodeData } from "../components/nodes/LLMNode";
import { createSvgToDiagramNodeData } from "../components/nodes/SvgToDiagramNode";
import { createPathData } from "../components/shapes/Path";
import type { SvgCanvasState } from "./SvgCanvasTypes";

// Import canvas custom hooks.
import { useDiagramChange } from "./hooks/useDiagramChange";
import { useDrag } from "./hooks/useDrag";
import { useTransform } from "./hooks/useTransform";
import { useSelect } from "./hooks/useSelect";
import { useSelectAll } from "./hooks/useSelectAll";
import { useClearAllSelection } from "./hooks/useClearAllSelection";
import { useDelete } from "./hooks/useDelete";
import { useAddItem } from "./hooks/useAddItem";
import { useConnect } from "./hooks/useConnect";

// TODO: 精査
type UpdateItem = Omit<PartiallyRequired<Diagram, "id">, "type" | "isSelected">;

/**
 * The SvgCanvas state and functions.
 *
 * @param initialItems - The initial items to be displayed on the canvas.
 * @returns The state and functions of the SvgCanvas.
 */
export const useSvgCanvas = (
	initialWidth: number,
	initialHeight: number,
	initialItems: Diagram[],
) => {
	// The state of the canvas.
	const [canvasState, setCanvasState] = useState<SvgCanvasState>({
		minX: 0,
		minY: 0,
		width: initialWidth,
		height: initialHeight,
		items: initialItems,
		isDiagramChanging: false,
		history: [
			{
				minX: 0,
				minY: 0,
				width: initialWidth,
				height: initialHeight,
				items: deepCopy(initialItems),
			},
		],
		historyIndex: 0,
		lastHistoryEventId: "",
	});

	// Create props for the canvas hooks.
	const canvasHooksProps = {
		canvasState,
		setCanvasState,
	};

	// Handler for the drag event.
	const onDrag = useDrag(canvasHooksProps);

	// Handler for the transfrom event.
	const onTransform = useTransform(canvasHooksProps);

	// Handler for the diagram change event.
	const onDiagramChange = useDiagramChange(canvasHooksProps);

	// Handler for the select event.
	const onSelect = useSelect(canvasHooksProps);

	// Handler for the select all event.
	const onSelectAll = useSelectAll(canvasHooksProps);

	// Handler for the clear all selection event.
	const onClearAllSelection = useClearAllSelection(canvasHooksProps);

	// Handler for the delete event.
	const onDelete = useDelete(canvasHooksProps);

	// Handler for the diagram connect event.
	const onConnect = useConnect(canvasHooksProps);

	// --- Functions for accessing the canvas state and modifying the canvas. --- //

	const addItem = useAddItem(canvasHooksProps);

	/**
	 * テキスト編集イベントハンドラ（開始時のみ発火する）
	 */
	const onTextEdit = useCallback((e: DiagramTextEditEvent) => {
		setCanvasState((prevState) => ({
			...prevState,
			items: applyRecursive(prevState.items, (item) =>
				item.id === e.id ? { ...item, isTextEditing: true } : item,
			),
		}));
	}, []);

	/**
	 * テキスト変更イベントハンドラ（完了時のみ発火する）
	 */
	const onTextChange = useCallback((e: DiagramTextChangeEvent) => {
		setCanvasState((prevState) => {
			// 新しい状態を作成
			let newState = {
				...prevState,
				items: applyRecursive(prevState.items, (item) =>
					item.id === e.id
						? { ...item, text: e.text, isTextEditing: false }
						: item,
				),
			};

			// 履歴を追加
			newState.lastHistoryEventId = e.eventId;
			newState = addHistory(prevState, newState);

			return newState;
		});
	}, []);

	/**
	 * グループ化イベントハンドラ
	 */
	const onGroup = useCallback(() => {
		setCanvasState((prevState) => {
			const selectedItems = getSelectedItems(prevState.items);
			if (selectedItems.length < 2) {
				// 選択されている図形が2つ未満の場合はグループ化させない
				// ここに到達する場合は呼び出し元の制御に不備あり
				console.error("Invalid selection count for group.");
				return prevState;
			}

			if (!prevState.multiSelectGroup) {
				// Type checking for multiSelectGroup.
				// If this is the case, it means that the canvas state is invalid.
				console.error("Invalid multiSelectGroup state.");
				return prevState;
			}

			// Create a new group data.
			const group: GroupData = {
				...prevState.multiSelectGroup,
				id: newId(),
				type: "Group",
				isSelected: true,
				isMultiSelectSource: false,
				items: selectedItems.map((item) => ({
					...item,
					isSelected: false,
					isMultiSelectSource: false,
				})),
			};

			// グループ化された図形を図形配列から削除
			let items = removeGroupedRecursive(prevState.items);
			// 新しいグループを追加
			items = [...items, group];
			// 複数選択の選択元設定を解除
			items = clearMultiSelectSourceRecursive(items);

			// 新しい状態を作成
			let newState = {
				...prevState,
				items,
				multiSelectGroup: undefined,
			} as SvgCanvasState;

			// 履歴を追加
			newState.lastHistoryEventId = newEventId();
			newState = addHistory(prevState, newState);

			return newState;
		});
	}, []);

	/**
	 * グループ解除イベントハンドラ
	 */
	const onUngroup = useCallback(() => {
		setCanvasState((prevState) => {
			let newItems = ungroupSelectedGroupsRecursive(prevState.items);
			newItems = clearMultiSelectSourceRecursive(newItems);

			// 新しい状態を作成
			let newState = {
				...prevState,
				items: newItems,
				multiSelectGroup: undefined,
			} as SvgCanvasState;

			// 履歴を追加
			newState.lastHistoryEventId = newEventId();
			newState = addHistory(prevState, newState);

			return newState;
		});
	}, []);

	/**
	 * Handle undo action.
	 */
	const onUndo = useCallback(() => {
		undo(); // TODO: ここに直接関数の実装を記述する
	}, []);

	/**
	 * Handle redo action.
	 */
	const onRedo = useCallback(() => {
		redo(); // TODO: ここに直接関数の実装を記述する
	}, []);

	/**
	 * Handle canvas resize event.
	 */
	const onCanvasResize = useCallback((e: SvgCanvasResizeEvent) => {
		setCanvasState((prevState) => ({
			...prevState,
			...e, // Apply new minX, minY, width and height.
		}));
	}, []);

	/**
	 * Handle new diagram action.
	 */
	const onNewDiagram = useCallback(
		(e: NewDiagramEvent) => {
			const centerX = canvasState.minX + canvasState.width / 2;
			const centerY = canvasState.minY + canvasState.height / 2;

			const diagramType = e.diagramType as DiagramType;
			if (diagramType === "Rectangle") {
				addItem(createRectangleData({ x: centerX, y: centerY }) as Diagram);
			}
			if (diagramType === "Ellipse") {
				addItem(createEllipseData({ x: centerX, y: centerY }) as Diagram);
			}
			if (diagramType === "Path") {
				addItem(createPathData({ x: centerX, y: centerY }) as Diagram);
			}
			if (diagramType === "TextAreaNode") {
				addItem(createTextAreaNodeData({ x: centerX, y: centerY }) as Diagram);
			}
			if (diagramType === "LLMNode") {
				addItem(createLLMNodeData({ x: centerX, y: centerY }) as Diagram);
			}
			if (diagramType === "SvgToDiagramNode") {
				addItem(
					createSvgToDiagramNodeData({ x: centerX, y: centerY }) as Diagram,
				);
			}
		},
		[
			canvasState.minX,
			canvasState.minY,
			canvasState.width,
			canvasState.height,
			addItem,
		],
	);

	const onNewItem = useCallback(
		(e: NewItemEvent) => {
			addItem(e.item);
		},
		[addItem],
	);

	const onStackOrderChange = useCallback((e: StackOrderChangeEvent) => {
		setCanvasState((prevState) => {
			const moveInList = (items: Diagram[]): Diagram[] => {
				const index = items.findIndex((item) => item.id === e.id);
				if (index === -1) return items;

				const newItems = [...items];
				const [target] = newItems.splice(index, 1); // remove

				switch (e.changeType) {
					case "bringToFront":
						newItems.push(target);
						break;
					case "sendToBack":
						newItems.unshift(target);
						break;
					case "bringForward":
						if (index < newItems.length - 1) {
							newItems.splice(index + 1, 0, target);
						} else {
							newItems.push(target);
						}
						break;
					case "sendBackward":
						if (index > 0) {
							newItems.splice(index - 1, 0, target);
						} else {
							newItems.unshift(target);
						}
						break;
				}
				return newItems;
			};

			// 再帰的に探し、idが一致する図形の属する親のitems配列を対象に並び替える
			const updateOrderRecursive = (items: Diagram[]): Diagram[] => {
				return items.map((item) => {
					if (isItemableData(item)) {
						// グループ内を再帰的に調査
						if (item.items?.some((child) => child.id === e.id)) {
							return {
								...item,
								items: moveInList(item.items),
							};
						}
						return {
							...item,
							items: updateOrderRecursive(item.items ?? []),
						};
					}
					return item;
				});
			};

			// top-level にある場合の対応
			let items = prevState.items;
			if (items.some((item) => item.id === e.id)) {
				items = moveInList(items);
			} else {
				items = updateOrderRecursive(items);
			}

			// 履歴に追加
			let newState: SvgCanvasState = {
				...prevState,
				items,
			};
			newState.lastHistoryEventId = newEventId(); // TODO: Trigger側で設定するようにする
			newState = addHistory(prevState, newState);

			return newState;
		});
	}, []);

	const onExecute = useCallback(
		(e: ExecuteEvent) => {
			const lines = canvasState.items.filter((i) => {
				if (i.type !== "ConnectLine") return false;

				const connectLine = i as ConnectLineData;
				return connectLine.startOwnerId === e.id;
			}) as ConnectLineData[];

			const detail = {
				...e,
				targetId: lines.map((i) => i.endOwnerId),
			} as PropagationEvent;

			document.dispatchEvent(
				new CustomEvent(PROPAGATION_EVENT_NAME, {
					detail,
				}),
			);
		},
		[canvasState.items],
	);

	const canvasProps = {
		...canvasState,
		onDrag,
		onSelect,
		onSelectAll,
		onClearAllSelection,
		onDelete,
		onConnect,
		onTransform,
		onDiagramChange,
		onTextEdit,
		onTextChange,
		onGroup,
		onUngroup,
		onUndo,
		onRedo,
		onCanvasResize,
		onNewDiagram,
		onNewItem,
		onStackOrderChange,
		onExecute,
	};

	// --- Functions for accessing the canvas state and modifying the canvas. --- //

	const updateItem = useCallback((item: UpdateItem) => {
		setCanvasState((prevState) => ({
			...prevState,
			items: applyRecursive(prevState.items, (i) =>
				i.id === item.id ? { ...i, ...item } : i,
			),
		}));
	}, []);

	/**
	 * 元に戻す
	 */
	const undo = useCallback(() => {
		setCanvasState((prevState) => {
			// Get the previous state.
			const prevIndex = prevState.historyIndex - 1;
			if (prevIndex < 0) {
				// If there is no history, do nothing.
				return prevState;
			}
			const prevHistory = prevState.history[prevIndex];

			const ret = {
				...prevState,
				...prevHistory, // Overwrite the current state with the previous history.
				historyIndex: prevIndex,
			};

			// Save the canvas data to local storage.
			saveCanvasDataToLocalStorage(ret);

			return ret;
		});
	}, []);

	/**
	 * やり直す
	 */
	const redo = useCallback(() => {
		setCanvasState((prevState) => {
			// 次の状態を取得
			const nextIndex = prevState.historyIndex + 1;
			if (nextIndex >= prevState.history.length) {
				// 履歴がない場合は何もしない
				return prevState;
			}
			const nextHistory = prevState.history[nextIndex];

			// console.log("redo", nextHistory.lastHistoryEventId);

			const ret = {
				...prevState,
				...nextHistory, // Overwrite the current state with the next history.
				historyIndex: nextIndex,
			};

			saveCanvasDataToLocalStorage(ret); // Save the canvas data to local storage.

			return ret;
		});
	}, []);

	const canvasFunctions = {
		addItem,
		updateItem,
		undo,
		redo,
	};

	return {
		state: [canvasState, setCanvasState],
		canvasProps,
		canvasFunctions,
	} as const;
};
