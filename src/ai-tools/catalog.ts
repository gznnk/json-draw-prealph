// Import libraries.
import type { OpenAI } from "openai";

// Import types.
import type { aiToolHander } from "./types";

// Import ai tools.
import { addImageGenNode } from "../features/svg-canvas/tools/add_image_gen_node";

export const AI_TOOLS = [
	addImageGenNode.definition,
] as const satisfies OpenAI.Responses.Tool[];

export const AI_TOOL_HANDLERS = {
	add_image_gen_node: addImageGenNode.handler,
} as const satisfies Record<string, aiToolHander>;
