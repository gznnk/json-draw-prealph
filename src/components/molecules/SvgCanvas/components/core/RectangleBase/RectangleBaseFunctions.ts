// RectangleBase関連関数定義ファイル

import type { ParentDiagramResizeEvent } from "../../../types/EventTypes";
import type { Point } from "../../../types/CoordinateTypes";
import type { RectangleBaseArrangement } from "./RectangleBaseTypes";

/**
 * 与えられた2つの点（pointとdiagonalPoint）から矩形の配置情報を計算します。
 *
 * @param point - 矩形の一つの頂点を表す点
 * @param diagonalPoint - 矩形の対角線上のもう一つの頂点を表す点
 * @returns 矩形の配置情報を含むオブジェクト
 */
export const calcArrangment = (
	point: Point,
	diagonalPoint: Point,
): RectangleBaseArrangement => {
	const top = Math.round(Math.min(point.y, diagonalPoint.y));
	const bottom = Math.round(Math.max(point.y, diagonalPoint.y));
	const left = Math.round(Math.min(point.x, diagonalPoint.x));
	const right = Math.round(Math.max(point.x, diagonalPoint.x));

	const leftTopPoint = {
		x: left,
		y: top,
	};

	const newWidth = right - left;
	const newHeight = bottom - top;

	const result: RectangleBaseArrangement = {
		point: leftTopPoint,
		width: newWidth,
		height: newHeight,
		leftTopPoint,
		leftBottomPoint: {
			x: left,
			y: bottom,
		},
		rightTopPoint: {
			x: right,
			y: top,
		},
		rightBottomPoint: {
			x: right,
			y: bottom,
		},
		topCenterPoint: {
			x: left + newWidth / 2,
			y: top,
		},
		leftCenterPoint: {
			x: left,
			y: top + newHeight / 2,
		},
		rightCenterPoint: {
			x: right,
			y: top + newHeight / 2,
		},
		bottomCenterPoint: {
			x: left + newWidth / 2,
			y: bottom,
		},
	};

	return result;
};

/**
 * 与えられた2つの点（pointとdiagonalPoint）から矩形の配置情報を計算します。
 * 親図形のリサイズ時に使用します。
 *
 * @param e - 親図形のリサイズイベント
 * @param point - 矩形の一つの頂点を表す点
 * @param width - 矩形の幅
 * @param height - 矩形の高さ
 * @returns 矩形の配置情報を含むオブジェクト
 */
export const calcArrangmentOnParentDiagramResize = (
	e: ParentDiagramResizeEvent,
	point: Point,
	width: number,
	height: number,
) => {
	const newX = Math.round(point.x * e.scaleX);
	const newY = Math.round(point.y * e.scaleY);

	let newWidth = Math.round(width * e.scaleX);
	let newHeight = Math.round(height * e.scaleY);
	if (newX + newWidth > e.width) {
		newWidth = e.width - newX;
	}
	if (newY + newHeight > e.height) {
		newHeight = e.height - newY;
	}
	return {
		point: { x: newX, y: newY },
		width: newWidth,
		height: newHeight,
	};
};

/**
 * 2点間の直線の方程式を基に、Y座標からX座標を計算する関数を生成します。
 *
 * @param p1 - 直線上の最初の点
 * @param p2 - 直線上の2番目の点
 * @returns Y座標を入力としてX座標を計算する関数
 */
export const createLinerDragY2xFunction = (p1: Point, p2: Point) => {
	const a = (p2.y - p1.y) / (p2.x - p1.x);
	const b = p1.y - a * p1.x;

	return (p: Point) => {
		return {
			x: (p.y - b) / a,
			y: p.y,
		};
	};
};

/**
 * 2点間の直線の方程式を基に、X座標からY座標を計算する関数を生成します。
 *
 * @param p1 - 直線上の最初の点
 * @param p2 - 直線上の2番目の点
 * @returns X座標を入力としてY座標を計算する関数
 */
export const createLinerDragX2yFunction = (p1: Point, p2: Point) => {
	const a = (p2.y - p1.y) / (p2.x - p1.x);
	const b = p1.y - a * p1.x;

	return (p: Point) => {
		return {
			x: p.x,
			y: a * p.x + b,
		};
	};
};
