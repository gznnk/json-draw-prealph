// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";
import type { SvgToDiagramNodeState } from "../../state/nodes/SvgToDiagramNodeState";

/**
 * Type of the SvgToDiagramNode component props.
 */
export type SvgToDiagramNodeProps = CreateDiagramProps<
	SvgToDiagramNodeState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		executable: true;
	}
>;
