import styled from "@emotion/styled";

export const PromptContainer = styled.div`
	position: fixed;
	bottom: 20px;
	left: 20px;
	z-index: 9999;
	max-width: 400px;
	animation: slideIn 0.3s ease-out;

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
`;

export const PromptContent = styled.div`
	background: #ffffff;
	border-radius: 12px;
	box-shadow:
		0 4px 6px rgba(0, 0, 0, 0.1),
		0 8px 16px rgba(0, 0, 0, 0.1);
	padding: 24px;
	position: relative;
`;

export const CloseButton = styled.button`
	position: absolute;
	top: 12px;
	right: 12px;
	background: none;
	border: none;
	font-size: 24px;
	color: #666;
	cursor: pointer;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	transition: all 0.2s;

	&:hover {
		background: #f0f0f0;
		color: #333;
	}
`;

export const Title = styled.h3`
	margin: 0 0 12px 0;
	font-size: 18px;
	font-weight: 600;
	color: #333;
`;

export const Description = styled.p`
	margin: 0 0 16px 0;
	font-size: 13px;
	line-height: 1.5;
	color: #666;
`;

export const Input = styled.input`
	width: 100%;
	padding: 10px 12px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
	box-sizing: border-box;
	margin-bottom: 16px;
	transition: border-color 0.2s;

	&:focus {
		outline: none;
		border-color: #4a90e2;
	}

	&::placeholder {
		color: #aaa;
	}
`;

export const ButtonGroup = styled.div`
	display: flex;
	gap: 8px;
`;

type ButtonProps = {
	$variant?: "primary" | "secondary";
};

export const Button = styled.button<ButtonProps>`
	flex: 1;
	padding: 10px 16px;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;

	${(props) =>
		props.$variant === "secondary"
			? `
		background: #f0f0f0;
		color: #333;

		&:hover:not(:disabled) {
			background: #e0e0e0;
		}
	`
			: `
		background: #4a90e2;
		color: white;

		&:hover:not(:disabled) {
			background: #357abd;
		}

		&:disabled {
			background: #ccc;
			cursor: not-allowed;
		}
	`}
`;
