import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { AgentNodeDefaultData } from "../../../constants/data/nodes/AgentNodeDefaultData";
import type { AgentNodeData } from "../../../types/diagrams/nodes/AgentNodeTypes";
import type { AgentNodeState } from "../../../types/diagrams/nodes/AgentNodeTypes";

export const mapAgentNodeStateToData =
	createStateToDataMapper<AgentNodeData>(AgentNodeDefaultData);

export const agentNodeStateToData = (state: AgentNodeState): AgentNodeData =>
	mapAgentNodeStateToData(state);
