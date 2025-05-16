// Import React.
import type React from "react";
import { memo } from "react";

// Import local module files.
import { HeaderContainer, HeaderTitle, HeaderControls } from "./HeaderStyled";

/**
 * Header component that appears at the top of the application.
 * This component provides navigation and app-level controls.
 *
 * @returns ReactElement representing the header
 */
const HeaderComponent: React.FC = () => {
	return (
		<HeaderContainer>
			<HeaderTitle>React Vite Project</HeaderTitle>
			<HeaderControls>
				{/* ヘッダーの右側にはコントロールを配置できます */}
			</HeaderControls>
		</HeaderContainer>
	);
};

export const Header = memo(HeaderComponent);
