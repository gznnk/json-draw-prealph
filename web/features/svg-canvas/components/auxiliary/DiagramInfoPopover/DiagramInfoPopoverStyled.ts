import styled from "@emotion/styled";

import {
	POPOVER_HEIGHT,
	POPOVER_WIDTH,
} from "../../../constants/styling/auxiliary/DiagramInfoPopoverStyling";

export const PopoverContainer = styled.div`
	position: absolute;
	z-index: 50;
	pointer-events: auto;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(8px);
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	box-shadow:
		0 10px 15px -3px rgba(0, 0, 0, 0.1),
		0 4px 6px -2px rgba(0, 0, 0, 0.05);
	width: ${POPOVER_WIDTH}px;
	height: ${POPOVER_HEIGHT}px;
	font-family: Noto Sans JP;
	overflow: hidden;
`;

export const PopoverContent = styled.div`
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export const PopoverFieldContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const PopoverLabel = styled.label`
	font-size: 12px;
	font-weight: 500;
	color: #374151;
	line-height: 1.25;
	user-select: none;
`;

export const PopoverText = styled.div`
	font-size: 12px;
	color: #737373;
	line-height: 1.25;
	background: rgba(255, 255, 255, 0.8);
	font-family: inherit;
	min-height: 1.5em;
	word-wrap: break-word;
`;
