import type { Diagram } from "../../types/state/core/Diagram";

/**
 * Get diagrams connected to the specified diagram ID.
 * This function finds all connect lines that have the specified diagram as start or end,
 * and returns the connected diagrams.
 *
 * @param diagramId - The ID of the diagram to find connections for
 * @param allDiagrams - All diagrams in the canvas
 * @returns Array of diagrams connected to the specified diagram
 */
export const getConnectedDiagrams = (
	diagramId: string,
	allDiagrams: Diagram[],
): Diagram[] => {
	const connectedDiagrams: Diagram[] = [];

	// Find all connect lines
	const connectLines = allDiagrams.filter(
		(diagram) => diagram.type === "ConnectLine",
	);

	// For each connect line, check if it connects to our diagram
	for (const connectLine of connectLines) {
		// Check if connectLine has the required properties
		if (
			"startOwnerId" in connectLine &&
			"endOwnerId" in connectLine &&
			typeof connectLine.startOwnerId === "string" &&
			typeof connectLine.endOwnerId === "string"
		) {
			let connectedDiagramId: string | null = null;

			// If our diagram is the start, get the end diagram
			if (connectLine.startOwnerId === diagramId) {
				connectedDiagramId = connectLine.endOwnerId;
			}
			// If our diagram is the end, get the start diagram
			else if (connectLine.endOwnerId === diagramId) {
				connectedDiagramId = connectLine.startOwnerId;
			}

			// Find the connected diagram and add it to results
			if (connectedDiagramId) {
				const connectedDiagram = allDiagrams.find(
					(diagram) => diagram.id === connectedDiagramId,
				);
				if (connectedDiagram && connectedDiagram.type !== "ConnectLine") {
					connectedDiagrams.push(connectedDiagram);
				}
			}
		}
	}

	return connectedDiagrams;
};