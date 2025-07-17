import { definition } from "./definition";
import { handler } from "./handler";
import { useAddImageGenNodeTool } from "./hook";

/**
 * Image Generation Node tool with type-safe definition and handler.
 * Used to add nodes that can generate images from text input on the canvas.
 */
export const addImageGenNode = {
	definition: definition,
	handler: handler,
	useAddImageGenNodeTool: useAddImageGenNodeTool,
};
