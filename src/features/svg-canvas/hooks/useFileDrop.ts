// Reactをインポート
import { useCallback, useRef } from "react";

/**
 * ファイルドロップイベントを処理するためのカスタムフック
 *
 * @param onFileDrop - ファイルがドロップされたときに呼び出されるコールバック関数
 */
const useFileDrop = (onFileDrop?: (files: FileList) => void) => {
	// すべての参照値をオブジェクトとしてまとめてuseRefに保持
	const refBusVal = {
		onFileDrop,
	};
	const refBus = useRef(refBusVal);
	// 参照値を最新に更新
	refBus.current = refBusVal;

	const onDragOver = useCallback<React.DragEventHandler>((event) => {
		event.preventDefault();
	}, []);

	const onDrop = useCallback<React.DragEventHandler>((event) => {
		event.preventDefault();
		const files = event.dataTransfer.files;
		if (files && files.length > 0) {
			// refBusを介して常に最新のコールバック関数を参照
			if (refBus.current.onFileDrop) {
				refBus.current.onFileDrop(files);
			}
		}
	}, []); // 依存配列を空にして不要な再作成を防止

	return { onDragOver, onDrop };
};

export default useFileDrop;
