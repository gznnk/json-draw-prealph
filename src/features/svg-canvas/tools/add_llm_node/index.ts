import { definition } from "./definition";
import { handler } from "./handler";
import { useAddLLMNodeTool } from "./hook";

export const addLLMNode = {
	definition: definition,
	handler: handler,
	useAddLLMNodeTool,
};
