// Import React.
import type React from "react";
import { memo, useEffect, useRef, useState } from "react";

// Import functions related to SvgCanvas.
import { createSvgTransform } from "../../../../utils/Diagram";
import { degreesToRadians } from "../../../../utils/Math";
import { newEventId } from "../../../../utils/Util";

// Imports related to this component.
import { TextEditorInput, TextEditorTextArea } from "./TextEditorStyled";
import type { TextEditorProps } from "./TextEditorTypes";

// TODO: きれいにする
/**
 * テキストエディタコンポーネント
 */
const TextEditorComponent: React.FC<TextEditorProps> = memo(
	({
		id,
		text,
		x,
		y,
		width,
		height,
		scaleX,
		scaleY,
		rotation,
		textType,
		textAlign,
		verticalAlign,
		fontColor,
		fontSize,
		fontFamily,
		isActive,
		onTextChange,
	}) => {
		const inputRef = useRef<HTMLInputElement>(null);
		const textAreaRef = useRef<HTMLTextAreaElement>(null);

		const [inputText, setInputText] = useState(text);

		useEffect(() => {
			if (isActive) {
				setInputText(text);
				if (textType === "textarea") {
					textAreaRef.current?.focus();
					textAreaRef.current?.setSelectionRange(text.length, text.length);
				} else {
					inputRef.current?.focus();
					inputRef.current?.setSelectionRange(text.length, text.length);
				}
			} else {
				setInputText("");
			}
		}, [isActive, text, textType]);

		if (!isActive) return null;

		const transform = createSvgTransform(
			scaleX,
			scaleY,
			degreesToRadians(rotation),
			x,
			y,
		);

		const handleTextAreaChange = (
			e: React.ChangeEvent<HTMLTextAreaElement>,
		) => {
			setInputText(e.target.value);
		};

		const handleTextAreaBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
			onTextChange?.({
				eventId: newEventId(),
				id,
				text: e.target.value,
			});
		};

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setInputText(e.target.value);
		};

		const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
			onTextChange?.({
				eventId: newEventId(),
				id,
				text: e.target.value,
			});
		};

		return textType === "textarea" ? (
			<TextEditorTextArea
				value={inputText}
				left={-width / 2}
				top={-height / 2}
				transform={transform}
				width={width}
				height={height}
				textAlign={textAlign}
				verticalAlign={verticalAlign}
				color={fontColor}
				fontSize={fontSize}
				fontFamily={fontFamily}
				ref={textAreaRef}
				onChange={handleTextAreaChange}
				onBlur={handleTextAreaBlur}
			/>
		) : (
			<TextEditorInput
				type="text"
				value={inputText}
				left={-width / 2}
				top={-height / 2}
				transform={transform}
				width={width}
				height={height}
				textAlign={textAlign}
				verticalAlign={verticalAlign}
				color={fontColor}
				fontSize={fontSize}
				fontFamily={fontFamily}
				ref={inputRef}
				onChange={handleInputChange}
				onBlur={handleInputBlur}
			/>
		);
	},
);

export const TextEditor = memo(TextEditorComponent);
