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
	eventBus,
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
				// 遘ｻ蜍暮幕蟋区凾縺ｮitems繧剃ｿ晄戟
				startItems.current = items;

				// 蝙ら峩縺ｨ豌ｴ蟷ｳ縺ｮ邱壹・縺ｿ縺九←縺・°繧貞愛螳・
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
			}

			// 遘ｻ蜍穂ｸｭ縺ｨ遘ｻ蜍慕ｵゆｺ・凾縺ｮ蜃ｦ逅・
			if (startItems.current.length === 0) {
				// 遘ｻ蜍暮幕蟋区凾縺ｮitems縺後↑縺・ｴ蜷医・菴輔ｂ縺励↑縺・
				// 繝輔ぉ繧､繝ｫ繧ｻ繝ｼ繝輔・蜃ｦ逅・〒縲√％縺薙↓縺上ｋ蝣ｴ蜷医・繝舌げ
				console.error("Illegal state: startItems is empty.");
				return;
			}

			const _startItems = startItems.current;
			const _isVerticalHorizontalLines = isVerticalHorizontalLines.current;
			const movedPointIdx = _startItems.findIndex(
				(item) => item.id === movedPoint.id,
			);

			// 蜍輔＞縺滓磁邯壹・繧､繝ｳ繝医・蜿榊ｯｾ蛛ｴ縺ｮ轤ｹ繧貞叙蠕・
			const oppositeItem =
				movedPointIdx === 0
					? _startItems[_startItems.length - 1]
					: _startItems[0];
			let oppositePoint = {
				x: oppositeItem.x,
				y: oppositeItem.y,
			};

			// 蜿榊ｯｾ蛛ｴ縺ｮ轤ｹ繧ょ虚縺・※縺・ｋ縺九←縺・°繧堤｢ｺ隱・
			const movedOppositPoint = event.points.find(
				(p) => p.id === oppositeItem.id,
			);

			if (!autoRouting) {
				// 閾ｪ蜍輔Ν繝ｼ繝・ぅ繝ｳ繧ｰ辟｡蜉ｹ譎・

				// 遘ｻ蜍募ｾ後・繝昴う繝ｳ繝井ｽ懈・髢｢謨ｰ
				const createNewPoint = (
					movedBothEndsPoint: ConnectPointMoveData,
					oldPoint: Diagram,
					idx: number,
				) => {
					// 謗･邯壹・繧､繝ｳ繝医・遘ｻ蜍輔↓縺ゅｏ縺帙※譛ｫ遶ｯ縺ｮ轤ｹ繧らｧｻ蜍・
					if (oldPoint.id === movedBothEndsPoint.id) {
						return {
							...oldPoint,
							x: movedBothEndsPoint.x,
							y: movedBothEndsPoint.y,
						};
					}

					// 遘ｻ蜍輔＠縺溽せ縺ｮ髫｣縺ｮ轤ｹ縺九←縺・° TODO: 蜿榊ｯｾ縺ｮ轤ｹ縺ｮ譎ゅ・蛻､螳壹′縺・∪縺上＞縺九ｓ
					const movedBothEndsPointIdx = _startItems.findIndex(
						(item) => item.id === movedBothEndsPoint.id,
					);
					const isNextPoint =
						(movedBothEndsPointIdx === 0 && idx === 1) ||
						(movedBothEndsPointIdx === _startItems.length - 1 &&
							idx === _startItems.length - 2);

					if (isNextPoint) {
						// 謗･邯夂ｷ壹′蝙ら峩縺ｨ豌ｴ蟷ｳ縺ｮ邱壹・縺ｿ縺ｧ縺ｪ縺・ｴ蜷医・縲・ｼ堤分逶ｮ縺ｮ轤ｹ縺ｯ縺昴・縺ｾ縺ｾ
						if (!_isVerticalHorizontalLines) {
							return oldPoint;
						}

						// 謗･邯夂ｷ壹′蝙ら峩縺ｨ豌ｴ蟷ｳ縺ｮ邱壹・縺ｿ縺ｯ縲√◎繧後′邯ｭ謖√＆繧後ｋ繧医≧・堤分逶ｮ縺ｮ轤ｹ繧らｧｻ蜍輔☆繧・

						// 遘ｻ蜍暮㍼繧定ｨ育ｮ・
						const movedPointOldData = _startItems[movedBothEndsPointIdx];
						const dx = movedBothEndsPoint.x - movedPointOldData.x;
						const dy = movedBothEndsPoint.y - movedPointOldData.y;

						// ・堤せ髢薙・隗貞ｺｦ繧定ｨ育ｮ・
						const direction = calcRadians(
							movedPointOldData.x,
							movedPointOldData.y,
							oldPoint.x,
							oldPoint.y,
						);
						const degrees = radiansToDegrees(direction);
						const isVertical = (degrees + 405) % 180 > 90;

						// ・堤せ髢薙・邱壹′豌ｴ蟷ｳ縺ｧ縺ゅｌ縺ｰx蠎ｧ讓吶・縺ｿ縲∝桙逶ｴ縺ｧ縺ゅｌ縺ｰy蠎ｧ讓吶・縺ｿ遘ｻ蜍・
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

				// 謗･邯夂ｷ壹・螟画峩繧､繝吶Φ繝医ｒ逋ｺ轣ｫ
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
				// 閾ｪ蜍輔Ν繝ｼ繝・ぅ繝ｳ繧ｰ譛牙柑譎ゅ・縲∵怙驕ｩ縺ｪ謗･邯夂ｷ壹ｒ蜀崎ｨ育ｮ・

				if (movedOppositPoint) {
					// 蜿榊ｯｾ蛛ｴ縺ｮ轤ｹ縺悟虚縺・※縺・ｋ蝣ｴ蜷医・縲√◎縺ｮ蠎ｧ讓吶ｒ蛻ｩ逕ｨ
					oppositePoint = movedOppositPoint;
				}

				// 蜿榊ｯｾ蛛ｴ縺ｮ蝗ｳ蠖｢縺ｮ諠・ｱ繧貞叙蠕・
				let oppositeOwnerShape: Shape;
				if (movedOppositPoint) {
					oppositeOwnerShape = movedOppositPoint.ownerShape;
				} else {
					// 蜿榊ｯｾ蛛ｴ縺ｮ蝗ｳ蠖｢縺悟虚縺・※縺・↑縺・ｴ蜷医・canvasStateProvider縺九ｉ諠・ｱ繧貞叙蠕暦ｼ茨ｼ代ヵ繝ｬ繝ｼ繝蜑阪・諠・ｱ縺励°蜿悶ｌ縺ｪ縺・′縲∵磁邯壼・縺ｮ蝗ｳ蠖｢縺ｫ遘ｻ蜍輔・縺ｪ縺・ｴ蜷医↑縺ｮ縺ｧ蝠城｡後↑縺・ｼ・
					oppositeOwnerShape = canvasStateProvider?.getDiagramById(
						movedPoint.ownerId === startOwnerId ? endOwnerId : startOwnerId,
					) as Shape;
				}

				// 譛驕ｩ縺ｪ謗･邯夂ｷ壹ｒ蜀崎ｨ育ｮ・
				const newPath = createBestConnectPath(
					movedPoint.x,
					movedPoint.y,
					movedPoint.ownerShape,
					oppositePoint.x,
					oppositePoint.y,
					oppositeOwnerShape,
				);

				// 謗･邯夂ｷ壹・轤ｹ縺ｮ繝・・繧ｿ繧剃ｽ懈・
				const newItems = (
					movedPointIdx === 0 ? newPath : newPath.reverse()
				).map((p, idx) => ({
					id: event.eventType === "End" ? newId() : `${id}-${idx}`,
					name: `cp-${idx}`,
					type: "PathPoint",
					x: p.x,
					y: p.y,
				})) as Diagram[];
				// 荳｡遶ｯ縺ｮ轤ｹ縺ｮID縺ｯ邯ｭ謖√☆繧・
				newItems[0].id = _startItems[0].id;
				newItems[newItems.length - 1].id =
					_startItems[_startItems.length - 1].id;

				// 謗･邯夂ｷ壹・螟画峩繧､繝吶Φ繝医ｒ逋ｺ轣ｫ
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
