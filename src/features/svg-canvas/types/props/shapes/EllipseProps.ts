// Import types.
import type { CreateDiagramProps } from "./CreateDiagramProps";
import type { EllipseState } from "../../state/shapes/EllipseState";

/**
 * Props for Ellipse component
 */
export type EllipseProps = CreateDiagramProps<
	EllipseState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		textable: true;
	}
>;
