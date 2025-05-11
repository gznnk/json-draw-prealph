import type { CreateDataType } from "./CreateDataType";

/**
 * グループのデータ
 */
export type GroupData = CreateDataType<{
	selectable: true;
	transformative: true;
	itemable: true;
}>;
