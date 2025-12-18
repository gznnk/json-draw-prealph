import styled from "@emotion/styled";
import type React from "react";
// Import other libraries.

const UserMenuDiv = styled.div`
	position: absolute;
	top: 10px;
	right: 20px;
	display: flex;
	flex-direction: row;
	gap: 10px;
`;

const UserMenu: React.FC = () => {
	// UserMenu is now empty - API key management moved to ApiKeyPrompt
	return <UserMenuDiv />;
};

export default UserMenu;
