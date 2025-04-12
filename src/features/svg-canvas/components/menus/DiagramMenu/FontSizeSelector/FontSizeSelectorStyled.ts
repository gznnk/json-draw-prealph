// Import Emotion for styling.
import styled from "@emotion/styled";

/**
 * Styled element for the diagram menu font size.
 */
export const FontSizeSelectorDiv = styled.div`
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    flex-direction: row;
    background-color: #F9F9F9;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    padding: 3px 4px;
    pointer-events: auto;
    user-select: none;
`;

/**
 * Styled element for the diagram menu font size input.
 */
export const FontSizeSelectorInput = styled.input`
    display: block;
    width: 32px;
    height: 24px;
    margin: 0 3px;
    text-align: center;
    outline: none;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
`;

/**
 * Styled element for the diagram menu font size button input.
 */
export const FontSizeSelectorButton = styled.div`
    display: flex;
    width: 26px;
    height: 26px;
    box-sizing: border-box;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 3px 3px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s ease-in-out;
    &:hover {
        background-color: #EEEEEE;
    }
    &:active {
        background-color: #DDDDDD;
    }
`;
