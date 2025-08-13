/**
 * Interface for diagram elements that can have fill color.
 * Provides the fill property for elements that can be filled with color.
 */
export type FillableData = {
	fill: string;
};

/**
 * Interface for diagram elements that can have fill color.
 * Note: Fill functionality is entirely data-based, so no additional state is needed.
 */
export type FillableState = FillableData;

/**
 * Props for components that can have fill color.
 * Note: Fill functionality is controlled through data, so no specific props are needed.
 */
