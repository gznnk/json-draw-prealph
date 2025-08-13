import type {
	CreateDataType,
	CreateDiagramProps,
	CreateStateType,
} from "../shapes/CreateDiagramTypes";

/**
 * Type of the hub node data.
 */
export type HubNodeData = CreateDataType<{
	transformative: true;
	connectable: true;
}>;

/**
 * State type for hub nodes.
 * Since HubNodeData has no non-persistent keys, this directly extends the data type.
 */
export type HubNodeState = CreateStateType<
	HubNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;

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
