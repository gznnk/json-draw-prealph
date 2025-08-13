// Import types.
import type { TextableType } from "../../core/TextableType";
import type { TextAlign } from "../../core/TextAlign";
import type { VerticalAlign } from "../../core/VerticalAlign";
import type { DiagramChangeEvent } from "../../events/DiagramChangeEvent";
import type { DiagramTextChangeEvent } from "../../events/DiagramTextChangeEvent";

/**
 * Interface for diagram elements that can display and edit text.
 * Provides properties to control text content, appearance, and editing state.
 */
export type TextableData = {
	text: string;
	textType: TextableType;
	textAlign: TextAlign;
	verticalAlign: VerticalAlign;
	fontColor: string;
	fontSize: number;
	fontFamily: string;
	fontWeight: string;
};

/**
 * Interface for diagram elements that can display and edit text.
 * Extends base data with runtime state that should not be persisted.
 */
export type TextableState = TextableData & {
	isTextEditing: boolean;
};

/**
 * Props for components that can display and edit text.
 * Provides properties to control text editing behavior and associated event handlers.
 */
export type TextableProps = {
	isTextEditEnabled?: boolean;
	onTextChange?: (e: DiagramTextChangeEvent) => void;
	onDiagramChange?: (e: DiagramChangeEvent) => void;
};
