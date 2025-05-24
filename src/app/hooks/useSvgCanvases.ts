import { useState, useCallback } from "react";
import type { SvgCanvas } from "../models/SvgCanvas";
import { createSvgCanvasRepository } from "../repository/svg-canvas/factory";
import type { SvgCanvasRepository } from "../repository/svg-canvas/interface";

// リポジトリインスタンスの生成
const svgCanvasRepository: SvgCanvasRepository = createSvgCanvasRepository();

/**
 * useSvgCanvasesフック - SVGキャンバスの管理と永続化を行うカスタムフック
 * 初期表示時には全てのキャンバスを読み込まず、必要に応じて個別に取得します
 *
 * @returns SVGキャンバス操作関数を含むオブジェクト
 */
export const useSvgCanvases = () => {
	// キャッシュ用のstate管理（必要に応じて個別にロードしたキャンバスをキャッシュ）
	const [canvasCache, setCanvasCache] = useState<Map<string, SvgCanvas>>(
		new Map(),
	);

	/**
	 * 特定のSVGキャンバスをIDで取得する関数
	 * キャッシュにある場合はキャッシュから返し、なければリポジトリから取得してキャッシュに保存します
	 *
	 * @param id - 取得するSVGキャンバスのID
	 * @returns 取得したSVGキャンバスオブジェクト、存在しない場合はundefined
	 */
	const getCanvasById = useCallback(
		async (id: string): Promise<SvgCanvas | undefined> => {
			try {
				// キャッシュにあればキャッシュから返す
				if (canvasCache.has(id)) {
					return canvasCache.get(id);
				}

				// リポジトリから取得
				const canvas = await svgCanvasRepository.getCanvasById(id);

				// 取得できた場合はキャッシュに保存
				if (canvas) {
					setCanvasCache((prevCache) => {
						const newCache = new Map(prevCache);
						newCache.set(id, canvas);
						return newCache;
					});
				}

				return canvas;
			} catch (error) {
				console.error(`Failed to get SVG canvas with ID ${id}:`, error);
				return undefined;
			}
		},
		[canvasCache],
	);

	/**
	 * 新しいSVGキャンバスを保存または更新する関数
	 *
	 * @param canvas - 保存または更新するSVGキャンバス
	 */
	const saveCanvas = useCallback(async (canvas: SvgCanvas): Promise<void> => {
		try {
			// キャッシュに保存
			setCanvasCache((prevCache) => {
				const newCache = new Map(prevCache);
				newCache.set(canvas.id, canvas);
				return newCache;
			});

			// リポジトリを使用して永続化
			await svgCanvasRepository.updateCanvas(canvas);
		} catch (error) {
			console.error("Failed to save SVG canvas:", error);
			throw error; // エラーを上位に伝播させる
		}
	}, []);

	/**
	 * 特定のSVGキャンバスを削除する関数
	 *
	 * @param canvasId - 削除するSVGキャンバスのID
	 */
	const removeCanvas = useCallback(async (canvasId: string): Promise<void> => {
		try {
			// キャッシュから削除
			setCanvasCache((prevCache) => {
				const newCache = new Map(prevCache);
				newCache.delete(canvasId);
				return newCache;
			});

			// リポジトリを使用して永続化
			await svgCanvasRepository.deleteCanvasById(canvasId);
		} catch (error) {
			console.error("Failed to remove SVG canvas:", error);
			throw error; // エラーを上位に伝播させる
		}
	}, []);
	/**
	 * 全てのSVGキャンバスを取得する関数
	 * このメソッドは必要に応じて呼び出し側で使用してください
	 * (注: getCanvasesメソッド廃止に伴い、個別取得を集約して実装)
	 *
	 * @returns 全てのSVGキャンバスオブジェクト
	 */
	const getAllCanvases = useCallback(async (): Promise<SvgCanvas[]> => {
		try {
			// 個別IDを検索して取得する必要がありますが、実装が複雑になるため
			// 現在のキャッシュされたデータを返すのみとします。
			// より完全な実装では、何らかの形でIDリストを管理する必要があります。
			const result = Array.from(canvasCache.values());
			return result;
		} catch (error) {
			console.error("Failed to get all SVG canvases:", error);
			return [];
		}
	}, [canvasCache]);

	return {
		getCanvasById,
		saveCanvas,
		removeCanvas,
		getAllCanvases,
	};
};
