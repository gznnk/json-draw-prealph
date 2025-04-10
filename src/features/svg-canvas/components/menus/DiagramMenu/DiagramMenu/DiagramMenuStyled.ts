// Import Emotion for styling.
import styled from "@emotion/styled";

/**
 * Properties for the DiagramMenuWrapper.
 */
type DiagramMenuWrapperProps = {
	x: number;
	y: number;
};

/**
 * Styled element for the diagram menu wrapper.
 */
export const DiagramMenuWrapper = styled.div<DiagramMenuWrapperProps>`
    position: absolute;
    top: ${(props) => props.y}px;
    left: ${(props) => props.x - 300}px;
    width: 600px;
    display: flex;
    justify-content: center;
`;

/**
 * Styled element for the diagram menu.
 */
export const DiagramMenuDiv = styled.div`
    height: 34px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    font-size: 14px;
    padding: 3px 4px;
    background-color: #F9F9F9;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    pointer-events: auto;
    user-select: none;
`;

/**
 * Styled element for the diagram menu divider.
 */
export const DiagramMenuDivider = styled.div`
    width: 1px;
    height: 100%;
    margin-left: 3px;
    margin-right: 3px;
    background-color: #E0E0E0;
`;
