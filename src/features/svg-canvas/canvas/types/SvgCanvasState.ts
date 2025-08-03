// Import types.
import type { TextEditorState } from "../../components/core/Textable";
import type { GroupState } from "../../types/state/shapes/GroupState";
import type { PathState } from "../../types/state/shapes/PathState";
import type { AreaSelectionState } from "./AreaSelectionState";
import type { GrabScrollState } from "./GrabScrollState";
import type { InteractionState } from "./InteractionState";
import type { SvgCanvasData } from "./SvgCanvasData";
import type { SvgCanvasHistory } from "./SvgCanvasHistory";

/**
 * Type for the state of the SvgCanvas.
 */
export type SvgCanvasState = {
	zoom: number;
	multiSelectGroup?: GroupState;
	history: SvgCanvasHistory[];
	historyIndex: number;
	lastHistoryEventId: string;
	textEditorState: TextEditorState;
	previewConnectLineState?: PathState;
	grabScrollState?: GrabScrollState;
	interactionState: InteractionState;
	areaSelectionState: AreaSelectionState;
} & SvgCanvasData;
