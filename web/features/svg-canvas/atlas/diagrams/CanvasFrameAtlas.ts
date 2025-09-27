import { CanvasFrame, CanvasFrameMinimap } from "../../components/diagrams/CanvasFrame";
import { CanvasFrameDefaultData } from "../../constants/data/diagrams/CanvasFrameDefaultData";
import { CanvasFrameDefaultState } from "../../constants/state/diagrams/CanvasFrameDefaultState";
import type { CanvasFrameData } from "../../types/data/diagrams/CanvasFrameData";
import { CanvasFrameFeatures } from "../../types/data/diagrams/CanvasFrameData";
import type { CanvasFrameProps } from "../../types/props/diagrams/CanvasFrameProps";
import type { CanvasFrameState } from "../../types/state/diagrams/CanvasFrameState";
import { createCanvasFrameState } from "../../utils/diagrams/canvasFrame/createCanvasFrameState";
import { mapCanvasFrameDataToState } from "../../utils/diagrams/canvasFrame/mapCanvasFrameDataToState";
import { canvasFrameStateToData } from "../../utils/diagrams/canvasFrame/mapCanvasFrameStateToData";
import {
	type DiagramAtlas,
	type DataToStateMapper,
	type StateToDataMapper,
	dummyImplementation,
} from "../DiagramAtlas";

/**
 * CanvasFrame Diagram Atlas
 *
 * Complete index and registry for CanvasFrame diagram-related components.
 * This atlas provides centralized access to all CanvasFrame-related types,
 * default values, components, and utility functions.
 *
 * This file serves both as a developer reference and as a programmatic
 * registry for the DiagramRegistry system.
 */

/**
 * CanvasFrame Diagram Atlas Type Definition
 */
type CanvasFrameAtlas = DiagramAtlas<CanvasFrameData, CanvasFrameState, CanvasFrameProps>;

/**
 * CanvasFrame Diagram Atlas Implementation
 */
export const CanvasFrameAtlas: CanvasFrameAtlas = {
	// ============================================================================
	// Types
	// ============================================================================

	type: "CanvasFrame",
	features: CanvasFrameFeatures,

	// ============================================================================
	// Defaults
	// ============================================================================

	defaultData: CanvasFrameDefaultData,
	defaultState: CanvasFrameDefaultState,

	// ============================================================================
	// Components
	// ============================================================================

	component: CanvasFrame,
	minimapComponent: CanvasFrameMinimap,

	// ============================================================================
	// Utility Functions
	// ============================================================================

	createState: createCanvasFrameState,
	export: undefined,
	calcConnectPointPosition: dummyImplementation,
	transformItems: undefined,
	dataToState: mapCanvasFrameDataToState as DataToStateMapper,
	stateToData: canvasFrameStateToData as StateToDataMapper,
};