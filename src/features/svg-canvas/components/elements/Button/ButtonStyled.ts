// Import Emotion for styling.
import styled from "@emotion/styled";

/**
 * Props for the SVG button element.
 */
type ButtonProps = {
	isTransparent?: boolean;
};

/**
 * Styled button element for drag points.
 */
export const ButtonElement = styled.rect<ButtonProps>`
    opacity: ${(props) => (props.isTransparent ? 0 : 1)};
`;