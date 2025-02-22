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

			// 親から参照するためのRefを作成
			useImperativeHandle(ref, () => ({
				svgRef,
				draggableRef: diagramRef.current.draggableRef,
				onParentDiagramResize: onParentDiagramResize,
				onParentDiagramResizeEnd: onParentDiagramResizeEnd,
			}));

			/**
			 * 親図形のリサイズ中イベントハンドラ
			 *
			 * @param {ParentDiagramResizeEvent} e 親図形のリサイズ中イベント
			 */
			const onParentDiagramResize = useCallback(
				(e: ParentDiagramResizeEvent) => {
					// 親図形のリサイズ完了に伴うこの図形の変更を計算
					const newArrangment = calcArrangmentOnParentDiagramResize(
						e,
						point,
						width,
						height,
					);

					// 描画処理負荷軽減のため、DOMを直接操作
					// 短径領域の移動をDOMの直接操作で実施
					diagramRef.current.draggableRef?.current?.setAttribute(
						"transform",
						`translate(${newArrangment.point.x}, ${newArrangment.point.y})`,
					);

					// 四角形のリサイズをDOMの直接操作で実施
					svgRef?.current?.setAttribute("width", `${newArrangment.width}`);
					svgRef?.current?.setAttribute("height", `${newArrangment.height}`);

					// 親図形のリサイズが契機で、かつDOMを直接更新しての変更なので、親側への変更通知はしない
				},
				[point, width, height],
			);

			/**
			 * 親図形のリサイズ完了イベントハンドラ
			 *
			 * @param {ParentDiagramResizeEvent} e 親図形のリサイズ完了イベント
			 */
			const onParentDiagramResizeEnd = useCallback(
				(e: ParentDiagramResizeEvent) => {
					// 親図形のリサイズ完了に伴うこの図形の変更を親に通知し、Propsの更新を親側にしてもらう
					onDiagramChangeEnd?.({
						id,
						...calcArrangmentOnParentDiagramResize(e, point, width, height),
					});
				},
				[id, point, width, height, onDiagramChangeEnd],
			);

			/**
			 * 短形領域の変更中イベントハンドラ
			 *
			 * @param {DiagramChangeEvent} e 短形領域の変更中イベント
			 */
			const handleDiagramChange = useCallback(
				(e: DiagramChangeEvent) => {
					// 描画処理負荷軽減のため、DOMを直接操作
					svgRef.current?.setAttribute("width", `${e.width}`);
					svgRef.current?.setAttribute("height", `${e.height}`);

					// 親に変更中イベントを伝番
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
					onDiagramChange={handleDiagramChange}
					onDiagramChangeEnd={onDiagramChangeEnd} // 短形領域の変更完了イベントはそのまま親に伝番させて、Propsの更新を親側にしてもらう
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
