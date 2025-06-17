import type { Bounds } from "../../../types/base/Bounds";
import type { GroupData } from "../../../types/data/shapes/GroupData";
import { degreesToRadians } from "../../math/common/degreesToRadians";
import { nanToZero } from "../../math/common/nanToZero";
import { rotatePoint } from "../../math/points/rotatePoint";
import { calcGroupBoxOfNoRotation } from "./calcGroupBoxOfNoRotation";

export const calcBoundsOfGroup = (group: GroupData): Bounds => {
	const { items, x, y, rotation } = group;
	const radians = degreesToRadians(rotation);
	const box = calcGroupBoxOfNoRotation(items, x, y, rotation);
	const leftTop = rotatePoint(box.left, box.top, x, y, radians);
	const rightBottom = rotatePoint(box.right, box.bottom, x, y, radians);

	return {
		x: leftTop.x + nanToZero(rightBottom.x - leftTop.x) / 2,
		y: leftTop.y + nanToZero(rightBottom.y - leftTop.y) / 2,
		width: box.right - box.left,
		height: box.bottom - box.top,
	};
};
