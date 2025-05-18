import styled from "@emotion/styled";
import { LEVEL_INDENT_WIDTH } from "./DirectoryExplorerConstants";

/**
 * エクスプローラーのルートコンテナ
 */
export const DirectoryExplorerContainer = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 14px;
  width: 100%;
  height: 100%;
  overflow: auto;
  user-select: none;
  padding: 4px 0;
`;

/**
 * ディレクトリノード全体を包むコンテナ
 */
export const NodeContainer = styled.div<{
	isOver?: boolean;
	canDrop?: boolean;
	isDragging?: boolean;
	isSelected?: boolean;
}>`
  display: flex;
  flex-direction: column;
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
  background-color: ${(props) =>
		props.isSelected
			? "var(--list-active-selection-background, #2b579a)"
			: props.isOver && props.canDrop
				? "var(--list-hover-background, rgba(255, 255, 255, 0.05))"
				: "transparent"};
  color: ${(props) =>
		props.isSelected
			? "var(--list-active-selection-foreground, #ffffff)"
			: "inherit"};
`;

/**
 * ディレクトリノードの行コンテナ
 */
export const NodeRow = styled.div<{
	level: number;
	isDropTarget?: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 2px 0;
  padding-left: ${(props) => props.level * LEVEL_INDENT_WIDTH}px;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color: var(--list-hover-background, rgba(255, 255, 255, 0.05));
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: ${(props) => (props.isDropTarget ? "1px dashed #007fd4" : "none")};
    pointer-events: none;
  }
`;

/**
 * 展開アイコンのコンテナ
 */
export const ExpandIconContainer = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  font-size: 12px;
`;

/**
 * アイテムアイコンのコンテナ
 */
export const ItemIconContainer = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 4px;
`;

/**
 * ドロップインジケーターライン
 */
export const DropIndicator = styled.div<{
	position: "before" | "after";
}>`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #007fd4;
  z-index: 1;
  ${(props) => (props.position === "before" ? "top: 0;" : "bottom: 0;")}
  
  &::before {
    content: "";
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: #007fd4;
    border-radius: 50%;
    left: 0;
    top: ${(props) => (props.position === "before" ? "-2px" : "-2px")};
  }
`;

/**
 * ドロップインジケーターのハイライト
 */
export const DropHighlight = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border: 2px dashed #007fd4;
  background-color: rgba(0, 127, 212, 0.1);
  pointer-events: none;
  z-index: 1;
`;

/**
 * フォルダドロップ用のハイライトインジケータ
 */
export const FolderDropIndicator = styled.div`
  position: absolute;
  pointer-events: none;
  z-index: 2;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border: 2px dashed #007fd4;
  background-color: rgba(0, 127, 212, 0.1);
`;
