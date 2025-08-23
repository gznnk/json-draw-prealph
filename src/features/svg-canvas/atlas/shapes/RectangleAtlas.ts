/**
 * Rectangle図形関連ファイルの完全索引
 *
 * この索引ファイルは開発者がRectangle図形に関連する
 * 全ての型、デフォルト値、ユーティリティ関数を素早く
 * 見つけるために作成されています。
 *
 * 注意: このファイルは実際のプログラムでは使用しません。
 * 開発用の参照資料としてのみ使用してください。
 */
// ============================================================================
// 型定義 (Types)
// ============================================================================
import type { DiagramAtlas } from "../DiagramAtlas";
import type { RectangleData } from "../../types/data/shapes/RectangleData";
import type { RectangleState } from "../../types/state/shapes/RectangleState";
import type { RectangleProps } from "../../types/props/shapes/RectangleProps";
import { RectangleFeatures } from "../../types/data/shapes/RectangleData";

// ============================================================================
// デフォルト値 (Defaults)
// ============================================================================
import { RectangleDefaultData } from "../../constants/data/shapes/RectangleDefaultData";
import { RectangleDefaultState } from "../../constants/state/shapes/RectangleDefaultState";

// ============================================================================
// コンポーネント (Components)
// ============================================================================
import { Rectangle, RectangleMinimap } from "../../components/shapes/Rectangle";

// ============================================================================
// ユーティリティ関数 (Utility Functions)
// ============================================================================
import { createRectangleState } from "../../utils/shapes/rectangle/createRectangleState";
import { calcRectangleConnectPointPosition } from "../../utils/shapes/rectangle/calcRectangleConnectPointPosition";
import { rectangleDataToState } from "../../utils/shapes/rectangle/mapRectangleDataToState";
import { rectangleStateToData } from "../../utils/shapes/rectangle/mapRectangleStateToData";

/**
 * Rectangle図形の完全なAtlas定義型
 */
export type RectangleAtlas = DiagramAtlas<
	RectangleData,
	RectangleState,
	RectangleProps
>;

/**
 * Rectangle図形の実際のAtlasオブジェクト
 */
export const RectangleAtlas: RectangleAtlas = {
	// ============================================================================
	// 型定義 (Types)
	// ============================================================================
	type: "Rectangle",
	features: RectangleFeatures,

	// ============================================================================
	// デフォルト値 (Defaults)
	// ============================================================================

	defaultData: RectangleDefaultData,
	defaultState: RectangleDefaultState,

	// ============================================================================
	// コンポーネント (Components)
	// ============================================================================

	component: Rectangle,
	minimapComponent: RectangleMinimap,

	// ============================================================================
	// ユーティリティ関数 (Utility Functions)
	// ============================================================================

	createState: createRectangleState,
	export: undefined,
	calcConnectPointPosition: calcRectangleConnectPointPosition,
	dataToState: rectangleDataToState,
	stateToData: rectangleStateToData,
};
