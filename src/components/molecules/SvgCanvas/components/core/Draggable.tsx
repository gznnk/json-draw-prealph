// Reactのインポート
import type React from "react";
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";

// ライブラリのインポート
import styled from "@emotion/styled";

// SvgCanvas関連型定義をインポート
import type { Point } from "../../types/CoordinateTypes";
import { DragDirection } from "../../types/CoordinateTypes";
import type {
	DiagramClickEvent,
	DiagramDragEvent,
	DiagramPointerEvent,
} from "../../types/EventTypes";

type DraggableGProps = {
	cursor: string;
	outline?: string;
	outlineOffset?: string;
};

const DraggableG = styled.g<DraggableGProps>`
    cursor: ${({ cursor }) => cursor};
    &:focus {
        outline: ${({ outline }) => outline};
        outline-offset: ${({ outlineOffset }) => outlineOffset};
    }
`;

export type DraggableProps = {
	key?: string;
	id: string;
	point: Point;
	direction?: DragDirection;
	allowXDecimal?: boolean;
	allowYDecimal?: boolean;
	cursor?: string;
	tabIndex?: number;
	outline?: string;
	outlineOffset?: string;
	ref?: SVGGElement;
	onPointerDown?: (e: DiagramPointerEvent) => void;
	onPointerUp?: (e: DiagramPointerEvent) => void;
	onClick?: (e: DiagramClickEvent) => void;
	onDragStart?: (e: DiagramDragEvent) => void;
	onDrag?: (e: DiagramDragEvent) => void;
	onDragEnd?: (e: DiagramDragEvent) => void;
	dragPositioningFunction?: (point: Point) => Point;
	children?: React.ReactNode;
};

const Draggable = forwardRef<SVGGElement, DraggableProps>(
	(
		{
			key,
			id,
			point,
			direction = DragDirection.All,
			allowXDecimal = false,
			allowYDecimal = false,
			cursor = "move",
			tabIndex = 0,
			outline = "none",
			outlineOffset = "0px",
			onPointerDown,
			onPointerUp,
			onClick,
			onDragStart,
			onDrag,
			onDragEnd,
			dragPositioningFunction,
			children,
		},
		ref,
	) => {
		const [state, setState] = useState({ point });
		const [isPointerDown, setIsPointerDown] = useState(false);
		const [isDragging, setIsDragging] = useState(false);

		const startX = useRef(0);
		const startY = useRef(0);

		const svgRef = useRef<SVGGElement>({} as SVGGElement);

		useImperativeHandle(ref, () => svgRef.current);

		useEffect(() => {
			setState({ point });
		}, [point]);

		const adjustCoordinates = useCallback(
			(p: Point) => {
				let x = p.x;
				let y = p.y;

				if (!allowXDecimal) {
					x = Math.round(x);
				}

				if (!allowYDecimal) {
					y = Math.round(y);
				}

				return {
					x,
					y,
				};
			},
			[allowXDecimal, allowYDecimal],
		);

		const getPoint = (e: React.PointerEvent<SVGElement>) => {
			let x = e.clientX - startX.current;
			let y = e.clientY - startY.current;

			if (direction === DragDirection.Horizontal) {
				y = state.point.y;
			} else if (direction === DragDirection.Vertical) {
				x = state.point.x;
			} else if (dragPositioningFunction) {
				const p = dragPositioningFunction({
					x,
					y,
				});
				x = p.x;
				y = p.y;
			}

			return adjustCoordinates({
				x,
				y,
			});
		};

		const handlePointerDown = (e: React.PointerEvent<SVGElement>) => {
			setIsPointerDown(true);

			startX.current = e.clientX - state.point.x;
			startY.current = e.clientY - state.point.y;

			if ((e.target as HTMLElement).id === id) {
				e.currentTarget.setPointerCapture(e.pointerId);
			}

			const event = {
				id,
				point: getPoint(e),
			};

			onPointerDown?.(event);
		};

		const handlePointerMove = (e: React.PointerEvent<SVGElement>) => {
			if (!isPointerDown) {
				return;
			}

			const event = {
				id,
				old: {
					point: state.point,
					width: 0,
					height: 0,
				},
				new: {
					point: getPoint(e),
					width: 0,
					height: 0,
				},
			};

			if (
				!isDragging &&
				(Math.abs(e.clientX - state.point.x - startX.current) > 3 ||
					Math.abs(e.clientY - state.point.y - startY.current) > 3)
			) {
				onDragStart?.(event);
				setIsDragging(true);
			}

			if (!isDragging) {
				return;
			}

			svgRef?.current?.setAttribute(
				"transform",
				`translate(${event.new.point.x}, ${event.new.point.y})`,
			);

			onDrag?.(event);
		};

		const handlePointerUp = (e: React.PointerEvent<SVGElement>) => {
			const newPoint = getPoint(e);

			if (isDragging) {
				onDragEnd?.({
					id,
					old: {
						point: state.point,
						width: 0,
						height: 0,
					},
					new: {
						point: newPoint,
						width: 0,
						height: 0,
					},
				});
			}

			if (isPointerDown && !isDragging) {
				// ドラッグ後のポインターアップでなければ、クリックイベントを利用側に通知する
				onClick?.({
					id,
				});
			}

			onPointerUp?.({
				id,
				point: newPoint,
			});

			setIsDragging(false);
			setIsPointerDown(false);
		};

		const handleKeyDown = (e: React.KeyboardEvent<SVGGElement>) => {
			const movePoint = (dx: number, dy: number) => {
				let newPoint = {
					x: state.point.x + dx,
					y: state.point.y + dy,
				};

				if (direction === DragDirection.Horizontal) {
					newPoint.y = state.point.y;
				} else if (direction === DragDirection.Vertical) {
					newPoint.x = state.point.x;
				} else if (dragPositioningFunction) {
					newPoint = dragPositioningFunction({ ...newPoint });
				}

				newPoint = adjustCoordinates(newPoint);

				const dragEvent = {
					id,
					old: {
						point: state.point,
						width: 0,
						height: 0,
					},
					new: {
						point: newPoint,
						width: 0,
						height: 0,
					},
				};

				onDragStart?.(dragEvent);
				onDrag?.(dragEvent);
				setState({
					point: newPoint,
				});
			};

			switch (e.key) {
				case "ArrowRight":
					movePoint(1, 0);
					break;
				case "ArrowLeft":
					movePoint(-1, 0);
					break;
				case "ArrowUp":
					movePoint(0, -1);
					break;
				case "ArrowDown":
					movePoint(0, 1);
					break;
				default:
					break;
			}
		};

		const handleKeyUp = (e: React.KeyboardEvent<SVGGElement>) => {
			if (
				e.key === "ArrowRight" ||
				e.key === "ArrowLeft" ||
				e.key === "ArrowUp" ||
				e.key === "ArrowDown"
			) {
				onDragEnd?.({
					id,
					old: {
						point: state.point,
						width: 0,
						height: 0,
					},
					new: {
						point: state.point,
						width: 0,
						height: 0,
					},
				});
			}
		};

		return (
			<DraggableG
				key={key}
				transform={`translate(${state.point.x}, ${state.point.y})`}
				tabIndex={tabIndex}
				cursor={cursor}
				outline={outline}
				outlineOffset={outlineOffset}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onKeyDown={handleKeyDown}
				onKeyUp={handleKeyUp}
				ref={svgRef}
			>
				{children}
			</DraggableG>
		);
	},
);

export default Draggable;
