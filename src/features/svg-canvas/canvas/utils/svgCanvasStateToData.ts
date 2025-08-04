// Import types.
import type { SvgCanvasData } from "../types/SvgCanvasData";
import type { SvgCanvasState } from "../types/SvgCanvasState";

// Import resistry.
import { DiagramRegistry } from "../../registry";

// Import utils.
import { applyFunctionRecursively } from "./applyFunctionRecursively";

/**
 * Conversion function from SvgCanvasState to SvgCanvasData.
 * Extracts only the necessary properties included in SvgCanvasData.
 *
 * @param state - Source SvgCanvasState
 * @returns SvgCanvasData object
 */
export const svgCanvasStateToData = (state: SvgCanvasState): SvgCanvasData => {
	return {
		id: state.id,
		minX: state.minX,
		minY: state.minY,
		items: applyFunctionRecursively(state.items, (item) => {
			const stateToDataMapper = DiagramRegistry.getStateToDataMapper(item.type);
			if (stateToDataMapper) {
				return stateToDataMapper(item);
			}
			// Fallback: return the item as is if no mapper is found
			return item;
		}),
	};
};
