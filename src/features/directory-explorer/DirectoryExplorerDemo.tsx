import { memo, useState, useCallback } from "react";
import styled from "@emotion/styled";
import { DirectoryExplorer, type DirectoryItem } from "../directory-explorer";

// サンプルのディレクトリ構造データ
const sampleData: DirectoryItem[] = [
	// ルート階層（順序がランダム）
	{ id: "1", name: "Cフォルダ", path: "C-folder", type: "folder" },
	{ id: "2", name: "Bファイル", path: "B-file", type: "file" },
	{ id: "3", name: "Aフォルダ", path: "A-folder", type: "folder" },
	{ id: "4", name: "Dファイル", path: "D-file", type: "file" },

	// Aフォルダの中身
	{ id: "5", name: "Zファイル", path: "A-folder/Z-file", type: "file" },
	{
		id: "6",
		name: "Xサブフォルダ",
		path: "A-folder/X-subfolder",
		type: "folder",
	},
	{ id: "7", name: "Yファイル", path: "A-folder/Y-file", type: "file" },

	// Xサブフォルダの中身
	{ id: "8", name: "3番目", path: "A-folder/X-subfolder/3-file", type: "file" },
	{ id: "9", name: "1番目", path: "A-folder/X-subfolder/1-file", type: "file" },
	{
		id: "10",
		name: "2番目",
		path: "A-folder/X-subfolder/2-file",
		type: "file",
	},

	// Cフォルダの中身
	{ id: "11", name: "Cの中のファイル", path: "C-folder/C-file", type: "file" },
	{
		id: "12",
		name: "Cの中のフォルダ",
		path: "C-folder/C-subfolder",
		type: "folder",
	},
];

const Container = styled.div`
  width: 300px;
  height: 600px;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  color: #333;
`;

const InfoPanel = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-top: 1px solid #ccc;
  font-family: monospace;
  white-space: pre-wrap;
  font-size: 12px;
`;

/**
 * DirectoryExplorerコンポーネントのデモ表示用コンポーネント
 */
const DirectoryExplorerDemoComponent = () => {
	const [items, setItems] = useState<DirectoryItem[]>(sampleData);
	const [selectedItem, setSelectedItem] = useState<DirectoryItem | null>(null);

	const handleItemsChange = useCallback((newItems: DirectoryItem[]) => {
		console.log(newItems);
		setItems(newItems);
	}, []);

	const handleItemClick = useCallback((item: DirectoryItem) => {
		setSelectedItem(item);
	}, []);

	return (
		<div>
			<h2>ディレクトリエクスプローラーデモ</h2>
			<p>
				アイテムをクリックして展開/非展開、ドラッグ&ドロップで階層を変更できます
			</p>

			<Container>
				<DirectoryExplorer
					items={items}
					onItemsChange={handleItemsChange}
					onItemClick={handleItemClick}
				/>
			</Container>

			<InfoPanel>
				<h3>選択中のアイテム:</h3>
				{selectedItem ? (
					<>
						<p>ID: {selectedItem.id}</p>
						<p>名前: {selectedItem.name}</p>
						<p>パス: {selectedItem.path}</p>
					</>
				) : (
					<p>アイテムを選択してください</p>
				)}

				<h3>現在のデータ構造:</h3>
				<pre>{JSON.stringify(items, null, 2)}</pre>
			</InfoPanel>
		</div>
	);
};

export const DirectoryExplorerDemo = memo(DirectoryExplorerDemoComponent);
