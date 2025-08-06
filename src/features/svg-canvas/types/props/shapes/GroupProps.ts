// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "./CreateDiagramProps";
import type { GroupState } from "../../state/shapes/GroupState";

/**
 * Props for Group component.
 */
export type GroupProps = CreateDiagramProps<
	GroupState,
	{
		selectable: true;
		transformative: true;
		itemable: true;
		connectable: true;
		textable: true;
		executable: true;
	}
>;
