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
export type DiagramResizeEvent = {
	id: string;
	point: Point;
	width: number;
	height: number;
};

/**
 * グループのドラッグイベント
 */
export type GroupDragEvent = {
	id: string;
	oldPoint: Point;
	newPoint: Point;
};

/**
 * グループのリサイズイベント
 */
export type GroupResizeEvent = {
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

/**
 * 図形のクリックイベント
 */
export type DiagramClickEvent = {
	id: string;
	point: Point;
	reactEvent?: React.PointerEvent<SVGElement>;
};

/**
 * 図形の選択イベント
 */
export type DiagramSelectEvent = {
	id: string;
};

// TODO: 廃止予定
export type ItemSelectEvent = {
	id: string;
};
