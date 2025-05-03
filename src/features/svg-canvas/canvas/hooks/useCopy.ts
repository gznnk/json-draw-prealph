// Import React.
import { useCallback, useRef } from "react";

// Import types related to SvgCanvas.
import type { ConnectLineData } from "../../components/shapes/ConnectLine";
import type { Diagram } from "../../types/DiagramCatalog";
import type { CanvasHooksProps } from "../SvgCanvasTypes";

// Import functions related to SvgCanvas.
import { isItemableData } from "../../utils/TypeUtils";
import { getSelectedItems } from "../SvgCanvasFunctions";

/**
 * 指定されたIDのリストに含まれる図形IDを全て集める
 * (グループ内の図形も含む)
 *
 * @param items 図形のリスト
 * @param idSet 集めるIDのセット
 */
const collectAllShapeIds = (items: Diagram[], idSet: Set<string>) => {
	for (const item of items) {
		idSet.add(item.id);

		// 子要素を持つ場合は再帰的に処理
		if (isItemableData(item) && item.items) {
			collectAllShapeIds(item.items, idSet);
		}
	}
};

/**
 * 選択した図形に接続された接続線のうち、両端が選択されているものを取得する
 *
 * @param allItems キャンバス上の全アイテム
 * @param selectedIds 選択された図形のID集合
 * @returns 両端が選択されている接続線のリスト
 */
const findConnectLinesWithBothEndsSelected = (
	allItems: Diagram[],
	selectedIds: Set<string>,
): ConnectLineData[] => {
	return allItems
		.filter((item) => item.type === "ConnectLine")
		.map((item) => item as ConnectLineData)
		.filter(
			(connectLine) =>
				selectedIds.has(connectLine.startOwnerId) &&
				selectedIds.has(connectLine.endOwnerId),
		);
};

/**
 * Custom hook to handle copy events on the canvas.
 */
export const useCopy = (props: CanvasHooksProps) => {
	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	return useCallback(() => {
		// Bypass references to avoid function creation in every render.
		const {
			canvasState: { items, multiSelectGroup },
		} = refBus.current.props;

		// マルチセレクトグループが存在する場合はその中のアイテムをコピー
		let selectedItems: Diagram[];
		if (multiSelectGroup) {
			// multiSelectGroupのitemsプロパティを使用
			selectedItems = multiSelectGroup.items;
		} else {
			// 通常の選択アイテムを取得
			selectedItems = getSelectedItems(items);
		}

		// If no items are selected, do nothing.
		if (selectedItems.length === 0) return;

		try {
			// 選択された図形のIDを収集
			const selectedIds = new Set<string>();
			collectAllShapeIds(selectedItems, selectedIds);

			// 両端が選択されている接続線を取得
			const connectLines = findConnectLinesWithBothEndsSelected(
				items,
				selectedIds,
			);

			// コピー対象に接続線を追加
			const itemsToCopy = [...selectedItems, ...connectLines];

			const clipboardData = JSON.stringify(itemsToCopy);

			// Copy the data to the clipboard.
			navigator.clipboard
				.writeText(clipboardData)
				.then(() => {
					console.log("Selected items copied to clipboard.");
				})
				.catch((err) => {
					console.error("Could not copy items to clipboard: ", err);
				});
		} catch (error) {
			console.error("Error while copying selected items to clipboard: ", error);
		}
	}, []);
};
