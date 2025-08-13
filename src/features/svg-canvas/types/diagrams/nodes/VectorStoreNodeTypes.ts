import type {
	CreateDataType,
	CreateDiagramProps,
	CreateStateType,
} from "../shapes/CreateDiagramTypes";

/**
 * Type of the VectorStoreNode data.
 */
export type VectorStoreNodeData = CreateDataType<{
	transformative: true;
	connectable: true;
}>;

/**
 * State type for vector store nodes.
 */
export type VectorStoreNodeState = CreateStateType<
	VectorStoreNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;

/**
 * Type of the vector store node component props.
 */
export type VectorStoreNodeProps = CreateDiagramProps<
	VectorStoreNodeState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		executable: true;
	}
>;
