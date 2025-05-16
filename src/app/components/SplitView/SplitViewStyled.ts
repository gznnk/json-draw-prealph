import styled from "@emotion/styled";

// Emotion styled components
export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const Pane = styled.div`
  overflow: auto;
  height: 100%;
`;

export const Divider = styled.div`
  width: 5px;
  cursor: col-resize;
  background-color: #3A415C;
  &:hover {
    background-color: #666;
  }
`;
