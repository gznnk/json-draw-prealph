// イベント型定義

import type { Point } from "./CoordinateTypes";

/**
 * 図形のポインターダウンイベント
 */
export type DiagramPointerEvent = {
	id: string;
	point: Point;
	reactEvent?: React.PointerEvent<SVGElement>;
};

/**
 * 図形のドラッグイベント
 */
export type DiagramDragEvent = {
	id: string;
	point: Point;
	reactEvent?: React.PointerEvent<SVGElement>;
};

/**
 * 図形の変更イベント
 */
export type DiagramChangeEvent = {
	id: string;
	point: Point;
	width: number;
	height: number;
};

/**
 * 親図形のリサイズイベント
 */
export type ParentDiagramResizeEvent = {
	id: string;
	oldPoint: Point;
	oldWidth: number;
	oldHeight: number;
	newPoint: Point;
	newWidth: number;
	newHeight: number;
	scaleX: number;
	scaleY: number;
};

// TODO: 廃止予定
export type ItemSelectEvent = {
	id: string;
};

export type DiagramSelectEvent = {
	id: string;
};
