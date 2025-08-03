// Import types.
import type { AgentNodeState } from "../../../types/state/nodes/AgentNodeState";

// Import utils.
import { newId } from "../../shapes/common/newId";
import { createRectangleConnectPoint } from "../../shapes/rectangle/createRectangleConnectPoint";

// Import constants.
import { DefaultAgentNodeState } from "../../../constants/state/nodes/DefaultAgentNodeState";

export const createAgentNodeState = ({
	x,
	y,
}: {
	x: number;
	y: number;
}) => {
	const connectPoints = createRectangleConnectPoint({
		x,
		y,
		width: DefaultAgentNodeState.width,
		height: DefaultAgentNodeState.height,
		rotation: DefaultAgentNodeState.rotation,
		scaleX: DefaultAgentNodeState.scaleX,
		scaleY: DefaultAgentNodeState.scaleY,
	});

	return {
		...DefaultAgentNodeState,
		id: newId(),
		x,
		y,
		connectPoints,
	} as AgentNodeState;
};