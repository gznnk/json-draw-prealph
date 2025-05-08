// Import libraries.
import type { OpenAI } from "openai";

// Import types.
import type { aiToolHander } from "./types";

// Import ai tools.
import { workflowAgent } from "../features/svg-canvas/tools/workflow_agent";
import { addImageGenNode } from "../features/svg-canvas/tools/add_image_gen_node";
import { addLLMNode } from "../features/svg-canvas/tools/add_llm_node";
import { addTextNode } from "../features/svg-canvas/tools/add_text_node";
import { addSvgToCanvasNode } from "../features/svg-canvas/tools/add_svg_to_canvas_node";
import { connectNodes } from "../features/svg-canvas/tools/connect_nodes";

export const AI_TOOLS = [
	addImageGenNode.definition,
	addLLMNode.definition,
	addTextNode.definition,
	addSvgToCanvasNode.definition,
	connectNodes.definition,
	workflowAgent.definition,
] as const satisfies OpenAI.Responses.Tool[];

export const AI_TOOL_HANDLERS = {
	add_image_gen_node: addImageGenNode.handler,
	add_llm_node: addLLMNode.handler,
	add_text_node: addTextNode.handler,
	add_svg_to_canvas_node: addSvgToCanvasNode.handler,
	connect_nodes: connectNodes.handler,
	workflow_agent: workflowAgent.handler,
} as const satisfies Record<string, aiToolHander>;
