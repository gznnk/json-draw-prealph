// Import React.
import { useCallback, useState } from "react";

// Import types related to SvgCanvas.
import type { ConnectLineData } from "../components/shapes/ConnectLine";
import type { Diagram, DiagramType } from "../types/DiagramCatalog";
import {
	PROPAGATION_EVENT_NAME,
	type ExecuteEvent,
	type NewDiagramEvent,
	type PropagationEvent,
} from "../types/EventTypes";

// Import components related to SvgCanvas.
import { createTextAreaNodeData } from "../components/nodes/TextAreaNode";
import { createEllipseData } from "../components/shapes/Ellipse";
import { createRectangleData } from "../components/shapes/Rectangle";

// Import functions related to SvgCanvas.
import { deepCopy } from "../utils/Util";

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
import { useTextEdit } from "./hooks/useTextEdit";
import { useTextChange } from "./hooks/useTextChange";
import { useGroup } from "./hooks/useGroup";
import { useUngroup } from "./hooks/useUngroup";
import { useUndo } from "./hooks/useUndo";
import { useRedo } from "./hooks/useRedo";
import { useCanvasResize } from "./hooks/useCanvasResize";
import { useStackOrderChange } from "./hooks/useStackOrderChange";
import { useNewItem } from "./hooks/useNewItem";

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

	// Handler for the start of text editing.
	const onTextEdit = useTextEdit(canvasHooksProps);

	// Handler for the text change event.
	const onTextChange = useTextChange(canvasHooksProps);

	// Handler for the group event.
	const onGroup = useGroup(canvasHooksProps);

	// Handler for the ungroup event.
	const onUngroup = useUngroup(canvasHooksProps);

	// Handler for the undo event.
	const onUndo = useUndo(canvasHooksProps);

	// Handler for the redo event.
	const onRedo = useRedo(canvasHooksProps);

	// Handler for the canvas resize event.
	const onCanvasResize = useCanvasResize(canvasHooksProps);

	// Handler for the stack order change event.
	const onStackOrderChange = useStackOrderChange(canvasHooksProps);

	// Handler for the new item event.
	const onNewItem = useNewItem(canvasHooksProps);

	// --- Functions for accessing the canvas state and modifying the canvas. --- //

	const addItem = useAddItem(canvasHooksProps);

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

	const canvasFunctions = {
		addItem,
	};

	return {
		state: [canvasState, setCanvasState],
		canvasProps,
		canvasFunctions,
	} as const;
};
