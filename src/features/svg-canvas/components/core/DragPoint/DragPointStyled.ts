// Import Emotion for styling.
import styled from "@emotion/styled";

/**
 * Props for the SVG circle element.
 */
type CircleProps = {
	outline: string;
};

/**
 * Styled circle element for drag points.
 */
export const Circle = styled.circle<CircleProps>`
    :focus {
        outline: ${(props) => props.outline};
        outline-offset: 3px;
    }
`;
