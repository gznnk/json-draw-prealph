// Import React.
import type React from "react";
import { memo, useCallback, useContext, useEffect, useRef } from "react";

// Import types.
import type { Diagram } from "../../../../types/data/catalog/Diagram";
import type { ConnectLineProps } from "../../../../types/props/shapes/ConnectLineProps";
import type { ConnectPointMoveData } from "../../../../types/events/ConnectPointMoveData";
import type { ConnectPointsMoveEvent } from "../../../../types/events/ConnectPointsMoveEvent";
import type { DiagramChangeEvent } from "../../../../types/events/DiagramChangeEvent";
import type { Shape } from "../../../../types/base/Shape";

// Import components related to SvgCanvas.
import { createBestConnectPath } from "../../../../utils/shapes/connectPoint/createBestConnectPath";
import { Path } from "../../Path";

// Import utils.
import { calcRadians } from "../../../../utils/math/points/calcRadians";
import { newId } from "../../../../utils/shapes/common/newId";
import { radiansToDegrees } from "../../../../utils/math/common/radiansToDegrees";

// Imports related to this component.
import { EVENT_NAME_CONNECT_POINTS_MOVE } from "../../../../constants/EventNames";

// Import SvgCanvas context.
import { SvgCanvasContext } from "../../../../canvas/SvgCanvasContext";

/**
 * ConnectLine component.
 */
const ConnectLineComponent: React.FC<ConnectLineProps> = ({
	id,
	x,
	y,
	width,
	height,
	rotation,
	scaleX,
	scaleY,
	stroke = "black",
	strokeWidth = "1px",
	isSelected = false,
	items = [],
	startOwnerId,
	endOwnerId,
	autoRouting,
	startArrowHead,
	endArrowHead,
	onClick,
	onSelect,
	onDiagramChange,
}) => {
	// Items of ConnectLine component at the start of the change event.
	const startItems = useRef<Diagram[]>([]);
	// Is the line only vertical or horizontal.
	const isVerticalHorizontalLines = useRef<boolean>(true);
	// SvgCanvas state provider.
	const canvasStateProvider = useContext(SvgCanvasContext);

	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		id,
		items,
		startOwnerId,
		endOwnerId,
		autoRouting,
		onDiagramChange,
		canvasStateProvider,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	// Register handler for ConnectPoint components move event.
	useEffect(() => {
		const handleConnectPointsMove = (e: Event) => {
			// Bypass references to avoid function creation in every render.
			const {
				id,
				items,
				startOwnerId,
				endOwnerId,
				autoRouting,
				onDiagramChange,
				canvasStateProvider,
			} = refBus.current;

			const event = (e as CustomEvent<ConnectPointsMoveEvent>).detail;

			// Find point data in the event that this ConnectLine component owns.
			const movedPoint = event.points.find((p) =>
				items.some((item) => item.id === p.id),
			);
			if (!movedPoint) {
				// Ignore unrelated ConnectPoint components move events.
				return;
			}
			if (event.eventType === "Start") {
				// Hold items at the start of movement
				startItems.current = items;

				// Check if all lines are vertical and horizontal only
				isVerticalHorizontalLines.current = items.every((item, idx) => {
					if (idx === 0) {
						return true;
					}

					const prev = items[idx - 1];
					const degrees = radiansToDegrees(
						calcRadians(prev.x, prev.y, item.x, item.y),
					);
					return degrees % 90 === 0;
				});
			} // Process during movement and end of movement
			if (startItems.current.length === 0) {
				// If there are no items at movement start, do nothing
				// This is failsafe processing - if we reach here, it's a bug
				console.error("Illegal state: startItems is empty.");
				return;
			}

			const _startItems = startItems.current;
			const _isVerticalHorizontalLines = isVerticalHorizontalLines.current;
			const movedPointIdx = _startItems.findIndex(
				(item) => item.id === movedPoint.id,
			); // Get the point on the opposite side of the moved connection point
			const oppositeItem =
				movedPointIdx === 0
					? _startItems[_startItems.length - 1]
					: _startItems[0];
			let oppositePoint = {
				x: oppositeItem.x,
				y: oppositeItem.y,
			};

			// Check if the opposite point also moved
			const movedOppositPoint = event.points.find(
				(p) => p.id === oppositeItem.id,
			);

			if (!autoRouting) {
				// Auto-routing disabled

				// Function to create points after movement
				const createNewPoint = (
					movedBothEndsPoint: ConnectPointMoveData,
					oldPoint: Diagram,
					idx: number,
				) => {
					// Move end points along with connection point movement
					if (oldPoint.id === movedBothEndsPoint.id) {
						return {
							...oldPoint,
							x: movedBothEndsPoint.x,
							y: movedBothEndsPoint.y,
						};
					}

					// Check if it's a point adjacent to the moved point. TODO: Logic doesn't work well for opposite points
					const movedBothEndsPointIdx = _startItems.findIndex(
						(item) => item.id === movedBothEndsPoint.id,
					);
					const isNextPoint =
						(movedBothEndsPointIdx === 0 && idx === 1) ||
						(movedBothEndsPointIdx === _startItems.length - 1 &&
							idx === _startItems.length - 2);
					if (isNextPoint) {
						// If connection lines are not only vertical and horizontal, keep the second point as is
						if (!_isVerticalHorizontalLines) {
							return oldPoint;
						}

						// For connection lines with only vertical and horizontal lines, move the second point to maintain this constraint

						// Calculate movement amount
						const movedPointOldData = _startItems[movedBothEndsPointIdx];
						const dx = movedBothEndsPoint.x - movedPointOldData.x;
						const dy = movedBothEndsPoint.y - movedPointOldData.y;

						// Calculate angle between two points
						const direction = calcRadians(
							movedPointOldData.x,
							movedPointOldData.y,
							oldPoint.x,
							oldPoint.y,
						);
						const degrees = radiansToDegrees(direction);
						const isVertical = (degrees + 405) % 180 > 90;

						// If the line between two points is horizontal, move only x coordinate; if vertical, move only y coordinate
						return {
							...oldPoint,
							x: !isVertical ? oldPoint.x + dx : oldPoint.x,
							y: isVertical ? oldPoint.y + dy : oldPoint.y,
						};
					}

					return oldPoint;
				};

				const newItems = _startItems.map((item, idx) => {
					const newPoint = createNewPoint(movedPoint, item, idx);
					if (newPoint !== item) {
						return newPoint;
					}
					if (movedOppositPoint) {
						return createNewPoint(movedOppositPoint, item, idx);
					}
					return item;
				}) as Diagram[];

				// Fire connection line change event
				onDiagramChange?.({
					eventId: event.eventId,
					eventType: event.eventType,
					changeType: "Transform",
					id,
					startDiagram: {
						items: _startItems,
					},
					endDiagram: {
						items: newItems,
					},
				});
			} else {
				// When auto-routing is enabled, recalculate the optimal connection line

				if (movedOppositPoint) {
					// If the opposite point has moved, use its coordinates
					oppositePoint = movedOppositPoint;
				}

				// Get the information of the opposite shape
				let oppositeOwnerShape: Shape;
				if (movedOppositPoint) {
					oppositeOwnerShape = movedOppositPoint.ownerShape;
				} else {
					// If the opposite shape hasn't moved, get the information from canvasStateProvider (only the previous frame's information is available, but this is fine since the connected shape hasn't moved)
					oppositeOwnerShape = canvasStateProvider?.getDiagramById(
						movedPoint.ownerId === startOwnerId ? endOwnerId : startOwnerId,
					) as Shape;
				}

				// Recalculate the optimal connection line
				const newPath = createBestConnectPath(
					movedPoint.x,
					movedPoint.y,
					movedPoint.ownerShape,
					oppositePoint.x,
					oppositePoint.y,
					oppositeOwnerShape,
				); // Create connection line point data
				const newItems = (
					movedPointIdx === 0 ? newPath : newPath.reverse()
				).map((p, idx) => ({
					id: event.eventType === "End" ? newId() : `${id}-${idx}`,
					name: `cp-${idx}`,
					type: "PathPoint",
					x: p.x,
					y: p.y,
				})) as Diagram[];
				// Maintain IDs of both end points
				newItems[0].id = _startItems[0].id;
				newItems[newItems.length - 1].id =
					_startItems[_startItems.length - 1].id;

				// Fire connection line change event
				onDiagramChange?.({
					eventId: event.eventId,
					eventType: event.eventType,
					changeType: "Transform",
					id,
					startDiagram: {
						items: _startItems,
					},
					endDiagram: {
						items: newItems,
					},
				});

				if (event.eventType === "End") {
					startItems.current = [];
				}
			}
		};
		document.addEventListener(
			EVENT_NAME_CONNECT_POINTS_MOVE,
			handleConnectPointsMove,
		);

		return () => {
			document.removeEventListener(
				EVENT_NAME_CONNECT_POINTS_MOVE,
				handleConnectPointsMove,
			);
		};
	}, []);

	/**
	 * Handle Path component change event.
	 */
	const handlePathChange = useCallback((e: DiagramChangeEvent) => {
		refBus.current.onDiagramChange?.({
			...e,
			endDiagram: {
				...e.endDiagram,
				autoRouting: false,
			},
		});
	}, []);

	return (
		<Path
			id={id}
			x={x}
			y={y}
			width={width}
			height={height}
			rotation={rotation}
			scaleX={scaleX}
			scaleY={scaleY}
			keepProportion={false}
			stroke={stroke}
			strokeWidth={strokeWidth}
			isSelected={isSelected}
			isMultiSelectSource={false}
			dragEnabled={false}
			transformEnabled={false}
			segmentDragEnabled={true}
			rightAngleSegmentDrag={true}
			newVertexEnabled={true}
			fixBothEnds={true}
			startArrowHead={startArrowHead}
			endArrowHead={endArrowHead}
			items={items}
			onClick={onClick}
			onSelect={onSelect}
			onDiagramChange={handlePathChange}
		/>
	);
};

export const ConnectLine = memo(ConnectLineComponent);
