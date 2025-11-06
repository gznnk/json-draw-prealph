import { memo } from "react";

import type { IconProps } from "../../types/props/icon/IconProps";

/**
 * Rounded path icon component - shows straight lines with rounded corners
 *
 * @param props - Props for the icon
 * @param props.width - Icon width
 * @param props.height - Icon height
 * @param props.fill - SVG stroke color
 * @param props.title - Accessible title for the icon
 * @returns SVG element for rounded path icon
 */
const RoundedPathIconComponent: React.FC<IconProps> = ({
	width = 24,
	height = 24,
	fill = "#333333",
	title,
}) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>{title}</title>
			{/* Path with rounded corners - simplified to 3 segments */}
			<path
				d="M 4,16 L 9,16 Q 11,16 11,14 L 11,10 Q 11,8 13,8 L 20,8"
				stroke={fill}
				strokeWidth="2"
				fill="none"
			/>
			{/* Start point */}
			<circle cx="4" cy="16" r="3" fill={fill} />
			{/* End point */}
			<circle cx="20" cy="8" r="3" fill={fill} />
		</svg>
	);
};

export const RoundedPathIcon = memo(RoundedPathIconComponent);
