import { memo, type ReactElement } from "react";

import { StyledCircle } from "./ProcessIndicatorStyled";
import type {
	ProcessItem,
	ProcessStatus,
} from "../../../types/core/ProcessItem";
import { degreesToRadians } from "../../../utils/math/common/degreesToRadians";
import { rotatePoint } from "../../../utils/math/points/rotatePoint";

type ProcessIndicatorProps = {
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
	processes: ProcessItem[];
};

const getStatusColor = (status: ProcessStatus): string => {
	switch (status) {
		case "processing":
			return "#fbbf24";
		case "success":
			return "#4ade80";
		case "failed":
			return "#f87171";
		default:
			return "#9ca3af";
	}
};

const calculatePositions = (
	centerX: number,
	centerY: number,
	width: number,
	height: number,
	rotation: number,
	count: number,
): Array<{ x: number; y: number }> => {
	if (count === 0) return [];

	const positions: Array<{ x: number; y: number }> = [];
	const radius = 8; // アイコンの半径
	const padding = 4; // ノードとアイコンの間の余白

	// ノードの境界を計算
	const halfWidth = width / 2;
	const halfHeight = height / 2;
	const left = centerX - halfWidth;
	const right = centerX + halfWidth;
	const top = centerY - halfHeight;
	const bottom = centerY + halfHeight;

	// 境界からの距離を計算
	const outerLeft = left - padding - radius;
	const outerRight = right + padding + radius;
	const outerTop = top - padding - radius;
	const outerBottom = bottom + padding + radius;

	// 時計回りに配置する順序で境界の長さを計算
	const topLength = outerRight - outerLeft;
	const rightLength = outerBottom - outerTop;
	const bottomLength = outerRight - outerLeft;
	const leftLength = outerBottom - outerTop;
	const totalLength = topLength + rightLength + bottomLength + leftLength;

	// 各アイコンの間隔を計算
	const spacing = totalLength / count;

	for (let i = 0; i < count; i++) {
		const distance = i * spacing;
		let x: number, y: number;

		if (distance <= topLength) {
			// 上辺
			x = outerLeft + distance;
			y = outerTop;
		} else if (distance <= topLength + rightLength) {
			// 右辺
			x = outerRight;
			y = outerTop + (distance - topLength);
		} else if (distance <= topLength + rightLength + bottomLength) {
			// 下辺
			x = outerRight - (distance - topLength - rightLength);
			y = outerBottom;
		} else {
			// 左辺
			x = outerLeft;
			y = outerBottom - (distance - topLength - rightLength - bottomLength);
		}

		// Apply rotation around the center point
		const rotated = rotatePoint(x, y, centerX, centerY, degreesToRadians(rotation));
		positions.push(rotated);
	}

	return positions;
};

const ProcessIndicatorComponent = ({
	x,
	y,
	width,
	height,
	rotation,
	processes,
}: ProcessIndicatorProps): ReactElement => {
	const positions = calculatePositions(
		x,
		y,
		width,
		height,
		rotation,
		processes.length,
	);

	return (
		<g>
			{processes.map((process, index) => {
				const position = positions[index];
				if (!position) return null;

				return (
					<StyledCircle
						key={process.id}
						cx={position.x}
						cy={position.y}
						r={8}
						statusColor={getStatusColor(process.status)}
					/>
				);
			})}
		</g>
	);
};

export const ProcessIndicator = memo(ProcessIndicatorComponent);
