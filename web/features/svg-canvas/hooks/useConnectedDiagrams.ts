import { useSvgCanvasState } from "../context/SvgCanvasStateContext";
import type { Diagram } from "../types/state/core/Diagram";
import { getConnectedDiagrams } from "../utils/core/getConnectedDiagrams";

/**
 * Hook to get diagrams connected to the specified diagram ID.
 *
 * @param diagramId - The ID of the diagram to find connections for
 * @returns Array of diagrams connected to the specified diagram
 */
export const useConnectedDiagrams = (diagramId: string): Diagram[] => {
	const canvasStateRef = useSvgCanvasState();
	const allDiagrams = canvasStateRef.current?.items || [];

	return getConnectedDiagrams(diagramId, allDiagrams);
};