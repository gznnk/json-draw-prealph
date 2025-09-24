import styled from "@emotion/styled";

export const StyledCircle = styled.circle<{ statusColor: string }>`
	fill: ${(props) => props.statusColor};
	stroke: white;
	stroke-width: 2;
`;
