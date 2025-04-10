// Import Emotion for styling.
import styled from "@emotion/styled";

/**
 * Styled element for the context menu item.
 */
export const ContextMenuItemDiv = styled.div`
    font-size: 14px;
    color: #333333;
    padding: 3px 5px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    &:hover {
        background-color: #EEEEEE;
    }
    &.disabled {
        color: #BDBDBD;
        pointer-events: none;
    }
`;
