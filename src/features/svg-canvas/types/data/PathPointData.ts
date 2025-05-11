import type { DiagramBaseData } from "../base";

/**
 * 折れ線の頂点のデータ
 */
export type PathPointData = DiagramBaseData & {
	hidden?: boolean;
};
