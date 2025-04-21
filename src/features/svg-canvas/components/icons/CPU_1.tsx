import { memo } from "react";
import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";

const blink = keyframes`
	0%, 100% { fill: #00D1B2; }
	50%      { fill: #f1fa16; }
`;

const SmallRect = styled.rect<{ $blink: boolean }>`
	fill: #00D1B2;
	/* blink が true のときだけアニメーションを適用 */
	${({ $blink }) =>
		$blink &&
		css`
		animation: ${blink} 0.75s steps(1) infinite;
	`}
`;

type CPU1Props = {
	blink?: boolean;
};

export const CPU_1 = memo(({ blink = false }: CPU1Props) => {
	return (
		<>
			<rect x="0" y="0" width="80" height="80" rx="10" ry="10" fill="#0A0A37" />
			<g fill="none" stroke="#00D1B2" strokeWidth="2">
				<rect x="20" y="20" width="40" height="40" rx="5" ry="5" />
				<path d="M25 25 Q30 35, 40 30 T55 45" strokeLinecap="round" />
				<path d="M25 55 Q35 45, 40 50 T55 35" strokeLinecap="round" />
			</g>
			<SmallRect x="2" y="37" width="6" height="6" $blink={blink} />
			<SmallRect x="72" y="37" width="6" height="6" $blink={blink} />
			<SmallRect x="37" y="2" width="6" height="6" $blink={blink} />
			<SmallRect x="37" y="72" width="6" height="6" $blink={blink} />
		</>
	);
});
