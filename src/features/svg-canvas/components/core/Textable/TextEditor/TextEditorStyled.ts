// Import Emotion.
import styled from "@emotion/styled";

// Import types.
import type { VerticalAlign } from "../../../../types/core/VerticalAlign";

// Import local module files.
import { VerticalAlignMap } from "../Textable/TextableConstants";

/**
 * Props for the wrapper element that aligns the text vertically.
 */
type TextEditorWrapperProps = {
	left: number;
	top: number;
	transform: string;
	width: number;
	height: number;
	verticalAlign: VerticalAlign;
};

/**
 * Styled wrapper element for vertical text alignment in TextEditor.
 */
export const TextEditorWrapper = styled.div<TextEditorWrapperProps>`
    position: absolute;
    left: ${(props) => props.left}px;
    top: ${(props) => props.top}px;
    transform: ${(props) => props.transform};
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    display: flex;
    align-items: ${(props) => VerticalAlignMap[props.verticalAlign]};
    pointer-events: auto;
`;

/**
 * Props for the text editor element.
 */
type TextEditorStyledProps = {
	textAlign: string;
	color: string;
	fontSize: number;
	fontFamily: string;
	fontWeight: string;
};

/**
 * Styled contentEditable div for the text editor.
 */
export const EditableText = styled.div<TextEditorStyledProps>`
    width: 100%;
    text-align: ${(props) => props.textAlign};
    color: ${(props) => props.color};
    font-size: ${(props) => props.fontSize}px;
    font-family: ${(props) => props.fontFamily};
    font-weight: ${(props) => props.fontWeight};
    border: none;
    outline: none;
    background: transparent;
    box-sizing: border-box;
    padding: 2px 6px;
    pointer-events: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
`;
