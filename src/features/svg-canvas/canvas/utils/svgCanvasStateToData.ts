import type { SvgCanvasData, SvgCanvasState } from "../SvgCanvasTypes";

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
		items: state.items,
	};
};
