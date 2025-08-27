// Import React.
import type React from "react";
import { memo } from "react";

// Import types.
import type { ButtonProps } from "../../../types/props/elements/ButtonProps";

// Import components.
import { Textable } from "../../core/Textable";

// Import utils.
import { degreesToRadians } from "../../../utils/math/common/degreesToRadians";
import { createSvgTransform } from "../../../utils/shapes/common/createSvgTransform";

// Import local module files.
import { ButtonElement } from "./ButtonStyled";

/**
 * Button minimap component - lightweight version without outlines, controls, and labels.
 */
const ButtonMinimapComponent: React.FC<ButtonProps> = ({
	id,
	x,
	y,
	width,
	height,
	borderRadius,
	rotation,
	scaleX,
	scaleY,
	fill,
	stroke,
	strokeWidth,
	text,
	textType,
	fontColor,
	fontSize,
	fontFamily,
	fontWeight,
	textAlign,
	verticalAlign,
	isTextEditEnabled = true,
	isTransparent,
}) => {
	// Generate rect transform attribute
	const transform = createSvgTransform(
		scaleX,
		scaleY,
		degreesToRadians(rotation),
		x,
		y,
	);

	return (
		<>
			<ButtonElement
				id={id}
				x={-width / 2}
				y={-height / 2}
				width={width}
				height={height}
				rx={borderRadius}
				ry={borderRadius}
				fill={fill}
				stroke={stroke}
				strokeWidth={strokeWidth}
				isTransparent={isTransparent}
				transform={transform}
				pointerEvents="none"
			/>
			{isTextEditEnabled && text && (
				<Textable
					x={-width / 2}
					y={-height / 2}
					width={width}
					height={height}
					transform={transform}
					text={text}
					textType={textType}
					fontColor={fontColor}
					fontSize={fontSize}
					fontFamily={fontFamily}
					fontWeight={fontWeight}
					textAlign={textAlign}
					verticalAlign={verticalAlign}
					isTextEditing={false}
				/>
			)}
		</>
	);
};

export const ButtonMinimap = memo(ButtonMinimapComponent);