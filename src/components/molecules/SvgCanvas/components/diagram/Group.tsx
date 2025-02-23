// Reactのインポート
import React, {
	forwardRef,
	memo,
	useCallback,
	useImperativeHandle,
	useRef,
} from "react";

// SvgCanvas関連型定義をインポート
import type { Diagram, DiagramRef } from "../../types/DiagramTypes";
import { DiagramTypeComponentMap } from "../../types/DiagramTypes";
import type {
	DiagramChangeEvent,
	ParentDiagramResizeEvent,
	DiagramSelectEvent,
} from "../../types/EventTypes";

// SvgCanvas関連コンポーネントをインポート
import type { RectangleProps } from "./Rectangle";
import RectangleBase from "../core/RectangleBase";

// RectangleBase関連関数をインポート
import { calcArrangmentOnGroupDiagramChange } from "../core/RectangleBase/RectangleBaseFunctions";

type GroupProps = RectangleProps & {
	items?: Diagram[];
};

const Group: React.FC<GroupProps> = memo(
	forwardRef<DiagramRef, GroupProps>(
		(
			{
				id,
				point,
				width,
				height,
				keepProportion = false,
				tabIndex = 0,
				isSelected = false,
				onDiagramChangeEnd,
				onDiagramSelect,
				items = [],
			},
			ref,
		) => {
			const diagramRef = useRef<DiagramRef>({} as DiagramRef);

			// 親から参照するためのRefを作成
			useImperativeHandle(ref, () => ({
				svgRef: diagramRef.current.svgRef,
				draggableRef: diagramRef.current.draggableRef,
				onParentDiagramResize: onParentDiagramResize,
				onParentDiagramResizeEnd: onParentDiagramResizeEnd,
			}));

			// 子の図形への参照を保持するRef作成
			const itemsRef = useRef<{
				[key: string]: DiagramRef | undefined;
			}>({});

			// TODO: 精査
			const handleChildDiagramSelect = useCallback(
				(e: DiagramSelectEvent) => {
					console.log("Group handleChildDiagramSelect", e);
					onDiagramSelect?.({
						id: isSelected ? e.id : id,
					});
				},
				[onDiagramSelect, id, isSelected],
			);

			// TODO: 精査
			const handleChildDiagramClick = useCallback(
				(e: DiagramSelectEvent) => {
					console.log("Group handleChildDiagramClick", e);
					// onDiagramSelect?.(e);
				},
				[onDiagramSelect],
			);

			const handleChildDiagramChange = useCallback(
				(e: DiagramChangeEvent) => {
					const changeDiagram = items.find((item) => item.id === e.id);
					if (changeDiagram) {
						const dx = e.point.x - changeDiagram.point.x;
						const dy = e.point.y - changeDiagram.point.y;

						// グループ変更中イベントを発火
						handleGroupDiagramChange({
							id,
							point: {
								x: point.x + dx,
								y: point.y + dy,
							},
							width: width,
							height: height,
						});
					}
				},
				[id, point, width, height, items],
			);

			const handleChildDiagramChangeEnd = useCallback(
				(e: DiagramChangeEvent) => {
					const changeDiagram = items.find((item) => item.id === e.id);
					if (changeDiagram) {
						const dx = e.point.x - changeDiagram.point.x;
						const dy = e.point.y - changeDiagram.point.y;

						// グループ変更中イベントを発火
						handleGroupDiagramChangeEnd({
							id,
							point: {
								x: point.x + dx,
								y: point.y + dy,
							},
							width: width,
							height: height,
						});

						// 子図形の変更完了イベントを親へ伝番
						onDiagramChangeEnd?.(e);
					}
				},
				[onDiagramChangeEnd, id, point, width, height, items],
			);

			// TODO: 共通化
			const createDiagram = (item: Diagram): React.ReactNode => {
				const itemType = DiagramTypeComponentMap[item.type];
				const props = {
					...item,
					key: item.id,
					onDiagramClick: handleChildDiagramClick,
					onDiagramChange: handleChildDiagramChange,
					onDiagramChangeEnd: handleChildDiagramChangeEnd,
					onDiagramSelect: handleChildDiagramSelect,
					ref: (r: DiagramRef) => {
						itemsRef.current[item.id] = r;
					},
				};

				return React.createElement(itemType, props);
			};

			// 子図形の作成
			const children = items.map((item) => {
				return createDiagram(item);
			});

			// TODO: 修正
			/**
			 * 親図形のリサイズ中イベントハンドラ
			 *
			 * @param {ParentDiagramResizeEvent} e 親図形のリサイズ中イベント
			 */
			const onParentDiagramResize = useCallback(
				(e: ParentDiagramResizeEvent) => {
					// グループの枠表示用の四角形へ親図形のリサイズ中イベントを伝播
					diagramRef.current.onParentDiagramResize?.(e);

					// 親図形のリサイズ中に伴うこの図形の変更を計算
					const newArrangment = calcArrangmentOnGroupDiagramChange(
						e,
						point,
						width,
						height,
					);

					// 変更中イベント作成
					const event = {
						id,
						oldPoint: point,
						oldWidth: width,
						oldHeight: height,
						newPoint: newArrangment.point,
						newWidth: newArrangment.width,
						newHeight: newArrangment.height,
						scaleX: e.scaleX,
						scaleY: e.scaleY,
					};

					// グループ内の図形にリサイズ中イベントを通知
					for (const item of items) {
						itemsRef.current[item.id]?.onParentDiagramResize?.(event);
					}

					// 親図形のリサイズが契機で、かつDOMを直接更新しての変更なので、親側への変更通知はしない
				},
				[id, point, width, height, items],
			);

			// TODO: 修正
			/**
			 * 親図形のリサイズ完了イベントハンドラ
			 *
			 * @param {ParentDiagramResizeEvent} e 親図形のリサイズ完了イベント
			 */
			const onParentDiagramResizeEnd = useCallback(
				(e: ParentDiagramResizeEvent) => {
					// グループの枠表示用の四角形へ親図形のリサイズ中イベントを伝播
					diagramRef.current.onParentDiagramResizeEnd?.(e);

					// 親図形のリサイズ完了に伴うこの図形の変更を計算
					const newArrangment = calcArrangmentOnGroupDiagramChange(
						e,
						point,
						width,
						height,
					);

					// 変更完了イベント作成
					const event = {
						id,
						oldPoint: point,
						oldWidth: width,
						oldHeight: height,
						newPoint: newArrangment.point,
						newWidth: newArrangment.width,
						newHeight: newArrangment.height,
						scaleX: e.scaleX,
						scaleY: e.scaleY,
					};

					// グループ内の図形にリサイズ完了イベントを通知
					for (const item of items) {
						itemsRef.current[item.id]?.onParentDiagramResizeEnd?.(event);
					}
				},
				[id, point, width, height, items],
			);

			/**
			 * グループの変更中イベントハンドラ
			 *
			 * @param {DiagramChangeEvent} e 短形領域の変更中イベント
			 */
			const handleGroupDiagramChange = useCallback(
				(e: DiagramChangeEvent) => {
					// グループ内の図形への変更中イベント作成
					const event = {
						id,
						oldPoint: point,
						oldWidth: width,
						oldHeight: height,
						newPoint: e.point,
						newWidth: e.width,
						newHeight: e.height,
						scaleX: e.width / width,
						scaleY: e.height / height,
					};
					// グループ内の図形に変更中イベントを通知
					for (const item of items) {
						if (e.id !== item.id) {
							itemsRef.current[item.id]?.onParentDiagramResize?.(event);
						}
					}
				},
				[id, items, point, width, height],
			);

			/**
			 * グループの変更完了イベントハンドラ
			 *
			 * @param {DiagramChangeEvent} e 短形領域の変更完了イベント
			 */
			const handleGroupDiagramChangeEnd = useCallback(
				(e: DiagramChangeEvent) => {
					// グループ内の図形への変更完了イベント作成
					const event = {
						id,
						oldPoint: point,
						oldWidth: width,
						oldHeight: height,
						newPoint: e.point,
						newWidth: e.width,
						newHeight: e.height,
						scaleX: e.width / width,
						scaleY: e.height / height,
					};
					// グループ内の図形に変更完了イベントを通知
					for (const item of items) {
						if (e.id !== item.id) {
							const diagramChangeEndEvent =
								itemsRef.current[item.id]?.onParentDiagramResizeEnd?.(event);
							if (diagramChangeEndEvent) {
								// グループ内の図形の変更完了イベントを親に伝番させて、Propsの更新を親側にしてもらう
								onDiagramChangeEnd?.(diagramChangeEndEvent);
							}
						}
					}

					// グループの枠表示用の四角形の変更完了イベントを親に伝番させて、Propsの更新を親側にしてもらう
					onDiagramChangeEnd?.(e);
				},
				[onDiagramChangeEnd, id, items, point, width, height],
			);

			return (
				<>
					<RectangleBase
						id={id}
						point={point}
						width={width}
						height={height}
						tabIndex={tabIndex}
						keepProportion={keepProportion}
						isSelected={isSelected}
						onDiagramChange={handleGroupDiagramChange}
						onDiagramChangeEnd={handleGroupDiagramChangeEnd}
						ref={diagramRef}
					/>
					{children}
				</>
			);
		},
	),
);

export default Group;
