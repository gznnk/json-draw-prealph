// Import React.
import type React from "react";
import { memo } from "react";

// Import components related to SvgCanvas.
import { DragPoint } from "../../../core/DragPoint";

// Import types related to SvgCanvas.
import type { DiagramDragEvent } from "../../../../types/events/DiagramDragEvent";
import type { EventBus } from "../../../../../../shared/event-bus/EventBus";

// Imports related to this component.
import type { NewVertexData } from "./NewVertexTypes";

/**
 * 新規頂点プロパティ
 */
type NewVertexProps = NewVertexData & {
	eventBus: EventBus;
	onDrag?: (e: DiagramDragEvent) => void;
};

/**
 * 新規頂点コンポ�EネンチE
 */
const NewVertexComponent: React.FC<NewVertexProps> = ({
	id,
	x,
	y,
	eventBus,
	onDrag,
}) => {
	return (
		<DragPoint
			id={id}
			x={x}
			y={y}
			fill="white"

			onDrag={onDrag}
		/>
	);
};

export const NewVertex = memo(NewVertexComponent);
