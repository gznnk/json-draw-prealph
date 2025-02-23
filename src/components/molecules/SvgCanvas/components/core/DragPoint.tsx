// Reactのインポート
import { forwardRef, useImperativeHandle, useRef } from "react";

// SvgCanvas関連コンポーネントをインポート
import type { DraggableProps } from "../core/Draggable";
import Draggable from "../core/Draggable";

export type DragPointProps = DraggableProps & {
	color?: string;
	hidden?: boolean;
};

const DragPoint = forwardRef<SVGGElement, DragPointProps>(
	(
		{
			id,
			point,
			direction,
			allowXDecimal = false,
			allowYDecimal = false,
			cursor,
			onDragStart,
			onDrag,
			onDragEnd,
			dragPositioningFunction,
			color = "rgba(61, 90, 128, 0.8)",
			hidden = false,
		},
		ref,
	) => {
		const svgRef = useRef<SVGGElement>({} as SVGGElement);
		useImperativeHandle(ref, () => svgRef.current);

		if (hidden) {
			return;
		}

		return (
			<Draggable
				id={id}
				point={point}
				direction={direction}
				allowXDecimal={allowXDecimal}
				allowYDecimal={allowYDecimal}
				cursor={cursor}
				outline="1px dashed blue"
				outlineOffset="4px"
				onDragStart={onDragStart}
				onDrag={onDrag}
				onDragEnd={onDragEnd}
				dragPositioningFunction={dragPositioningFunction}
				ref={svgRef}
			>
				<circle id={id} cx={0} cy={0} r="5" fill={color} />
			</Draggable>
		);
	},
);

export default DragPoint;
