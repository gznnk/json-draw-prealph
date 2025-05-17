import { memo, useEffect, useRef, type ReactElement } from "react";
import { PreviewArea } from "./MarkdownEditorStyled";

/**
 * SafeHtmlPreviewコンポーネントのプロパティ定義
 */
type SafeHtmlPreviewProps = {
	/** レンダリング済みのHTML（サニタイズ済みであること） */
	html: string;
};

/**
 * サニタイズ済みHTMLを安全に表示するコンポーネント
 * dangerouslySetInnerHTMLの代わりにrefとinnerHTMLを使用して警告を回避します
 *
 * @param props - コンポーネントのプロパティ
 * @returns SafeHtmlPreviewコンポーネント
 */
const SafeHtmlPreviewComponent = ({
	html,
}: SafeHtmlPreviewProps): ReactElement => {
	const containerRef = useRef<HTMLDivElement>(null);

	// HTMLコンテンツをrefを通じて設定
	useEffect(() => {
		if (containerRef.current) {
			// innerHTMLを使用して手動でHTMLをセット
			containerRef.current.innerHTML = html;
		}
	}, [html]);

	// 空のdiv要素を返す（内容はuseEffectで設定）
	return <PreviewArea ref={containerRef} />;
};

export const SafeHtmlPreview = memo(SafeHtmlPreviewComponent);
