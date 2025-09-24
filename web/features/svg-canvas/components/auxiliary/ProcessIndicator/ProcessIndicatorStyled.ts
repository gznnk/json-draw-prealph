import { keyframes, css } from "@emotion/react";
import styled from "@emotion/styled";

const blinkAnimation = keyframes`
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
	100% {
		opacity: 1;
	}
`;

const disappearAnimation = keyframes`
	0% {
		opacity: 1;
	}
	90% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
`;

export const StyledCircle = styled.circle<{
	statusColor: string;
	isProcessing: boolean;
	isDisappearing: boolean;
}>`
	fill: ${(props) => props.statusColor};
	transition: fill 0.5s linear;
	${({ isProcessing }) =>
		isProcessing &&
		css`
			animation: ${blinkAnimation} 1s ease-in-out infinite;
		`}
	${({ isDisappearing }) =>
		isDisappearing &&
		css`
			animation: ${disappearAnimation} 10s ease-out forwards;
		`}
`;
