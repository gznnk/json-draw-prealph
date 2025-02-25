import type React from "react";
import {
	useCallback,
	useRef,
	forwardRef,
	memo,
	useImperativeHandle,
} from "react";
import Draggable from "../core/Draggable";
import DragPoint from "../core/DragPoint";
import type { Point } from "../../types/CoordinateTypes";
import type {
	DiagramDragEvent,
	GroupDragEvent,
	GroupResizeEvent,
} from "../../types/EventTypes";
import type {
	DiagramRef,
	DiagramBaseProps,
	LinePointData,
} from "../../types/DiagramTypes";

export type LinePointProps = DiagramBaseProps & LinePointData;

const LinePoint: React.FC<LinePointProps> = memo(
	forwardRef<DiagramRef, LinePointProps>(
		(
			{
				id,
				point,
				onDiagramClick,
				onDiagramDragStart,
				onDiagramDrag,
				onDiagramDragEnd,
				onDiagramSelect,
			},
			ref,
		) => {
			// 親グループのドラッグ・リサイズ時に、親グループ側から実行してもらう関数を公開
			useImperativeHandle(ref, () => ({
				onGroupDrag: handleGroupDrag,
				onGroupDragEnd: handleGroupDragEnd,
				onGroupResize: onGroupResize,
				onGroupResizeEnd: onGroupResizeEnd,
			}));

			/**
			 * グループのドラッグ中イベントハンドラ
			 *
			 * @param {GroupDragEvent} e グループのドラッグ中イベント
			 * @returns {void}
			 */
			const handleGroupDrag = useCallback((e: GroupDragEvent) => {
				// TODO: 実装
			}, []);

			/**
			 * グループのドラッグ完了イベントハンドラ
			 *
			 * @param {GroupDragEvent} e グループのドラッグ完了イベント
			 * @returns {void}
			 */
			const handleGroupDragEnd = useCallback((e: GroupDragEvent) => {
				// TODO: 実装
			}, []);

			/**
			 * グループのリサイズ中イベントハンドラ
			 *
			 * @param {GroupResizeEvent} e グループのリサイズ中イベント
			 * @returns {void}
			 */
			const onGroupResize = useCallback(
				(e: GroupResizeEvent) => {
					// TODO: 実装
				},
				[point],
			);

			/**
			 * グループのリサイズ完了イベントハンドラ
			 *
			 * @param {GroupResizeEvent} e グループのリサイズ完了イベント
			 */
			const onGroupResizeEnd = useCallback((e: GroupResizeEvent) => {
				// TODO: 実装
			}, []);

			return (
				<DragPoint
					id={id}
					point={point}
					onPointerDown={onDiagramClick}
					onDragStart={onDiagramDragStart}
					onDrag={onDiagramDrag}
					onDragEnd={onDiagramDragEnd}
				/>
			);
		},
	),
);

export default LinePoint;
