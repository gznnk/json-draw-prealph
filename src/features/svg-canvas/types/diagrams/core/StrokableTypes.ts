/**
 * Interface for diagram elements that can have stroke styling.
 * Provides properties to control the stroke color and width.
 */
export type StrokableData = {
	stroke: string;
	strokeWidth: string;
};

/**
 * State type for elements that can have a stroke.
 * Since StrokableData has no non-persistent keys, this directly extends the data type.
 */
export type StrokableState = StrokableData;

/**
 * Props for components that can have stroke styling.
 * Note: Stroke functionality is controlled through data, so no specific props are needed.
 */
