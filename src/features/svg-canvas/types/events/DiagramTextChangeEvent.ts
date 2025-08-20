// Import types.
import type { Shape } from "../core/Shape";
import type { TextableData } from "../data/core/TextableData";
import type { EventPhase } from "./EventPhase";

/**
 * Attributes for the text editor component.
 */
export type TextEditorAttributes = Shape & TextableData;

/**
 * Event fired when text content is changed on a diagram
 */
export type DiagramTextChangeEvent = {
	eventId: string;
	eventPhase: EventPhase;
	id: string;
	text: string;
	initializeAttributes?: TextEditorAttributes; // Optional initial attributes for the text editor
};
