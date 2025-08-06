import type { GroupData } from "../../../types/data/shapes/GroupData";
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";
import { ItemableDefaultData } from "../core/ItemableDefaultData";

/**
 * Default group data template.
 * Used for State to Data conversion mapping.
 */
export const GroupDefaultData = {
	...DiagramBaseDefaultData,
	...TransformativeDefaultData,
	...ItemableDefaultData,
	type: "Group",
} as const satisfies GroupData;