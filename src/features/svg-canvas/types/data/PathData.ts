import type { CreateDataType } from "./CreateDataType";
import type { ArrowHeadType, DiagramBaseData } from "../base";

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

/**
 * 折れ線の頂点のデータ
 */
export type PathPointData = DiagramBaseData & {
	hidden: boolean;
};
