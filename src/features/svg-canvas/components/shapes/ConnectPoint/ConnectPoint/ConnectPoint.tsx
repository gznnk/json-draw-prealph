// Import React.
import type React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

// Import types.
import type { Point } from "../../../../types/base/Point";
import type { DiagramDragDropEvent } from "../../../../types/events/DiagramDragDropEvent";
import type { DiagramDragEvent } from "../../../../types/events/DiagramDragEvent";
import type { DiagramHoverEvent } from "../../../../types/events/DiagramHoverEvent";
import type { ConnectPointProps } from "../../../../types/props/shapes/ConnectPointProps";
import type { PathPointData } from "../../../../types/data/shapes/PathPointData";

// Import hooks
import { useEventBus } from "../../../../context/EventBusContext";

// SvgCanvas髢｢騾｣繧ｳ繝ｳ繝昴・繝阪Φ繝医ｒ繧､繝ｳ繝昴・繝・
import { DragPoint } from "../../../core/DragPoint";

// Import utils.
import { calcRectangleBoundingBoxGeometry } from "../../../../utils/math/geometry/calcRectangleBoundingBoxGeometry";
import { newId } from "../../../../utils/shapes/common/newId";

// Imports related to this component.
import { triggerNewConnectLine } from "../NewConnectLine";
import { EVENT_NAME_CONNECTTION } from "./ConnectPointConstants";
import { createBestConnectPath } from "../../../../utils/shapes/connectPoint/createBestConnectPath";
import { createConnectPathOnDrag } from "../../../../utils/shapes/connectPoint/createConnectPathOnDrag";
import { getLineDirection } from "../../../../utils/shapes/connectPoint/getLineDirection";
import type { ConnectingPoint, ConnectionEvent } from "./ConnectPointTypes";

/**
 * 謗･邯壹・繧､繝ｳ繝医さ繝ｳ繝昴・繝阪Φ繝・
 */
const ConnectPointComponent: React.FC<ConnectPointProps> = ({
	id,
	x,
	y,
	ownerId,
	ownerShape,
	isTransparent,
	onConnect,
}) => {
	// Get eventBus from context
	const eventBus = useEventBus();

	// 繝帙ヰ繝ｼ迥ｶ諷九・邂｡逅・
	const [isHovered, setIsHovered] = useState(false);
	// 謗･邯夂ｷ壹・蠎ｧ讓・
	const [pathPoints, setPathPoints] = useState<PathPointData[]>([]);
	// 謗･邯壻ｸｭ縺ｮ繝昴う繝ｳ繝・
	const connectingPoint = useRef<ConnectingPoint | undefined>(undefined);
	// 謗･邯壹・繧､繝ｳ繝医・謇譛芽・・螟匁磁遏ｩ蠖｢
	const ownerBoundingBoxGeometry = calcRectangleBoundingBoxGeometry(ownerShape);
	// 謗･邯壹・繧､繝ｳ繝医・譁ｹ蜷・
	const direction = getLineDirection(ownerShape.x, ownerShape.y, x, y);

	/**
	 * 謗･邯夂ｷ壹・蠎ｧ讓吶ｒ譖ｴ譁ｰ
	 */
	const updatePathPoints = (dragX: number, dragY: number) => {
		let newPoints: Point[] = [];

		if (!connectingPoint.current) {
			// 繝峨Λ繝・げ荳ｭ縺ｮ謗･邯夂ｷ・
			newPoints = createConnectPathOnDrag(
				x,
				y,
				direction,
				ownerBoundingBoxGeometry,
				dragX,
				dragY,
			);
		} else {
			// 謗･邯壻ｸｭ縺ｮ繝昴う繝ｳ繝医′縺ゅｋ蝣ｴ蜷医・謗･邯夂ｷ・
			newPoints = createBestConnectPath(
				x,
				y,
				ownerShape,
				connectingPoint.current.x, // 謗･邯壼・縺ｮX蠎ｧ讓・
				connectingPoint.current.y, // 謗･邯壼・縺ｮY蠎ｧ讓・
				connectingPoint.current.ownerShape, // 謗･邯壼・縺ｮ謇譛芽・・蠖｢迥ｶ
			);
		}

		const newPathPoints = newPoints.map(
			(p, i) =>
				({
					id: `${id}-${i}`, // 莉ｮ縺ｮID繧剃ｻ倅ｸ・
					x: p.x,
					y: p.y,
				}) as PathPointData,
		);

		setPathPoints(newPathPoints);

		// Notify the path data for the new connection line rendering.
		triggerNewConnectLine(eventBus, {
			id: `${id}-connecting-path`,
			type: "Path",
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			rotation: 0,
			scaleX: 1,
			scaleY: 1,
			stroke: "#3A415C",
			strokeWidth: "3px",
			keepProportion: false,
			isSelected: false,
			isMultiSelectSource: false,
			endArrowHead: "Circle",
			items: newPathPoints,
		});
	};

	// 繝上Φ繝峨Λ逕滓・縺ｮ鬆ｻ逋ｺ繧貞屓驕ｿ縺吶ｋ縺溘ａ縲∝盾辣ｧ縺吶ｋ蛟､繧置seRef縺ｧ菫晄戟縺吶ｋ
	const refBusVal = {
		// 繝励Ο繝代ユ繧｣
		id,
		x,
		y,
		ownerId,
		ownerShape,
		onConnect,
		eventBus,
		// 蜀・Κ螟画焚繝ｻ蜀・Κ髢｢謨ｰ
		pathPoints,
		updatePathPoints,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	/**
	 * 謗･邯壹・繧､繝ｳ繝医・繝峨Λ繝・げ繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleDrag = useCallback((e: DiagramDragEvent) => {
		if (connectingPoint.current) {
			// 謗･邯壻ｸｭ縺ｮ繝昴う繝ｳ繝医′縺ゅｋ蝣ｴ蜷医・縲√◎縺ｮ繝昴う繝ｳ繝医ｒ邨らせ縺ｨ縺吶ｋ
			return;
		}

		// 謗･邯夂ｷ壹・蠎ｧ讓吶ｒ蜀崎ｨ育ｮ・
		refBus.current.updatePathPoints(e.endX, e.endY);

		if (e.eventType === "End") {
			setPathPoints([]);

			// Clear the path data for the new connection line rendering.
			triggerNewConnectLine(refBus.current.eventBus);
		}
	}, []);

	/**
	 * 縺薙・謗･邯壹・繧､繝ｳ繝医・荳翫↓隕∫ｴ縺御ｹ励▲縺滓凾縺ｮ繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleDragOver = useCallback((e: DiagramDragDropEvent) => {
		if (e.dropItem.type === "ConnectPoint") {
			setIsHovered(true);

			const { id, x, y, ownerId, ownerShape, eventBus } = refBus.current;

			// 謗･邯壼・縺ｫ諠・ｱ繧帝∽ｿ｡
			eventBus.dispatchEvent(
				new CustomEvent(EVENT_NAME_CONNECTTION, {
					detail: {
						eventId: e.eventId,
						type: "connecting",
						startPointId: e.dropItem.id,
						startX: e.dropItem.x,
						startY: e.dropItem.y,
						endPointId: id,
						endX: x,
						endY: y,
						endOwnerId: ownerId,
						endOwnerShape: ownerShape,
					},
				}),
			);
		}
	}, []);
	/**
	 * 縺薙・謗･邯壹・繧､繝ｳ繝医・荳翫°繧芽ｦ∫ｴ縺悟､悶ｌ縺滓凾縺ｮ繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleDragLeave = useCallback((e: DiagramDragDropEvent) => {
		setIsHovered(false);
		// 謗･邯壹′蛻・ｌ縺滓凾縺ｮ蜃ｦ逅・
		if (e.dropItem.type === "ConnectPoint") {
			const { id, x, y, ownerId, ownerShape, eventBus } = refBus.current;

			// 謗･邯壼・縺ｫ諠・ｱ繧帝∽ｿ｡
			eventBus.dispatchEvent(
				new CustomEvent(EVENT_NAME_CONNECTTION, {
					detail: {
						eventId: e.eventId,
						type: "disconnect",
						startPointId: e.dropItem.id,
						startX: e.dropItem.x,
						startY: e.dropItem.y,
						endPointId: id,
						endX: x,
						endY: y,
						endOwnerId: ownerId,
						endOwnerShape: ownerShape,
					},
				}),
			);
		}
	}, []);
	/**
	 * 縺薙・謗･邯壹・繧､繝ｳ繝医↓隕∫ｴ縺後ラ繝ｭ繝・・縺輔ｌ縺滓凾縺ｮ繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleDrop = useCallback((e: DiagramDragDropEvent) => {
		// 繝峨Ο繝・・縺輔ｌ縺溘→縺阪・蜃ｦ逅・
		if (e.dropItem.type === "ConnectPoint") {
			const { id, x, y, ownerId, ownerShape, eventBus } = refBus.current;

			// 謗･邯壼・縺ｫ諠・ｱ繧帝∽ｿ｡
			eventBus.dispatchEvent(
				new CustomEvent(EVENT_NAME_CONNECTTION, {
					detail: {
						eventId: e.eventId,
						type: "connect",
						startPointId: e.dropItem.id,
						startX: e.dropItem.x,
						startY: e.dropItem.y,
						endPointId: id,
						endX: x,
						endY: y,
						endOwnerId: ownerId,
						endOwnerShape: ownerShape,
					},
				}),
			);
		}
		setIsHovered(false);
	}, []);

	/**
	 * 繝帙ヰ繝ｼ迥ｶ諷句､画峩繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 *
	 * @param {DiagramHoverEvent} e 繝帙ヰ繝ｼ迥ｶ諷句､画峩繧､繝吶Φ繝・
	 * @returns {void}
	 */
	const handleHover = useCallback((e: DiagramHoverEvent) => {
		setIsHovered(e.isHovered);
	}, []);

	useEffect(() => {
		const handleConnection = (e: Event) => {
			// refBus繧剃ｻ九＠縺ｦ蜿ら・蛟､繧貞叙蠕・
			const { id, pathPoints, ownerId, onConnect, updatePathPoints, eventBus } =
				refBus.current;

			const customEvent = e as CustomEvent<ConnectionEvent>;
			if (customEvent.detail.startPointId === id) {
				if (customEvent.detail.type === "connecting") {
					// 謗･邯壹′蟋九∪縺｣縺滓凾縺ｮ蜃ｦ逅・
					// 謗･邯壼・縺ｮ繝昴う繝ｳ繝医ｒ菫晄戟
					connectingPoint.current = {
						id: customEvent.detail.endPointId,
						x: customEvent.detail.endX,
						y: customEvent.detail.endY,
						onwerId: customEvent.detail.endOwnerId,
						ownerShape: customEvent.detail.endOwnerShape,
					};

					// 謗･邯壼・縺ｮ繝昴う繝ｳ繝医→邱壹′縺､縺ｪ縺後ｋ繧医≧縲√ヱ繧ｹ繝昴う繝ｳ繝医ｒ蜀崎ｨ育ｮ・
					updatePathPoints(customEvent.detail.endX, customEvent.detail.endY);
				}

				if (customEvent.detail.type === "disconnect") {
					// 蛻・妙譎ゅ・蜃ｦ逅・
					// 謗･邯壻ｸｭ縺ｮ繝昴う繝ｳ繝医ｒ隗｣髯､
					connectingPoint.current = undefined;
				}

				if (customEvent.detail.type === "connect") {
					// 謗･邯壼ｮ御ｺ・凾縺ｮ蜃ｦ逅・
					// 謗･邯夂ｷ壹・繝・・繧ｿ繧堤函謌舌＠縺ｦ繧､繝吶Φ繝育匱轣ｫ

					const points: PathPointData[] = [...pathPoints];
					points[0].id = id;
					for (let i = 1; i < points.length - 1; i++) {
						points[i].id = newId();
					}
					points[points.length - 1].id = customEvent.detail.endPointId;

					onConnect?.({
						eventId: customEvent.detail.eventId,
						startOwnerId: ownerId,
						points: points,
						endOwnerId: customEvent.detail.endOwnerId,
					});

					setPathPoints([]);

					// Clear the path data for the new connection line rendering.
					triggerNewConnectLine(eventBus);
				}
			}
		};

		eventBus.addEventListener(EVENT_NAME_CONNECTTION, handleConnection);

		return () => {
			if (handleConnection) {
				eventBus.removeEventListener(EVENT_NAME_CONNECTTION, handleConnection);
			}
		};
	}, [eventBus]);

	return (
		<DragPoint
			id={id}
			x={x}
			y={y}
			type="ConnectPoint"
			radius={6}
			stroke="rgba(255, 204, 0, 0.8)"
			fill="rgba(255, 204, 0, 0.8)"
			cursor="pointer"
			outline="none"
			// Show when hovered, even if isTransparent is true.
			// If you want to hide when hovered, do not render this component.
			isTransparent={isTransparent && !isHovered}

			onDrag={handleDrag}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onHover={handleHover}
		/>
	);
};

export const ConnectPoint = memo(ConnectPointComponent);
