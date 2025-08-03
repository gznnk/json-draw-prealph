// Import types.
import type { DiagramBaseData } from "../types/data/core/DiagramBaseData";
import type { FillableData } from "../types/data/core/FillableData";
import type { ItemableData } from "../types/data/core/ItemableData";
import type { StrokableData } from "../types/data/core/StrokableData";
import type { ConnectLineData } from "../types/data/shapes/ConnectLineData";
import type { EllipseData } from "../types/data/shapes/EllipseData";
import type { ImageData } from "../types/data/shapes/ImageData";
import type { PathData } from "../types/data/shapes/PathData";
import type { RectangleData } from "../types/data/shapes/RectangleData";
import type { SvgData } from "../types/data/shapes/SvgData";
import type { Diagram } from "../types/state/catalog/Diagram";
import type { SelectableState } from "../types/state/core/SelectableState";
import type { TextableState } from "../types/state/core/TextableState";
import type { TransformativeState } from "../types/state/core/TransformativeState";
import type { ConnectPointState } from "../types/state/shapes/ConnectPointState";
import type { ConnectableState } from "../types/state/shapes/ConnectableState";

/**
 * Default diagram base data.
 */
export const DEFAULT_DIAGRAM_BASE_DATA = {
	id: "",
	type: "Rectangle",
	x: 0,
	y: 0,
} as const satisfies DiagramBaseData;

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
} as const satisfies ItemableData<Diagram>;

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
} as const satisfies StrokableData;

/**
 * Default fillable data.
 */
export const DEFAULT_FILLABLE_DATA = {
	fill: "transparent",
} as const satisfies FillableData;

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
} as const satisfies RectangleData;

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
} as const satisfies EllipseData;

/**
 * Default image data.
 */
export const DEFAULT_IMAGE_DATA = {
	...DEFAULT_DIAGRAM_BASE_DATA,
	...DEFAULT_SELECTABLE_DATA,
	...DEFAULT_TRANSFORMATIVE_DATA,
	type: "Image",
	base64Data: "",
} as const satisfies ImageData;

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
} as const satisfies SvgData;

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
} as const satisfies PathData;

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
} as const satisfies ConnectLineData;
