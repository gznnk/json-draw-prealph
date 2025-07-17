import { definition } from "./definition";
import { useAddTextNodeTool } from "./hook";
import type {
	FunctionCallHandler,
	FunctionCallInfo,
} from "../../../../shared/llm-client/types";
import type { EventBus } from "../../../../shared/event-bus/EventBus";

// Legacy handler for compatibility with FunctionHandlerMap (for workflow_agent)
// This assumes a global or singleton EventBus instance is available for tools
let _eventBus: EventBus | undefined = undefined;
export const setAddTextNodeEventBus = (eventBus: EventBus) => {
	_eventBus = eventBus;
};
export const handler: FunctionCallHandler = (
	functionCall: FunctionCallInfo,
) => {
	if (!_eventBus) {
		throw new Error("EventBus not set for addTextNode.handler");
	}
	return useAddTextNodeTool(_eventBus)(functionCall);
};

export const addTextNode = {
	definition: definition,
	useAddTextNodeTool: useAddTextNodeTool,
	handler: handler,
	setAddTextNodeEventBus: setAddTextNodeEventBus,
};
