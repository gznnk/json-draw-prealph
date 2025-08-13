import type { RectangleData } from "../shapes/RectangleTypes";
import type {
	CreateDiagramProps,
	CreateStateType,
} from "../shapes/CreateDiagramTypes";

/**
 * Type of the LLM node data.
 */
export type LLMNodeData = Omit<RectangleData, "type"> & {
	type: "LLMNode";
};

/**
 * State type for LLM nodes.
 * Since LLMNodeData has no non-persistent keys, this directly extends the data type.
 */
export type LLMNodeState = CreateStateType<
	LLMNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		textable: true;
		executable: true;
	}
>;

/**
 * Type of the LLM node component props.
 */
export type LLMNodeProps = CreateDiagramProps<
	LLMNodeState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		textable: true;
		executable: true;
		itemCreatable: true;
	}
>;
