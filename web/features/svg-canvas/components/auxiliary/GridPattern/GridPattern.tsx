import { memo, useMemo } from "react";

type GridPatternProps = {
	zoom: number;
	baseGridSize?: number;
	color?: string;
};

/**
 * SVG grid pattern component with adaptive multi-level grid system.
 * Similar to Miro, it shows:
 * - Medium grid lines at 20px intervals
 * - Bold grid lines at 100px intervals (5 x 20px)
 *
 * The grid adapts to zoom level, with medium lines becoming bold lines as you zoom out.
 */
const GridPatternComponent = ({
	zoom,
	baseGridSize = 20,
	color = "#f3f4f6",
}: GridPatternProps): React.JSX.Element => {
	const gridConfig = useMemo(() => {
		// Fixed grid sizes in world coordinates
		// These don't change - only zoom changes how they appear on screen
		const baseLevel = Math.floor(Math.log(zoom) / Math.log(5));
		const scaleFactor = 5 ** baseLevel;

		const mediumGrid = baseGridSize / scaleFactor; // 20px at zoom=1
		const boldGrid = (baseGridSize * 5) / scaleFactor; // 100px at zoom=1

		// Stroke widths in world coordinates (will be scaled by zoom)
		// These values are divided by zoom to maintain consistent screen size
		const mediumStrokeWidth = 1 / zoom;
		const boldStrokeWidth = 2 / zoom;

		return {
			mediumGrid,
			boldGrid,
			mediumStrokeWidth,
			boldStrokeWidth,
		};
	}, [zoom, baseGridSize]);

	return (
		<defs>
			{/* Medium grid pattern (20px) */}
			<pattern
				id="grid-medium"
				width={gridConfig.mediumGrid}
				height={gridConfig.mediumGrid}
				patternUnits="userSpaceOnUse"
			>
				<path
					d={`M ${gridConfig.mediumGrid} 0 L 0 0 0 ${gridConfig.mediumGrid}`}
					fill="none"
					stroke={color}
					strokeWidth={gridConfig.mediumStrokeWidth}
				/>
			</pattern>

			{/* Bold grid pattern (100px) */}
			<pattern
				id="grid-bold"
				width={gridConfig.boldGrid}
				height={gridConfig.boldGrid}
				patternUnits="userSpaceOnUse"
			>
				<path
					d={`M ${gridConfig.boldGrid} 0 L 0 0 0 ${gridConfig.boldGrid}`}
					fill="none"
					stroke={color}
					strokeWidth={gridConfig.boldStrokeWidth}
				/>
			</pattern>

			{/* Combined grid pattern */}
			<pattern
				id="grid"
				width={gridConfig.boldGrid}
				height={gridConfig.boldGrid}
				patternUnits="userSpaceOnUse"
			>
				<rect
					width={gridConfig.boldGrid}
					height={gridConfig.boldGrid}
					fill="url(#grid-medium)"
				/>
				<rect
					width={gridConfig.boldGrid}
					height={gridConfig.boldGrid}
					fill="url(#grid-bold)"
				/>
			</pattern>
		</defs>
	);
};

export const GridPattern = memo(GridPatternComponent);
