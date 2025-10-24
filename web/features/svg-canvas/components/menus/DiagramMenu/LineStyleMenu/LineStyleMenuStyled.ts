import styled from "@emotion/styled";

export const LineStyleMenuWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 8px;
	background-color: #fff;
	border-radius: 4px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	pointer-events: auto;
`;

export const LineStyleSection = styled.div`
	display: flex;
	gap: 4px;
`;

type LineStyleButtonProps = {
	isActive: boolean;
};

export const LineStyleButton = styled.button<LineStyleButtonProps>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	padding: 4px;
	border: 1px solid ${(props) => (props.isActive ? "#1890ff" : "#d9d9d9")};
	border-radius: 4px;
	background-color: ${(props) => (props.isActive ? "#e6f7ff" : "#fff")};
	color: ${(props) => (props.isActive ? "#1890ff" : "#000")};
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		border-color: #1890ff;
		background-color: #e6f7ff;
	}
`;
