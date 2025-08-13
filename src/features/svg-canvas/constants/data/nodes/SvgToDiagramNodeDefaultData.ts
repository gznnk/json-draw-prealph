import type { SvgToDiagramNodeData } from "../../../types/diagrams/nodes/SvgToDiagramNodeData";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";
import { ConnectableDefaultData } from "../shapes/ConnectableDefaultData";

/**
 * Default SVG to diagram node data template.
 * Used for State to Data conversion mapping.
 */
export const SvgToDiagramNodeDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	...ConnectableDefaultData,
	type: "SvgToDiagramNode",
} as const satisfies SvgToDiagramNodeData;
