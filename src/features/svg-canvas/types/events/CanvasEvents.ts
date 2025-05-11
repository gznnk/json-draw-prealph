/**
 * Event type for SvgCanvas scroll.
 */
export type SvgCanvasScrollEvent = {
	scrollTop: number;
	scrollLeft: number;
};

/**
 * Event type for SvgCanvas resize.
 */
export type SvgCanvasResizeEvent = {
	minX: number;
	minY: number;
	width: number;
	height: number;
};
