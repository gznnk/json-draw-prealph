/**
 * Defines the available shapes for arrow heads in diagram connections.
 * These types determine the visual appearance of connection endpoints.
 * Includes standard arrows and UML relationship markers.
 */
export type ArrowHeadType =
	| "FilledTriangle" // Standard arrow (filled triangle)
	| "ConcaveTriangle" // Concave triangle arrow
	| "OpenArrow" // UML Dependency (open arrow)
	| "HollowTriangle" // UML Generalization (inheritance, white-filled triangle)
	| "FilledDiamond" // UML Composition (black-filled diamond)
	| "HollowDiamond" // UML Aggregation (white-filled diamond)
	| "Circle" // Circle marker
	| "None"; // No marker
