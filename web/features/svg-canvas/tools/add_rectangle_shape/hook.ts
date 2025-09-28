import type { EventBus } from "../../../../shared/event-bus/EventBus";
import type { FunctionCallHandler } from "../../../../shared/llm-client/types";
import { useAddDiagramWithBus } from "../../hooks/useAddDiagramWithBus";
import { useAddRectangleShapeWithHandlerTool } from "../add_rectangle_shape_with_handler";

export const useAddRectangleShapeTool = (
	eventBus: EventBus,
): FunctionCallHandler => {
	const addDiagram = useAddDiagramWithBus(eventBus);
	const rectangleShapeWithHandlerTool = useAddRectangleShapeWithHandlerTool();

	return rectangleShapeWithHandlerTool(addDiagram);
};
