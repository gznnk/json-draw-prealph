// Import Emotion for styling.
import styled from "@emotion/styled";

export const DiagramMenuItemDiv = styled.div`
    display: flex;
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
    &.active {
        background-color: #DDDDDD;
    }
`;
