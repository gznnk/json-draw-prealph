import { memo } from "react";
import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";

// 上下に動くアニメーション
const moveUpDown = keyframes`
    0% { transform: translateY(0); }
    25% { transform: translateY(-3px); }
	50% { transform: translateY(7px); }
    100% { transform: translateY(0); }
`;

// moveUpDown アニメーションを適用するためのグループ
const AnimatedGroup = styled.g<{ $animate: boolean }>`
    ${({ $animate }) =>
			$animate &&
			css`
            animation: ${moveUpDown} 1s ease-out infinite;
        `}
`;

type AgentProps = {
	width: number;
	height: number;
	animate?: boolean;
};

export const Agent = memo<AgentProps>(
	({ width = 100, height = 100, animate = false }) => {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 100 100"
				width={width}
				height={height}
			>
				<title>Agent</title>
				<rect x="10" y="10" width="80" height="80" fill="#000" rx="8" ry="8" />
				<circle cx="50" cy="50" r="30" fill="#fff" />
				<AnimatedGroup $animate={animate}>
					<rect x="25" y="40" width="20" height="10" fill="#000" />
					<rect x="55" y="40" width="20" height="10" fill="#000" />
					<line x1="45" y1="45" x2="55" y2="45" stroke="#000" strokeWidth="3" />
				</AnimatedGroup>
			</svg>
		);
	},
);
