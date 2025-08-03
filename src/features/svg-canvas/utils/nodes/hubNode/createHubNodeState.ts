// Import types.
import type { HubNodeState } from "../../../types/state/nodes/HubNodeState";

// Import utils.
import { newId } from "../../shapes/common/newId";
import { createEllipseConnectPoint } from "../../shapes/ellipse/createEllipseConnectPoint";

// Import constants.
import { DefaultHubNodeState } from "../../../constants/state/nodes/DefaultHubNodeState";

export const createHubNodeState = ({
	x,
	y,
}: {
	x: number;
	y: number;
}) => {
	const connectPoints = createEllipseConnectPoint({
		x,
		y,
		width: DefaultHubNodeState.width,
		height: DefaultHubNodeState.height,
		rotation: DefaultHubNodeState.rotation,
		scaleX: DefaultHubNodeState.scaleX,
		scaleY: DefaultHubNodeState.scaleY,
	});

	return {
		...DefaultHubNodeState,
		id: newId(),
		x,
		y,
		connectPoints,
	} as HubNodeState;
};