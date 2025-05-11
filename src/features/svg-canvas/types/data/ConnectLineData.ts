import type { ArrowHeadType } from "../base";
import type { CreateDataType } from "./CreateDataType";

/**
 * 接続線のデータ
 */
export type ConnectLineData = CreateDataType<{
	selectable: true;
	transformative: true;
	itemable: true;
	strokable: true;
}> & {
	startOwnerId: string;
	endOwnerId: string;
	autoRouting: boolean;
	startArrowHead?: ArrowHeadType;
	endArrowHead?: ArrowHeadType;
};
