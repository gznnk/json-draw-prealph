// Reactのインポート
import type React from "react";
import {
	forwardRef,
	memo,
	useCallback,
	useImperativeHandle,
	useRef,
} from "react";

// SvgCanvas関連型定義をインポート
import type { DiagramRef } from "../../types/DiagramTypes";
import type {
	DiagramChangeEvent,
	ParentDiagramResizeEvent,
} from "../../types/EventTypes";

// RectangleBase関連コンポーネントをインポート
import type { RectangleBaseProps } from "../core/RectangleBase";
import RectangleBase from "../core/RectangleBase";

// RectangleBase関連関数をインポート
import { calcArrangmentOnParentDiagramResize } from "../core/RectangleBase/RectangleBaseFunctions";

export type RectangleProps = RectangleBaseProps & {
	fill?: string;
	stroke?: string;
	strokeWidth?: string;
	ref?: React.Ref<DiagramRef>;
};

const Rectangle: React.FC<RectangleProps> = memo(
	forwardRef<DiagramRef, RectangleProps>(
		(
			{
				id,
				point,
				width,
				height,
				fill = "transparent",
				stroke = "black",
				strokeWidth = "1px",
				keepProportion = false,
				tabIndex = 0,
				isSelected = false,
				onPointerDown,
				onDiagramChange,
				onDiagramChangeEnd,
				children,
			},
			ref,
		) => {
			const svgRef = useRef<SVGRectElement>({} as SVGRectElement);
			const diagramRef = useRef<DiagramRef>({} as DiagramRef);

			const onParentDiagramResize = useCallback(
				(e: ParentDiagramResizeEvent) => {
					const newArrangment = calcArrangmentOnParentDiagramResize(
						e,
						point,
						width,
						height,
					);

					diagramRef.current.draggableRef?.current?.setAttribute(
						"transform",
						`translate(${newArrangment.point.x}, ${newArrangment.point.y})`,
					);
					svgRef?.current?.setAttribute("width", `${newArrangment.width}`);
					svgRef?.current?.setAttribute("height", `${newArrangment.height}`);
				},
				[point, width, height],
			);

			const onParentDiagramResizeEnd = useCallback(
				(e: ParentDiagramResizeEvent) => {
					onDiagramChangeEnd?.({
						id,
						...calcArrangmentOnParentDiagramResize(e, point, width, height),
					});
				},
				[id, point, width, height, onDiagramChangeEnd],
			);

			useImperativeHandle(ref, () => ({
				svgRef,
				draggableRef: diagramRef.current.draggableRef,
				onParentDiagramResize: onParentDiagramResize,
				onParentDiagramResizeEnd: onParentDiagramResizeEnd,
			}));

			const handleChange = useCallback(
				(e: DiagramChangeEvent) => {
					if (e.width && e.height) {
						svgRef.current?.setAttribute("width", `${e.width}`);
						svgRef.current?.setAttribute("height", `${e.height}`);
					}
					onDiagramChange?.(e);
				},
				[onDiagramChange],
			);

			return (
				<RectangleBase
					id={id}
					point={point}
					width={width}
					height={height}
					tabIndex={tabIndex}
					keepProportion={keepProportion}
					isSelected={isSelected}
					onPointerDown={onPointerDown}
					onDiagramChange={handleChange}
					onDiagramChangeEnd={onDiagramChangeEnd}
					ref={diagramRef}
				>
					<rect
						x={0}
						y={0}
						width={width}
						height={height}
						ref={svgRef}
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
					{children}
				</RectangleBase>
			);
		},
	),
);

export default Rectangle;
