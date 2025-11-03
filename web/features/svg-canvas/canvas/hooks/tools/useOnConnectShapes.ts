import { useEffect, useRef } from "react";

import { EVENT_NAME_CONNECT_SHAPES } from "../../../constants/core/EventNames";
import { ConnectLineDefaultState } from "../../../constants/state/shapes/ConnectLineDefaultState";
import type { Frame } from "../../../types/core/Frame";
import type {
	AnchorPosition,
	ConnectShapesEvent,
} from "../../../types/events/ConnectShapesEvent";
import type { Diagram } from "../../../types/state/core/Diagram";
import type { ConnectableState } from "../../../types/state/shapes/ConnectableState";
import type { ConnectLineState } from "../../../types/state/shapes/ConnectLineState";
import type { ConnectPointState } from "../../../types/state/shapes/ConnectPointState";
import type { EllipseState } from "../../../types/state/shapes/EllipseState";
import type { PathPointState } from "../../../types/state/shapes/PathPointState";
import type { RectangleState } from "../../../types/state/shapes/RectangleState";
import { getDiagramById } from "../../../utils/core/getDiagramById";
import { calcOrientedFrameFromPoints } from "../../../utils/math/geometry/calcOrientedFrameFromPoints";
import { newId } from "../../../utils/shapes/common/newId";
import { generateOptimalFrameToFrameConnection } from "../../../utils/shapes/connectPoint/generateOptimalFrameToFrameConnection";
import { createEllipseConnectPoint } from "../../../utils/shapes/ellipse/createEllipseConnectPoint";
import { createRectangleConnectPoint } from "../../../utils/shapes/rectangle/createRectangleConnectPoint";
import { isConnectableState } from "../../../utils/validation/isConnectableState";
import { isFrame } from "../../../utils/validation/isFrame";
import type { SvgCanvasSubHooksProps } from "../../types/SvgCanvasSubHooksProps";
import { useAddDiagram } from "../actions/useAddDiagram";

/**
 * Hook that monitors ConnectShapes events and performs shape connections.
 * This is a more generic version of useOnConnectNodes that supports
 * connecting any shapes (not just nodes) with customizable line styles,
 * arrow heads, and anchor positions.
 */
export const useOnConnectShapes = (props: SvgCanvasSubHooksProps) => {
	// Create a function to add a new diagram.
	const addDiagram = useAddDiagram(props);

	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
		addDiagram,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	useEffect(() => {
		// Bypass references to avoid function creation in every render.
		const { eventBus } = refBus.current.props;

		const connectShapesListener = (e: Event) => {
			// Bypass references to avoid function creation in every render.
			const { props, addDiagram } = refBus.current;
			const { canvasState } = props;

			const event = (e as CustomEvent<ConnectShapesEvent>).detail;

			// Debug: Log received event
			console.log("📥 [useOnConnectShapes] Received event:", {
				sourceShapeId: event.sourceShapeId,
				targetShapeId: event.targetShapeId,
				startArrowHead: event.startArrowHead,
				endArrowHead: event.endArrowHead,
				lineStyle: event.lineStyle,
				pathType: event.pathType,
				sourceAnchor: event.sourceAnchor,
				targetAnchor: event.targetAnchor,
				types: {
					sourceAnchor: typeof event.sourceAnchor,
					targetAnchor: typeof event.targetAnchor,
				},
			});

			const sourceShape = getDiagramById(
				canvasState.items,
				event.sourceShapeId,
			) as Diagram;
			const targetShape = getDiagramById(
				canvasState.items,
				event.targetShapeId,
			) as Diagram;

			if (!sourceShape || !targetShape) {
				console.error("Source or target shape not found.");
				return;
			}

			if (!isFrame(sourceShape) || !isFrame(targetShape)) {
				console.error("Source or target shape is not a frame.");
				return;
			}

			if (
				!isConnectableState(sourceShape) ||
				!isConnectableState(targetShape)
			) {
				console.error("Source or target shape is not connectable.");
				return;
			}

			// Find connection points based on anchor positions or use defaults
			console.log("🔍 [useOnConnectShapes] Looking for connect points:", {
				sourceShapeId: event.sourceShapeId,
				targetShapeId: event.targetShapeId,
				requestedSourceAnchor: event.sourceAnchor,
				requestedTargetAnchor: event.targetAnchor,
				sourceShapeConnectPoints: (
					sourceShape as ConnectableState
				).connectPoints
					?.map((p) => p.name)
					.join(", "),
				targetShapeConnectPoints: (
					targetShape as ConnectableState
				).connectPoints
					?.map((p) => p.name)
					.join(", "),
			});

			const sourceConnectPoint = findConnectPoint(
				sourceShape as ConnectableState & Diagram,
				event.sourceAnchor,
				"bottomCenterPoint", // default anchor for source
			);

			const targetConnectPoint = findConnectPoint(
				targetShape as ConnectableState & Diagram,
				event.targetAnchor,
				"topCenterPoint", // default anchor for target
			);

			if (!sourceConnectPoint || !targetConnectPoint) {
				console.error(
					"Source or target connect point not found.",
					`\nSource shape ID: ${event.sourceShapeId}, requested anchor: "${event.sourceAnchor || "(default)"}"`,
					`\nTarget shape ID: ${event.targetShapeId}, requested anchor: "${event.targetAnchor || "(default)"}"`,
					`\nSource point found: ${!!sourceConnectPoint}`,
					`\nTarget point found: ${!!targetConnectPoint}`,
				);
				return;
			}

			// Generate connection path points
			const points = generateOptimalFrameToFrameConnection(
				sourceConnectPoint.x,
				sourceConnectPoint.y,
				sourceShape as Frame,
				targetConnectPoint.x,
				targetConnectPoint.y,
				targetShape as Frame,
			);

			const frame = calcOrientedFrameFromPoints(
				points.map((p) => ({ x: p.x, y: p.y })),
			);

			const newPathPointId = (i: number) => {
				if (i === 0) return sourceConnectPoint.id;
				if (i === points.length - 1) return targetConnectPoint.id;
				return newId();
			};

			const pathPoints = points.map((p, i) => ({
				...p,
				id: newPathPointId(i),
				type: "PathPoint",
			})) as PathPointState[];

			// Create connection line with custom properties
			const connectLine: ConnectLineState = {
				...ConnectLineDefaultState,
				id: newId(),
				x: frame.x,
				y: frame.y,
				width: frame.width,
				height: frame.height,
				items: pathPoints,
				startOwnerId: sourceShape.id,
				endOwnerId: targetShape.id,
				// Apply custom arrow heads if specified
				...(event.startArrowHead !== undefined && {
					startArrowHead: event.startArrowHead,
				}),
				...(event.endArrowHead !== undefined && {
					endArrowHead: event.endArrowHead,
				}),
				// Apply custom path type if specified
				...(event.pathType !== undefined && {
					pathType: event.pathType,
				}),
				// Apply custom line style if specified
				...(event.lineStyle !== undefined && {
					strokeDashType: event.lineStyle,
				}),
			};

			addDiagram({
				eventId: event.eventId,
				item: connectLine,
			});
		};

		eventBus.addEventListener(EVENT_NAME_CONNECT_SHAPES, connectShapesListener);

		return () => {
			eventBus.removeEventListener(
				EVENT_NAME_CONNECT_SHAPES,
				connectShapesListener,
			);
		};
	}, []);
};

/**
 * Finds or creates a connection point on a shape based on the anchor position.
 * If the connection point doesn't exist, it will be generated dynamically.
 * If no anchor is specified, uses the default anchor name.
 *
 * @param shape - The connectable shape to find/create the point on
 * @param anchor - The anchor position name (optional)
 * @param defaultAnchor - The default anchor name to use if none specified
 * @returns The connection point or undefined if generation fails
 */
const findConnectPoint = (
	shape: ConnectableState & Diagram,
	anchor: AnchorPosition | undefined,
	defaultAnchor: string,
): ConnectPointState | undefined => {
	// Debug: Log input parameters
	console.log("🔎 [findConnectPoint] Input:", {
		anchor,
		anchorType: typeof anchor,
		anchorLength: anchor?.length,
		anchorTrimmed: anchor?.trim(),
		defaultAnchor,
		availablePoints:
			shape.connectPoints?.map((p) => p.name).join(", ") || "(none)",
		shapeType: shape.type,
	});

	// Empty string should be treated as undefined (use default)
	const anchorName = anchor && anchor.trim() !== "" ? anchor : defaultAnchor;

	console.log("🎯 [findConnectPoint] Searching for:", anchorName);

	// Try to find existing connect point
	const existingPoint = shape.connectPoints?.find((p) => p.name === anchorName);

	if (existingPoint) {
		console.log(`✅ Found existing connect point: ${anchorName}`);
		return existingPoint;
	}

	// Connect point not found - generate it dynamically
	console.log(
		`🏭 [findConnectPoint] Generating missing connect point: ${anchorName}`,
	);

	let generatedPoints: ConnectPointState[] = [];

	if (shape.type === "Rectangle") {
		const rectangleShape = shape as RectangleState;
		generatedPoints = createRectangleConnectPoint({
			x: rectangleShape.x,
			y: rectangleShape.y,
			width: rectangleShape.width,
			height: rectangleShape.height,
			rotation: rectangleShape.rotation,
			scaleX: rectangleShape.scaleX,
			scaleY: rectangleShape.scaleY,
		});
	} else if (shape.type === "Ellipse") {
		const ellipseShape = shape as EllipseState;
		generatedPoints = createEllipseConnectPoint({
			x: ellipseShape.x,
			y: ellipseShape.y,
			width: ellipseShape.width,
			height: ellipseShape.height,
			rotation: ellipseShape.rotation,
			scaleX: ellipseShape.scaleX,
			scaleY: ellipseShape.scaleY,
		});
	} else {
		console.error(
			`❌ Cannot generate connect point for unsupported shape type: ${shape.type}`,
		);
		return undefined;
	}

	// Find the specific connect point we need from the generated points
	const newConnectPoint = generatedPoints.find(
		(p: ConnectPointState) => p.name === anchorName,
	);

	if (!newConnectPoint) {
		console.error(
			`❌ Failed to generate connect point "${anchorName}" for shape type: ${shape.type}`,
		);
		return undefined;
	}

	// Initialize connectPoints array if it doesn't exist
	if (!shape.connectPoints) {
		shape.connectPoints = [];
	}

	// Add the newly generated point to the shape's connect points
	shape.connectPoints.push(newConnectPoint);

	console.log(
		`✨ [findConnectPoint] Generated and added connect point: ${anchorName}`,
	);

	return newConnectPoint;
};
