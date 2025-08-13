import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultTextAreaNodeState } from "../../../constants/state/nodes/DefaultTextAreaNodeState";
import type { TextAreaNodeData } from "../../../types/diagrams/nodes/TextAreaNodeTypes";
import type { TextAreaNodeState } from "../../../types/diagrams/nodes/TextAreaNodeTypes";

export const mapTextAreaNodeDataToState =
	createDataToStateMapper<TextAreaNodeState>(DefaultTextAreaNodeState);

export const textAreaNodeDataToState = (
	data: TextAreaNodeData,
): TextAreaNodeState => mapTextAreaNodeDataToState(data);
