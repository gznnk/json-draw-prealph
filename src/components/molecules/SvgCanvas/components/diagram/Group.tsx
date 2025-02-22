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
} from "../../types/EventTypes";

// SvgCanvas関連コンポーネントをインポート
import type { RectangleProps } from "./Rectangle";
import Rectangle from "./Rectangle";

// RectangleBase関連関数をインポート
import { calcArrangmentOnParentDiagramResize } from "../core/RectangleBase/RectangleBaseFunctions";

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
				onPointerDown, // TODO: わかりづらい
				onDiagramChangeEnd,
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

			// TODO: 共通化
			const createDiagram = (item: Diagram): React.ReactNode => {
				const itemType = DiagramTypeComponentMap[item.type];
				const props = {
					...item,
					key: item.id,
					onDiagramChangeEnd: onDiagramChangeEnd,
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
					const newArrangment = calcArrangmentOnParentDiagramResize(
						e,
						point,
						width,
						height,
					);

					// 変更中イベント作成
					const event = {
						...newArrangment,
						scaleX: e.scaleX,
						scaleY: e.scaleY,
					};

					// グループ内の図形にリサイズ中イベントを通知
					for (const item of items) {
						itemsRef.current[item.id]?.onParentDiagramResize?.(event);
					}
				},
				[point, width, height, items],
			);

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
					const newArrangment = calcArrangmentOnParentDiagramResize(
						e,
						point,
						width,
						height,
					);

					// 変更完了イベント作成
					const event = {
						...newArrangment,
						scaleX: e.scaleX,
						scaleY: e.scaleY,
					};

					// グループ内の図形にリサイズ完了イベントを通知
					for (const item of items) {
						itemsRef.current[item.id]?.onParentDiagramResizeEnd?.(event);
					}

					// 親図形のリサイズが契機で、かつDOMを直接更新しての変更なので、親側への変更通知はしない
				},
				[point, width, height, items],
			);

			/**
			 * グループの枠表示用の四角形の変更中イベントハンドラ
			 *
			 * @param {DiagramChangeEvent} e 短形領域の変更中イベント
			 */
			const handleDiagramChange = useCallback(
				(e: DiagramChangeEvent) => {
					// グループ内の図形への変更中イベント作成
					const event = {
						point: e.point,
						width: e.width,
						height: e.height,
						scaleX: e.width / width,
						scaleY: e.height / height,
					};
					// グループ内の図形に変更中イベントを通知
					for (const item of items) {
						itemsRef.current[item.id]?.onParentDiagramResize?.(event);
					}
				},
				[items, width, height],
			);

			/**
			 * グループの枠表示用の四角形の変更完了イベントハンドラ
			 *
			 * @param {DiagramChangeEvent} e 短形領域の変更完了イベント
			 */
			const handleDiagramChangeEnd = useCallback(
				(e: DiagramChangeEvent) => {
					// グループ内の図形への変更完了イベント作成
					const event = {
						point: e.point,
						width: e.width,
						height: e.height,
						scaleX: e.width / width,
						scaleY: e.height / height,
					};
					// グループ内の図形に変更完了イベントを通知
					for (const item of items) {
						itemsRef.current[item.id]?.onParentDiagramResizeEnd?.(event);
					}

					// グループの枠表示用の四角形の変更完了イベントを親に伝番させて、Propsの更新を親側にしてもらう
					onDiagramChangeEnd?.(e);
				},
				[onDiagramChangeEnd, items, width, height],
			);

			return (
				<Rectangle
					id={id}
					point={point}
					width={width}
					height={height}
					tabIndex={tabIndex}
					strokeWidth={"0px"}
					keepProportion={keepProportion}
					isSelected={isSelected}
					onPointerDown={onPointerDown}
					onDiagramChange={handleDiagramChange}
					onDiagramChangeEnd={handleDiagramChangeEnd}
					ref={diagramRef}
				>
					{children}
				</Rectangle>
			);
		},
	),
);

export default Group;
