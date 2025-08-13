import type { EllipseData } from "../../../types/diagrams/shapes/EllipseData";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";
import { ConnectableDefaultData } from "./ConnectableDefaultData";
import { StrokableDefaultData } from "../core/StrokableDefaultData";
import { FillableDefaultData } from "../core/FillableDefaultData";
import { TextableDefaultData } from "../core/TextableDefaultData";

/**
 * Default ellipse data template.
 * Used for State to Data conversion mapping.
 */
export const EllipseDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	...ConnectableDefaultData,
	...StrokableDefaultData,
	...FillableDefaultData,
	...TextableDefaultData,
	type: "Ellipse",
} as const satisfies EllipseData;
