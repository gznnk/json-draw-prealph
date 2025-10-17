import type React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import type { DiagramClickEvent } from "../../../types/events/DiagramClickEvent";
import type { DiagramDragEvent } from "../../../types/events/DiagramDragEvent";
import type { DiagramSelectEvent } from "../../../types/events/DiagramSelectEvent";
import type { AiProps } from "../../../types/props/diagrams/AiProps";
import type { InputState } from "../../../types/state/elements/InputState";
import { degreesToRadians } from "../../../utils/math/common/degreesToRadians";
import { efficientAffineTransformation } from "../../../utils/math/transform/efficientAffineTransformation";
import { Frame } from "../../elements/Frame";
import { Input } from "../../elements/Input";
import { AiAssistant } from "../../icons/AiAssistant";

/**
 * Ai component - an AI chat diagram element with avatar, speech bubble, and chat input
 */
const AiComponent: React.FC<AiProps> = (props) => {
	const {
		id,
		x,
		y,
		width,
		height,
		scaleX,
		scaleY,
		rotation,
		rotateEnabled,
		avatarUrl,
		avatarBgColor,
		bubbleBgColor,
		aiMessage,
		items,
		isSelected,
		isAncestorSelected,
		onDrag,
		onSelect,
		onClick,
		onHoverChange,
		onTextChange,
	} = props;

	const inputState = items[0] as InputState;
	const [text, setText] = useState<string>(inputState?.text || "");

	useEffect(() => {
		setText(inputState?.text || "");
	}, [inputState?.text]);

	// Create references to avoid function creation in every render
	const refBusVal = {
		id,
		text,
		onDrag,
		onSelect,
		onClick,
		onHoverChange,
		onTextChange,
		setText,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	// Handler for drag events
	const handleDrag = useCallback((e: DiagramDragEvent) => {
		const { id, onDrag } = refBus.current;
		onDrag?.({
			...e,
			id,
		});
	}, []);

	// Handler for select events
	const handleSelect = useCallback((e: DiagramSelectEvent) => {
		const { id, onSelect } = refBus.current;
		onSelect?.({
			...e,
			id,
		});
	}, []);

	// Handler for click events
	const handleClick = useCallback((e: DiagramClickEvent) => {
		const { id, onClick } = refBus.current;
		onClick?.({
			...e,
			id,
		});
	}, []);

	// Layout constants
	const avatarSize = 60;
	const bubbleHeight = height - avatarSize - 110; // Space for avatar, input, and padding
	const inputHeight = 40;
	const padding = 10;
	const bubblePadding = 15;

	// Avatar position (top center)
	const avatarY = -(height / 2 - (avatarSize / 2 + padding));

	// Speech bubble position (below avatar)
	const bubbleY = avatarY + avatarSize / 2 + padding + bubbleHeight / 2;

	// Input position (bottom)
	const inputCenter = efficientAffineTransformation(
		0,
		height / 2 - (inputHeight / 2 + padding),
		scaleX,
		scaleY,
		degreesToRadians(rotation),
		x,
		y,
	);

	// Calculate positions for transform
	const left = -width / 2;
	const bubbleTop = bubbleY - bubbleHeight / 2;
	const tailWidth = 20;
	const tailHeight = 15;
	const bubbleWidth = width - padding * 2;

	return (
		<>
			<Frame
				{...props}
				width={width}
				height={height}
				minWidth={250}
				minHeight={350}
				stroke="none"
				strokeWidth="0px"
				fill="transparent"
				cornerRadius={0}
				rotateEnabled={rotateEnabled}
				connectEnabled={false}
				connectPoints={[]}
				showConnectPoints={false}
			>
				{/* Avatar circle */}
				<circle
					cx={0}
					cy={avatarY}
					r={avatarSize / 2}
					fill={avatarBgColor}
					pointerEvents="none"
				/>

				{/* Avatar image or icon */}
				{avatarUrl ? (
					<image
						href={avatarUrl}
						x={-avatarSize / 2}
						y={avatarY - avatarSize / 2}
						width={avatarSize}
						height={avatarSize}
						clipPath={`circle(${avatarSize / 2}px at center)`}
						pointerEvents="none"
					/>
				) : (
					<g
						transform={`translate(${-avatarSize / 2}, ${avatarY - avatarSize / 2})`}
					>
						<AiAssistant
							width={avatarSize}
							height={avatarSize}
							animation={true}
						/>
					</g>
				)}

				{/* Speech bubble tail (triangle pointing to avatar) */}
				<polygon
					points={`
						${0},${bubbleTop}
						${-tailWidth / 2},${bubbleTop - tailHeight}
						${tailWidth / 2},${bubbleTop - tailHeight}
					`}
					fill={bubbleBgColor}
					stroke="#ccc"
					strokeWidth="1"
					pointerEvents="none"
				/>

				{/* Main bubble rectangle */}
				<rect
					x={left + padding}
					y={bubbleTop}
					width={bubbleWidth}
					height={bubbleHeight}
					rx="10"
					ry="10"
					fill={bubbleBgColor}
					stroke="#ccc"
					strokeWidth="1"
					pointerEvents="none"
				/>

				{/* Bubble content */}
				<foreignObject
					x={left + padding + bubblePadding}
					y={bubbleTop + bubblePadding}
					width={bubbleWidth - bubblePadding * 2}
					height={bubbleHeight - bubblePadding * 2}
					pointerEvents="none"
				>
					<div
						style={{
							width: "100%",
							height: "100%",
							overflow: "auto",
							fontSize: "14px",
							color: "#333",
							fontFamily: "Arial, sans-serif",
							whiteSpace: "pre-wrap",
							wordWrap: "break-word",
						}}
					>
						{aiMessage}
					</div>
				</foreignObject>
			</Frame>
			{inputState && (
				<Input
					{...inputState}
					x={inputCenter.x}
					y={inputCenter.y}
					width={width - padding * 2}
					height={inputHeight}
					scaleX={scaleX}
					scaleY={scaleY}
					rotation={rotation}
					text={text}
					isSelected={isSelected}
					isAncestorSelected={isAncestorSelected}
					rotateEnabled={rotateEnabled}
					showOutline={false}
					isTransforming={false}
					showTransformControls={false}
					onDrag={handleDrag}
					onSelect={handleSelect}
					onClick={handleClick}
					onTextChange={onTextChange}
				/>
			)}
		</>
	);
};

export const Ai = memo(AiComponent);
