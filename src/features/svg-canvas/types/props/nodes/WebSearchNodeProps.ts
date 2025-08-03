// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";
import type { WebSearchNodeState } from "../../state/nodes/WebSearchNodeState";

/**
 * Type of the WebSearchNode component props.
 */
export type WebSearchNodeProps = CreateDiagramProps<
	WebSearchNodeState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		executable: true;
	}
>;
