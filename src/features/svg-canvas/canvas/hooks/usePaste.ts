// Import React.
import { useCallback, useRef } from "react";

// Import types related to SvgCanvas.
import type { ConnectLineData } from "../../components/shapes/ConnectLine";
import type { GroupData } from "../../components/shapes/Group";
import type { Diagram } from "../../types/DiagramCatalog";
import type { CanvasHooksProps } from "../SvgCanvasTypes";

// Import functions related to SvgCanvas.
import { calcGroupBoxOfNoRotation } from "../../components/shapes/Group";
import { newId } from "../../utils/Diagram";
import {
	isConnectableData,
	isItemableData,
	isSelectableData,
} from "../../utils/TypeUtils";
import { MULTI_SELECT_GROUP } from "../SvgCanvasConstants";

/**
 * 図形をペーストする際の移動量
 */
const PASTE_OFFSET = 20;

/**
 * 旧IDと新IDのマッピングを追跡するためのマップ
 */
type IdMap = { [oldId: string]: string };

/**
 * IDを再採番し、座標をオフセットするための再帰的処理
 * @param item 処理する図形
 * @param idMap IDのマッピング
 * @returns 処理後の図形
 */
const processItemRecursively = (item: Diagram, idMap: IdMap): Diagram => {
	// 新しいID生成
	const newItemId = newId();
	idMap[item.id] = newItemId;

	// 図形の基本情報をコピー
	const newItem = {
		...item,
		id: newItemId,
	};

	// 座標を持つ要素の場合はオフセット
	if ("x" in newItem && "y" in newItem) {
		newItem.x = (newItem.x as number) + PASTE_OFFSET;
		newItem.y = (newItem.y as number) + PASTE_OFFSET;
	}

	// 接続ポイントを持つ場合は接続ポイントも処理
	if (isConnectableData(newItem) && newItem.connectPoints) {
		newItem.connectPoints = newItem.connectPoints.map((point) => {
			const newPointId = newId();
			idMap[point.id] = newPointId;

			return {
				...point,
				id: newPointId,
				x: point.x + PASTE_OFFSET,
				y: point.y + PASTE_OFFSET,
			};
		});
	}

	// 子アイテムがある場合は再帰的に処理
	if (isItemableData(newItem) && newItem.items) {
		newItem.items = newItem.items.map((childItem) =>
			processItemRecursively(childItem, idMap),
		);
	}

	return newItem;
};

/**
 * 接続線の更新
 * @param line 接続線
 * @param idMap IDマッピング
 * @returns 更新された接続線、または無効な場合はnull
 */
const processConnectLine = (
	line: ConnectLineData,
	idMap: IdMap,
): ConnectLineData | null => {
	// 両端が含まれているか確認
	if (!idMap[line.startOwnerId] || !idMap[line.endOwnerId]) {
		return null;
	}

	// 接続線を更新
	return {
		...line,
		id: newId(),
		x: line.x + PASTE_OFFSET,
		y: line.y + PASTE_OFFSET,
		startOwnerId: idMap[line.startOwnerId],
		endOwnerId: idMap[line.endOwnerId],
		items: line.items.map((point, index) => {
			let pointId: string;
			if (index === 0 || index === line.items.length - 1) {
				pointId = idMap[point.id] || newId();
			} else {
				pointId = newId();
			}

			return {
				...point,
				id: pointId,
				x: point.x + PASTE_OFFSET,
				y: point.y + PASTE_OFFSET,
			};
		}),
	};
};

/**
 * Custom hook to handle paste events on the canvas.
 */
export const usePaste = (props: CanvasHooksProps) => {
	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	return useCallback(() => {
		// Bypass references to avoid function creation in every render.
		const { setCanvasState } = refBus.current.props;

		// Read data from clipboard
		navigator.clipboard
			.readText()
			.then((clipboardText) => {
				try {
					// クリップボードデータをパース
					const clipboardData = JSON.parse(clipboardText) as Diagram[];

					if (!Array.isArray(clipboardData) || clipboardData.length === 0) {
						console.error("Invalid clipboard data format");
						return;
					}

					// IDのマッピングを保持
					const idMap: IdMap = {};

					// 図形と接続線を分離
					const connectLines = clipboardData.filter(
						(item) => item.type === "ConnectLine",
					) as ConnectLineData[];
					const normalItems = clipboardData.filter(
						(item) => item.type !== "ConnectLine",
					);

					// 複数選択モードかどうか判定
					const isMultiSelect = normalItems.length > 1;

					// 通常の図形を処理（IDの再採番とオフセット）
					const processedNormalItems = normalItems.map((item) =>
						processItemRecursively(item, idMap),
					);

					// キャンバスの状態を更新
					setCanvasState((prevState) => {
						// すべての既存アイテムの選択を解除
						const deselectedItems = prevState.items.map((item) => {
							if (isSelectableData(item)) {
								return {
									...item,
									isSelected: false,
									isMultiSelectSource: false,
								};
							}
							return item;
						});

						// 処理済みの通常アイテムをキャンバスに追加
						let allItems = [...deselectedItems, ...processedNormalItems];

						// 接続線を処理して追加
						if (connectLines.length > 0) {
							const processedConnectLines = connectLines
								.map((line) => processConnectLine(line, idMap))
								.filter((line): line is ConnectLineData => line !== null);

							allItems = [...allItems, ...processedConnectLines];
						}

						// 複数選択の場合はマルチセレクトグループを設定
						let multiSelectGroup = undefined;
						if (isMultiSelect) {
							// グループの位置とサイズを計算（既存のcalcGroupBoxOfNoRotation関数を使用）
							const box = calcGroupBoxOfNoRotation(processedNormalItems);

							multiSelectGroup = {
								id: MULTI_SELECT_GROUP,
								type: "Group",
								x: box.left + (box.right - box.left) / 2,
								y: box.top + (box.bottom - box.top) / 2,
								width: box.right - box.left,
								height: box.bottom - box.top,
								rotation: 0,
								scaleX: 1,
								scaleY: 1,
								keepProportion:
									prevState.multiSelectGroup?.keepProportion ?? true,
								isSelected: true,
								isMultiSelectSource: false,
								items: processedNormalItems,
							} as GroupData;
						}

						return {
							...prevState,
							items: allItems,
							isDiagramChanging: false,
							multiSelectGroup,
						};
					});
				} catch (error) {
					console.error("Error while pasting items from clipboard:", error);
				}
			})
			.catch((err) => {
				console.error("Failed to read clipboard contents:", err);
			});
	}, []);
};
