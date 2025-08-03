// Import types related to SvgCanvas.
import type { CreateDataType } from "../shapes/CreateDataType";

/**
 * Type of the VectorStoreNode data.
 */
export type VectorStoreNodeData = CreateDataType<{
	transformative: true;
	connectable: true;
}>;
