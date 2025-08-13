// Import types.
import type { PageDesignNodeState } from "../../../types/diagrams/nodes/PageDesignNodeTypes";

// Import utils.
import { newId } from "../../shapes/common/newId";
import { createRectangleConnectPoint } from "../../shapes/rectangle/createRectangleConnectPoint";

// Import constants.
import { DefaultPageDesignNodeState } from "../../../constants/state/nodes/DefaultPageDesignNodeState";

export const createPageDesignNodeState = ({
	x,
	y,
}: {
	x: number;
	y: number;
}) => {
	const connectPoints = createRectangleConnectPoint({
		x,
		y,
		width: DefaultPageDesignNodeState.width,
		height: DefaultPageDesignNodeState.height,
		rotation: DefaultPageDesignNodeState.rotation,
		scaleX: DefaultPageDesignNodeState.scaleX,
		scaleY: DefaultPageDesignNodeState.scaleY,
	});

	return {
		...DefaultPageDesignNodeState,
		id: newId(),
		x,
		y,
		connectPoints,
	} as PageDesignNodeState;
};
