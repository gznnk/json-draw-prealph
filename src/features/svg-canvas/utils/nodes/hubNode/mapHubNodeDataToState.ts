import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultHubNodeState } from "../../../constants/state/nodes/DefaultHubNodeState";
import type { HubNodeData } from "../../../types/diagrams/nodes/HubNodeTypes";
import type { HubNodeState } from "../../../types/diagrams/nodes/HubNodeTypes";

export const mapHubNodeDataToState =
	createDataToStateMapper<HubNodeState>(DefaultHubNodeState);

export const hubNodeDataToState = (data: HubNodeData): HubNodeState =>
	mapHubNodeDataToState(data);
