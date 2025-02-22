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

type EllipseProps = RectangleBaseProps & {
	fill?: string;
	stroke?: string;
	strokeWidth?: string;
	ref?: React.Ref<DiagramRef>;
};

const Ellipse: React.FC<EllipseProps> = memo(
	forwardRef<DiagramRef, EllipseProps>(
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
				onDiagramChangeEnd,
			},
			ref,
		) => {
			const svgRef = useRef<SVGEllipseElement>({} as SVGEllipseElement);
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

					const rx = newArrangment.width / 2;
					const ry = newArrangment.height / 2;
					svgRef.current?.setAttribute("cx", `${rx}`);
					svgRef.current?.setAttribute("cy", `${ry}`);
					svgRef.current?.setAttribute("rx", `${rx}`);
					svgRef.current?.setAttribute("ry", `${ry}`);
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

			const onDiagramChange = useCallback((e: DiagramChangeEvent) => {
				svgRef.current?.setAttribute("cx", `${e.width / 2}`);
				svgRef.current?.setAttribute("cy", `${e.height / 2}`);
				svgRef.current?.setAttribute("rx", `${e.width / 2}`);
				svgRef.current?.setAttribute("ry", `${e.height / 2}`);
			}, []);

			return (
				<RectangleBase
					id={id}
					point={point}
					width={width}
					height={height}
					keepProportion={keepProportion}
					tabIndex={tabIndex}
					isSelected={isSelected}
					onPointerDown={onPointerDown}
					onDiagramChange={onDiagramChange}
					onDiagramChangeEnd={onDiagramChangeEnd}
					ref={diagramRef}
				>
					<ellipse
						cx={width / 2}
						cy={height / 2}
						rx={width / 2}
						ry={height / 2}
						ref={svgRef}
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
					/>
				</RectangleBase>
			);
		},
	),
);

export default Ellipse;
