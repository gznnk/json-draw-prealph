import type { OriginableData } from "../../types/data/core/OriginableData";
import type { Diagram } from "../../types/state/core/Diagram";

/**
 * Type guard to check if a diagram has origin properties.
 * Validates that the diagram has originX and originY properties with number type.
 *
 * @param diagram - The diagram to check
 * @returns True if the diagram has origin properties
 */
export const isOriginableState = (
	diagram: Diagram,
): diagram is Diagram & OriginableData => {
	return (
		"originX" in diagram &&
		"originY" in diagram &&
		typeof diagram.originX === "number" &&
		typeof diagram.originY === "number"
	);
};
