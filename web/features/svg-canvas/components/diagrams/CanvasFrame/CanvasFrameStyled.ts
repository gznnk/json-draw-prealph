import styled from "@emotion/styled";

/**
 * Props for the SVG canvas frame element.
 */
type CanvasFrameProps = {
	isTransparent?: boolean;
};

/**
 * Styled canvas frame element for background.
 */
export const CanvasFrameElement = styled.rect<CanvasFrameProps>`
	opacity: ${(props) => (props.isTransparent ? 0 : 1)};
`;