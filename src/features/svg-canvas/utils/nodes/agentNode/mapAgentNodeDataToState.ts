import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultAgentNodeState } from "../../../constants/state/nodes/DefaultAgentNodeState";
import type { AgentNodeData } from "../../../types/diagrams/nodes/AgentNodeTypes";
import type { AgentNodeState } from "../../../types/diagrams/nodes/AgentNodeTypes";

export const mapAgentNodeDataToState = createDataToStateMapper<AgentNodeState>(
	DefaultAgentNodeState,
);

export const agentNodeDataToState = (data: AgentNodeData): AgentNodeState =>
	mapAgentNodeDataToState(data);
