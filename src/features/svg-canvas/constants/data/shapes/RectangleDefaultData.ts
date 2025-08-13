import type { RectangleData } from "../../../types/diagrams/shapes/RectangleData";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";
import { ConnectableDefaultData } from "./ConnectableDefaultData";
import { StrokableDefaultData } from "../core/StrokableDefaultData";
import { FillableDefaultData } from "../core/FillableDefaultData";
import { TextableDefaultData } from "../core/TextableDefaultData";

/**
 * Default rectangle data template.
 * Used for State to Data conversion mapping.
 */
export const RectangleDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	...ConnectableDefaultData,
	...StrokableDefaultData,
	...FillableDefaultData,
	...TextableDefaultData,
	type: "Rectangle",
	radius: 0,
} as const satisfies RectangleData;
