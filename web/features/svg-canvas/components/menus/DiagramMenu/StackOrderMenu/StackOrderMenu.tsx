import type React from "react";
import { memo } from "react";

import { DiagramMenuControl } from "../DiagramMenuControl";
import {
	StackOrderMenuWrapper,
	StackOrderButton,
} from "./StackOrderMenuStyled";
import { BringForward } from "../../../icons/BringForward";
import { BringToFront } from "../../../icons/BringToFront";
import { SendBackward } from "../../../icons/SendBackward";
import { SendToBack } from "../../../icons/SendToBack";

type StackOrderMenuProps = {
	onBringToFront: () => void;
	onBringForward: () => void;
	onSendBackward: () => void;
	onSendToBack: () => void;
};

const StackOrderMenuComponent: React.FC<StackOrderMenuProps> = ({
	onBringToFront,
	onBringForward,
	onSendBackward,
	onSendToBack,
}) => {
	return (
		<DiagramMenuControl>
			<StackOrderMenuWrapper>
				<StackOrderButton
					isActive={false}
					onClick={onBringToFront}
					title="Bring to Front"
				>
					<BringToFront />
				</StackOrderButton>
				<StackOrderButton
					isActive={false}
					onClick={onBringForward}
					title="Bring Forward"
				>
					<BringForward />
				</StackOrderButton>
				<StackOrderButton
					isActive={false}
					onClick={onSendBackward}
					title="Send Backward"
				>
					<SendBackward />
				</StackOrderButton>
				<StackOrderButton
					isActive={false}
					onClick={onSendToBack}
					title="Send to Back"
				>
					<SendToBack />
				</StackOrderButton>
			</StackOrderMenuWrapper>
		</DiagramMenuControl>
	);
};

export const StackOrderMenu = memo(StackOrderMenuComponent);
