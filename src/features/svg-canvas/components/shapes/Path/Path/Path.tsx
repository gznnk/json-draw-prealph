// Import React.
import type React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

// Import types.
import type { Diagram } from "../../../../types/data/catalog/Diagram";
import type { DiagramBaseData } from "../../../../types/base/DiagramBaseData";
import type { PathData } from "../../../../types/data/shapes/PathData";
import type { DiagramChangeEvent } from "../../../../types/events/DiagramChangeEvent";
import type { DiagramClickEvent } from "../../../../types/events/DiagramClickEvent";
import type { DiagramDragEvent } from "../../../../types/events/DiagramDragEvent";
import type { DiagramPointerEvent } from "../../../../types/events/DiagramPointerEvent";
import type { PathProps } from "../../../../types/props/shapes/PathProps";

// Import components.
import { Outline } from "../../../core/Outline";
import { PositionLabel } from "../../../core/PositionLabel";
import { Group } from "../../Group";
import { NewVertexList } from "../NewVertexList";
import { SegmentList } from "../SegmentList";
import { PathElement } from "./PathStyled";

// Import hooks.
import { useDrag } from "../../../../hooks/useDrag";
import { useEventBus } from "../../../../context/EventBusContext";

// Import utils.
import { calcPointsOuterShape } from "../../../../utils/math/geometry/calcPointsOuterShape";
import {
	createEndPointArrowHead,
	createStartPointArrowHead,
} from "../../../../utils/shapes/path/createArrowHeads";
import { createDValue } from "../../../../utils/shapes/path/createDValue";
import { isItemableData } from "../../../../utils/validation/isItemableData";

// TODO: 譫邱壹→驥阪↑縺｣縺ｦ縺・ｋ縺ｨ鬆らせ邱ｨ髮・Δ繝ｼ繝峨↓縺ｧ縺阪↑縺・
/**
 * 謚倥ｌ邱壹さ繝ｳ繝昴・繝阪Φ繝・
 * 縺ｧ縺阪ｋ縺薙→・・
 * - 謚倥ｌ邱壹・謠冗判
 * - 謚倥ｌ邱壹・蜈ｨ菴薙ラ繝ｩ繝・げ
 * - 謚倥ｌ邱壹・驕ｸ謚・
 * - 謚倥ｌ邱壹・螟牙ｽ｢
 * - 謚倥ｌ邱壹・邱壼・縺ｮ繝峨Λ繝・げ
 * - 謚倥ｌ邱壹・譁ｰ隕城らせ縺ｮ霑ｽ蜉
 */
const PathComponent: React.FC<PathProps> = ({
	id,
	x,
	y,
	width,
	height,
	rotation,
	scaleX,
	scaleY,
	keepProportion = false,
	stroke = "black",
	strokeWidth = "1px",
	isSelected = false,
	isMultiSelectSource = false,
	showOutline = false,
	items = [],
	syncWithSameId = false,
	dragEnabled = true,
	transformEnabled = true,
	segmentDragEnabled = true,
	rightAngleSegmentDrag = false,
	newVertexEnabled = true,
	fixBothEnds = false,
	startArrowHead = "None",
	endArrowHead = "None",
	onClick,
	onDrag,
	onSelect,
	onTransform,
	onDiagramChange,
}) => {
	// Get eventBus from context
	const eventBus = useEventBus();

	const [isDragging, setIsDragging] = useState(false);
	const [isPathPointDragging, setIsPathPointDragging] = useState(false);
	const [isSequentialSelection, setIsSequentialSelection] = useState(false);
	const [isVerticesMode, setIsVerticesMode] = useState(!transformEnabled);

	const startItems = useRef<Diagram[]>(items);
	const dragSvgRef = useRef<SVGPathElement>({} as SVGPathElement);

	// 繝上Φ繝峨Λ逕滓・縺ｮ鬆ｻ逋ｺ繧貞屓驕ｿ縺吶ｋ縺溘ａ縲∝盾辣ｧ縺吶ｋ蛟､繧置seRef縺ｧ菫晄戟縺吶ｋ
	const refBusVal = {
		// 繝励Ο繝代ユ繧｣
		id,
		x,
		y,
		rotation,
		scaleX,
		scaleY,
		isSelected,
		transformEnabled,
		dragEnabled,
		items,
		onDrag,
		onSelect,
		onClick,
		onDiagramChange,
		// 蜀・Κ螟画焚繝ｻ蜀・Κ髢｢謨ｰ
		isSequentialSelection,
		isVerticesMode,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	/**
	 * 謚倥ｌ邱壹・繝昴う繝ｳ繧ｿ繝ｼ繝繧ｦ繝ｳ繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handlePointerDown = useCallback((e: DiagramPointerEvent) => {
		const { id, isSelected, transformEnabled, onSelect } = refBus.current;

		// 蝗ｳ蠖｢驕ｸ謚槭う繝吶Φ繝医ｒ逋ｺ轣ｫ
		onSelect?.({
			eventId: e.eventId,
			id,
		});

		if (!transformEnabled) {
			setIsVerticesMode(true);
		}

		if (isSelected) {
			setIsSequentialSelection(true);
		}
	}, []);

	/**
	 * 謚倥ｌ邱壹・繧ｯ繝ｪ繝・け繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleClick = useCallback((e: DiagramClickEvent) => {
		const {
			id,
			isSequentialSelection,
			isVerticesMode,
			transformEnabled,
			onClick,
		} = refBus.current;

		if (isSequentialSelection && transformEnabled) {
			setIsVerticesMode(!isVerticesMode);
		}
		onClick?.({
			eventId: e.eventId,
			id,
		});
	}, []);

	// 謚倥ｌ邱壹・驕ｸ謚樒憾諷句宛蠕｡
	useEffect(() => {
		// 繧ｰ繝ｫ繝ｼ繝励°繧蛾∈謚槭′螟悶ｌ縺溘ｉ騾｣邯夐∈謚槭ヵ繝ｩ繧ｰ繧りｧ｣髯､
		if (!isSelected) {
			setIsSequentialSelection(false);
			setIsVerticesMode(false);
		}
	}, [isSelected]);

	/**
	 * 謚倥ｌ邱壹・繝峨Λ繝・げ繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleDrag = useCallback((e: DiagramDragEvent) => {
		const { id, dragEnabled, items, onDiagramChange, isVerticesMode } =
			refBus.current;

		// 繝峨Λ繝・げ縺檎┌蜉ｹ縺ｪ蝣ｴ蜷医・繧､繝吶Φ繝医ｒ貎ｰ縺励※繝峨Λ繝・げ繧堤┌蜉ｹ蛹・
		if (!dragEnabled) {
			return;
		}

		// 鬆らせ繝｢繝ｼ繝峨・蝣ｴ蜷医・繧､繝吶Φ繝医ｒ貎ｰ縺励※繝峨Λ繝・げ繧堤┌蜉ｹ蛹・
		if (isVerticesMode) {
			return;
		}

		// 繝峨Λ繝・げ髢句ｧ区凾縺ｮ蜃ｦ逅・
		if (e.eventType === "Start") {
			setIsDragging(true);

			startItems.current = items;

			const startDiagram = {
				x: e.startX,
				y: e.startY,
				items: startItems.current,
			};

			onDiagramChange?.({
				eventId: e.eventId,
				eventType: e.eventType,
				changeType: "Drag",
				id,
				startDiagram,
				endDiagram: startDiagram,
			});

			return;
		}

		const dx = e.endX - e.startX;
		const dy = e.endY - e.startY;

		const newItems = startItems.current.map((item) => {
			const x = item.x + dx;
			const y = item.y + dy;
			return { ...item, x, y };
		});

		onDiagramChange?.({
			eventId: e.eventId,
			eventType: e.eventType,
			changeType: "Drag",
			id,
			startDiagram: {
				x: e.startX,
				y: e.startY,
				items: startItems.current,
			},
			endDiagram: {
				x: e.endX,
				y: e.endY,
				items: newItems,
			},
		});

		if (e.eventType === "End") {
			setIsDragging(false);
		}
	}, []);

	/**
	 * 鬆らせ縺ｮ繝峨Λ繝・げ荳ｭ繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handlePathPointDrag = useCallback((e: DiagramDragEvent) => {
		if (e.eventType === "Start") {
			setIsPathPointDragging(true);
		}

		refBus.current.onDrag?.(e);

		if (e.eventType === "End") {
			setIsPathPointDragging(false);
		}
	}, []);

	/**
	 * 邱壼・縺翫ｈ縺ｳ譁ｰ隕城らせ縺ｮ螟画峩繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */ const handleDiagramChangeBySegumentAndNewVertex = useCallback(
		(e: DiagramChangeEvent) => {
			if (!isItemableData<DiagramBaseData>(e.endDiagram)) return; // Type guard with DiagramBaseData

			const { rotation, scaleX, scaleY, onDiagramChange } = refBus.current;

			if (e.eventType === "End") {
				// 譁ｰ隕城らせ縺翫ｈ縺ｳ邱壼・縺ｮ繝峨Λ繝・げ螳御ｺ・↓莨ｴ縺・ヱ繧ｹ縺ｮ螟匁棧縺ｮ蠖｢迥ｶ險育ｮ・
				const newShape = calcPointsOuterShape(
					(e.endDiagram.items ?? []).map((p) => ({ x: p.x, y: p.y })),
					rotation,
					scaleX,
					scaleY,
				);

				// Apply the new shape of the Path component.
				onDiagramChange?.({
					...e,
					endDiagram: {
						...e.endDiagram,
						x: newShape.x,
						y: newShape.y,
						width: newShape.width,
						height: newShape.height,
					},
				});
			} else {
				onDiagramChange?.(e);
			}
		},
		[],
	);

	// 謚倥ｌ邱壹・繝峨Λ繝・げ逕ｨ隕∫ｴ縺ｮ繝励Ο繝代ユ繧｣逕滓・
	const dragProps = useDrag({
		id,
		type: "Path",
		x,
		y,
		syncWithSameId,
		ref: dragSvgRef,
		onPointerDown: handlePointerDown,
		onClick: handleClick,
		onDrag: handleDrag,
		eventBus,
	});

	// 謚倥ｌ邱壹・d螻樊ｧ蛟､繧堤函謌・
	const d = createDValue(items);

	// 鬆らせ諠・ｱ繧堤函謌・
	const isBothEnds = (idx: number) => idx === 0 || idx === items.length - 1;
	const linePoints = items.map((item, idx) => ({
		...item,
		hidden: !isVerticesMode || isDragging || (fixBothEnds && isBothEnds(idx)),
	}));

	// 繝峨Λ繝・げ邱壼・縺ｮ陦ｨ遉ｺ繝輔Λ繧ｰ
	const showSegmentList =
		segmentDragEnabled &&
		isSelected &&
		isVerticesMode &&
		!isDragging &&
		!isPathPointDragging &&
		!isMultiSelectSource;

	// 譁ｰ隕城らせ縺ｮ陦ｨ遉ｺ繝輔Λ繧ｰ
	const showNewVertex =
		newVertexEnabled &&
		isSelected &&
		isVerticesMode &&
		!isDragging &&
		!isPathPointDragging &&
		!isMultiSelectSource;

	// 蜈ｨ菴灘､牙ｽ｢逕ｨ繧ｰ繝ｫ繝ｼ繝励・陦ｨ遉ｺ繝輔Λ繧ｰ
	const showTransformGroup = isSelected && !isMultiSelectSource;

	// Flag to show the position label.
	const showPositionLabel = isSelected && isDragging;

	// Start ArrowHead.
	const startArrowHeadComp = createStartPointArrowHead({
		items,
		stroke,
		startArrowHead,
	} as PathData);

	// End ArrowHead.
	const endArrowHeadComp = createEndPointArrowHead({
		items,
		stroke,
		endArrowHead,
	} as PathData);

	return (
		<>
			{/* 謠冗判逕ｨ縺ｮ繝代せ */}
			<g transform="translate(0.5,0.5)">
				<PathElement
					d={d}
					fill="none"
					stroke={stroke}
					strokeWidth={strokeWidth}
					isTransparent={isMultiSelectSource}
				/>
			</g>
			{/* 繝峨Λ繝・げ逕ｨ縺ｮ繝代せ */}
			<path
				id={id}
				d={d}
				fill="none"
				stroke="transparent"
				strokeWidth={5}
				cursor={dragEnabled ? "move" : "pointer"}
				tabIndex={0}
				ref={dragSvgRef}
				{...dragProps}
			/>
			{/* Start point arrow head. */}
			{startArrowHeadComp}
			{/* End point arrow head. */}
			{endArrowHeadComp}
			{/* 邱壼・繝峨Λ繝・げ */}
			{showSegmentList && (
				<SegmentList
					id={id}
					rightAngleSegmentDrag={rightAngleSegmentDrag}
					fixBothEnds={fixBothEnds}
					items={items}

					onPointerDown={handlePointerDown}
					onClick={handleClick}
					onDiagramChange={handleDiagramChangeBySegumentAndNewVertex}
				/>
			)}
			{/* 譁ｰ隕城らせ */}
			{showNewVertex && (
				<NewVertexList
					id={id}
					items={items}

					onDiagramChange={handleDiagramChangeBySegumentAndNewVertex}
				/>
			)}
			{/* 繧｢繧ｦ繝医Λ繧､繝ｳ・郁､・焚驕ｸ謚樒畑・・*/}
			{!showTransformGroup && (
				<Outline
					x={x}
					y={y}
					width={width}
					height={height}
					rotation={rotation}
					scaleX={scaleX}
					scaleY={scaleY}
					isSelected={isSelected}
					isMultiSelectSource={isMultiSelectSource}
					showOutline={showOutline}
				/>
			)}
			{/* 蜈ｨ菴灘､牙ｽ｢逕ｨ繧ｰ繝ｫ繝ｼ繝・*/}
			{showTransformGroup && (
				<Group
					id={id}
					x={x}
					y={y}
					isSelected={transformEnabled && !isVerticesMode}
					isMultiSelectSource={isMultiSelectSource}
					width={width}
					height={height}
					rotation={rotation}
					scaleX={scaleX}
					scaleY={scaleY}
					keepProportion={keepProportion}
					items={linePoints}

					onDrag={handlePathPointDrag}
					onTransform={onTransform}
					onDiagramChange={onDiagramChange}
				/>
			)}
			{/* Position label. */}
			{showPositionLabel && (
				<PositionLabel
					x={x}
					y={y}
					width={width}
					height={height}
					rotation={rotation}
					scaleX={scaleX}
					scaleY={scaleY}
				/>
			)}
		</>
	);
};

export const Path = memo(PathComponent);
