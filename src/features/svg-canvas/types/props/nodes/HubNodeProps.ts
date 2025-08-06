// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";
import type { HubNodeState } from "../../state/nodes/HubNodeState";

/**
 * Type of the hub node component props.
 */
export type HubNodeProps = CreateDiagramProps<
	HubNodeState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		executable: true;
	}
>;
