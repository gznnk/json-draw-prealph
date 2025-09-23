import React, { memo } from "react";

import {
	PopoverContainer,
	PopoverContent,
	PopoverLabel,
	PopoverFieldContainer,
	PopoverText,
} from "./DiagramInfoPopoverStyled";
import type { DiagramInfoPopoverProps } from "./iagramInfoPopoverTypes";
import type { SvgCanvasProps } from "../../../canvas/types/SvgCanvasProps";
import {
	DISTANCE_FROM_DIAGRAM,
	POPOVER_HEIGHT,
	POPOVER_WIDTH,
} from "../../../constants/styling/auxiliary/DiagramInfoPopoverStyling";
import type { Diagram } from "../../../types/state/core/Diagram";
import { getSelectedDiagrams } from "../../../utils/core/getSelectedDiagrams";
import { calcDiagramBoundingBox } from "../../../utils/math/geometry/calcDiagramBoundingBox";
import { isFrame } from "../../../utils/validation/isFrame";

const DiagramInfoPopoverComponent = ({
	canvasProps,
	containerWidth,
	containerHeight,
}: DiagramInfoPopoverProps): React.JSX.Element => {
	// Get selected diagrams
	const selectedDiagrams = getSelectedDiagrams(canvasProps.items);

	if (selectedDiagrams.length === 0) {
		return <></>;
	}

	const selectedDiagram = selectedDiagrams[0];

	if (!selectedDiagram.name && !selectedDiagram.description) {
		// Only show popover if there's a name or description
		return <></>;
	}

	// Only display when interaction state is idle
	if (canvasProps.interactionState !== "idle") {
		return <></>;
	}

	// Calculate position for popover display
	const position = calculatePopoverPosition(
		canvasProps,
		containerWidth,
		containerHeight,
		selectedDiagram,
	);

	return (
		<PopoverContainer
			style={{
				left: position.x,
				top: position.y,
			}}
		>
			<PopoverContent>
				<PopoverFieldContainer>
					<PopoverLabel>Name</PopoverLabel>
					<PopoverText>{selectedDiagram.name || "Untitled"}</PopoverText>
				</PopoverFieldContainer>

				<PopoverFieldContainer>
					<PopoverLabel>Description</PopoverLabel>
					<PopoverText>{selectedDiagram.description || "No description"}</PopoverText>
				</PopoverFieldContainer>
			</PopoverContent>
		</PopoverContainer>
	);
};

/**
 * Calculate the position for popover display
 * Priority: right side of the shape, fallback to left side if no space
 * Note: This now works in the HTMLElementsContainer coordinate system without zoom
 */
const calculatePopoverPosition = (
	canvasProps: SvgCanvasProps,
	containerWidth: number,
	containerHeight: number,
	diagram?: Diagram,
): { x: number; y: number } => {
	if (!diagram) {
		return { x: 0, y: 0 }; // Default position if no diagram
	}
	if (!isFrame(diagram)) {
		return { x: diagram.x, y: diagram.y };
	}

	const boundingBox = calcDiagramBoundingBox(diagram);

	let popoverX = boundingBox.right * canvasProps.zoom + DISTANCE_FROM_DIAGRAM;
	if (canvasProps.minX + containerWidth < popoverX + POPOVER_WIDTH) {
		// Not enough space on the right, fallback to left
		popoverX =
			boundingBox.left * canvasProps.zoom -
			DISTANCE_FROM_DIAGRAM -
			POPOVER_WIDTH;
	}

	// Ensure the popover does not go below the bottom edge of the diagram
	let popoverY = diagram.y * canvasProps.zoom - POPOVER_HEIGHT / 2;
	const diagramBottomY = boundingBox.bottom * canvasProps.zoom;
	if (diagramBottomY < popoverY + POPOVER_HEIGHT) {
		popoverY = diagramBottomY - POPOVER_HEIGHT;
	}
	// Ensure popover is within vertical bounds of the viewport
	if (popoverY < canvasProps.minY) {
		popoverY = canvasProps.minY;
	}
	const popoverBottomY = popoverY + POPOVER_HEIGHT;
	const viewportBottomY = canvasProps.minY + containerHeight;
	if (viewportBottomY < popoverBottomY) {
		popoverY = viewportBottomY - POPOVER_HEIGHT;
	}

	return {
		x: popoverX,
		y: popoverY,
	};
};

export const DiagramInfoPopover = memo(DiagramInfoPopoverComponent);
