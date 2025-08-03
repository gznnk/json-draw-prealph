// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";
import type { LLMNodeState } from "../../state/nodes/LLMNodeState";

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
