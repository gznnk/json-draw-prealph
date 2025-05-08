// Import libraries.
import type { OpenAI } from "openai";
import { AI_TOOL_HANDLERS } from "./catalog";

/**
 * Handles the chunk of data received from the OpenAI API.
 *
 * @param chunk - The chunk of data received from the OpenAI API.
 * @returns - The result of the function call if it is a function call, otherwise undefined.
 */
export const handleChunk = (chunk: OpenAI.Responses.ResponseStreamEvent) => {
	if (
		chunk.type === "response.output_item.done" &&
		chunk.item?.type === "function_call"
	) {
		const functionName = chunk.item.name;
		const functionCallArguments = JSON.parse(chunk.item.arguments);

		return AI_TOOL_HANDLERS[functionName as keyof typeof AI_TOOL_HANDLERS]?.(
			functionCallArguments,
		);
	}
};
