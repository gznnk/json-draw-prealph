import type { CreateDataType } from "./CreateDataType";
import type { ArrowHeadType } from "../base";

/**
 * 折れ線のデータ
 */
export type PathData = CreateDataType<{
	selectable: true;
	transformative: true;
	itemable: true;
	strokable: true;
}> & {
	startArrowHead?: ArrowHeadType;
	endArrowHead?: ArrowHeadType;
};
