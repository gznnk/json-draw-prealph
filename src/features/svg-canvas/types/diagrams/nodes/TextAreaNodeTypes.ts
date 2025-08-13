import type { RectangleData } from "../shapes/RectangleTypes";
import type {
	CreateDiagramProps,
	CreateStateType,
} from "../shapes/CreateDiagramTypes";

/**
 * Type of the TextAreaNode data.
 */
export type TextAreaNodeData = Omit<RectangleData, "type"> & {
	type: "TextAreaNode";
	text?: string;
	isTextEditing?: boolean;
};

/**
 * State type for text area nodes.
 * Since TextAreaNodeData has no non-persistent keys, this directly extends the data type.
 */
export type TextAreaNodeState = CreateStateType<
	TextAreaNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		textable: true;
		executable: true;
	}
>;

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
