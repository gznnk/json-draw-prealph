import type { Diagram, GroupData } from "./types/DiagramTypes";

// biome-ignore lint/suspicious/noExplicitAny: 型チェック関数のため
export const isGroupData = (obj: any): obj is GroupData => {
	return obj && typeof obj.type === "string" && Array.isArray(obj.items);
};

export const applyRecursive = (
	items: Diagram[],
	func: (item: Diagram) => Diagram,
) => {
	return items.map((item) => {
		const newItem = func(item);
		if (isGroupData(item) && isGroupData(newItem)) {
			newItem.items = applyRecursive(item.items ?? [], func);
		}
		return newItem;
	});
};
