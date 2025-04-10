// Import React.
import type React from "react";
import { memo } from "react";

// Import types related to SvgCanvas.
import type { TextableData } from "../../../../types/DiagramTypes";

// Imports related to this component.
import { Text, TextWrapper } from "./TextableStyled";

/**
 * Props for rendering editable text inside the SVG shape.
 */
type TextableProps = TextableData & {
	x: number;
	y: number;
	width: number;
	height: number;
	transform: string;
};

/**
 * React component for rendering editable text inside the SVG shape.
 */
const TextableComponent: React.FC<TextableProps> = ({
	x,
	y,
	width,
	height,
	transform,
	text,
	textType,
	textAlign,
	verticalAlign,
	fontColor,
	fontSize,
	fontFamily,
	isTextEditing,
}) => {
	if (!text) return null;
	if (isTextEditing) return null;

	return (
		<foreignObject
			className="diagram"
			x={x}
			y={y}
			width={width}
			height={height}
			transform={transform}
			pointerEvents="none"
		>
			<TextWrapper verticalAlign={verticalAlign}>
				<Text
					textAlign={textAlign}
					color={fontColor}
					fontSize={fontSize}
					fontFamily={fontFamily}
					wordBreak={textType === "textarea" ? "break-word" : "normal"}
					whiteSpace={textType === "textarea" ? "pre-wrap" : "nowrap"}
				>
					{text}
				</Text>
			</TextWrapper>
		</foreignObject>
	);
};

export const Textable = memo(TextableComponent);
