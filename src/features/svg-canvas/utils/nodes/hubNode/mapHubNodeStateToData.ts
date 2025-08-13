import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { HubNodeDefaultData } from "../../../constants/data/nodes/HubNodeDefaultData";
import type { HubNodeData } from "../../../types/diagrams/nodes/HubNodeTypes";
import type { HubNodeState } from "../../../types/diagrams/nodes/HubNodeTypes";

export const mapHubNodeStateToData =
	createStateToDataMapper<HubNodeData>(HubNodeDefaultData);

export const hubNodeStateToData = (state: HubNodeState): HubNodeData =>
	mapHubNodeStateToData(state);
