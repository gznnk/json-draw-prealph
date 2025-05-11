import type { CreateDataType } from "./CreateDataType";

/**
 * 矩形のデータ
 */
export type RectangleData = CreateDataType<{
	selectable: true;
	transformative: true;
	connectable: true;
	strokable: true;
	fillable: true;
	textable: true;
}> & {
	radius: number;
};
