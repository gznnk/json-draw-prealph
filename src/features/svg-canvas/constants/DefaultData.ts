// Import types.
import type { Diagram } from "../types/state/catalog/Diagram";
import type { DiagramBaseState } from "../types/state/core/DiagramBaseState";
import type { FillableState } from "../types/state/core/FillableState";
import type { ItemableState } from "../types/state/core/ItemableState";
import type { SelectableState } from "../types/state/core/SelectableState";
import type { StrokableState } from "../types/state/core/StrokableState";
import type { TextableState } from "../types/state/core/TextableState";
import type { TransformativeState } from "../types/state/core/TransformativeState";
import type { ConnectLineState } from "../types/state/shapes/ConnectLineState";
import type { ConnectPointState } from "../types/state/shapes/ConnectPointState";
import type { ConnectableState } from "../types/state/shapes/ConnectableState";
import type { EllipseState } from "../types/state/shapes/EllipseState";
import type { ImageState } from "../types/state/shapes/ImageState";
import type { PathState } from "../types/state/shapes/PathState";
import type { RectangleState } from "../types/state/shapes/RectangleState";
import type { SvgState } from "../types/state/shapes/SvgState";

/**
 * Default diagram base data.
 */
export const DEFAULT_DIAGRAM_BASE_DATA = {
	id: "",
	type: "Rectangle",
	x: 0,
	y: 0,
} as const satisfies DiagramBaseState;

/**
 * Default selectable data.
 */
export const DEFAULT_SELECTABLE_DATA = {
	isSelected: false,
	isAncestorSelected: false,
	showOutline: false,
} as const satisfies SelectableState;

/**
 * Default transformative data.
 */
export const DEFAULT_TRANSFORMATIVE_DATA = {
	x: 50,
	y: 50,
	width: 100,
	height: 100,
	rotation: 0,
	scaleX: 1,
	scaleY: 1,
	keepProportion: false,
	showTransformControls: false,
	isTransforming: false,
} as const satisfies TransformativeState;

/**
 * Default itemable data.
 */
export const DEFAULT_ITEMABLE_DATA = {
	items: [] as Diagram[],
} as const satisfies ItemableState<Diagram>;

/**
 * Default connectable data.
 */
export const DEFAULT_CONNECTABLE_DATA = {
	showConnectPoints: false,
	connectPoints: [] as ConnectPointState[],
} as const satisfies ConnectableState;

/**
 * Default strokable data.
 */
export const DEFAULT_STROKABLE_DATA = {
	stroke: "transparent",
	strokeWidth: "0",
} as const satisfies StrokableState;

/**
 * Default fillable data.
 */
export const DEFAULT_FILLABLE_DATA = {
	fill: "transparent",
} as const satisfies FillableState;

/**
 * Default textable data.
 */
export const DEFAULT_TEXTABLE_DATA = {
	text: "",
	textType: "textarea",
	fontColor: "#000000",
	fontSize: 16,
	fontFamily: "Segoe UI",
	fontWeight: "normal",
	textAlign: "center",
	verticalAlign: "center",
	isTextEditing: false,
} as const satisfies TextableState;

/**
 * Default rectangle data.
 */
export const DEFAULT_RECTANGLE_DATA = {
	...DEFAULT_DIAGRAM_BASE_DATA,
	...DEFAULT_SELECTABLE_DATA,
	...DEFAULT_TRANSFORMATIVE_DATA,
	...DEFAULT_CONNECTABLE_DATA,
	...DEFAULT_STROKABLE_DATA,
	...DEFAULT_FILLABLE_DATA,
	...DEFAULT_TEXTABLE_DATA,
	type: "Rectangle",
	radius: 0,
} as const satisfies RectangleState;

/**
 * Default ellipse data.
 */
export const DEFAULT_ELLIPSE_DATA = {
	...DEFAULT_DIAGRAM_BASE_DATA,
	...DEFAULT_SELECTABLE_DATA,
	...DEFAULT_TRANSFORMATIVE_DATA,
	...DEFAULT_CONNECTABLE_DATA,
	...DEFAULT_STROKABLE_DATA,
	...DEFAULT_FILLABLE_DATA,
	...DEFAULT_TEXTABLE_DATA,
	type: "Ellipse",
} as const satisfies EllipseState;

/**
 * Default image data.
 */
export const DEFAULT_IMAGE_DATA = {
	...DEFAULT_DIAGRAM_BASE_DATA,
	...DEFAULT_SELECTABLE_DATA,
	...DEFAULT_TRANSFORMATIVE_DATA,
	type: "Image",
	base64Data: "",
} as const satisfies ImageState;

/**
 * Default svg data.
 */
export const DEFAULT_SVG_DATA = {
	...DEFAULT_DIAGRAM_BASE_DATA,
	...DEFAULT_SELECTABLE_DATA,
	...DEFAULT_TRANSFORMATIVE_DATA,
	type: "Svg",
	initialWidth: 100,
	initialHeight: 100,
	svgText: "",
} as const satisfies SvgState;

/**
 * Default path data.
 */
export const DEFAULT_PATH_DATA = {
	...DEFAULT_DIAGRAM_BASE_DATA,
	...DEFAULT_SELECTABLE_DATA,
	...DEFAULT_TRANSFORMATIVE_DATA,
	...DEFAULT_ITEMABLE_DATA,
	...DEFAULT_STROKABLE_DATA,
	type: "Path",
} as const satisfies PathState;

/**
 * Default connect line data.
 */
export const DEFAULT_CONNECT_LINE_DATA = {
	...DEFAULT_DIAGRAM_BASE_DATA,
	...DEFAULT_SELECTABLE_DATA,
	...DEFAULT_TRANSFORMATIVE_DATA,
	...DEFAULT_ITEMABLE_DATA,
	...DEFAULT_STROKABLE_DATA,
	type: "ConnectLine",
	stroke: "#002766",
	strokeWidth: "2px",
	startOwnerId: "",
	endOwnerId: "",
	autoRouting: true,
	endArrowHead: "Circle",
} as const satisfies ConnectLineState;
