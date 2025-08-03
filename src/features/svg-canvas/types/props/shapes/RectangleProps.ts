// Import types.
import type { CreateDiagramProps } from "./CreateDiagramProps";
import type { RectangleState } from "../../state/shapes/RectangleState";

/**
 * Props for Rectangle component
 */
export type RectangleProps = CreateDiagramProps<
	RectangleState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		textable: true;
		fileDroppable: true;
	}
>;
