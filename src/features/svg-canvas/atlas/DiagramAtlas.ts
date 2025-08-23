/**
 * 図形Atlas用の共通型定義
 * 各図形のAtlasファイルで使用される構造化された型システム
 */
import type { DiagramFeatures } from "../types/core/DiagramFeatures";
import type { DiagramType } from "../types/core/DiagramType";
import type { ConnectPointState } from "../types/state/shapes/ConnectPointState";

/**
 * 図形Atlasの基本構造を定義する型
 *
 * @template TData - データ型
 * @template TFeatures - フィーチャー型
 * @template TState - ステート型
 * @template TProps - Props型
 */
export type DiagramAtlas<
	// biome-ignore lint/suspicious/noExplicitAny: Generic type parameter requires flexibility
	TData = any,
	// biome-ignore lint/suspicious/noExplicitAny: Generic type parameter requires flexibility
	TState = any,
	// biome-ignore lint/suspicious/noExplicitAny: Generic type parameter requires flexibility
	TProps = any,
> = {
	// ============================================================================
	// 型定義 (Types)
	// ============================================================================

	/** Type identifier */
	type: DiagramType;

	/** Data Types (Serialization) */
	features: DiagramFeatures;

	// ============================================================================
	// デフォルト値 (Defaults)
	// ============================================================================

	/** Default Data */
	defaultData: TData;

	/** Default State */
	defaultState: TState;

	// ============================================================================
	// コンポーネント (Components)
	// ============================================================================

	/** Component */
	component: React.FC<TProps>;

	/** Minimap Component */
	minimapComponent: React.FC<TProps>;

	// ============================================================================
	// ユーティリティ関数 (Utility Functions)
	// ============================================================================

	/** Create Functions */
	// biome-ignore lint/suspicious/noExplicitAny: Dynamic props require flexible typing
	createState: (props: { x: number; y: number; [key: string]: any }) => TState;

	/** Export Function */
	export?: (state: TState) => TData;

	/** Calculator Functions */
	calcConnectPointPosition?: (state: TState) => ConnectPointState[];

	/** Mapper Functions */
	dataToState: (data: TData) => TState;
	stateToData: (state: TState) => TData;
};
