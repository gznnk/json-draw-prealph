// 座標系に関する型定義

/**
 * 座標（x,y）の型定義
 */
export type Point = {
	x: number;
	y: number;
};

// TODO: いらない？
/**
 * ドラッグ方向の型定義
 */
export enum DragDirection {
	All = "all",
	Horizontal = "horizontal",
	Vertical = "vertical",
}

/**
 * 矩形の頂点の型定義
 */
export type RectangleVertices = {
	leftTopPoint: Point;
	leftBottomPoint: Point;
	rightTopPoint: Point;
	rightBottomPoint: Point;
	topCenterPoint: Point;
	leftCenterPoint: Point;
	rightCenterPoint: Point;
	bottomCenterPoint: Point;
};
