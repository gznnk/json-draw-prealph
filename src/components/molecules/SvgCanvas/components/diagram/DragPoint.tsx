import type React from "react";
import Draggable from "../core/Draggable";
import type { DraggableProps } from "../core/Draggable";

export type DragPointProps = DraggableProps & {
	color?: string;
	visible?: boolean;
	hidden?: boolean;
};

const DragPoint: React.FC<DragPointProps> = ({
	initialPoint,
	direction,
	cursor,
	visible,
	onPointerDown,
	onDragStart,
	onDrag,
	onDragEnd,
	dragPositioningFunction,
	color = "rgba(61, 90, 128, 0.8)",
	hidden = false,
}) => {
	if (hidden) {
		return;
	}

	return (
		<Draggable
			initialPoint={initialPoint}
			direction={direction}
			cursor={cursor}
			visible={visible}
			outline="1px dashed blue"
			outlineOffset="4px"
			onPointerDown={onPointerDown}
			onDragStart={onDragStart}
			onDrag={onDrag}
			onDragEnd={onDragEnd}
			dragPositioningFunction={dragPositioningFunction}
		>
			<circle cx={0} cy={0} r="5" fill={color} />
		</Draggable>
	);
};

export default DragPoint;
