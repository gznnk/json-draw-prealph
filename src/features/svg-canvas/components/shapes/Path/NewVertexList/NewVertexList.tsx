// Import React.
import type React from "react";
import { memo, useCallback, useRef, useState } from "react";

// Import types related to SvgCanvas.
import type { Diagram } from "../../../../types/data/catalog/Diagram";
import type { DiagramChangeEvent } from "../../../../types/events/DiagramChangeEvent";
import type { DiagramDragEvent } from "../../../../types/events/DiagramDragEvent";
import type { EventBus } from "../../../../../../shared/event-bus/EventBus";

// Import functions related to SvgCanvas.
import { newId } from "../../../../utils/shapes/common/newId";

// Imports related to this component.
import { NewVertex, type NewVertexData } from "../NewVertex";

/**
 * 譁ｰ隕城らせ繝ｪ繧ｹ繝医・繝ｭ繝代ユ繧｣
 */
type NewVertexListProps = {
	id: string;
	items: Diagram[];
	eventBus: EventBus;
	onDiagramChange?: (e: DiagramChangeEvent) => void;
};

/**
 * 譁ｰ隕城らせ繝ｪ繧ｹ繝医さ繝ｳ繝昴・繝阪Φ繝・
 */
const NewVertexListComponent: React.FC<NewVertexListProps> = ({
	id,
	items,
	eventBus,
	onDiagramChange,
}) => {
	// Dragging NewVertex component data.
	const [draggingNewVertex, setDraggingNewVertex] = useState<
		NewVertexData | undefined
	>();

	// Items of owner Path component at the start of the new vertex drag.
	const startItems = useRef<Diagram[]>(items);

	// NewVertex data list for rendering.
	const newVertexList: NewVertexData[] = [];
	if (draggingNewVertex) {
		// 繝峨Λ繝・げ荳ｭ縺ｮ蝣ｴ蜷医・縺昴・譁ｰ隕城らせ縺ｮ縺ｿ謠冗判
		newVertexList.push(draggingNewVertex);
	} else {
		// 繝峨Λ繝・げ荳ｭ縺ｧ縺ｪ縺代ｌ縺ｰ縲∝推鬆らせ縺ｮ荳ｭ轤ｹ縺ｫ譁ｰ隕城らせ繧呈緒逕ｻ
		for (let i = 0; i < items.length - 1; i++) {
			const item = items[i];
			const nextItem = items[i + 1];

			const x = (item.x + nextItem.x) / 2;
			const y = (item.y + nextItem.y) / 2;

			newVertexList.push({
				id: `${item.id}-${nextItem.id}`, // 蜑榊ｾ後・鬆らせ縺九ｉID繧堤函謌・
				x,
				y,
			});
		}
	}

	// 繝上Φ繝峨Λ逕滓・縺ｮ鬆ｻ逋ｺ繧貞屓驕ｿ縺吶ｋ縺溘ａ縲∝盾辣ｧ縺吶ｋ蛟､繧置seRef縺ｧ菫晄戟縺吶ｋ
	const refBusVal = {
		// 繝励Ο繝代ユ繧｣
		id,
		items,
		onDiagramChange,
		// 蜀・Κ螟画焚繝ｻ蜀・Κ髢｢謨ｰ
		newVertexList,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	/**
	 * 譁ｰ隕城らせ縺ｮ繝峨Λ繝・げ繧､繝吶Φ繝医ワ繝ｳ繝峨Λ
	 */
	const handleNewVertexDrag = useCallback((e: DiagramDragEvent) => {
		const { id, items, onDiagramChange, newVertexList } = refBus.current;
		// 繝峨Λ繝・げ髢句ｧ区凾縺ｮ蜃ｦ逅・
		if (e.eventType === "Start") {
			// Store the items of owner Path component at the start of the new vertex drag.
			startItems.current = items;

			// 繝峨Λ繝・げ荳ｭ縺ｮ譁ｰ隕城らせ繧定ｨｭ螳・
			setDraggingNewVertex({ id: e.id, x: e.startX, y: e.startY });

			// 譁ｰ隕城らせ縺ｨ蜷後§菴咲ｽｮ縺ｫ鬆らせ繧定ｿｽ蜉縺励√ヱ繧ｹ繧呈峩譁ｰ縺吶ｋ
			const idx = newVertexList.findIndex((v) => v.id === e.id);
			const newItems = [...items];
			const newItem = {
				id: e.id,
				type: "PathPoint",
				x: e.startX,
				y: e.startY,
			} as Diagram;
			newItems.splice(idx + 1, 0, newItem);

			// 繝代せ縺ｮ螟画峩繧帝夂衍
			onDiagramChange?.({
				eventId: e.eventId,
				eventType: e.eventType,
				changeType: "Transform",
				id,
				startDiagram: {
					items: startItems.current,
				},
				endDiagram: {
					items: newItems,
				},
			});
		}

		// 繝峨Λ繝・げ荳ｭ縺ｮ蜃ｦ逅・
		if (e.eventType === "InProgress") {
			// 繝峨Λ繝・げ荳ｭ縺ｮ譁ｰ隕城らせ縺ｮ菴咲ｽｮ繧呈峩譁ｰ
			setDraggingNewVertex({ id: e.id, x: e.endX, y: e.endY });

			// 譁ｰ隕城らせ縺ｮ繝峨Λ繝・げ縺ｫ莨ｴ縺・ヱ繧ｹ縺ｮ鬆らせ縺ｮ菴咲ｽｮ螟画峩繧帝夂衍
			onDiagramChange?.({
				eventId: e.eventId,
				eventType: e.eventType,
				changeType: "Transform",
				id,
				startDiagram: {
					items: startItems.current,
				},
				endDiagram: {
					items: items.map((item) =>
						item.id === e.id ? { ...item, x: e.endX, y: e.endY } : item,
					),
				},
			});
		}

		// 繝峨Λ繝・げ螳御ｺ・凾縺ｮ蜃ｦ逅・
		if (e.eventType === "End") {
			// 繝峨Λ繝・げ荳ｭ縺ｮ譁ｰ隕城らせ繧定ｧ｣髯､
			setDraggingNewVertex(undefined);

			// 譁ｰ隕城らせ縺ｮ繝峨Λ繝・げ螳御ｺ・↓莨ｴ縺・ヱ繧ｹ縺ｮ繝・・繧ｿ螟画峩繧帝夂衍
			onDiagramChange?.({
				eventId: e.eventId,
				eventType: e.eventType,
				changeType: "Transform",
				id,
				startDiagram: {
					items: startItems.current,
				},
				endDiagram: {
					items: items.map((item) =>
						item.id === e.id
							? {
									...item,
									id: newId(), // 繝峨Λ繝・げ縺悟ｮ御ｺ・＠縺溘ｉ縲∵眠隕城らせ逕ｨ縺ｮID縺九ｉ譁ｰ縺励＞ID縺ｫ螟画峩
									x: e.endX,
									y: e.endY,
								}
							: item,
					),
				},
			});
		}
	}, []);

	return (
		<>
			{newVertexList.map((item) => (
				<NewVertex
					key={item.id}
					{...item}

					onDrag={handleNewVertexDrag}
				/>
			))}
		</>
	);
};

export const NewVertexList = memo(NewVertexListComponent);
