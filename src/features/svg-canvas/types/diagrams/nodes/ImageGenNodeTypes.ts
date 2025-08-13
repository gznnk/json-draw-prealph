import type {
	CreateDataType,
	CreateDiagramProps,
	CreateStateType,
} from "../shapes/CreateDiagramTypes";

/**
 * Type of the ImageGenNode data.
 */
export type ImageGenNodeData = CreateDataType<{
	transformative: true;
	connectable: true;
}>;

/**
 * State type for image generation nodes.
 * Since ImageGenNodeData has no non-persistent keys, this directly extends the data type.
 */
export type ImageGenNodeState = CreateStateType<
	ImageGenNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;

/**
 * Type of the image generation node component props.
 */
export type ImageGenNodeProps = CreateDiagramProps<
	ImageGenNodeState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		executable: true;
	}
>;
