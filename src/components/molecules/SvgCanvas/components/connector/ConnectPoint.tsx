// Reactのインポート
import type React from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

// SvgCanvas関連型定義をインポート
import type { Point } from "../../types/CoordinateTypes";
import type {
	ConnectPointData,
	Diagram,
	PathPointData,
	Shape,
} from "../../types/DiagramTypes";
import type {
	DiagramConnectEvent,
	DiagramDragDropEvent,
	DiagramDragEvent,
	DiagramHoverEvent,
} from "../../types/EventTypes";

// SvgCanvas関連コンポーネントをインポート
import DragPoint from "../core/DragPoint";
import Path from "../diagram/Path";

// SvgCanvas関連関数をインポート
import {
	calcRectangleOuterBox,
	closer,
	isPointInShape,
	signNonZero,
	calcRadian,
	radiansToDegrees,
	degreesToRadians,
	boolSign,
} from "../../functions/Math";

import { drawPoint, drawRect } from "../../functions/Diagram";

const CONNECT_LINE_MARGIN = 20;

const createPathPointId = (id: string, index: number) => `${id}-pp-${index}`;

const createPathPointData = (id: string, point: Point): PathPointData => ({
	id,
	point,
	isSelected: false,
});

type Direction = "up" | "down" | "left" | "right";

const getDirection = (radians: number): Direction => {
	const degrees = Math.round(radiansToDegrees(radians));
	if (degrees <= 45 || 315 <= degrees) {
		return "up";
	}
	if (45 < degrees && degrees < 135) {
		return "right";
	}
	if (135 <= degrees && degrees <= 225) {
		return "down";
	}
	return "left";
};

const getDirectionFromPoint = (o: Point, p: Point): Direction => {
	return getDirection(calcRadian(o, p));
};

type ConnectionEvent = {
	id: string;
	type: "connecting" | "connect" | "disconnect";
	point: Point;
	ownerShape: Shape;
};

type ConnectingPoint = {
	id: string;
	point: Point;
	ownerShape: Shape;
};

type ConnectPointProps = ConnectPointData & {
	ownerShape: Shape;
	visible: boolean;
	onConnect?: (e: DiagramConnectEvent) => void;
};

const ConnectPoint: React.FC<ConnectPointProps> = ({
	id,
	point,
	ownerShape,
	visible,
	onConnect,
}) => {
	// console.log("ConnectPoint rendered")
	// ホバー状態の管理
	const [isHovered, setIsHovered] = useState(false);
	// ドラッグ状態の管理
	const [isDragging, setIsDragging] = useState(false);
	// 接続中のポイント
	const connectingPoint = useRef<ConnectingPoint | undefined>(undefined);

	// パスポイントのID
	const pathPointIds = useMemo(
		() => ({
			p1: createPathPointId(id, 1),
			p2: createPathPointId(id, 2),
			p3: createPathPointId(id, 3),
			p4: createPathPointId(id, 4),
			p5: createPathPointId(id, 5),
			p6: createPathPointId(id, 6),
		}),
		[id],
	);

	const [pathPoints, setPathPoints] = useState<PathPointData[]>([]);

	const ownerOuterBox = calcRectangleOuterBox(ownerShape);

	const direction = getDirectionFromPoint(ownerShape.point, point);
	const isUpDown = direction === "up" || direction === "down";

	const calcPathPoints = useCallback(
		(dragPoint: Point) => {
			const newPoints: PathPointData[] = [];

			// 接続中のポイントがある場合は、そのポイントを終点とする
			// ない場合は、ドラッグ中のポイントを終点とする
			const endPoint = connectingPoint.current
				? connectingPoint.current.point
				: dragPoint;

			if (point.x === endPoint.x || point.y === endPoint.y) {
				// 直線の場合は、p1とp2の2点で描画
				newPoints.push(createPathPointData(pathPointIds.p1, point));
				newPoints.push(createPathPointData(pathPointIds.p2, endPoint));
			} else {
				// 直線でない場合、階段状の線を引く

				// p1
				newPoints.push(createPathPointData(pathPointIds.p1, point));

				// p2
				const p2 = {
					x: isUpDown ? point.x : (point.x + endPoint.x) / 2,
					y: isUpDown ? (point.y + endPoint.y) / 2 : point.y,
				};
				// p1-p2間の線が図形を横断してないかチェック
				const p2AcrossShape = getDirectionFromPoint(point, p2) !== direction;
				if (p2AcrossShape) {
					// 横断している場合は、p2を反対方向に移動
					if (isUpDown) {
						if (direction === "up") {
							p2.y = ownerOuterBox.top - CONNECT_LINE_MARGIN;
						} else {
							p2.y = ownerOuterBox.bottom + CONNECT_LINE_MARGIN;
						}
					} else {
						if (direction === "right") {
							p2.x = ownerOuterBox.right + CONNECT_LINE_MARGIN;
						} else {
							p2.x = ownerOuterBox.left - CONNECT_LINE_MARGIN;
						}
					}
				}
				newPoints.push(createPathPointData(pathPointIds.p2, p2));

				// p3
				newPoints.push(
					createPathPointData(pathPointIds.p3, {
						x: isUpDown ? endPoint.x : p2.x,
						y: isUpDown ? p2.y : endPoint.y,
					}),
				);

				// p4
				newPoints.push(createPathPointData(pathPointIds.p4, endPoint));

				// drawPoint(`${pathPointIds.p1}-point`, {
				// 	x: newPoints[1].point.x,
				// 	y: point.y + signNonZero(newPoints[1].point.y - point.y) * 2,
				// });

				// 接続中の図形がある場合
				if (connectingPoint.current?.ownerShape) {
					// 接続の方向が一致しているかチェック
					const endDirection = getDirectionFromPoint(
						connectingPoint.current?.ownerShape.point,
						connectingPoint.current?.point,
					);
					const connectDirection = getDirectionFromPoint(
						connectingPoint.current?.point,
						pathPoints[pathPoints.length - 2].point,
					);

					// TODO こっから
					const p3AcrossShape = endDirection !== connectDirection;
					if (p3AcrossShape) {
						// 横断している場合は、p3を反対方向に移動
						const p3y =
							endPoint.y - signNonZero(newPoints[2].point.y - endPoint.y) * 20;
						newPoints[2].point.y = p3y;

						if (!p2AcrossShape) {
							// p2が横断していなかった場合は、p2のy位置をp3と同じにする
							newPoints[1].point.y = p3y;
						} else {
							// p2, p3がどちらも横断していた場合は、ジグザグ状に変形する
							const ownerBox = calcRectangleOuterBox(ownerShape);
							const connectingPointOwnerBox = calcRectangleOuterBox(
								connectingPoint.current.ownerShape,
							);

							const startSide = closer(
								endPoint.x,
								ownerBox.left,
								ownerBox.right,
							);
							const endSide = closer(
								newPoints[0].point.x,
								connectingPointOwnerBox.left,
								connectingPointOwnerBox.right,
							);

							const x = Math.round((startSide + endSide) / 2);
							newPoints.splice(2, 0, {
								id: pathPointIds.p5,
								point: {
									x: x,
									y: newPoints[1].point.y,
								},
								isSelected: false,
							});
							newPoints.splice(3, 0, {
								id: pathPointIds.p6,
								point: {
									x: x,
									y: newPoints[3].point.y,
								},
								isSelected: false,
							});
						}
					}
				}
			}

			return newPoints;
		},
		[point, ownerShape, ownerOuterBox, direction, isUpDown, pathPointIds],
	);

	const handleDragStart = useCallback((_e: DiagramDragEvent) => {
		setIsDragging(true);
	}, []);

	const handleDrag = useCallback(
		(e: DiagramDragEvent) => {
			if (connectingPoint.current) {
				return;
			}
			setPathPoints(calcPathPoints(e.endPoint));
		},
		[calcPathPoints],
	);

	const handleDragEnd = useCallback(
		(_e: DiagramDragEvent) => {
			setPathPoints((prevState) =>
				prevState.map((item) => ({
					...item,
					point: point,
				})),
			);
			setIsDragging(false);
		},
		[point],
	);

	const handleDragOver = useCallback(
		(e: DiagramDragDropEvent) => {
			if (e.dropItem.type === "ConnectPoint") {
				setIsHovered(true);
				// 接続中の処理
				document.dispatchEvent(
					new CustomEvent("Connection", {
						detail: { id, type: "connecting", point, ownerShape },
					}),
				);
			}
		},
		[id, point, ownerShape],
	);

	const handleDragLeave = useCallback(
		(e: DiagramDragDropEvent) => {
			setIsHovered(false);
			// 接続が切れた時の処理
			if (e.dropItem.type === "ConnectPoint") {
				// 接続元に情報を送信
				document.dispatchEvent(
					new CustomEvent("Connection", {
						detail: { id, type: "disconnect", point },
					}),
				);
			}
		},
		[id, point],
	);

	const handleDrop = useCallback(
		(e: DiagramDragDropEvent) => {
			// ドロップされたときの処理
			if (e.dropItem.type === "ConnectPoint") {
				// 接続元に情報を送信
				document.dispatchEvent(
					new CustomEvent("Connection", {
						detail: { id, type: "connect", point, ownerShape },
					}),
				);
			}
			setIsHovered(false);
		},
		[id, point, ownerShape],
	);

	/**
	 * ホバー状態変更イベントハンドラ
	 *
	 * @param {DiagramHoverEvent} e ホバー状態変更イベント
	 * @returns {void}
	 */
	const handleHoverChange = useCallback((e: DiagramHoverEvent) => {
		setIsHovered(e.isHovered);
	}, []);

	// 接続イベントのリスナー登録
	useEffect(() => {
		let handleConnection: (e: Event) => void;
		if (isDragging) {
			handleConnection = (e: Event) => {
				const customEvent = e as CustomEvent<ConnectionEvent>;
				if (customEvent.detail.id !== id) {
					if (customEvent.detail.type === "connecting") {
						// 接続が始まった時の処理
						// 接続中のポイントを保持
						connectingPoint.current = {
							...customEvent.detail,
						};

						// 接続中のポイントと線がつながるよう、パスポイントを再計算
						setPathPoints(calcPathPoints(customEvent.detail.point));
					}

					if (customEvent.detail.type === "disconnect") {
						// 切断時の処理
						// 接続中のポイントを解除
						connectingPoint.current = undefined;
					}

					if (customEvent.detail.type === "connect") {
						// 接続完了時の処理
						// 接続ラインのデータを生成してイベント発火
						const points: PathPointData[] = [];
						points.push({
							id,
							point,
							isSelected: false,
						});
						for (let i = 1; i < pathPoints.length - 1; i++) {
							points.push({
								id: pathPoints[i].id,
								point: pathPoints[i].point,
								isSelected: false,
							});
						}
						points.push({
							id: customEvent.detail.id,
							point: customEvent.detail.point,
							isSelected: false,
						});

						onConnect?.({
							points,
						});
					}
				}
			};

			document.addEventListener("Connection", handleConnection);
		}

		return () => {
			if (handleConnection) {
				document.removeEventListener("Connection", handleConnection);
			}
		};
	}, [onConnect, id, point, isDragging, pathPoints, calcPathPoints]);

	return (
		<>
			<DragPoint
				id={id}
				point={point}
				type="ConnectPoint"
				radius={6}
				color="rgba(255, 204, 0, 0.8)"
				visible={visible || isHovered}
				onDragStart={handleDragStart}
				onDrag={handleDrag}
				onDragEnd={handleDragEnd}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onHoverChange={handleHoverChange}
			/>
			{isDragging && (
				<Path
					id={`${id}-path`}
					point={{ x: 0, y: 0 }}
					width={0}
					height={0}
					rotation={0}
					scaleX={1}
					scaleY={1}
					fill="none"
					stroke="black"
					strokeWidth="1px"
					keepProportion={false}
					isSelected={false}
					items={pathPoints as Diagram[]}
				/>
			)}
		</>
	);
};

export default memo(ConnectPoint);
