import type { ConnectLineData } from "../../../types/diagrams/shapes/ConnectLineData";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";
import { ItemableDefaultData } from "../core/ItemableDefaultData";
import { StrokableDefaultData } from "../core/StrokableDefaultData";

/**
 * Default connect line data template.
 * Used for State to Data conversion mapping.
 */
export const ConnectLineDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	...ItemableDefaultData,
	...StrokableDefaultData,
	type: "ConnectLine",
	stroke: "#002766",
	strokeWidth: "2px",
	startOwnerId: "",
	endOwnerId: "",
	autoRouting: true,
	endArrowHead: "Circle",
} as const satisfies ConnectLineData;
