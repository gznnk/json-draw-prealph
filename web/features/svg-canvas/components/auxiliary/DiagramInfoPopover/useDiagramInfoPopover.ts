import { useMemo } from "react";

import type { SvgCanvasProps } from "../../../canvas/types/SvgCanvasProps";
import type { Diagram } from "../../../types/state/core/Diagram";
import { getSelectedDiagrams } from "../../../utils/core/getSelectedDiagrams";

type PopoverDisplayInfo = {
	diagram: Diagram;
	position: { x: number; y: number };
} | null;

/**
 * Hook for managing diagram info popover display of diagram name and description
 * @param canvasProps - SVG Canvas props containing state and configuration
 * @returns Information about which diagram to display popover info for and its position
 */
export const useDiagramInfoPopover = (canvasProps: SvgCanvasProps): PopoverDisplayInfo => {
	return useMemo(() => {
		// Get selected diagrams
		const selectedDiagrams = getSelectedDiagrams(canvasProps.items);

		// Only show popover info for single selection
		if (selectedDiagrams.length !== 1) {
			return null;
		}

		const selectedDiagram = selectedDiagrams[0];

		// Check if the diagram has name or description
		const hasName = selectedDiagram.name && selectedDiagram.name.trim() !== "";
		const hasDescription = selectedDiagram.description && selectedDiagram.description.trim() !== "";

		if (!hasName && !hasDescription) {
			return null;
		}

		// Calculate position for popover display
		const position = calculatePopoverPosition(selectedDiagram, canvasProps);

		return {
			diagram: selectedDiagram,
			position,
		};
	}, [canvasProps]);
};

/**
 * Calculate the position for popover display
 * Priority: right side of the shape, fallback to left side if no space
 */
const calculatePopoverPosition = (diagram: Diagram, canvasProps: SvgCanvasProps): { x: number; y: number } => {
	const MARGIN = 12; // Distance from the shape
	const POPOVER_WIDTH = 256; // 16rem in pixels (estimated)

	// Get diagram bounds (basic implementation for common shape properties)
	const diagramX = diagram.x || 0;
	const diagramY = diagram.y || 0;

	// Estimate diagram dimensions (this could be enhanced based on diagram type)
	const diagramWidth = getDiagramWidth(diagram);
	const diagramHeight = getDiagramHeight(diagram);

	// Calculate canvas viewport bounds
	const viewportWidth = window.innerWidth; // Could be passed as prop if needed
	const canvasTransformX = -canvasProps.minX * canvasProps.zoom;
	const canvasTransformY = -canvasProps.minY * canvasProps.zoom;

	// Convert diagram position to screen coordinates
	const screenX = (diagramX * canvasProps.zoom) + canvasTransformX;
	const screenY = (diagramY * canvasProps.zoom) + canvasTransformY;
	const scaledWidth = diagramWidth * canvasProps.zoom;
	const scaledHeight = diagramHeight * canvasProps.zoom;

	// Try right side first
	const rightPosition = screenX + scaledWidth + MARGIN;
	const centerY = screenY + (scaledHeight / 2);

	// Check if there's enough space on the right
	if (rightPosition + POPOVER_WIDTH <= viewportWidth - 20) {
		return {
			x: rightPosition,
			y: centerY,
		};
	}

	// Fallback to left side
	const leftPosition = screenX - POPOVER_WIDTH - MARGIN;
	return {
		x: Math.max(20, leftPosition), // Ensure minimum distance from left edge
		y: centerY,
	};
};

/**
 * Get estimated width of diagram based on its type and properties
 */
const getDiagramWidth = (diagram: Diagram): number => {
	// This is a basic implementation - could be enhanced based on actual diagram types
	if ('width' in diagram && typeof diagram.width === 'number') {
		return diagram.width;
	}

	// Default estimates based on diagram type
	switch (diagram.type) {
		case 'Text':
			return 100;
		case 'Rectangle':
			return 120;
		case 'Ellipse':
			return 80;
		case 'LLMNode':
			return 160;
		case 'AgentNode':
			return 140;
		default:
			return 100;
	}
};

/**
 * Get estimated height of diagram based on its type and properties
 */
const getDiagramHeight = (diagram: Diagram): number => {
	// This is a basic implementation - could be enhanced based on actual diagram types
	if ('height' in diagram && typeof diagram.height === 'number') {
		return diagram.height;
	}

	// Default estimates based on diagram type
	switch (diagram.type) {
		case 'Text':
			return 30;
		case 'Rectangle':
			return 80;
		case 'Ellipse':
			return 80;
		case 'LLMNode':
			return 100;
		case 'AgentNode':
			return 90;
		default:
			return 60;
	}
};