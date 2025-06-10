export const SVG_CANVAS_SCROLL_EVENT_NAME = "SvgCanvasScrollEvent" as const;

export type SvgCanvasScrollEvent = {
	minX: number;
	minY: number;
	clientX: number;
	clientY: number;
};
