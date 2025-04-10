// Import React.
import type React from "react";
import { memo, useCallback } from "react";

// Imports related to this component.
import type {
	DiagramMenuStateMap,
	DiagramMenuType,
} from "../DiagramMenu/DiagramMenuTypes";
import { DiagramMenuItemDiv } from "./DiagramMenuItemStyled";

/**
 * Props for the DiagramMenuItem component.
 */
type DiagramMenuItemProps = {
	menuType: DiagramMenuType;
	menuStateMap: DiagramMenuStateMap;
	tooltip: string;
	children: React.ReactNode;
	onMenuClick: (menuType: DiagramMenuType) => void;
};

/**
 * Diagram menu item component.
 */
const DiagramMenuItemComponent: React.FC<DiagramMenuItemProps> = ({
	menuType,
	menuStateMap,
	tooltip,
	children,
	onMenuClick,
}) => {
	const handleMenuClick = useCallback(() => {
		onMenuClick(menuType);
	}, [menuType, onMenuClick]);

	const menuState = menuStateMap[menuType];
	if (menuState === "Hidden") return null;

	return (
		<DiagramMenuItemDiv
			className={menuState === "Active" ? "active" : ""}
			onClick={handleMenuClick}
		>
			<svg viewBox="0 0 1024 1024" width="100%" height="100%">
				<title>{tooltip}</title>
				{children}
			</svg>
		</DiagramMenuItemDiv>
	);
};

export const DiagramMenuItem = memo(DiagramMenuItemComponent);
