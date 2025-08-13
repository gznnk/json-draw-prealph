import type {
	CreateDataType,
	CreateDiagramProps,
	CreateStateType,
} from "../shapes/CreateDiagramTypes";

/**
 * Type of the WebSearchNode data.
 */
export type WebSearchNodeData = CreateDataType<{
	transformative: true;
	connectable: true;
}>;

/**
 * State type for web search nodes.
 */
export type WebSearchNodeState = CreateStateType<
	WebSearchNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;

/**
 * Type of the web search node component props.
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
