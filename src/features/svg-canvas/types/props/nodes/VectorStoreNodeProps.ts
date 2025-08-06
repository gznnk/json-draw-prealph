// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";
import type { VectorStoreNodeState } from "../../state/nodes/VectorStoreNodeState";

/**
 * Type of the VectorStoreNode component props.
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
