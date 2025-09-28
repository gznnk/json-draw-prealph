import type { ToolDefinition } from "../../../../shared/llm-client/types";
import { textElementWithHandlerToolDefinition } from "../add_text_element_with_handler";

/**
 * Tool definition for adding a text element to the canvas.
 */
export const textElementToolDefinition: ToolDefinition =
	textElementWithHandlerToolDefinition;
