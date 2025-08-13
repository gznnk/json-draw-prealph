import type {
	CreateDataType,
	CreateDiagramProps,
	CreateStateType,
} from "../shapes/CreateDiagramTypes";

/**
 * Type of the AgentNode data.
 */
export type AgentNodeData = CreateDataType<{
	transformative: true;
	connectable: true;
}>;

/**
 * State type for agent nodes.
 * Since AgentNodeData has no non-persistent keys, this directly extends the data type.
 */
export type AgentNodeState = CreateStateType<
	AgentNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;

/**
 * Type of the agent node component props.
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
