import type { CreateStateType } from "./CreateStateType";
import type { EllipseData } from "../../data/shapes/EllipseData";

/**
 * State type for ellipse shapes.
 * Includes properties for styling, text, connections and transformations of elliptical elements.
 */
export type EllipseState = CreateStateType<
	EllipseData,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		strokable: true;
		fillable: true;
		textable: true;
	}
>;
