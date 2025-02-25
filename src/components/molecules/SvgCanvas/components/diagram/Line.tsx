import type React from "react";
import {
	useCallback,
	useRef,
	forwardRef,
	memo,
	useImperativeHandle,
} from "react";
import Draggable from "../core/Draggable";
import DragPoint from "../core/DragPoint";
import type { Point } from "../../types/CoordinateTypes";
import type {
	DiagramDragEvent,
	DiagramPointerEvent,
} from "../../types/EventTypes";
import type {
	Diagram,
	DiagramRef,
	DiagramBaseProps,
	LineData,
} from "../../types/DiagramTypes";
import Group from "./Group";

const createDValue = (
	items: Diagram[],
	originPoint: Point = { x: 0, y: 0 },
) => {
	let d = "";
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		d += `${i === 0 ? "M" : "L"} ${item.point.x - originPoint.x} ${item.point.y - originPoint.y} `;
	}
	return d;
};

export type LineProps = DiagramBaseProps & LineData;

const Line: React.FC<LineProps> = memo(
	forwardRef<DiagramRef, LineProps>(
		(
			{
				id,
				point,
				width,
				height,
				fill = "none",
				stroke = "black",
				strokeWidth = "1px",
				keepProportion = false,
				isSelected = false,
				onDiagramClick,
				onDiagramResizeStart,
				onDiagramResizing,
				onDiagramResizeEnd,
				onDiagramDragStart,
				onDiagramDrag,
				onDiagramDragEnd,
				onDiagramDragEndByGroup,
				onDiagramSelect,
				items = [],
			},
			ref,
		) => {
			const svgRef = useRef<SVGPathElement>({} as SVGPathElement);
			const dragSvgRef = useRef<SVGPathElement>({} as SVGPathElement);
			const groupRef = useRef<DiagramRef>({} as DiagramRef);

			useImperativeHandle(ref, () => groupRef.current);

			const handleChildDiagramDrag = useCallback(
				(e: DiagramDragEvent) => {
					let d = "";
					for (let i = 0; i < items.length; i++) {
						const item = items[i];
						const x = item.id === e.id ? e.endPoint.x : item.point.x;
						const y = item.id === e.id ? e.endPoint.y : item.point.y;
						if (i === 0) {
							d += `M ${x} ${y} `;
						} else {
							d += `L ${x} ${y} `;
						}
					}
					svgRef.current.setAttribute("d", d);

					onDiagramDrag?.(e);
				},
				[items, onDiagramDrag],
			);

			/**
			 * ポインターダウンイベントハンドラ
			 *
			 * @param {DiagramPointerEvent} _e ポインターイベント
			 * @returns {void}
			 */
			const handlePointerDown = useCallback(
				(_e: DiagramPointerEvent) => {
					// 図形選択イベントを発火
					onDiagramSelect?.({
						id,
					});
				},
				[id, onDiagramSelect],
			);

			// ドラッグ用のPath要素のonDragイベントにて、ドラッグ中の移動量を計算し、描画用のPath要素に対してDOMを直接更新し、座標を更新
			const handleDraggablePathDrag = useCallback(
				(e: DiagramDragEvent) => {
					const dx = e.endPoint.x - e.startPoint.x;
					const dy = e.endPoint.y - e.startPoint.y;

					const d = createDValue(items, {
						x: -dx,
						y: -dy,
					});

					svgRef.current.setAttribute("d", d);
				},
				[items],
			);

			const handleDraggablePathDragEnd = useCallback(
				(e: DiagramDragEvent) => {
					onDiagramDragEnd?.({
						id,
						startPoint: e.startPoint,
						endPoint: e.endPoint,
					});
					const dx = e.endPoint.x - e.startPoint.x;
					const dy = e.endPoint.y - e.startPoint.y;
					for (let i = 0; i < items.length; i++) {
						const item = items[i];
						const x = item.point.x + dx;
						const y = item.point.y + dy;
						onDiagramDragEnd?.({
							id: item.id,
							startPoint: item.point,
							endPoint: { x, y },
						});
					}
				},
				[id, items, onDiagramDragEnd],
			);

			const d = createDValue(items);
			const dragD = createDValue(items, point);

			return (
				<>
					<path
						id={id}
						d={d}
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
						ref={svgRef}
					/>
					<Draggable
						id={`${id}-draggable`}
						point={point}
						onPointerDown={handlePointerDown}
						onClick={onDiagramClick}
						onDragStart={onDiagramDragStart}
						onDrag={handleDraggablePathDrag}
						onDragEnd={handleDraggablePathDragEnd}
					>
						<path
							id={`${id}-draggable`}
							d={dragD}
							fill="none"
							stroke="transparent"
							strokeWidth={7}
							ref={dragSvgRef}
						/>
					</Draggable>
					<Group
						id={id}
						point={point}
						width={width}
						height={height}
						keepProportion={keepProportion}
						isSelected={isSelected}
						onDiagramClick={onDiagramClick}
						onDiagramResizeStart={onDiagramResizeStart}
						onDiagramResizing={onDiagramResizing}
						onDiagramResizeEnd={onDiagramResizeEnd}
						onDiagramDragStart={onDiagramDragStart}
						onDiagramDrag={handleChildDiagramDrag}
						onDiagramDragEnd={onDiagramDragEnd}
						onDiagramDragEndByGroup={onDiagramDragEndByGroup}
						onDiagramSelect={onDiagramSelect}
						items={items}
						ref={(r: DiagramRef | null) => {
							groupRef.current = r ?? {};
						}}
					/>
				</>
			);
		},
	),
);

export default Line;
