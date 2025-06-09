import { useState, useEffect, useCallback } from "react";
import type { Work } from "../models/Work";
import { createWorkRepository } from "../repository/work/factory";
import type { WorkRepository } from "../repository/work/interface";

// リポジトリインスタンスの生成
const workRepository: WorkRepository = createWorkRepository();

/**
 * useWorksフック - Workの管理と永続化を行うカスタムフック
 *
 * @returns Work配列と操作関数を含むオブジェクト
 */
export const useWorks = () => {
	// Work配列のstate管理
	const [works, setWorks] = useState<Work[]>([]);

	// 初期表示時にリポジトリからWorkを取得
	useEffect(() => {
		const loadWorks = async () => {
			try {
				const loadedWorks = await workRepository.getWorks();
				setWorks(loadedWorks);
			} catch (error) {
				console.error("Failed to load works:", error);
			}
		};

		loadWorks();
	}, []);

	/**
	 * Work配列に新しいWorkを追加する関数
	 *
	 * @param newWork - 追加するWork
	 */
	const addWork = useCallback(
		async (newWork: Work) => {
			// 現在の状態をバックアップ
			const originalWorks = [...works];

			try {
				// 新しいWork配列を作成
				const updatedWorks = [...works, newWork];

				// stateを更新
				setWorks(updatedWorks);

				// リポジトリを使用して永続化
				await workRepository.saveWorks(updatedWorks);
			} catch (error) {
				console.error("Failed to add work:", error);
				// エラー時はバックアップした状態に戻す
				setWorks(originalWorks);
				throw error; // エラーを上位に伝播させる
			}
		},
		[works],
	);

	/**
	 * Work配列を更新する関数（一括更新）
	 *
	 * @param updatedWorks - 更新後のWork配列
	 */
	const updateWorks = useCallback(
		async (updatedWorks: Work[]) => {
			// 現在の状態をバックアップ
			const originalWorks = [...works];

			try {
				// stateを更新
				setWorks(updatedWorks);

				// リポジトリを使用して永続化
				await workRepository.saveWorks(updatedWorks);
			} catch (error) {
				console.error("Failed to update works:", error);
				// エラー時はバックアップした状態に戻す
				setWorks(originalWorks);
				throw error; // エラーを上位に伝播させる
			}
		},
		[works],
	);

	/**
	 * 特定のWorkを削除する関数
	 *
	 * @param workId - 削除するWorkのID
	 */
	const removeWork = useCallback(
		async (workId: string) => {
			// 現在の状態をバックアップ
			const originalWorks = [...works];

			try {
				// IDに一致しないWorkだけを残す
				const updatedWorks = works.filter((work) => work.id !== workId);

				// stateを更新
				setWorks(updatedWorks);

				// リポジトリを使用して永続化
				await workRepository.saveWorks(updatedWorks);
			} catch (error) {
				console.error("Failed to remove work:", error);
				// エラー時はバックアップした状態に戻す
				setWorks(originalWorks);
				throw error; // エラーを上位に伝播させる
			}
		},
		[works],
	);

	return {
		works,
		addWork,
		updateWorks,
		removeWork,
	};
};
