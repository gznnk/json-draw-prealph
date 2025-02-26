// Reactのインポート
import type React from "react";
import { memo, useState, useRef, useCallback, useEffect } from "react";

// SvgCanvas関連型定義をインポート
import type { Point } from "../../types/CoordinateTypes";
// SvgCanvas関連型定義をインポート
import type { DiagramRef, RectangleData } from "../../types/DiagramTypes";
import type {
	DiagramHoverEvent,
	DiagramResizeEvent,
	GroupDragEvent,
	GroupResizeEvent,
	DiagramDragEvent,
} from "../../types/EventTypes";

// SvgCanvas関連コンポーネントをインポート
import type { DraggableProps } from "../core/Draggable";
import Draggable from "../core/Draggable";

import DragPoint from "../core/DragPoint";

type ConnectPointProps = {
	id: string;
	diagramId: string;
	point: Point;
	visible: boolean;
};

const ConnectPoint: React.FC<ConnectPointProps> = ({
	id,
	diagramId,
	point,
	visible,
}) => {
	// console.log("ConnectPoint rendered");
	// ホバー状態の管理
	const [isHovered, setIsHovered] = useState(false);
	// ドラッグ状態の管理
	const [isDragging, setIsDragging] = useState(false);

	const svgRef = useRef<SVGPathElement>({} as SVGPathElement);
	const dragPointRef = useRef<SVGGElement>({} as SVGGElement);

	const handleDragStart = (e: DiagramDragEvent) => {
		// console.log(e);
		setIsDragging(true);
	};

	const handleDrag = (e: DiagramDragEvent) => {
		svgRef.current.setAttribute(
			"d",
			`M ${point.x} ${point.y} L ${e.endPoint.x} ${e.endPoint.y}`,
		);
		dragPointRef.current?.dispatchEvent(
			new CustomEvent("ConnectPointDrag", {
				bubbles: true,
				detail: { id, point: e.endPoint },
			}),
		);
		// console.log(e);
	};

	const handleDragEnd = (e: DiagramDragEvent) => {
		setIsDragging(false);
		svgRef.current.removeAttribute("d");
		dragPointRef.current.setAttribute(
			"transform",
			`translate(${point.x}, ${point.y})`,
		);
		//console.log(e);

		dragPointRef.current?.dispatchEvent(
			new CustomEvent("ConnectPointDragEnd", {
				bubbles: true,
				detail: { id, point: e.endPoint },
			}),
		);
	};

	/**
	 * ホバー状態変更イベントハンドラ
	 *
	 * @param {DiagramHoverEvent} e ホバー状態変更イベント
	 * @returns {void}
	 */
	const handleHoverChange = useCallback((e: DiagramHoverEvent) => {
		setIsHovered(e.isHovered);
		//console.log("hovered", e.isHovered);
	}, []);

	return (
		<>
			<DragPoint
				id={id}
				point={point}
				color="rgba(120, 120, 1, 0.8)"
				visible={visible || isHovered}
				onDragStart={handleDragStart}
				onDrag={handleDrag}
				onDragEnd={handleDragEnd}
				onHoverChange={handleHoverChange}
				ref={dragPointRef}
			/>
			{isDragging && <path stroke="black" strokeWidth={1} ref={svgRef} />}
		</>
	);
};

export default memo(ConnectPoint);
