import type { Point } from "../types/CoordinateTypes";

/**
 * 指定されたパラメータからSVGのtransform属性を作成する
 *
 * @param {number} sx - x方向の拡大縮小率
 * @param {number} sy - y方向の拡大縮小率
 * @param {number} theta - 回転角度（ラジアン）
 * @param {number} tx - x方向の平行移動量
 * @param {number} ty - y方向の平行移動量
 * @returns {string} SVGのtransform属性
 */
export const createSvgTransform = (
	sx: number,
	sy: number,
	theta: number,
	tx: number,
	ty: number,
): string => {
	const cosTheta = Math.cos(theta);
	const sinTheta = Math.sin(theta);

	const a = sx * cosTheta;
	const b = sx * sinTheta;
	const c = -sy * sinTheta;
	const d = sy * cosTheta;
	const e = tx;
	const f = ty;

	return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
};

export const drawPoint = (id: string, point: Point, color = "red") => {
	const svg = document.getElementsByTagName("svg")[0];
	const elm = svg.getElementById(id);
	if (elm) {
		elm.setAttribute("cx", point.x.toString());
		elm.setAttribute("cy", point.y.toString());
	} else {
		const circle = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"circle",
		);
		circle.setAttribute("id", id);
		circle.setAttribute("cx", point.x.toString());
		circle.setAttribute("cy", point.y.toString());
		circle.setAttribute("r", "5");
		circle.setAttribute("fill", color);
		circle.setAttribute("pointer-events", "none");
		svg.appendChild(circle);
	}
};

export const drawRect = (
	id: string,
	p1: Point,
	p2: Point,
	p3: Point,
	p4: Point,
	color = "red",
) => {
	const svg = document.getElementsByTagName("svg")[0];
	const elm = svg.getElementById(id);
	if (elm) {
		elm.setAttribute(
			"points",
			`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`,
		);
	} else {
		const polygon = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"polygon",
		);
		polygon.setAttribute("id", id);
		polygon.setAttribute(
			"points",
			`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`,
		);
		polygon.setAttribute("stroke", color);
		polygon.setAttribute("fill", "transparent");
		polygon.setAttribute("pointer-events", "none");
		svg.appendChild(polygon);
	}
};
