import type { CreateDataType } from "./CreateDataType";

/**
 * 楕円のデータ
 */
export type EllipseData = CreateDataType<{
	selectable: true;
	transformative: true;
	connectable: true;
	strokable: true;
	fillable: true;
	textable: true;
}>;
