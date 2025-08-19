// Import React.
import type React from "react";
import { memo, useEffect, useRef } from "react";

// Import utils.
import { createSvgTransform } from "../../../../utils/shapes/common/createSvgTransform";
import { degreesToRadians } from "../../../../utils/math/common/degreesToRadians";
import { newEventId } from "../../../../utils/core/newEventId";

// Import local module files.
import { EditableText, TextEditorWrapper } from "./TextEditorStyled";
import type { TextEditorProps } from "./TextEditorTypes";

/**
 * TextEditor component.
 */
const TextEditorComponent: React.FC<TextEditorProps> = ({
	id,
	text,
	x,
	y,
	width,
	height,
	scaleX,
	scaleY,
	rotation,
	textAlign,
	verticalAlign,
	fontColor,
	fontSize,
	fontFamily,
	fontWeight,
	isActive,
	onTextChange,
}) => {
	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		text,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	// Ref for contentEditable div.
	// This ref is used to focus the div when the component is active.
	const editableRef = useRef<HTMLDivElement>(null);

	// Focus the contentEditable div when the component is active.
	useEffect(() => {
		if (isActive) {
			if (editableRef.current) {
				editableRef.current.textContent = refBus.current.text ?? "";
				editableRef.current?.focus();
				// Move cursor to end of text
				const selection = window.getSelection();
				const range = document.createRange();
				if (editableRef.current.childNodes.length > 0) {
					range.selectNodeContents(editableRef.current);
					range.collapse(false);
					selection?.removeAllRanges();
					selection?.addRange(range);
				}
			}
		}
	}, [isActive]);

	// Hide the text editor when not active.
	if (!isActive) return null;

	/**
	 * Handle input event for contentEditable div.
	 */
	const handleEditableInput = (e: React.FormEvent<HTMLDivElement>) => {
		const newText = e.currentTarget.textContent || "";
		// editableRef.current.textContent = newText;
		// console.log(e.currentTarget.innerText);
		// console.log(e.currentTarget.innerHTML);
		// console.log(e.currentTarget.textContent);
		console.log("Text changed:", newText);
		onTextChange?.({
			eventId: newEventId(),
			eventPhase: "InProgress",
			id,
			text: newText,
		});
	};

	/**
	 * Handle blur event for contentEditable div.
	 */
	const handleEditableBlur = (e: React.FormEvent<HTMLDivElement>) => {
		const newText = e.currentTarget.textContent || "";
		// editableRef.current.textContent = newText;
		onTextChange?.({
			eventId: newEventId(),
			eventPhase: "Ended",
			id,
			text: newText,
		});
	};

	// Transform for the element.
	const transform = createSvgTransform(
		scaleX,
		scaleY,
		degreesToRadians(rotation),
		x,
		y,
	);

	// Wrapper properties
	const wrapperProps = {
		left: -width / 2,
		top: -height / 2,
		transform,
		width,
		height,
		verticalAlign,
	};

	// Common properties for contentEditable div.
	const editableProps = {
		textAlign,
		color: fontColor,
		fontSize,
		fontFamily,
		fontWeight,
	};

	return (
		<TextEditorWrapper {...wrapperProps}>
			<EditableText
				{...editableProps}
				ref={editableRef}
				contentEditable
				suppressContentEditableWarning
				onInput={handleEditableInput}
				onBlur={handleEditableBlur}
			/>
		</TextEditorWrapper>
	);
};

export const TextEditor = memo(TextEditorComponent);
