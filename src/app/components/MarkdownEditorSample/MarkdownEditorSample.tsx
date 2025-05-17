import { memo, useState, type ReactElement } from "react";
import styled from "@emotion/styled";
import { MarkdownEditor } from "../../../features/markdown-editor";

const sampleMarkdown = `# マークダウンエディタのサンプル

これは**マークダウンエディタ**のサンプルです。

## 機能
- マークダウンの編集
- リアルタイムプレビュー
- 表示モードの切り替え
  - 分割表示
  - エディタのみ
  - プレビューのみ

## コードサンプル

\`\`\`javascript
// サンプルコード
function hello() {
  console.log("Hello, Markdown!");
}
\`\`\`

## 数式サポート
以下は数式の例です：

$E = mc^2$

$$
\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right) = f(x)
$$

## 表
| 名前 | 説明 |
| ---- | ---- |
| マークダウン | テキストを整形するための軽量マークアップ言語 |
| エディタ | テキストを編集するためのツール |

## リンク
[Markdown 公式サイト](https://daringfireball.net/projects/markdown/)`;

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
`;

const MarkdownEditorSampleComponent = (): ReactElement => {
	const [markdown, setMarkdown] = useState(sampleMarkdown);

	const handleChange = (newMarkdown: string) => {
		setMarkdown(newMarkdown);
	};

	return (
		<Container>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					margin: "20px",
				}}
			>
				<MarkdownEditor
					initialMarkdown={markdown}
					onChange={handleChange}
					minHeight={500}
				/>
			</div>
		</Container>
	);
};

export const MarkdownEditorSample = memo(MarkdownEditorSampleComponent);
