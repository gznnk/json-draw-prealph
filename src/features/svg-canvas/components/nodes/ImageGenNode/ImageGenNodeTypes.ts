// Import types related to SvgCanvas.
import type {
	CreateDiagramProps,
	CreateDiagramType,
} from "../../../types/DiagramTypes";
import type { NewItemEvent } from "../../../types/EventTypes";

/**
 * Type of the ImageGenNode data.
 */
export type ImageGenNodeData = CreateDiagramType<{
	selectable: true;
	transformative: true;
	connectable: true;
}>;

/**
 * Type of the ImageGenNode component props.
 */
export type ImageGenNodeProps = CreateDiagramProps<
	ImageGenNodeData,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		executable: true;
	}
> & {
	onNewItem: (e: NewItemEvent) => void;
};
