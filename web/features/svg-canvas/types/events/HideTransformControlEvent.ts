/**
 * Event fired when a diagram's transform control visibility should be changed.
 * This is a UI-only state change that should NOT be saved to history.
 */
export type HideTransformControlEvent = {
	id: string;
	hide: boolean;
};
