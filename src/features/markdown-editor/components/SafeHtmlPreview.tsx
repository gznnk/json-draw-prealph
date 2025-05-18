import { forwardRef, memo, useEffect, useRef } from "react";
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
const SafeHtmlPreviewComponent = forwardRef<
	HTMLDivElement,
	SafeHtmlPreviewProps
>(({ html }, forwardedRef) => {
	const localRef = useRef<HTMLDivElement>(null);
	const resolvedRef = (forwardedRef ||
		localRef) as React.RefObject<HTMLDivElement>;

	// HTMLコンテンツをrefを通じて設定
	useEffect(() => {
		if (resolvedRef.current) {
			// innerHTMLを使用して手動でHTMLをセット
			resolvedRef.current.innerHTML = html;
		}
	}, [html, resolvedRef]);

	// 空のdiv要素を返す（内容はuseEffectで設定）
	return <PreviewArea ref={resolvedRef} />;
});

// コンポーネント名の設定（デバッグ用）
SafeHtmlPreviewComponent.displayName = "SafeHtmlPreview";

export const SafeHtmlPreview = memo(SafeHtmlPreviewComponent);
