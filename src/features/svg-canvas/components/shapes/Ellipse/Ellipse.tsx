// Import React.
import type React from "react";
import { memo, useCallback, useMemo, useRef, useState } from "react";

// Import types.
import type { DiagramDragEvent } from "../../../types/events/DiagramDragEvent";
import type { DiagramHoverEvent } from "../../../types/events/DiagramHoverEvent";
import type { DiagramPointerEvent } from "../../../types/events/DiagramPointerEvent";
import type { DiagramTransformEvent } from "../../../types/events/DiagramTransformEvent";
import type { EllipseProps } from "../../../types/props/shapes/EllipseProps";

// SvgCanvas髢｢騾｣繧ｳ繝ｳ繝昴・繝阪Φ繝医ｒ繧､繝ｳ繝昴・繝・
import { PositionLabel } from "../../core/PositionLabel";
import { Outline } from "../../core/Outline";
import { Textable } from "../../core/Textable";
import { Transformative } from "../../core/Transformative";
import { ConnectPoint } from "../ConnectPoint";

// Import hooks.
import { useDrag } from "../../../hooks/useDrag";

// Import utils.
import { degreesToRadians } from "../../../utils/math/common/degreesToRadians";
import { createSvgTransform } from "../../../utils/shapes/common/createSvgTransform";

// Import local module files.
import { EllipseElement } from "./EllipseStyled";

/**
 * 讌募・繧ｳ繝ｳ繝昴・繝阪Φ繝・
 */
const EllipseComponent: React.FC<EllipseProps> = ({
	id,
	x,
	y,
	width,
	height,
	rotation,
	scaleX,
	scaleY,
	fill,
	stroke,
	strokeWidth,
	keepProportion,
	isSelected,
	isMultiSelectSource,
	connectPoints,
	showConnectPoints = true,
	syncWithSameId = false,
	text,
	textType,
	fontColor,
	fontSize,
	fontFamily,
	fontWeight,
	textAlign,
	verticalAlign,
	isTextEditing,
	isTextEditEnabled = true,
	isTransparent,
	showOutline = false,
	eventBus,
	onDrag,
	onClick,
	onSelect,
	onTransform,
	onConnect,
	onTextEdit,
}) => {
	// 繝峨Λ繝・げ荳ｭ縺九・繝輔Λ繧ｰ
	const [isDragging, setIsDragging] = useState(false);
	// 螟牙ｽ｢荳ｭ縺九・繝輔Λ繧ｰ
	const [isTransformimg, setIsTransforming] = useState(false);
	// 繝帙ヰ繝ｼ荳ｭ縺九・繝輔Λ繧ｰ
	const [isHovered, setIsHovered] = useState(false);
	// 螟牙ｽ｢蟇ｾ雎｡縺ｮSVG隕∫ｴ縺ｸ縺ｮ蜿ら・
	const svgRef = useRef<SVGEllipseElement>({} as SVGEllipseElement);

	// 繝上Φ繝峨Λ逕滓・縺ｮ鬆ｻ逋ｺ繧貞屓驕ｿ縺吶ｋ縺溘ａ縲∝盾辣ｧ縺吶ｋ蛟､繧置seRef縺ｧ菫晄戟縺吶ｋ
	const refBusVal = {
		// 繝励Ο繝代ユ繧｣
		id,
		isSelected,
		isTextEditEnabled,
		onDrag,
		onSelect,
		onTransform,
		onTextEdit,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	/**
	 * 讌募・縺ｮ繝峨Λ繝・げ繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleDrag = useCallback((e: DiagramDragEvent) => {
		const { onDrag } = refBus.current;

		if (e.eventType === "Start") {
			setIsDragging(true);
		}

		onDrag?.(e);

		if (e.eventType === "End") {
			setIsDragging(false);
		}
	}, []);

	/**
	 * 讌募・縺ｮ螟牙ｽ｢繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleTransform = useCallback((e: DiagramTransformEvent) => {
		const { onTransform } = refBus.current;

		if (e.eventType === "Start") {
			setIsTransforming(true);
		}

		onTransform?.(e);

		if (e.eventType === "End") {
			setIsTransforming(false);
		}
	}, []);

	/**
	 * 繝昴う繝ｳ繧ｿ繝ｼ繝繧ｦ繝ｳ繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handlePointerDown = useCallback((e: DiagramPointerEvent) => {
		const { id, onSelect } = refBus.current;

		// 蝗ｳ蠖｢驕ｸ謚槭う繝吶Φ繝医ｒ逋ｺ轣ｫ
		onSelect?.({
			eventId: e.eventId,
			id,
		});
	}, []);

	/**
	 * 繝帙ヰ繝ｼ迥ｶ諷句､画峩繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleHover = useCallback((e: DiagramHoverEvent) => {
		setIsHovered(e.isHovered);
	}, []);

	/**
	 * 繝峨Λ繝・げ繧ｪ繝ｼ繝舌・繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleDragOver = useCallback(() => {
		setIsHovered(true);
	}, []);

	/**
	 * 繝峨Λ繝・げ繝ｪ繝ｼ繝悶う繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleDragLeave = useCallback(() => {
		setIsHovered(false);
	}, []);

	/**
	 * 繝繝悶Ν繧ｯ繝ｪ繝・け繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleDoubleClick = useCallback(() => {
		const { id, isSelected, isTextEditEnabled, onTextEdit } = refBus.current;

		if (!isTextEditEnabled) return;

		if (!isSelected) return;

		// 繝・く繧ｹ繝育ｷｨ髮・う繝吶Φ繝医ｒ逋ｺ轣ｫ
		onTextEdit?.({
			id,
		});
	}, []);

	// 繝峨Λ繝・げ逕ｨ縺ｮ繝励Ο繝代ユ繧｣繧堤函謌・
	const dragProps = useDrag({
		id,
		type: "Ellipse",
		x,
		y,
		syncWithSameId,
		ref: svgRef,
		eventBus,
		onPointerDown: handlePointerDown,
		onClick: onClick,
		onDrag: handleDrag,
		onHover: handleHover,
		onDragOver: handleDragOver,
		onDragLeave: handleDragLeave,
	});

	// memo蛹悶↓繧医ｊConnectPoint縺ｮ蜀肴緒逕ｻ繧呈椛蛻ｶ
	// key縺ｧ蛻・ｧ｣縺励※縺ｰ繧峨・繧峨↓props縺ｧ貂｡縺吶→縲∝推ConnectPoint蛛ｴ縺昴ｌ縺槭ｌ縺ｧ蜷・ey縺ｫ蟇ｾ縺励※
	// 豈碑ｼ・・逅・′襍ｰ繧企撼蜉ｹ邇・↑縺ｮ縺ｧ縲√％縺薙〒縺ｾ縺ｨ繧√※Shape縺ｮ蟾ｮ逡ｰ繧呈､懃衍縺吶ｋ
	const ownerShape = useMemo(
		() => ({
			x,
			y,
			width,
			height,
			rotation,
			scaleX,
			scaleY,
		}),
		[x, y, width, height, rotation, scaleX, scaleY],
	);

	// ellipse縺ｮtransform螻樊ｧ繧堤函謌・
	const transform = createSvgTransform(
		scaleX,
		scaleY,
		degreesToRadians(rotation),
		x,
		y,
	);

	// 螟牙ｽ｢繧ｳ繝ｳ繝昴・繝阪Φ繝医ｒ陦ｨ遉ｺ縺吶ｋ縺九・繝輔Λ繧ｰ
	const showTransformative = isSelected && !isMultiSelectSource && !isDragging;

	// 謗･邯壹・繧､繝ｳ繝医ｒ陦ｨ遉ｺ縺吶ｋ縺九・繝輔Λ繧ｰ
	const doShowConnectPoints =
		showConnectPoints &&
		!isSelected &&
		!isMultiSelectSource &&
		!isDragging &&
		!isTransformimg;

	return (
		<>
			<g transform="translate(0.5,0.5)">
				<EllipseElement
					id={id}
					cx={0}
					cy={0}
					rx={width / 2}
					ry={height / 2}
					fill={fill}
					stroke={stroke}
					strokeWidth={strokeWidth}
					tabIndex={0}
					cursor="move"
					isTransparent={isTransparent || isMultiSelectSource}
					transform={transform}
					ref={svgRef}
					onDoubleClick={handleDoubleClick}
					{...dragProps}
				/>
			</g>
			{isTextEditEnabled && (
				<Textable
					x={-width / 2}
					y={-height / 2}
					width={width}
					height={height}
					transform={transform}
					text={text}
					textType={textType}
					fontColor={fontColor}
					fontSize={fontSize}
					fontFamily={fontFamily}
					fontWeight={fontWeight}
					textAlign={textAlign}
					verticalAlign={verticalAlign}
					isTextEditing={isTextEditing}
				/>
			)}
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
			{showTransformative && (
				<Transformative
					id={id}
					type="Ellipse"
					x={x}
					y={y}
					width={width}
					height={height}
					rotation={rotation}
					scaleX={scaleX}
					scaleY={scaleY}
					keepProportion={keepProportion}
					isSelected={isSelected}
					isMultiSelectSource={isMultiSelectSource}

					onTransform={handleTransform}
				/>
			)}
			{doShowConnectPoints &&
				connectPoints.map((cp) => (
					<ConnectPoint
						key={cp.id}
						id={cp.id}
						name={cp.name}
						x={cp.x}
						y={cp.y}
						ownerId={id}
						ownerShape={ownerShape}
						isTransparent={!isHovered || isDragging || isTransformimg}

						onConnect={onConnect}
					/>
				))}
			{isSelected && isDragging && (
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

export const Ellipse = memo(EllipseComponent);
