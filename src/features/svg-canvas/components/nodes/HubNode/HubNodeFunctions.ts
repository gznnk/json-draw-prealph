import { createEllipseData } from "../../shapes/Ellipse";

export const createHubNodeData = ({
	x,
	y,
}: {
	x: number;
	y: number;
}) => {
	const data = createEllipseData({
		x,
		y,
		stroke: "transparent",
		fill: "transparent",
	});

	data.type = "HubNode";

	return data;
};
