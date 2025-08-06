// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";
import type { ImageGenNodeState } from "../../state/nodes/ImageGenNodeState";

/**
 * Type of the ImageGenNode component props.
 */
export type ImageGenNodeProps = CreateDiagramProps<
	ImageGenNodeState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		executable: true;
		itemCreatable: true;
	}
>;
