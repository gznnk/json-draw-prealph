// Import types.
import type { SvgCanvasData } from "../types/SvgCanvasData";
import type { Diagram } from "../../types/state/catalog/Diagram";

// Import resistry.
import { DiagramRegistry } from "../../registry";

// Import utils.
import { applyFunctionRecursively } from "./applyFunctionRecursively";

/**
 * Conversion function from SvgCanvasData to SvgCanvasState.
 * Converts data format back to state format for internal use.
 *
 * @param data - Source SvgCanvasData
 * @returns SvgCanvasState object
 */
/**
 * Conversion function from SvgCanvasData to converted items array.
 * Converts data format items back to state format for internal use.
 *
 * @param data - Source SvgCanvasData
 * @returns Converted items array in state format
 */
export const svgCanvasDataToState = (data: SvgCanvasData): Diagram[] => {
	return applyFunctionRecursively(data.items, (item) => {
		const dataToStateMapper = DiagramRegistry.getDataToStateMapper(item.type);
		if (dataToStateMapper) {
			return dataToStateMapper(item);
		}
		// Fallback: return the item as is if no mapper is found
		return item;
	});
};;