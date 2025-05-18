import {
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
	type ReactElement,
} from "react";
import { renderMarkdown } from "../../markdown";
import type { MarkdownEditorProps } from "../types";
import {
	DEFAULT_MIN_HEIGHT,
	DEFAULT_PLACEHOLDER,
	VIEW_MODE_LABELS,
} from "./MarkdownEditorConstants";
import {
	EditorContainer,
	MarkdownTextarea,
	Toolbar,
	ToolbarButton,
} from "./MarkdownEditorStyled";
import { SafeHtmlPreview } from "./SafeHtmlPreview";

const MarkdownEditorComponent = ({
	initialMarkdown = "",
	onChange,
	placeholder = DEFAULT_PLACEHOLDER,
	minHeight = DEFAULT_MIN_HEIGHT,
}: MarkdownEditorProps): ReactElement => {
	// マークダウンコンテンツの状態管理
	const [markdown, setMarkdown] = useState(initialMarkdown);
	// レンダリングされたHTMLの状態管理
	const [renderedHtml, setRenderedHtml] = useState("");
	// 表示状態の管理
	const [showEditor, setShowEditor] = useState(true);
	const [showPreview, setShowPreview] = useState(true);
	// テキストエリアとプレビューの参照
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const previewRef = useRef<HTMLDivElement | null>(null);

	// スクロール同期のフラグ
	const isScrollingEditor = useRef(false);
	const isScrollingPreview = useRef(false);

	// マークダウンが変更されたときにHTMLをレンダリングし直す
	useEffect(() => {
		setRenderedHtml(renderMarkdown(markdown));
	}, [markdown]);

	// スクロール位置の割合を取得する関数
	const getScrollPercentage = useCallback((element: HTMLElement) => {
		return (
			element.scrollTop / (element.scrollHeight - element.clientHeight) || 0
		);
	}, []);

	// スクロール位置をパーセンテージに基づいて設定する関数
	const setScrollPercentage = useCallback(
		(element: HTMLElement, percentage: number) => {
			const maxScroll = element.scrollHeight - element.clientHeight;
			element.scrollTop = Math.max(
				0,
				Math.min(maxScroll, percentage * maxScroll),
			);
		},
		[],
	);

	// エディタのスクロールイベントハンドラ
	const handleEditorScroll = useCallback(() => {
		if (
			isScrollingPreview.current ||
			!showPreview ||
			!textareaRef.current ||
			!previewRef.current
		)
			return;

		isScrollingEditor.current = true;
		const percentage = getScrollPercentage(textareaRef.current);
		setScrollPercentage(previewRef.current, percentage);

		// スクロールイベントのロックを解除するタイマー
		setTimeout(() => {
			isScrollingEditor.current = false;
		}, 50);
	}, [showPreview, getScrollPercentage, setScrollPercentage]);

	// プレビューのスクロールイベントハンドラ
	const handlePreviewScroll = useCallback(() => {
		if (
			isScrollingEditor.current ||
			!showEditor ||
			!textareaRef.current ||
			!previewRef.current
		)
			return;

		isScrollingPreview.current = true;
		const percentage = getScrollPercentage(previewRef.current);
		setScrollPercentage(textareaRef.current, percentage);

		// スクロールイベントのロックを解除するタイマー
		setTimeout(() => {
			isScrollingPreview.current = false;
		}, 50);
	}, [showEditor, getScrollPercentage, setScrollPercentage]);

	// スクロールイベントのリスナーを設定
	useEffect(() => {
		const textarea = textareaRef.current;
		const preview = previewRef.current;

		if (textarea && preview && showEditor && showPreview) {
			textarea.addEventListener("scroll", handleEditorScroll);
			preview.addEventListener("scroll", handlePreviewScroll);

			return () => {
				textarea.removeEventListener("scroll", handleEditorScroll);
				preview.removeEventListener("scroll", handlePreviewScroll);
			};
		}
	}, [handleEditorScroll, handlePreviewScroll, showEditor, showPreview]);

	// テキストエリアの変更イベントハンドラ
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const newValue = e.target.value;
			setMarkdown(newValue);
			// 親コンポーネントに変更を通知
			if (onChange) {
				onChange(newValue);
			}
		},
		[onChange],
	);

	// キャレット位置に基づいてスクロールを調整
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			// 矢印キーまたはエンターキーの場合のみ処理
			if (
				!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(
					e.key,
				)
			) {
				return;
			}

			if (textareaRef.current) {
				// 少し遅延を入れて、キャレット位置が更新された後に実行
				setTimeout(() => {
					const textarea = textareaRef.current;
					if (!textarea) return;

					const { scrollTop, clientHeight } = textarea;
					const caretPosition = textarea.selectionStart;

					// テキストの内容を取得して行ごとに分割
					const text = textarea.value;
					const lines = text.substring(0, caretPosition).split("\n");

					// キャレットが現在いる行数を計算（0ベース）
					const currentLineIndex = lines.length - 1;

					// 1行の高さを取得
					const lineHeight = Number.parseInt(
						getComputedStyle(textarea).lineHeight,
						10,
					);

					// キャレットのY座標を計算
					const caretY = currentLineIndex * lineHeight;

					// パディングに応じたオフセット
					const paddingTop = Number.parseInt(
						getComputedStyle(textarea).paddingTop,
						10,
					);
					const paddingBottom = Number.parseInt(
						getComputedStyle(textarea).paddingBottom,
						10,
					);

					// 上方向のスクロール調整（最初の行の場合、paddingTopを考慮）
					if (currentLineIndex === 0 || caretY < scrollTop + paddingTop) {
						textarea.scrollTop = Math.max(0, caretY - paddingTop);
					}

					// 下方向のスクロール調整（最後の行の場合、paddingBottomを考慮）
					const allLines = text.split("\n");
					const isLastLine = currentLineIndex === allLines.length - 1;
					const isEnterKey = e.key === "Enter";

					// 最終行の場合、スクロールを最大まで設定
					if (isLastLine) {
						textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
					}
					// 最終行でエンターキーが押された場合も最大スクロール
					else if (isEnterKey && currentLineIndex === allLines.length - 2) {
						textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
					}
					// 通常のスクロール調整
					else if (
						caretY + lineHeight >
						scrollTop + clientHeight - paddingBottom
					) {
						textarea.scrollTop =
							caretY + lineHeight - clientHeight + paddingBottom;
					}

					// エディタがスクロールされたとき、プレビューも同期させる
					if (
						showPreview &&
						previewRef.current &&
						!isScrollingPreview.current
					) {
						isScrollingEditor.current = true;
						const percentage = getScrollPercentage(textarea);
						setScrollPercentage(previewRef.current, percentage);

						setTimeout(() => {
							isScrollingEditor.current = false;
						}, 50);
					}
				}, 0);
			}
		},
		[showPreview, getScrollPercentage, setScrollPercentage],
	);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				minHeight: minHeight,
			}}
		>
			{/* ツールバー */}
			<Toolbar>
				<ToolbarButton
					active={showEditor && showPreview}
					onClick={() => {
						setShowEditor(true);
						setShowPreview(true);
					}}
				>
					{VIEW_MODE_LABELS.split}
				</ToolbarButton>
				<ToolbarButton
					active={showEditor && !showPreview}
					onClick={() => {
						setShowEditor(true);
						setShowPreview(false);
					}}
				>
					{VIEW_MODE_LABELS.editorOnly}
				</ToolbarButton>
				<ToolbarButton
					active={!showEditor && showPreview}
					onClick={() => {
						setShowEditor(false);
						setShowPreview(true);
					}}
				>
					{VIEW_MODE_LABELS.previewOnly}
				</ToolbarButton>
			</Toolbar>

			{/* エディタとプレビューのコンテナ */}
			<EditorContainer>
				{/* マークダウン入力エリア */}
				{showEditor && (
					<MarkdownTextarea
						ref={textareaRef}
						value={markdown}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
					/>
				)}
				{/* プレビュー表示エリア */}
				{showPreview && (
					<SafeHtmlPreview ref={previewRef} html={renderedHtml} />
				)}
			</EditorContainer>
		</div>
	);
};

export const MarkdownEditor = memo(MarkdownEditorComponent);
