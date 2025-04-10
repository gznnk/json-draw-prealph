// Import types related to SvgCanvas.
import type {
	TextableType,
	TextAlign,
	VerticalAlign,
} from "../../../../types/DiagramTypes";
import type { DiagramTextChangeEvent } from "../../../../types/EventTypes";

/**
 * Props for the TextEditor component.
 */
export type TextEditorProps = {
	id: string;
	text: string;
	x: number;
	y: number;
	width: number;
	height: number;
	scaleX: number;
	scaleY: number;
	rotation: number;
	textType: TextableType;
	textAlign: TextAlign;
	verticalAlign: VerticalAlign;
	fontColor: string;
	fontSize: number;
	fontFamily: string;
	isActive: boolean;
	onTextChange?: (e: DiagramTextChangeEvent) => void;
};
