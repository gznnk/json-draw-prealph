// Reactのインポート
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

// SvgCanvas関連型定義をインポート
import type { Point } from "../../../types/CoordinateTypes";
import type { DiagramDragEvent } from "../../../types/EventTypes";

// RectangleBase関連型定義をインポート
import type {
	RectangleBaseArrangement,
	RectangleBaseDragPointProps,
} from "./RectangleBaseTypes";
import { DragPointType } from "./RectangleBaseTypes";

// RectangleBase関連コンポーネントをインポート
import RectangleBaseDragPointBase from "./RectangleBaseDragPointBase";

// RectangleBase関連関数をインポート
import {
	calcArrangment,
	calcRectangleVertices,
	createLinerDragY2xFunction,
} from "./RectangleBaseFunctions";

import {
	calculateDistance,
	rotatePoint,
	degreesToRadians,
	calcRotatedRectangleDimensions,
} from "../../../functions/Math";

const DragPointLeftTop = forwardRef<SVGGElement, RectangleBaseDragPointProps>(
	(
		{
			id,
			leftTopPoint,
			rightBottomPoint,
			rotation = 0,
			scaleX = 1,
			scaleY = 1,
			draggingPointType,
			dragEndPointType,
			keepProportion,
			aspectRatio,
			hidden,
			onArrangmentChangeStart,
			onArrangmentChange,
			onArrangmentChangeEnd,
			onResizeEnd,
		},
		ref,
	) => {
		const domRef = useRef<SVGGElement>({} as SVGGElement);
		useImperativeHandle(ref, () => domRef.current);

		const calcArrangmentFunction = useCallback(
			(e: DiagramDragEvent) => calcArrangment(e.endPoint, rightBottomPoint),
			[rightBottomPoint],
		);

		const calcBoxFunction = useCallback(
			(e: DiagramDragEvent) => {
				const radians = degreesToRadians(rotation);

				const center: Point = {
					x: (e.endPoint.x + rightBottomPoint.x) / 2,
					y: (e.endPoint.y + rightBottomPoint.y) / 2,
				};

				const topLeftRotated = rotatePoint(e.endPoint, center, -radians);
				const bottomRightRotated = rotatePoint(
					rightBottomPoint,
					center,
					-radians,
				);

				const newWidth = Math.abs(bottomRightRotated.x - topLeftRotated.x);
				let newHeight = Math.abs(bottomRightRotated.y - topLeftRotated.y);
				if (keepProportion && aspectRatio) {
					newHeight = newWidth / aspectRatio;
				}

				return {
					point: center,
					width: newWidth,
					height: newHeight,
					scaleX: 1,
					scaleY: 1,
				};
			},
			[rightBottomPoint, rotation, keepProportion, aspectRatio],
		);

		const linerDragFunction = useCallback(
			(p: Point) =>
				createLinerDragY2xFunction(leftTopPoint, rightBottomPoint)(p),
			[leftTopPoint, rightBottomPoint],
		);

		return (
			<RectangleBaseDragPointBase
				id={id}
				point={leftTopPoint}
				dragPointType={DragPointType.LeftTop}
				cursor="nw-resize"
				draggingPointType={draggingPointType}
				dragEndPointType={dragEndPointType}
				hidden={hidden}
				onArrangmentChangeStart={onArrangmentChangeStart}
				onArrangmentChange={onArrangmentChange}
				onArrangmentChangeEnd={onArrangmentChangeEnd}
				onResizeEnd={onResizeEnd}
				dragPositioningFunction={keepProportion ? linerDragFunction : undefined}
				calcBoxFunction={calcBoxFunction}
				calcArrangmentFunction={calcArrangmentFunction}
				ref={domRef}
			/>
		);
	},
);

export default DragPointLeftTop;
