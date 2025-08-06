import type { SvgToDiagramNodeData } from "../../data/nodes/SvgToDiagramNodeData";
import type { CreateStateType } from "../shapes/CreateStateType";

/**
 * State type for SVG to diagram nodes.
 * Since SvgToDiagramNodeData has no non-persistent keys, this directly extends the data type.
 */
export type SvgToDiagramNodeState = CreateStateType<
	SvgToDiagramNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;
