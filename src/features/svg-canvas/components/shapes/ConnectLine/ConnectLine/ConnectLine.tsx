// Import React.
import type React from "react";
import { memo, useCallback, useContext, useEffect, useRef } from "react";

// Import types.
import type { Diagram } from "../../../../types/data/catalog/Diagram";
import type { ConnectLineProps } from "../../../../types/props/shapes/ConnectLineProps";
import type { ConnectPointMoveData } from "../../../../types/events/ConnectPointMoveData";
import type { ConnectPointsMoveEvent } from "../../../../types/events/ConnectPointsMoveEvent";
import type { DiagramChangeEvent } from "../../../../types/events/DiagramChangeEvent";
import type { Shape } from "../../../../types/base/Shape";

// Import components related to SvgCanvas.
import { createBestConnectPath } from "../../../../utils/shapes/connectPoint/createBestConnectPath";
import { Path } from "../../Path";

// Import utils.
import { calcRadians } from "../../../../utils/math/points/calcRadians";
import { newId } from "../../../../utils/shapes/common/newId";
import { radiansToDegrees } from "../../../../utils/math/common/radiansToDegrees";

// Imports related to this component.
import { EVENT_NAME_CONNECT_POINTS_MOVE } from "../../../../constants/EventNames";

// Import SvgCanvas context.
import { SvgCanvasContext } from "../../../../canvas/SvgCanvasContext";

/**
 * ConnectLine component.
 */
const ConnectLineComponent: React.FC<ConnectLineProps> = ({
	id,
	x,
	y,
	width,
	height,
	rotation,
	scaleX,
	scaleY,
	stroke = "black",
	strokeWidth = "1px",
	isSelected = false,
	items = [],
	startOwnerId,
	endOwnerId,
	autoRouting,
	startArrowHead,
	endArrowHead,
	onClick,
	onSelect,
	onDiagramChange,
}) => {
	// Items of ConnectLine component at the start of the change event.
	const startItems = useRef<Diagram[]>([]);
	// Is the line only vertical or horizontal.
	const isVerticalHorizontalLines = useRef<boolean>(true);
	// SvgCanvas state provider.
	const canvasStateProvider = useContext(SvgCanvasContext);

	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		id,
		items,
		startOwnerId,
		endOwnerId,
		autoRouting,
		onDiagramChange,
		canvasStateProvider,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	// Register handler for ConnectPoint components move event.
	useEffect(() => {
		const handleConnectPointsMove = (e: Event) => {
			// Bypass references to avoid function creation in every render.
			const {
				id,
				items,
				startOwnerId,
				endOwnerId,
				autoRouting,
				onDiagramChange,
				canvasStateProvider,
			} = refBus.current;

			const event = (e as CustomEvent<ConnectPointsMoveEvent>).detail;

			// Find point data in the event that this ConnectLine component owns.
			const movedPoint = event.points.find((p) =>
				items.some((item) => item.id === p.id),
			);
			if (!movedPoint) {
				// Ignore unrelated ConnectPoint components move events.
				return;
			}

			if (event.eventType === "Start") {
				// 移動開始時のitemsを保持
				startItems.current = items;

				// 垂直と水平の線�EみかどぁE��を判宁E
				isVerticalHorizontalLines.current = items.every((item, idx) => {
					if (idx === 0) {
						return true;
					}

					const prev = items[idx - 1];
					const degrees = radiansToDegrees(
						calcRadians(prev.x, prev.y, item.x, item.y),
					);
					return degrees % 90 === 0;
				});
			}

			// 移動中と移動終亁E��の処琁E
			if (startItems.current.length === 0) {
				// 移動開始時のitemsがなぁE��合�E何もしなぁE
				// フェイルセーフ�E処琁E��、ここにくる場合�Eバグ
				console.error("Illegal state: startItems is empty.");
				return;
			}

			const _startItems = startItems.current;
			const _isVerticalHorizontalLines = isVerticalHorizontalLines.current;
			const movedPointIdx = _startItems.findIndex(
				(item) => item.id === movedPoint.id,
			);

			// 動いた接続�Eイント�E反対側の点を取征E
			const oppositeItem =
				movedPointIdx === 0
					? _startItems[_startItems.length - 1]
					: _startItems[0];
			let oppositePoint = {
				x: oppositeItem.x,
				y: oppositeItem.y,
			};

			// 反対側の点も動ぁE��ぁE��かどぁE��を確誁E
			const movedOppositPoint = event.points.find(
				(p) => p.id === oppositeItem.id,
			);

			if (!autoRouting) {
				// 自動ルーチE��ング無効晁E

				// 移動後�Eポイント作�E関数
				const createNewPoint = (
					movedBothEndsPoint: ConnectPointMoveData,
					oldPoint: Diagram,
					idx: number,
				) => {
					// 接続�Eイント�E移動にあわせて末端の点も移勁E
					if (oldPoint.id === movedBothEndsPoint.id) {
						return {
							...oldPoint,
							x: movedBothEndsPoint.x,
							y: movedBothEndsPoint.y,
						};
					}

					// 移動した点の隣の点かどぁE�� TODO: 反対の点の時�E判定がぁE��くいかん
					const movedBothEndsPointIdx = _startItems.findIndex(
						(item) => item.id === movedBothEndsPoint.id,
					);
					const isNextPoint =
						(movedBothEndsPointIdx === 0 && idx === 1) ||
						(movedBothEndsPointIdx === _startItems.length - 1 &&
							idx === _startItems.length - 2);

					if (isNextPoint) {
						// 接続線が垂直と水平の線�EみでなぁE��合�E、E��番目の点はそ�Eまま
						if (!_isVerticalHorizontalLines) {
							return oldPoint;
						}

						// 接続線が垂直と水平の線�Eみは、それが維持されるよう�E�番目の点も移動すめE

						// 移動量を計箁E
						const movedPointOldData = _startItems[movedBothEndsPointIdx];
						const dx = movedBothEndsPoint.x - movedPointOldData.x;
						const dy = movedBothEndsPoint.y - movedPointOldData.y;

						// �E�点間�E角度を計箁E
						const direction = calcRadians(
							movedPointOldData.x,
							movedPointOldData.y,
							oldPoint.x,
							oldPoint.y,
						);
						const degrees = radiansToDegrees(direction);
						const isVertical = (degrees + 405) % 180 > 90;

						// �E�点間�E線が水平であればx座標�Eみ、垂直であればy座標�Eみ移勁E
						return {
							...oldPoint,
							x: !isVertical ? oldPoint.x + dx : oldPoint.x,
							y: isVertical ? oldPoint.y + dy : oldPoint.y,
						};
					}

					return oldPoint;
				};

				const newItems = _startItems.map((item, idx) => {
					const newPoint = createNewPoint(movedPoint, item, idx);
					if (newPoint !== item) {
						return newPoint;
					}
					if (movedOppositPoint) {
						return createNewPoint(movedOppositPoint, item, idx);
					}
					return item;
				}) as Diagram[];

				// 接続線�E変更イベントを発火
				onDiagramChange?.({
					eventId: event.eventId,
					eventType: event.eventType,
					changeType: "Transform",
					id,
					startDiagram: {
						items: _startItems,
					},
					endDiagram: {
						items: newItems,
					},
				});
			} else {
				// 自動ルーチE��ング有効時�E、最適な接続線を再計箁E

				if (movedOppositPoint) {
					// 反対側の点が動ぁE��ぁE��場合�E、その座標を利用
					oppositePoint = movedOppositPoint;
				}

				// 反対側の図形の惁E��を取征E
				let oppositeOwnerShape: Shape;
				if (movedOppositPoint) {
					oppositeOwnerShape = movedOppositPoint.ownerShape;
				} else {
					// 反対側の図形が動ぁE��ぁE��ぁE��合�EcanvasStateProviderから惁E��を取得（１フレーム前�E惁E��しか取れなぁE��、接続�Eの図形に移動�EなぁE��合なので問題なぁE��E
					oppositeOwnerShape = canvasStateProvider?.getDiagramById(
						movedPoint.ownerId === startOwnerId ? endOwnerId : startOwnerId,
					) as Shape;
				}

				// 最適な接続線を再計箁E
				const newPath = createBestConnectPath(
					movedPoint.x,
					movedPoint.y,
					movedPoint.ownerShape,
					oppositePoint.x,
					oppositePoint.y,
					oppositeOwnerShape,
				);

				// 接続線�E点のチE�Eタを作�E
				const newItems = (
					movedPointIdx === 0 ? newPath : newPath.reverse()
				).map((p, idx) => ({
					id: event.eventType === "End" ? newId() : `${id}-${idx}`,
					name: `cp-${idx}`,
					type: "PathPoint",
					x: p.x,
					y: p.y,
				})) as Diagram[];
				// 両端の点のIDは維持すめE
				newItems[0].id = _startItems[0].id;
				newItems[newItems.length - 1].id =
					_startItems[_startItems.length - 1].id;

				// 接続線�E変更イベントを発火
				onDiagramChange?.({
					eventId: event.eventId,
					eventType: event.eventType,
					changeType: "Transform",
					id,
					startDiagram: {
						items: _startItems,
					},
					endDiagram: {
						items: newItems,
					},
				});

				if (event.eventType === "End") {
					startItems.current = [];
				}
			}
		};
		document.addEventListener(
			EVENT_NAME_CONNECT_POINTS_MOVE,
			handleConnectPointsMove,
		);

		return () => {
			document.removeEventListener(
				EVENT_NAME_CONNECT_POINTS_MOVE,
				handleConnectPointsMove,
			);
		};
	}, []);

	/**
	 * Handle Path component change event.
	 */
	const handlePathChange = useCallback((e: DiagramChangeEvent) => {
		refBus.current.onDiagramChange?.({
			...e,
			endDiagram: {
				...e.endDiagram,
				autoRouting: false,
			},
		});
	}, []);

	return (
		<Path
			id={id}
			x={x}
			y={y}
			width={width}
			height={height}
			rotation={rotation}
			scaleX={scaleX}
			scaleY={scaleY}
			keepProportion={false}
			stroke={stroke}
			strokeWidth={strokeWidth}
			isSelected={isSelected}
			isMultiSelectSource={false}
			dragEnabled={false}
			transformEnabled={false}
			segmentDragEnabled={true}
			rightAngleSegmentDrag={true}
			newVertexEnabled={true}
			fixBothEnds={true}
			startArrowHead={startArrowHead}
			endArrowHead={endArrowHead}
			items={items}
			onClick={onClick}
			onSelect={onSelect}
			onDiagramChange={handlePathChange}
		/>
	);
};

export const ConnectLine = memo(ConnectLineComponent);
