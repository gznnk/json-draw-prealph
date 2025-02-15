import type React from "react";
import { useState, useRef, useCallback } from "react";
import type Point from "../../../types/Point";
import DragPoint from "./DragPoint";
import Draggable from "./Draggable";
import type { DragEvent } from "./Draggable";

const updatedPoints = (point: Point, diagonalPoint: Point) => {
	const top = Math.min(point.y, diagonalPoint.y);
	const bottom = Math.max(point.y, diagonalPoint.y);
	const left = Math.min(point.x, diagonalPoint.x);
	const right = Math.max(point.x, diagonalPoint.x);

	const leftTopPoint = {
		x: left,
		y: top,
	};

	const leftBottomPoint = {
		x: left,
		y: bottom,
	};

	const rightTopPoint = {
		x: right,
		y: top,
	};

	const rightBottomPoint = {
		x: right,
		y: bottom,
	};

	return {
		point: leftTopPoint,
		leftTopPoint,
		leftBottomPoint,
		rightTopPoint,
		rightBottomPoint,
		width: right - left,
		height: bottom - top,
	};
};

type RectangleProps = {
	initialPoint: Point;
	initialWidth: number;
	initialHeight: number;
	fill?: string;
	stroke?: string;
	children?: React.ReactNode;
};

const Rectangle: React.FC<RectangleProps> = ({
	initialPoint,
	initialWidth,
	initialHeight,
	fill = "transparent",
	stroke = "black",
	children,
}) => {
	const [state, setState] = useState({
		point: initialPoint,
		width: initialWidth,
		height: initialHeight,
		leftTopPoint: initialPoint,
		leftBottomPoint: {
			x: initialPoint.x,
			y: initialPoint.y + initialHeight,
		},
		rightTopPoint: {
			x: initialPoint.x + initialWidth,
			y: initialPoint.y,
		},
		rightBottomPoint: {
			x: initialPoint.x + initialWidth,
			y: initialPoint.y + initialHeight,
		},
		isDragging: false,
		isLeftTopDragging: false,
		isLeftBottomDragging: false,
		isRightTopDragging: false,
		isRightBottomDragging: false,
	});

	const draggableRef = useRef<SVGGElement | null>(null);
	const rectRef = useRef<SVGRectElement | null>(null);

	const updateDomPoints = useCallback(
		(leftTopPoint: Point, width: number, height: number) => {
			draggableRef.current?.setAttribute(
				"transform",
				`translate(${leftTopPoint.x}, ${leftTopPoint.y})`,
			);
			rectRef.current?.setAttribute("width", `${width}`);
			rectRef.current?.setAttribute("height", `${height}`);
		},
		[],
	);

	// --- 以下四角形全体のドラッグ ---

	const onDragStart = useCallback((_e: DragEvent) => {
		setState((prevState) => ({
			...prevState,
			isDragging: true,
		}));
	}, []);

	const onDragEnd = useCallback(
		(e: DragEvent) => {
			setState((prevState) => ({
				...prevState,
				point: e.point,
				leftTopPoint: e.point,
				leftBottomPoint: {
					x: e.point.x,
					y: e.point.y + state.height,
				},
				rightTopPoint: {
					x: e.point.x + state.width,
					y: e.point.y,
				},
				rightBottomPoint: {
					x: e.point.x + state.width,
					y: e.point.y + state.height,
				},
				isDragging: false,
			}));
		},
		[state.width, state.height],
	);

	// --- 以下左上の点のドラッグ ---

	const onLeftTopDragStart = useCallback((_e: DragEvent) => {
		setState((prevState) => ({
			...prevState,
			isDragging: true,
			isLeftTopDragging: true,
		}));
	}, []);

	const onLeftTopDrag = useCallback(
		(e: DragEvent) => {
			const { leftTopPoint, width, height } = updatedPoints(
				e.point,
				state.rightBottomPoint,
			);

			updateDomPoints(leftTopPoint, width, height);
		},
		[updateDomPoints, state.rightBottomPoint],
	);

	const onLeftTopDragEnd = useCallback(
		(e: DragEvent) => {
			const points = updatedPoints(e.point, state.rightBottomPoint);

			setState((prevState) => ({
				...prevState,
				...points,
				isDragging: false,
				isLeftTopDragging: false,
			}));
		},
		[state.rightBottomPoint],
	);

	// --- 以下左下の点のドラッグ ---

	const onLeftBottomDragStart = useCallback((_e: DragEvent) => {
		setState((prevState) => ({
			...prevState,
			isDragging: true,
			isLeftBottomDragging: true,
		}));
	}, []);

	const onLeftBottomDrag = useCallback(
		(e: DragEvent) => {
			const { leftTopPoint, width, height } = updatedPoints(
				e.point,
				state.rightTopPoint,
			);

			updateDomPoints(leftTopPoint, width, height);
		},
		[updateDomPoints, state.rightTopPoint],
	);

	const onLeftBottomDragEnd = useCallback(
		(e: DragEvent) => {
			const points = updatedPoints(e.point, state.rightTopPoint);

			setState((prevState) => ({
				...prevState,
				...points,
				isDragging: false,
				isLeftBottomDragging: false,
			}));
		},
		[state.rightTopPoint],
	);

	// --- 以下右上の点のドラッグ ---

	const onRightTopDragStart = useCallback((_e: DragEvent) => {
		setState((prevState) => ({
			...prevState,
			isDragging: true,
			isRightTopDragging: true,
		}));
	}, []);

	const onRightTopDrag = useCallback(
		(e: DragEvent) => {
			const { leftTopPoint, width, height } = updatedPoints(
				e.point,
				state.leftBottomPoint,
			);

			updateDomPoints(leftTopPoint, width, height);
		},
		[updateDomPoints, state.leftBottomPoint],
	);

	const onRightTopDragEnd = useCallback(
		(e: DragEvent) => {
			const points = updatedPoints(e.point, state.leftBottomPoint);

			setState((prevState) => ({
				...prevState,
				...points,
				isDragging: false,
				isRightTopDragging: false,
			}));
		},
		[state.leftBottomPoint],
	);

	// --- 以下右下の点のドラッグ ---

	const onRightBottomDragStart = useCallback((_e: DragEvent) => {
		setState((prevState) => ({
			...prevState,
			isDragging: true,
			isRightBottomDragging: true,
		}));
	}, []);

	const onRightBottomDrag = useCallback(
		(e: DragEvent) => {
			const { leftTopPoint, width, height } = updatedPoints(
				e.point,
				state.leftTopPoint,
			);

			updateDomPoints(leftTopPoint, width, height);
		},
		[updateDomPoints, state.leftTopPoint],
	);

	const onRightBottomDragEnd = useCallback(
		(e: DragEvent) => {
			const points = updatedPoints(e.point, state.leftTopPoint);

			setState((prevState) => ({
				...prevState,
				...points,
				isDragging: false,
				isRightBottomDragging: false,
			}));
		},
		[state.leftTopPoint],
	);

	return (
		<>
			<Draggable
				initialPoint={state.point}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				ref={draggableRef}
			>
				<rect
					x={0}
					y={0}
					width={state.width}
					height={state.height}
					fill={fill}
					stroke={stroke}
					ref={rectRef}
				>
					{children}
				</rect>
			</Draggable>
			{/* 左上 */}
			<DragPoint
				initialPoint={state.leftTopPoint}
				onDragStart={onLeftTopDragStart}
				onDrag={onLeftTopDrag}
				onDragEnd={onLeftTopDragEnd}
				cursor="nw-resize"
				hidden={state.isDragging && !state.isLeftTopDragging}
			/>
			{/* 左下 */}
			<DragPoint
				initialPoint={state.leftBottomPoint}
				onDragStart={onLeftBottomDragStart}
				onDrag={onLeftBottomDrag}
				onDragEnd={onLeftBottomDragEnd}
				cursor="sw-resize"
				hidden={state.isDragging && !state.isLeftBottomDragging}
			/>
			{/* 右上 */}
			<DragPoint
				initialPoint={state.rightTopPoint}
				onDragStart={onRightTopDragStart}
				onDrag={onRightTopDrag}
				onDragEnd={onRightTopDragEnd}
				cursor="ne-resize"
				hidden={state.isDragging && !state.isRightTopDragging}
			/>
			{/* 右下 */}
			<DragPoint
				initialPoint={state.rightBottomPoint}
				onDragStart={onRightBottomDragStart}
				onDrag={onRightBottomDrag}
				onDragEnd={onRightBottomDragEnd}
				cursor="se-resize"
				hidden={state.isDragging && !state.isRightBottomDragging}
			/>
		</>
	);
};

export default Rectangle;
