import { memo, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { DirectoryNodeProps, DropResult } from "./DirectoryExplorerTypes";
import { DIRECTORY_ITEM_TYPE } from "./DirectoryExplorerConstants";
import {
	NodeContainer,
	NodeRow,
	ExpandIconContainer,
	ItemIconContainer,
} from "./DirectoryExplorerStyled";
import { getDirectChildren } from "./DirectoryExplorerFunctions";

/**
 * ディレクトリツリーの個々のノードを表示するコンポーネント
 * 展開/非展開の状態管理と子要素の表示を担当
 */
const DirectoryNodeComponent = ({
	item,
	allItems,
	expandedNodes,
	toggleExpand,
	level,
	onDrop,
	onItemClick,
}: DirectoryNodeProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const isExpanded = expandedNodes.has(item.id);
	const children = getDirectChildren(item, allItems);

	// アイテムのドラッグ設定
	const [{ isDragging }, drag] = useDrag({
		type: DIRECTORY_ITEM_TYPE,
		item: () => ({ id: item.id }),
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});
	// ドロップ対象の状態を追跡
	const [{ isOver, canDrop }, drop] = useDrop({
		accept: DIRECTORY_ITEM_TYPE,
		canDrop: (draggedItem: { id: string }) => {
			// ファイルはドロップターゲットにしない（フォルダのみ許可）
			if (item.type === "file") return false;

			// 自分自身へのドロップは許可しない
			if (draggedItem.id === item.id) return false;

			// 子孫へのドロップも許可しない（循環参照防止）
			const draggedItemObj = allItems.find((i) => i.id === draggedItem.id);
			if (!draggedItemObj) return false;

			// ドラッグしているアイテムが現在のアイテムの親か確認
			return !item.path.startsWith(`${draggedItemObj.path}/`);
		},
		drop: (draggedItem: { id: string }, monitor) => {
			// ファイルはドロップ先にしない
			if (item.type !== "folder") return;

			// モニターがドロップを受け取ったアイテムが自分自身かどうかを確認
			// これにより、バブリングによる親コンポーネントでの処理を防止する
			if (!monitor.isOver({ shallow: true })) {
				return;
			}

			// ドロップ処理のみ実行
			const result: DropResult = {
				draggedItemId: draggedItem.id,
				targetFolderId: item.id,
			};
			onDrop(result); // フォルダが展開されていない場合は直接展開する
			if (!isExpanded) {
				toggleExpand(item.id);
			}

			// イベントが親に伝播しないようにする
			return { dropEffect: "move" };
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop(),
		}),
	});

	// ドラッグ＆ドロップの参照を結合
	drag(drop(ref)); // アイテムのクリックハンドラー
	const handleClick = () => {
		// フォルダの場合は、子要素の有無にかかわらず展開/折りたたみを切り替える
		if (item.type === "folder") {
			toggleExpand(item.id);
		}
		if (onItemClick) {
			onItemClick(item);
		}
	};

	return (
		<NodeContainer
			ref={ref}
			isDragging={isDragging}
			isOver={isOver}
			canDrop={canDrop}
		>
			<NodeRow
				level={level}
				onClick={handleClick}
				isDropTarget={isOver && canDrop && item.type === "folder"}
			>
				{" "}
				{/* 展開/非展開アイコン */}
				<ExpandIconContainer>
					{item.type === "folder" ? (
						isExpanded ? (
							"▾"
						) : (
							"▸"
						)
					) : (
						<span style={{ width: "16px" }} />
					)}
				</ExpandIconContainer>
				{/* アイテムアイコン（フォルダかファイル） */}
				<ItemIconContainer>
					{item.type === "folder" ? "📁" : "📄"}
				</ItemIconContainer>
				{/* アイテム名 */}
				<span>{item.name}</span>
			</NodeRow>
			{/* 子ノードの表示（展開時のみ） */}
			{isExpanded &&
				children.map((child) => (
					<DirectoryNode
						key={child.id}
						item={child}
						allItems={allItems}
						expandedNodes={expandedNodes}
						toggleExpand={toggleExpand}
						level={level + 1}
						onDrop={onDrop}
						onItemClick={onItemClick}
					/>
				))}
		</NodeContainer>
	);
};

export const DirectoryNode = memo(DirectoryNodeComponent);
