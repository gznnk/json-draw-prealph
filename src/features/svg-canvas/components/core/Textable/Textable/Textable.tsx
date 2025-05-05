// Import React.
import type React from "react";
import { memo, useEffect, useRef } from "react";

// Import other libraries.
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import katex from "katex";
import { marked, type Tokens } from "marked";
import markdownItKatex from "markdown-it-katex";
import MarkdownIt from "markdown-it";

// Import other libraries css.
import "highlight.js/styles/github.css";
import "katex/dist/katex.min.css";

// Import types related to SvgCanvas.
import type { TextableData } from "../../../../types/DiagramTypes";

// Imports related to this component.
import { Text, TextWrapper } from "./TextableStyled";

/**
 * Props for rendering editable text inside the SVG shape.
 */
type TextableProps = TextableData & {
	x: number;
	y: number;
	width: number;
	height: number;
	transform: string;
};

// 行頭 $$ と行末 $$ を単独行にして markdown-it に渡す
export const normalizeMath = (text: string) => {
	return (
		text
			// \[...\] → $$\n...\n$$
			.replace(/\\\[(.*?)\\\]/gs, (_, inner) => `\n$$\n${inner}\n$$\n`)
			// 既存の $$...$$ が行内にある場合も強制的に改行
			.replace(/\$\$([^$\n]+?)\$\$/gs, (_, inner) => `\n$$\n${inner}\n$$\n`)
	);
};

export const katexLite = (md: MarkdownIt) => {
	/* ---------- Inline $ ... $ ---------- */
	md.inline.ruler.after("escape", "math_inline", (state, silent) => {
		if (state.src[state.pos] !== "$") return false;
		const start = state.pos + 1;
		const end = state.src.indexOf("$", start);
		if (end === -1 || end === start) return false;
		if (silent) return false;

		const token = state.push("math_inline", "", 0);
		token.content = state.src.slice(start, end);
		state.pos = end + 1;
		return true;
	});

	/* ---------- Block $$ ... $$ ---------- */
	md.block.ruler.after(
		"fence",
		"math_block",
		(state, startLine, endLine, silent) => {
			const begin = state.bMarks[startLine] + state.tShift[startLine];
			if (state.src.slice(begin, begin + 2) !== "$$") return false;

			let next = startLine;
			while (++next < endLine) {
				const pos = state.bMarks[next] + state.tShift[next];
				if (state.src.slice(pos, pos + 2) === "$$") break;
			}
			if (next >= endLine) return false;
			if (silent) return true;

			const token = state.push("math_block", "", 0);
			const firstLine = state.src
				.slice(begin + 2, state.eMarks[startLine])
				.trim();
			const lastLine = state.src
				.slice(state.bMarks[next] + state.tShift[next] + 2, state.eMarks[next])
				.trim();
			token.content = `${firstLine ? `${firstLine}\n` : ""}${state.getLines(startLine + 1, next, state.tShift[startLine], true)}${lastLine || ""}`;
			token.map = [startLine, next + 1];
			state.line = next + 1;
			return true;
		},
		{ alt: ["paragraph", "reference", "blockquote", "list"] },
	);

	/* ---------- Renderer ---------- */
	md.renderer.rules.math_inline = (t, i) =>
		katex.renderToString(t[i].content, { throwOnError: false });

	md.renderer.rules.math_block = (t, i) =>
		`<div class="math-block">${katex.renderToString(t[i].content, {
			displayMode: true,
			throwOnError: false,
		})}</div>`;
};

// MarkdownItインスタンス作成
const md = new MarkdownIt({
	html: true,
	breaks: true,
	linkify: true,
	highlight: (str: string, lang: string): string => {
		if (lang && hljs.getLanguage(lang)) {
			return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
		}
		return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>`;
	},
}).use(katexLite);

/**
 * Function to create a math extension for marked.js.
 *
 * @param name - The name of the extension.
 * @param level - The level of the extension (inline or block).
 * @param pattern - The regex pattern to match the math expression.
 * @param displayMode - Whether to display the math in block mode.
 * @returns - The math extension object.
 */
const createMathExtension = (
	name: string,
	level: "inline" | "block",
	pattern: RegExp,
	displayMode = false,
) => ({
	name,
	level,
	start: (src: string) => src.match(pattern)?.index,
	tokenizer: (src: string) => {
		const match = src.match(pattern);
		if (match) {
			return {
				type: name,
				raw: match[0],
				text: match[1],
				tokens: [],
			};
		}
	},
	renderer: (token: Tokens.Generic) =>
		displayMode
			? `<div class="math-block">${katex.renderToString(token.text, {
					displayMode: true,
					throwOnError: false,
				})}</div>`
			: katex.renderToString(token.text, { throwOnError: false }),
});

// Configure marked.js to use the math extension and highlight.js for code highlighting.
marked.use({
	renderer: {
		code({ text, lang }) {
			// If no language is specified, return the text as plaintext.
			if (!lang) return `<pre><code>${text}</code></pre>`;

			// If a language is specified, use highlight.js to highlight the code.
			const validLang = hljs.getLanguage(lang);

			// If the language is not valid, return the text as plaintext.
			if (!validLang) return `<pre><code>${text}</code></pre>`;

			// Highlight the code using highlight.js.
			const highlighted = hljs.highlight(text, {
				language: lang,
			}).value;
			return `<pre><code class="hljs language-${validLang}">${highlighted}</code></pre>`;
		},
	},
	extensions: [
		createMathExtension("math", "inline", /^\$([^$]+?)\$/),
		createMathExtension("mathBlock", "block", /^\$\$([^$]+?)\$\$/s, true),
		createMathExtension("mathInline", "inline", /^\\\((.+?)\\\)/),
		createMathExtension("mathBlockAlt", "block", /^\\\[(.+?)\\\]/s, true),
	],
});

/**
 * React component for rendering editable text inside the SVG shape.
 */
const TextableComponent: React.FC<TextableProps> = ({
	x,
	y,
	width,
	height,
	transform,
	text,
	textType,
	textAlign,
	verticalAlign,
	fontColor,
	fontSize,
	fontFamily,
	fontWeight,
	isTextEditing,
}) => {
	const textRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (textRef.current && !isTextEditing) {
			// Clear the previous content
			textRef.current.innerHTML = "";
			// Set the new content with sanitized HTML
			textRef.current.innerHTML = DOMPurify.sanitize(
				// marked(text, {
				// 	async: false,
				// }),
				md.render(normalizeMath(text)),
			);

			// Manage the links to open in a new tab and prevent security issues with rel attribute
			for (const link of textRef.current.querySelectorAll("a")) {
				link.setAttribute("target", "_blank");
				link.setAttribute("rel", "noopener noreferrer");
			}
		}
	}, [text, isTextEditing]);

	if (!text) return null;
	if (isTextEditing) return null;

	return (
		<foreignObject
			className="diagram"
			x={x}
			y={y}
			width={width}
			height={height}
			transform={transform}
			pointerEvents="none"
		>
			<TextWrapper verticalAlign={verticalAlign}>
				{textType === "markdown" ? (
					<Text
						textAlign={textAlign}
						color={fontColor}
						fontSize={fontSize}
						fontFamily={fontFamily}
						fontWeight={fontWeight}
						wordBreak="break-word"
						whiteSpace="pre-wrap"
						ref={textRef}
					/>
				) : (
					<Text
						textAlign={textAlign}
						color={fontColor}
						fontSize={fontSize}
						fontFamily={fontFamily}
						fontWeight={fontWeight}
						wordBreak={textType === "text" ? "normal" : "break-word"}
						whiteSpace={textType === "text" ? "nowrap" : "pre-wrap"}
					>
						{text}
					</Text>
				)}
			</TextWrapper>
		</foreignObject>
	);
};

export const Textable = memo(TextableComponent);
