import styled from "@emotion/styled";

export const PopoverContainer = styled.div`
	position: absolute;
	z-index: 50;
	pointer-events: none;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(8px);
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	max-width: 16rem;
	font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
`;

export const PopoverContent = styled.div`
	padding: 0.75rem 1rem;
`;

export const PopoverTitle = styled.div`
	font-size: 0.875rem;
	font-weight: 600;
	color: #111827;
	margin-bottom: 0.25rem;
	line-height: 1.25;
	word-wrap: break-word;
`;

export const PopoverDescription = styled.div`
	font-size: 0.75rem;
	color: #6b7280;
	line-height: 1.5;
	word-wrap: break-word;
`;