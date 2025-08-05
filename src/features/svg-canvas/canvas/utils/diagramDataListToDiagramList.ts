// Import types.
import type { DiagramData } from "../../types/data/catalog/DiagramData";
import type { Diagram } from "../../types/state/catalog/Diagram";

// Import utils.
import { applyFunctionRecursively } from "./applyFunctionRecursively";
import { mapDiagramDataToState } from "./mapDiagramDataToState";

/**
 * Converts a list of DiagramData items to Diagram state format.
 * Applies the conversion recursively to handle nested structures.
 *
 * @param items - Array of DiagramData items to convert
 * @returns Array of Diagram items in state format
 */
export const diagramDataListToDiagramList = (
	items: DiagramData[],
): Diagram[] => {
	return applyFunctionRecursively(items, mapDiagramDataToState);
};
