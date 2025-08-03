// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";
import type { TextAreaNodeState } from "../../state/nodes/TextAreaNodeState";

/**
 * Type of the TextAreaNode component props.
 */
export type TextAreaNodeProps = CreateDiagramProps<
	TextAreaNodeState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		textable: true;
		executable: true;
	}
>;
