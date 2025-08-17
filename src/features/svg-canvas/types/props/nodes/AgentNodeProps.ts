// Import types.
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";
import type { AgentNodeState } from "../../state/nodes/AgentNodeState";

/**
 * Type of the AgentNode component props.
 */
export type AgentNodeProps = CreateDiagramProps<
	AgentNodeState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		executable: true;
	}
>;
