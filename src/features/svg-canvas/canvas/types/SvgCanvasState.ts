// Import types.
import type { TextEditorState } from "../../components/core/Textable";
import type { Diagram } from "../../types/diagrams/catalog/DiagramTypes";
import type { GroupState } from "../../types/diagrams/shapes/GroupTypes";
import type { PathState } from "../../types/diagrams/shapes/PathTypes";
import type { AreaSelectionState } from "./AreaSelectionState";
import type { GrabScrollState } from "./GrabScrollState";
import type { InteractionState } from "./InteractionState";
import type { SvgCanvasHistory } from "./SvgCanvasHistory";

/**
 * Type for the state of the SvgCanvas.
 */
export type SvgCanvasState = {
	id: string;
	minX: number;
	minY: number;
	zoom: number;
	items: Diagram[];
	multiSelectGroup?: GroupState;
	history: SvgCanvasHistory[];
	historyIndex: number;
	lastHistoryEventId: string;
	textEditorState: TextEditorState;
	previewConnectLineState?: PathState;
	grabScrollState?: GrabScrollState;
	interactionState: InteractionState;
	areaSelectionState: AreaSelectionState;
};
