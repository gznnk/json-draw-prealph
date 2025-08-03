import type { CreateStateType } from "./CreateStateType";
import type { RectangleData } from "../../data/shapes/RectangleData";

/**
 * State type for rectangle shapes.
 * Contains properties specific to rectangular diagram elements.
 */
export type RectangleState = CreateStateType<
	RectangleData,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		strokable: true;
		fillable: true;
		textable: true;
	}
>;
