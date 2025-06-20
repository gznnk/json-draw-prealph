// Import React.
import type React from "react";
import { memo, useCallback, useRef, useState } from "react";

// Import types related to SvgCanvas.
import type { Diagram } from "../../../../types/data/catalog/Diagram";
import type { DiagramChangeEvent } from "../../../../types/events/DiagramChangeEvent";
import type { DiagramDragEvent } from "../../../../types/events/DiagramDragEvent";

// Import functions related to SvgCanvas.
import { newId } from "../../../../utils/shapes/common/newId";

// Imports related to this component.
import { NewVertex, type NewVertexData } from "../NewVertex";

/**
 * 新規頂点リスト�Eロパティ
 */
type NewVertexListProps = {
	id: string;
	items: Diagram[];
	onDiagramChange?: (e: DiagramChangeEvent) => void;
};

/**
 * 新規頂点リストコンポ�EネンチE
 */
const NewVertexListComponent: React.FC<NewVertexListProps> = ({
	id,
	items,
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
		// ドラチE��中の場合�Eそ�E新規頂点のみ描画
		newVertexList.push(draggingNewVertex);
	} else {
		// ドラチE��中でなければ、各頂点の中点に新規頂点を描画
		for (let i = 0; i < items.length - 1; i++) {
			const item = items[i];
			const nextItem = items[i + 1];

			const x = (item.x + nextItem.x) / 2;
			const y = (item.y + nextItem.y) / 2;

			newVertexList.push({
				id: `${item.id}-${nextItem.id}`, // 前後�E頂点からIDを生戁E
				x,
				y,
			});
		}
	}

	// ハンドラ生�Eの頻発を回避するため、参照する値をuseRefで保持する
	const refBusVal = {
		// プロパティ
		id,
		items,
		onDiagramChange,
		// 冁E��変数・冁E��関数
		newVertexList,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	/**
	 * 新規頂点のドラチE��イベントハンドラ
	 */
	const handleNewVertexDrag = useCallback((e: DiagramDragEvent) => {
		const { id, items, onDiagramChange, newVertexList } = refBus.current;
		// ドラチE��開始時の処琁E
		if (e.eventType === "Start") {
			// Store the items of owner Path component at the start of the new vertex drag.
			startItems.current = items;

			// ドラチE��中の新規頂点を設宁E
			setDraggingNewVertex({ id: e.id, x: e.startX, y: e.startY });

			// 新規頂点と同じ位置に頂点を追加し、パスを更新する
			const idx = newVertexList.findIndex((v) => v.id === e.id);
			const newItems = [...items];
			const newItem = {
				id: e.id,
				type: "PathPoint",
				x: e.startX,
				y: e.startY,
			} as Diagram;
			newItems.splice(idx + 1, 0, newItem);

			// パスの変更を通知
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

		// ドラチE��中の処琁E
		if (e.eventType === "InProgress") {
			// ドラチE��中の新規頂点の位置を更新
			setDraggingNewVertex({ id: e.id, x: e.endX, y: e.endY });

			// 新規頂点のドラチE��に伴ぁE��スの頂点の位置変更を通知
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

		// ドラチE��完亁E��の処琁E
		if (e.eventType === "End") {
			// ドラチE��中の新規頂点を解除
			setDraggingNewVertex(undefined);

			// 新規頂点のドラチE��完亁E��伴ぁE��スのチE�Eタ変更を通知
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
									id: newId(), // ドラチE��が完亁E��たら、新規頂点用のIDから新しいIDに変更
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
				<NewVertex key={item.id} {...item} onDrag={handleNewVertexDrag} />
			))}
		</>
	);
};

export const NewVertexList = memo(NewVertexListComponent);
