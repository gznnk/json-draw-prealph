import type React from "react";
import { memo } from "react";

import { Group } from "../../../icons/Group";
import { DiagramMenuItemNew } from "../DiagramMenuItem/DiagramMenuItemNew";

type GroupMenuProps = {
	isActive: boolean;
	onGroup?: () => void;
	onUngroup?: () => void;
	isHidden?: boolean;
};

const GroupMenuComponent: React.FC<GroupMenuProps> = ({
	isActive,
	onGroup,
	onUngroup,
	isHidden = false,
}) => {
	const handleClick = () => {
		if (isActive) {
			onUngroup?.();
		} else {
			onGroup?.();
		}
	};

	return (
		<DiagramMenuItemNew
			isActive={isActive}
			onClick={handleClick}
			isHidden={isHidden}
		>
			<Group width={22} height={22} title={isActive ? "Ungroup" : "Group"} />
		</DiagramMenuItemNew>
	);
};

export const GroupMenu = memo(GroupMenuComponent);
