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
			return "#06b6d4";
		case "success":
			return "#3b82f6";
		case "failed":
			return "#ef4444";
		default:
			return "transparent";
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
	const padding = 6; // ノードとアイコンの間の余白
	const iconSpacing = radius * 2 + 4; // アイコン間の間隔

	// 下辺に左側から順番に配置（幅を超える分は非表示）
	const maxCount = Math.floor((width - iconSpacing) / iconSpacing) + 1;
	const visibleCount = Math.min(count, maxCount);

	for (let i = 0; i < visibleCount; i++) {
		const x = centerX - width / 2 + iconSpacing / 2 + i * iconSpacing;
		const y = centerY + height / 2 + padding + radius;

		const rotated = rotatePoint(
			x,
			y,
			centerX,
			centerY,
			degreesToRadians(rotation),
		);
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
						isProcessing={process.status === "processing"}
						isDisappearing={process.status !== "processing"}
					/>
				);
			})}
		</g>
	);
};

export const ProcessIndicator = memo(ProcessIndicatorComponent);
