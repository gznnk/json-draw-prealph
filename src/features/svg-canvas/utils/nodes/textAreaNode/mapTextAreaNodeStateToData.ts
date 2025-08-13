import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { TextAreaNodeDefaultData } from "../../../constants/data/nodes/TextAreaNodeDefaultData";
import type { TextAreaNodeData } from "../../../types/diagrams/nodes/TextAreaNodeTypes";
import type { TextAreaNodeState } from "../../../types/diagrams/nodes/TextAreaNodeTypes";

export const mapTextAreaNodeStateToData =
	createStateToDataMapper<TextAreaNodeData>(TextAreaNodeDefaultData);

export const textAreaNodeStateToData = (
	state: TextAreaNodeState,
): TextAreaNodeData => mapTextAreaNodeStateToData(state);
