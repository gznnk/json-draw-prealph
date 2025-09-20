import styled from "@emotion/styled";

/**
 * Container component for the header.
 * Defines the styling and layout for the header section.
 */
export const HeaderContainer = styled.header<{ height?: number }>`
	height: ${(props) => `${props.height || 30}px`};
	width: 100%;
	background-color: #1890ff;
	border-bottom: 1px solid #096dd9;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 0 16px;
	box-sizing: border-box;
	color: #ffffff;
	font-size: 12px;
	position: relative;
	overflow: visible;
	z-index: 1000;
`;

/**
 * Title component for the header.
 * Displays the application title.
 */
export const HeaderTitle = styled.div`
	font-weight: 500;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-right: 16px;
`;
