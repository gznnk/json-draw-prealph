// Reactのインポート
import type React from "react";
import { memo, useCallback } from "react";

// SvgCanvas関連コンポーネントをインポート
import Path from "../diagram/Path";

// SvgCanvas関連型定義をインポート
import type {
	ConnectLineData,
	DiagramBaseProps,
	TransformativeProps,
} from "../../types/DiagramTypes";
import type {
	DiagramDragEvent,
	GroupDataChangeEvent,
} from "../../types/EventTypes";

type ConnectLineProps = DiagramBaseProps &
	TransformativeProps &
	ConnectLineData & {
		onGroupDataChange?: (e: GroupDataChangeEvent) => void; // TODO: 共通化
	};

const ConnectLine: React.FC<ConnectLineProps> = ({
	id,
	point,
	width,
	height,
	rotation,
	scaleX,
	scaleY,
	fill = "none",
	stroke = "black",
	strokeWidth = "1px",
	isSelected = false,
	onClick,
	onDragStart,
	onDrag,
	onDragEnd,
	onSelect,
	onTransform,
	onGroupDataChange,
	items = [],
}) => {
	const isBothEndsPathPoint = useCallback(
		(id: string) => {
			const startId = items[0]?.id;
			const endId = items[items.length - 1]?.id;
			return id === startId || id === endId;
		},
		[items],
	);

	/**
	 * ドラッグ開始イベントハンドラ
	 */
	const handleDragStart = useCallback(
		(e: DiagramDragEvent) => {
			if (isBothEndsPathPoint(e.id)) {
				return;
			}
			onDragStart?.(e);
		},
		[onDragStart, isBothEndsPathPoint],
	);

	/**
	 * ドラッグ中イベントハンドラ
	 */
	const handleDrag = useCallback(
		(e: DiagramDragEvent) => {
			if (isBothEndsPathPoint(e.id)) {
				return;
			}
			onDrag?.(e);
		},
		[onDrag, isBothEndsPathPoint],
	);

	/**
	 * ドラッグ完了イベントハンドラ
	 */
	const handleDragEnd = useCallback(
		(e: DiagramDragEvent) => {
			if (isBothEndsPathPoint(e.id)) {
				return;
			}
			onDragEnd?.(e);
		},
		[onDragEnd, isBothEndsPathPoint],
	);

	return (
		<Path
			id={id}
			point={point}
			width={width}
			height={height}
			rotation={rotation}
			scaleX={scaleX}
			scaleY={scaleY}
			keepProportion={false}
			fill={fill}
			stroke={stroke}
			strokeWidth={strokeWidth}
			isSelected={isSelected}
			dragEnabled={false}
			transformEnabled={false}
			segmentDragEnabled={true}
			newVertexEnabled={true}
			onClick={onClick}
			onDragStart={handleDragStart}
			onDrag={handleDrag}
			onDragEnd={handleDragEnd}
			onSelect={onSelect}
			onTransform={onTransform}
			onGroupDataChange={onGroupDataChange}
			items={items}
		/>
	);
};

export default memo(ConnectLine);
