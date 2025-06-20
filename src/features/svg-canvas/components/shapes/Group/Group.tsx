// Import React.
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

// Import types.
import type { Diagram } from "../../../types/data/catalog/Diagram";
import { DiagramRegistry } from "../../../registry";
import type { DiagramChangeEvent } from "../../../types/events/DiagramChangeEvent";
import type { DiagramConnectEvent } from "../../../types/events/DiagramConnectEvent";
import type { DiagramDragEvent } from "../../../types/events/DiagramDragEvent";
import type { DiagramSelectEvent } from "../../../types/events/DiagramSelectEvent";
import type { DiagramTextEditEvent } from "../../../types/events/DiagramTextEditEvent";
import type { DiagramTransformEvent } from "../../../types/events/DiagramTransformEvent";
import type { GroupProps } from "../../../types/props/shapes/GroupProps";

// Import hooks
import { useEventBus } from "../../../context/EventBusContext";

// Import components related to SvgCanvas.
import { PositionLabel } from "../../core/PositionLabel";
import { Outline } from "../../core/Outline";
import { Transformative } from "../../core/Transformative";

// Import utils.
import { degreesToRadians } from "../../../utils/math/common/degreesToRadians";
import { isItemableData } from "../../../utils/validation/isItemableData";
import { isTransformativeData } from "../../../utils/validation/isTransformativeData";
import { rotatePoint } from "../../../utils/math/points/rotatePoint";

// Imports related to this component.
import { getSelectedChildDiagram } from "../../../utils/shapes/group/getSelectedChildDiagram";

/**
 * Group component.
 */
const GroupComponent: React.FC<GroupProps> = ({
	id,
	x,
	y,
	width,
	height,
	rotation,
	scaleX,
	scaleY,
	keepProportion,
	isSelected,
	isMultiSelectSource,
	items,
	showConnectPoints = true,
	showOutline = false,
	syncWithSameId = false,
	onDrag,
	onClick,
	onSelect,
	onTransform,
	onDiagramChange,
	onConnect,
	onTextEdit,
	onExecute,
}) => {
	// Get eventBus from context, fallback to prop during migration
	const contextEventBus = useEventBus();
	const eventBus = contextEventBus; // Use context eventBus

	// Flag indicating whether the entire group is being dragged.
	// Set to true only when this group is selected and currently being dragged.
	const [isGroupDragging, setIsGroupDragging] = useState(false);

	// Flag indicating whether the entire group is being transformed.
	const [isGroupTransforming, setIsGroupTransforming] = useState(false);

	// Flag for sequential selection.
	// Sequential selection refers to the operation of selecting shape within the same group in succession,
	// even if the shape are not the same.
	// This is set to true only when the group is already selected and the pointer is pressed again on a shape inside the group.
	const isSequentialSelection = useRef(false);

	// List of child shapes at the start of a drag or transform.
	const startItems = useRef<Diagram[]>(items);

	// Group's oriented box at the start of a drag or transform.
	const startBox = useRef({ x, y, width, height });

	// 繝上Φ繝峨Λ逕滓・縺ｮ鬆ｻ逋ｺ繧貞屓驕ｿ縺吶ｋ縺溘ａ縲∝盾辣ｧ縺吶ｋ蛟､繧置seRef縺ｧ菫晄戟縺吶ｋ
	const refBusVal = {
		// 繝励Ο繝代ユ繧｣
		id,
		x,
		y,
		width,
		height,
		isSelected,
		items,
		onDrag,
		onClick,
		onSelect,
		onTransform,
		onDiagramChange,
		onConnect,
		onTextEdit,
		// 蜀・Κ螟画焚繝ｻ蜀・Κ髢｢謨ｰ
		isGroupDragging,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	/**
	 * 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢縺ｮ驕ｸ謚槭う繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleChildDiagramSelect = useCallback((e: DiagramSelectEvent) => {
		const { id, isSelected, items, onSelect } = refBus.current;

		const selectedChild = getSelectedChildDiagram(items);
		if (!selectedChild) {
			// 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢縺碁∈謚槭＆繧後※縺・↑縺・ｴ蜷医・縲√％縺ｮ繧ｰ繝ｫ繝ｼ繝励・驕ｸ謚槭う繝吶Φ繝医ｒ逋ｺ轣ｫ縺輔○繧九・
			// 縺薙ｌ縺ｫ繧医ｊ縲√げ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢縺碁∈謚槭＆繧後※縺・↑縺・げ繝ｫ繝ｼ繝励・縺・■縲∵怙繧ゆｸ贋ｽ阪・繧ｰ繝ｫ繝ｼ繝励・繧､繝吶Φ繝医′
			// SvgCanvas縺ｾ縺ｧ莨晉分縺輔ｌ縲√◎縺ｮ繧ｰ繝ｫ繝ｼ繝励′驕ｸ謚樒憾諷九↓縺ｪ繧九・
			onSelect?.({
				eventId: e.eventId,
				id,
			});
		} else if (selectedChild.id !== e.id) {
			// 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢縺碁∈謚槭＆繧後※縺・※縲√°縺､繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蛻･縺ｮ蝗ｳ蠖｢縺碁∈謚槭＆繧後◆蝣ｴ蜷医√◎縺ｮ蝗ｳ蠖｢繧帝∈謚樒憾諷九↓縺吶ｋ
			onSelect?.(e);
		}

		if (isSelected) {
			// 繧ｰ繝ｫ繝ｼ繝鈴｣邯夐∈謚樊凾縺ｮ繧ｯ繝ｪ繝・け・医・繧､繝ｳ繧ｿ繝ｼ繧｢繝・・・画凾縺ｫ縲√げ繝ｫ繝ｼ繝怜・縺ｧ繧ｯ繝ｪ繝・け縺輔ｌ縺溷峙蠖｢繧帝∈謚樒憾諷九↓縺励◆縺・・縺ｧ縲・
			// 繝輔Λ繧ｰ繧堤ｫ九※縺ｦ縺翫″縲√け繝ｪ繝・け繧､繝吶Φ繝亥・縺ｧ蜿ら・縺吶ｋ縲・
			isSequentialSelection.current = true;
		}
	}, []);

	/**
	 * 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢縺ｮ繧ｯ繝ｪ繝・け繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleChildDiagramClick = useCallback((e: DiagramSelectEvent) => {
		const { id, onSelect, onClick } = refBus.current;

		if (isSequentialSelection.current) {
			// 繧ｰ繝ｫ繝ｼ繝鈴｣邯夐∈謚樊凾縺ｮ繧ｯ繝ｪ繝・け・医・繧､繝ｳ繧ｿ繝ｼ繧｢繝・・・画凾縺ｧ縺ゅｌ縺ｰ縲√◎縺ｮ繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢繧帝∈謚樒憾諷九↓縺吶ｋ縲・
			// 縺薙ｌ縺ｫ繧医ｊ縲√げ繝ｫ繝ｼ繝励′繝阪せ繝医＠縺ｦ縺・ｋ蝣ｴ蜷医・縲・∈謚槭・髫主ｱ､縺鯉ｼ代▽縺壹▽荳九′縺｣縺ｦ縺・″縲∵怙邨ら噪縺ｫ繧ｯ繝ｪ繝・け縺輔ｌ縺溷峙蠖｢縺碁∈謚槭＆繧後ｋ縲・
			onSelect?.(e);
			isSequentialSelection.current = false;
		} else {
			// 繧ｰ繝ｫ繝ｼ繝鈴｣邯夐∈謚樊凾縺ｧ縺ｪ縺・ｴ蜷医・縲√％縺ｮ繧ｰ繝ｫ繝ｼ繝励・繧ｯ繝ｪ繝・け繧､繝吶Φ繝医ｒ逋ｺ轣ｫ縺輔○繧九・
			// 縺薙ｌ縺ｫ繧医ｊ縲・｣邯夐∈謚槭〒縺ｪ縺・げ繝ｫ繝ｼ繝励・縺・■縲∵怙繧ゆｸ贋ｽ阪・繧ｰ繝ｫ繝ｼ繝励・繧ｯ繝ｪ繝・け繧､繝吶Φ繝医′
			// 騾｣邯夐∈謚槭＆繧後◆繧ｰ繝ｫ繝ｼ繝励∪縺ｧ莨晉分縺励√◎縺ｮ繧ｰ繝ｫ繝ｼ繝励・騾｣邯夐∈謚樊凾縺ｮ蜃ｦ逅・ｼ亥ｽ楢ｩｲ蛻・ｲ舌・true蛛ｴ・峨′螳溯｡後＆繧後・
			// 縺昴・逶ｴ荳九・繧ｰ繝ｫ繝ｼ繝励′驕ｸ謚樒憾諷九↓縺ｪ繧九・
			onClick?.({
				eventId: e.eventId,
				id,
			});
		}
	}, []);

	// 繧ｰ繝ｫ繝ｼ繝励・驕ｸ謚樒憾諷句宛蠕｡
	useEffect(() => {
		// 繧ｰ繝ｫ繝ｼ繝励°繧蛾∈謚槭′螟悶ｌ縺溘ｉ騾｣邯夐∈謚槭ヵ繝ｩ繧ｰ繧りｧ｣髯､
		if (!isSelected) {
			isSequentialSelection.current = false;
		}
	}, [isSelected]);

	/**
	 * 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢縺ｮ繝峨Λ繝・げ荳ｭ繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleChildDiagramDrag = useCallback((e: DiagramDragEvent) => {
		const {
			id,
			x,
			y,
			width,
			height,
			isSelected,
			items,
			onDrag,
			onDiagramChange,
			isGroupDragging,
		} = refBus.current;

		// 繝峨Λ繝・げ髢句ｧ区凾縺ｮ蜃ｦ逅・
		if (e.eventType === "Start") {
			if (!isSelected) {
				// 繧ｰ繝ｫ繝ｼ繝鈴∈謚樊凾縺ｧ縺ｪ縺代ｌ縺ｰ縲√ラ繝ｩ繝・げ繧､繝吶Φ繝医ｒ縺昴・縺ｾ縺ｾ莨晉分縺励・
				// 驕ｸ謚槭＆繧後※縺・ｋ蝗ｳ蠖｢縺ｮ縺ｿ遘ｻ蜍輔ｒ陦後≧
				onDrag?.(e);
			} else {
				// 繧ｰ繝ｫ繝ｼ繝鈴∈謚樊凾縺ｧ縺ゅｌ縺ｰ縲√げ繝ｫ繝ｼ繝怜・菴薙ｒ繝峨Λ繝・げ蜿ｯ閭ｽ縺ｫ縺吶ｋ
				setIsGroupDragging(true);

				// 繝峨Λ繝・げ髢句ｧ区凾縺ｮ繧ｰ繝ｫ繝ｼ繝励・蠖｢迥ｶ繧定ｨ俶・
				startItems.current = items;
				startBox.current = { x, y, width, height };

				// 繧ｰ繝ｫ繝ｼ繝怜・菴薙・螟画峩髢句ｧ九ｒ騾夂衍
				onDiagramChange?.({
					eventId: e.eventId,
					eventType: "Start",
					changeType: "Drag",
					id,
					startDiagram: {
						x,
						y,
						items,
					},
					endDiagram: {
						x,
						y,
						items,
					},
					cursorX: e.cursorX,
					cursorY: e.cursorY,
				});
			}
			return;
		}

		// 莉･髯阪ラ繝ｩ繝・げ荳ｭ繝ｻ繝峨Λ繝・げ邨ゆｺ・凾縺ｮ蜃ｦ逅・
		if (!isGroupDragging) {
			// 繧ｰ繝ｫ繝ｼ繝怜・菴薙・繝峨Λ繝・げ縺ｧ縺ｪ縺代ｌ縺ｰ縲√ラ繝ｩ繝・げ繧､繝吶Φ繝医ｒ縺昴・縺ｾ縺ｾ莨晉分縺励・
			// 驕ｸ謚槭＆繧後※縺・ｋ蝗ｳ蠖｢縺ｮ縺ｿ遘ｻ蜍輔ｒ陦後≧
			onDrag?.(e);
		} else {
			// 繧ｰ繝ｫ繝ｼ繝怜・菴薙・繝峨Λ繝・げ縺ｮ蝣ｴ蜷医√げ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢繧貞・蟶ｰ逧・↓遘ｻ蜍輔＆縺帙ｋ
			const dx = e.endX - e.startX;
			const dy = e.endY - e.startY;

			// 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢繧貞・蟶ｰ逧・↓遘ｻ蜍輔＆縺帙ｋ・域磁邯壹・繧､繝ｳ繝医・蜷ｫ縺ｾ縺ｪ縺・ｼ・
			const moveRecursive = (diagrams: Diagram[]) => {
				const newItems: Diagram[] = [];
				for (const item of diagrams) {
					const newItem = { ...item, x: item.x + dx, y: item.y + dy };
					if (isItemableData(newItem)) {
						newItem.items = moveRecursive(newItem.items ?? []);
					}
					newItems.push(newItem);
				}

				return newItems;
			};

			const event: DiagramChangeEvent = {
				eventId: e.eventId,
				eventType: e.eventType,
				changeType: "Drag",
				id,
				startDiagram: {
					x: startBox.current.x,
					y: startBox.current.y,
					items: startItems.current,
				},
				endDiagram: {
					x: startBox.current.x + dx,
					y: startBox.current.y + dy,
					items: moveRecursive(startItems.current),
				},
				cursorX: e.cursorX,
				cursorY: e.cursorY,
			};

			// 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蜈ｨ縺ｦ縺ｮ蝗ｳ蠖｢縺ｮ遘ｻ蜍輔ｒ縺ｾ縺ｨ繧√※騾夂衍
			onDiagramChange?.(event);
		}

		// 繝峨Λ繝・げ邨ゆｺ・凾縺ｫ繝峨Λ繝・げ荳ｭ繝輔Λ繧ｰ繧定ｧ｣髯､
		if (e.eventType === "End") {
			setIsGroupDragging(false);
		}
	}, []);

	/**
	 * 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢縺ｮ螟牙ｽ｢繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleChildDiagramTransfrom = useCallback(
		(e: DiagramTransformEvent) => {
			const { onTransform } = refBus.current;

			// 螟牙ｽ｢繧､繝吶Φ繝医ｒ縺昴・縺ｾ縺ｾ莨晉分縺吶ｋ
			// 繧｢繧ｦ繝医Λ繧､繝ｳ譖ｴ譁ｰ縺ｯCanvas蛛ｴ縺ｧ陦後≧縺ｮ縺ｧ縲√％縺薙〒縺ｯ菴輔ｂ縺励↑縺・
			onTransform?.(e);
		},
		[],
	);

	/**
	 * 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢縺ｮ螟画峩繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleChildDiagramChange = useCallback(
		(e: DiagramChangeEvent) => {
			const { id, isSelected, onDiagramChange } = refBus.current;

			if (isSelected) {
				// TODO: 蠢・ｦ√°・・
				// 繧ｰ繝ｫ繝ｼ繝鈴∈謚樊凾縺ｮ蝣ｴ蜷医√％縺薙↓譚･繧九・縺ｯ繝峨Λ繝・げ逶ｸ蠖薙・謫堺ｽ懊・蝣ｴ蜷医↑縺ｮ縺ｧ縲√ラ繝ｩ繝・げ繧､繝吶Φ繝医↓螟画鋤縺励※莨晉分縺吶ｋ
				const dragEvent = {
					eventType: e.eventType,
					id,
					startX: e.startDiagram.x,
					startY: e.startDiagram.y,
					endX: e.endDiagram.x,
					endY: e.endDiagram.y,
				} as DiagramDragEvent;

				handleChildDiagramDrag(dragEvent);
			} else {
				// 繧ｰ繝ｫ繝ｼ繝鈴∈謚樊凾縺ｧ縺ｪ縺・ｴ蜷医√い繧ｦ繝医Λ繧､繝ｳ莉･螟悶・繧ｰ繝ｫ繝ｼ繝励∈縺ｮ蠖ｱ髻ｿ縺ｯ縺ｪ縺・・縺ｧ縲∝､画峩繧､繝吶Φ繝医ｒ縺昴・縺ｾ縺ｾ莨晉分縺吶ｋ
				onDiagramChange?.(e);
			}
		},
		[handleChildDiagramDrag],
	);

	/**
	 * 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢縺ｮ謗･邯壹う繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleChildDiagramConnect = useCallback((e: DiagramConnectEvent) => {
		const { onConnect } = refBus.current;

		// 迚ｹ縺ｫ縺吶ｋ縺薙→縺ｯ縺ｪ縺・・縺ｧ縺昴・縺ｾ縺ｾ莨晉分縺吶ｋ
		onConnect?.(e);
	}, []);

	/**
	 * 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢縺ｮ繝・く繧ｹ繝育ｷｨ髮・う繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleChildDiagramTextEdit = useCallback((e: DiagramTextEditEvent) => {
		const { onTextEdit } = refBus.current;

		// 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢縺ｮ繝・く繧ｹ繝育ｷｨ髮・う繝吶Φ繝医ｒ縺昴・縺ｾ縺ｾ莨晉分縺吶ｋ
		onTextEdit?.(e);
	}, []);

	/**
	 * 繧ｰ繝ｫ繝ｼ繝励・螟牙ｽ｢繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleTransform = useCallback((e: DiagramTransformEvent) => {
		const { id, x, y, width, height, items, onDiagramChange } = refBus.current;

		// 繧ｰ繝ｫ繝ｼ繝励・螟牙ｽ｢髢句ｧ区凾縺ｮ蜃ｦ逅・
		if (e.eventType === "Start") {
			// 螟牙ｽ｢髢句ｧ区凾縺ｮ繧ｰ繝ｫ繝ｼ繝励・蠖｢迥ｶ繧定ｨ俶・
			startBox.current = { x, y, width, height };
			startItems.current = items;

			// 縺ｾ縺菴輔ｂ螟牙ｽ｢縺励※縺ｪ縺・・縺ｧ縲・幕蟋九・騾夂衍縺ｮ縺ｿ陦後≧
			onDiagramChange?.({
				eventId: e.eventId,
				eventType: "Start",
				changeType: "Transform",
				id,
				startDiagram: {
					...e.startShape,
					items,
				},
				endDiagram: {
					...e.endShape,
					items,
				},
				cursorX: e.cursorX,
				cursorY: e.cursorY,
			});

			setIsGroupTransforming(true);
			return;
		}

		// 莉･髯阪げ繝ｫ繝ｼ繝励・螟牙ｽ｢荳ｭ繝ｻ螟牙ｽ｢邨ゆｺ・凾縺ｮ蜃ｦ逅・

		// 繧ｰ繝ｫ繝ｼ繝励・諡｡邵ｮ繧定ｨ育ｮ・
		const groupScaleX = e.endShape.width / e.startShape.width;
		const groupScaleY = e.endShape.height / e.startShape.height;

		// 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢繧貞・蟶ｰ逧・↓螟牙ｽ｢縺輔○繧具ｼ域磁邯壹・繧､繝ｳ繝医ｂ蜷ｫ繧・・
		const transformRecursive = (diagrams: Diagram[]) => {
			const newItems: Diagram[] = [];
			for (const item of diagrams) {
				const inversedItemCenter = rotatePoint(
					item.x,
					item.y,
					e.startShape.x,
					e.startShape.y,
					degreesToRadians(-e.startShape.rotation),
				);
				const dx =
					(inversedItemCenter.x - e.startShape.x) *
					e.startShape.scaleX *
					e.endShape.scaleX;
				const dy =
					(inversedItemCenter.y - e.startShape.y) *
					e.startShape.scaleY *
					e.endShape.scaleY;

				const newDx = dx * groupScaleX;
				const newDy = dy * groupScaleY;

				let newCenter = {
					x: e.endShape.x + newDx,
					y: e.endShape.y + newDy,
				};
				newCenter = rotatePoint(
					newCenter.x,
					newCenter.y,
					e.endShape.x,
					e.endShape.y,
					degreesToRadians(e.endShape.rotation),
				);

				if (isTransformativeData(item)) {
					const rotationDiff = e.endShape.rotation - e.startShape.rotation;
					const newRotation = item.rotation + rotationDiff;

					newItems.push({
						...item,
						x: newCenter.x,
						y: newCenter.y,
						width: item.width * groupScaleX,
						height: item.height * groupScaleY,
						rotation: newRotation,
						scaleX: e.endShape.scaleX,
						scaleY: e.endShape.scaleY,
						items: isItemableData(item)
							? transformRecursive(item.items ?? [])
							: undefined,
					} as Diagram);
				} else {
					newItems.push({
						...item,
						x: newCenter.x,
						y: newCenter.y,
					});
				}
			}

			return newItems;
		};

		const event: DiagramChangeEvent = {
			eventId: e.eventId,
			eventType: e.eventType,
			changeType: "Transform",
			id,
			startDiagram: {
				...e.startShape,
				items: startItems.current,
			},
			endDiagram: {
				...e.endShape,
				items: transformRecursive(startItems.current),
			},
			cursorX: e.cursorX,
			cursorY: e.cursorY,
		};

		// 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蜈ｨ縺ｦ縺ｮ蝗ｳ蠖｢縺ｮ螟牙ｽ｢繧偵∪縺ｨ繧√※騾夂衍
		onDiagramChange?.(event);

		if (e.eventType === "End") {
			setIsGroupTransforming(false);
		}
	}, []);

	const doShowConnectPoints =
		showConnectPoints &&
		!isSelected &&
		!isGroupDragging &&
		!isGroupTransforming;

	// 繧ｰ繝ｫ繝ｼ繝怜・縺ｮ蝗ｳ蠖｢縺ｮ菴懈・
	const children = items.map((item) => {
		// item.type縺轡iagramType蝙九〒縺ゅｋ縺薙→繧堤｢ｺ隱・
		if (!item.type) {
			console.error("Item has no type", item);
			return null;
		}
		const component = DiagramRegistry.getComponent(item.type);
		if (!component) {
			console.warn(`Component not found for type: ${item.type}`);
			return null;
		}
		const props = {
			...item,
			key: item.id,
			showConnectPoints: doShowConnectPoints,
			// 繧ｰ繝ｫ繝ｼ繝励′驕ｸ謚槭＆繧後※縺・ｋ縺九∬ｦｪ縺九ｉ蟄占ｦ∫ｴ縺ｨ縺励※繧｢繧ｦ繝医Λ繧､繝ｳ陦ｨ遉ｺ謖・､ｺ縺後≠縺｣縺溷ｴ蜷医↓蟄占ｦ∫ｴ縺ｫ繧｢繧ｦ繝医Λ繧､繝ｳ繧定｡ｨ遉ｺ
			showOutline: isSelected || showOutline,
			syncWithSameId,
			eventBus,
			onClick: handleChildDiagramClick,
			onSelect: handleChildDiagramSelect,
			onDrag: handleChildDiagramDrag,
			onTransform: handleChildDiagramTransfrom,
			onDiagramChange: handleChildDiagramChange,
			onConnect: handleChildDiagramConnect,
			onTextEdit: handleChildDiagramTextEdit,
			onExecute,
		};

		return React.createElement(component(), props);
	});
	return (
		<>
			{children}
			<Outline
				x={x}
				y={y}
				width={width}
				height={height}
				rotation={rotation}
				scaleX={scaleX}
				scaleY={scaleY}
				isSelected={isSelected}
				showOutline={showOutline}
				isMultiSelectSource={isMultiSelectSource}
			/>
			{!isMultiSelectSource && !isGroupDragging && (
				<Transformative
					id={id}
					type="Group"
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
			{isSelected && isGroupDragging && (
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

export const Group = memo(GroupComponent);
