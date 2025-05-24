import { useState, useCallback } from "react";
import type { Markdown } from "../models/Markdown";
import { createMarkdownRepository } from "../repository/markdown/factory";
import type { MarkdownRepository } from "../repository/markdown/interface";

// リポジトリインスタンスの生成
const markdownRepository: MarkdownRepository = createMarkdownRepository();

/**
 * useMarkdownsフック - Markdownの管理と永続化を行うカスタムフック
 * 初期表示時には全てのマークダウンを読み込まず、必要に応じて個別に取得します
 *
 * @returns Markdown操作関数を含むオブジェクト
 */
export const useMarkdowns = () => {
	// キャッシュ用のstate管理（必要に応じて個別にロードしたマークダウンをキャッシュ）
	const [markdownCache, setMarkdownCache] = useState<Map<string, Markdown>>(
		new Map(),
	);

	/**
	 * 特定のMarkdownをIDで取得する関数
	 * キャッシュにある場合はキャッシュから返し、なければリポジトリから取得してキャッシュに保存します
	 *
	 * @param id - 取得するMarkdownのID
	 * @returns 取得したMarkdownオブジェクト、存在しない場合はundefined
	 */
	const getMarkdownById = useCallback(
		async (id: string): Promise<Markdown | undefined> => {
			try {
				// キャッシュにあればキャッシュから返す
				if (markdownCache.has(id)) {
					return markdownCache.get(id);
				}

				// リポジトリから取得
				const markdown = await markdownRepository.getMarkdownById(id);

				// 取得できた場合はキャッシュに保存
				if (markdown) {
					setMarkdownCache((prevCache) => {
						const newCache = new Map(prevCache);
						newCache.set(id, markdown);
						return newCache;
					});
				}

				return markdown;
			} catch (error) {
				console.error(`Failed to get markdown with ID ${id}:`, error);
				return undefined;
			}
		},
		[markdownCache],
	);

	/**
	 * 新しいMarkdownを保存または更新する関数
	 *
	 * @param markdown - 保存または更新するMarkdownオブジェクト
	 */
	const saveMarkdown = useCallback(
		async (markdown: Markdown): Promise<void> => {
			try {
				// リポジトリに保存
				await markdownRepository.updateMarkdown(markdown);

				// キャッシュを更新
				setMarkdownCache((prevCache) => {
					const newCache = new Map(prevCache);
					newCache.set(markdown.id, markdown);
					return newCache;
				});
			} catch (error) {
				console.error("Failed to save markdown:", error);
				throw error; // エラーを上位に伝播させる
			}
		},
		[],
	);

	/**
	 * Markdownを削除する関数
	 *
	 * @param id - 削除するMarkdownのID
	 */
	const deleteMarkdown = useCallback(async (id: string): Promise<void> => {
		try {
			// リポジトリから削除
			await markdownRepository.deleteMarkdownById(id);

			// キャッシュから削除
			setMarkdownCache((prevCache) => {
				const newCache = new Map(prevCache);
				newCache.delete(id);
				return newCache;
			});
		} catch (error) {
			console.error(`Failed to delete markdown with ID ${id}:`, error);
			throw error; // エラーを上位に伝播させる
		}
	}, []);

	return {
		getMarkdownById,
		saveMarkdown,
		deleteMarkdown,
	};
};
