import { memo } from "react";
import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";

/* 太陽の昇降を表すキーフレーム */
const riseAndSet = keyframes`
  0%   { transform: rotate(0deg); }
  50%  { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
`;

/* 太陽を包む <g> 要素。animation が true のときだけ回転させる */
const SunGroup = styled.g<{ animate: boolean }>`
    transform-origin: 32px 48px;  /* 稜線中心を支点に */
    transform-box: view-box;
    ${({ animate }) =>
			animate &&
			css`
        animation: ${riseAndSet} 3s linear infinite;
    `}
`;

const skyColor = keyframes`
    0%   { fill: #ffffff; }
    25%  { fill: #ffffff; }
    50%  { fill: #0d47a1; }
    75%  { fill: #0d47a1; }  
    100% { fill: #ffffff; }
`;

/* 背景空 */
const Sky = styled.rect<{ animate: boolean }>`
  ${({ animate }) =>
		animate &&
		css`
        animation: ${skyColor} 3s linear infinite;
    `}
`;

type PictureProps = {
	/** true で太陽が昇降アニメーション */
	animation?: boolean;
};

export const Picture = memo<PictureProps>(({ animation = false }) => {
	return (
		<svg width={60} height={60} viewBox="0 0 60 60">
			<title>Picture</title>
			<Sky animate={animation} width="60" height="60" fill="#ffffff" />
			<polygon points="8,48 20,30 30,42 42,22 52,48" fill="#2196F3" />
			<SunGroup animate={animation}>
				<circle cx="32" cy="18" r="4" fill="#FFC107" />
			</SunGroup>
		</svg>
	);
});
