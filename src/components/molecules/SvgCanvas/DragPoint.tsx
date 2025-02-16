import type React from "react";
import Draggable from "./Draggable";
import type { DraggableProps } from "./Draggable";

export type DragPointProps = DraggableProps & {
	color?: string;
	hidden?: boolean;
};

const DragPoint: React.FC<DragPointProps> = ({
	initialPoint,
	direction,
	cursor,
	onDragStart,
	onDrag,
	onDragEnd,
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
			onDragStart={onDragStart}
			onDrag={onDrag}
			onDragEnd={onDragEnd}
			cursor={cursor}
		>
			<circle cx={0} cy={0} r="5" fill={color} />
		</Draggable>
	);
};

export default DragPoint;
