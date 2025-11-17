import styled from "@emotion/styled";

export const Container = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background-color: #f8fafc; /* slate-50 - same as ChatSpace */
	color: #111827; /* gray-900 */
	font-family:
		-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
		Arial, sans-serif;
	font-size: 13px;
	box-shadow:
		inset 0 1px 0 rgb(255 255 255 / 0.6),
		0 20px 25px -5px rgb(15 23 42 / 0.08),
		0 10px 10px -5px rgb(15 23 42 / 0.06);
`;

export const TreeContainer = styled.div`
	flex: 1;
	width: 100%;
	overflow: hidden;
	padding: 4px 0;

	/* ChatSpace-style scrollbar */
	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-thumb {
		background: #d1d5db;
		border-radius: 9999px;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}
`;

export const NodeContainer = styled.div<{ isSelected: boolean }>`
	display: flex;
	align-items: center;
	padding: 4px 8px;
	cursor: pointer;
	background-color: ${(props) =>
		props.isSelected ? "#f3f4f6" : "transparent"};
	transition: background-color 0.15s ease;

	&:hover {
		background-color: #f3f4f6; /* gray-100 - same as ChatSpace */
	}
`;

export const NodeIcon = styled.span`
	margin-right: 8px;
	display: inline-block;
	width: 16px;
	text-align: center;
	font-size: 14px;
`;

export const NodeLabel = styled.span`
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 14px;
	color: #111827;
`;

export const EmptyState = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: #6b7280; /* gray-500 */
	font-size: 14px;
`;

export const LoadingState = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: #6b7280; /* gray-500 */
	font-size: 14px;
`;

export const ErrorState = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: #dc2626; /* red-600 */
	font-size: 14px;
	padding: 16px;
	text-align: center;
`;

export const ToolbarContainer = styled.div`
	display: flex;
	align-items: center;
	padding: 12px 8px;
	border-bottom: 1px solid #e5e7eb; /* gray-200 */
	gap: 8px;
	background: #ffffff;
`;

export const ToolbarButton = styled.button`
	background-color: #111827; /* gray-900 - same as ChatSpace */
	color: #f9fafb;
	border: none;
	padding: 8px 14px;
	cursor: pointer;
	font-size: 13px;
	border-radius: 8px;
	font-weight: 600;
	transition:
		transform 0.15s ease,
		box-shadow 0.15s ease,
		filter 0.15s ease;

	&:hover {
		transform: translateY(-1px);
		filter: brightness(1.05);
		box-shadow: 0 10px 20px -12px rgb(17 24 39 / 0.35);
	}

	&:active {
		transform: translateY(0);
		box-shadow: none;
	}

	&:disabled {
		background-color: #d1d5db; /* gray-300 */
		color: #6b7280; /* gray-500 */
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}
`;

export const FolderListContainer = styled.div`
	padding: 0;
	border-bottom: 1px solid #e5e7eb; /* gray-200 */
	background: #ffffff;
`;

export const FolderItem = styled.div<{ isActive: boolean }>`
	display: flex;
	align-items: center;
	padding: 12px 8px;
	cursor: pointer;
	background-color: ${(props) => (props.isActive ? "#f3f4f6" : "transparent")};
	border-bottom: 1px solid #e5e7eb;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: #f3f4f6; /* gray-100 - same as ChatSpace */
	}

	&:last-child {
		border-bottom: none;
	}
`;

export const FolderName = styled.span`
	flex: 1;
	margin-left: 8px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 14px;
	font-weight: 600;
	color: #111827;
`;

export const RemoveButton = styled.button`
	background-color: transparent;
	color: #9ca3af; /* gray-400 */
	border: none;
	padding: 4px 8px;
	cursor: pointer;
	font-size: 16px;
	margin-left: 8px;
	border-radius: 4px;
	transition: all 0.15s ease;

	&:hover {
		color: #ef4444; /* red-500 */
		background-color: #fee2e2; /* red-100 */
	}
`;
