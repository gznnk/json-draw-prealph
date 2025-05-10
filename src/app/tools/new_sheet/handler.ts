/**
 * Function to handle the addition of an LLM node.
 *
 * @param args - The arguments for the function, including x, y coordinates and instructions.
 * @returns - An object containing the ID, type, width, and height of the created node.
 */

import { newId } from "../../../features/svg-canvas/utils";
import { dispatchAddNewSheetEvent } from "../../App";

// biome-ignore lint/suspicious/noExplicitAny: argument type is not known
export const handler = (args: any) => {
	if ("sheet_name" in args) {
		const id = newId();
		dispatchAddNewSheetEvent({
			id,
			sheetName: args.sheet_name,
		});

		return {
			id,
			sheet_name: args.sheet_name,
		};
	}
};
