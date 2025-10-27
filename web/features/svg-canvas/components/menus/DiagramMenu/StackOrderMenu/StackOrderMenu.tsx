import type React from "react";
import { memo } from "react";

import {
	StackOrderMenuWrapper,
	StackOrderButton,
} from "./StackOrderMenuStyled";
import { useStackOrderChange } from "../../../../hooks/useStackOrderChange";
import { newEventId } from "../../../../utils/core/newEventId";
import { BringForward } from "../../../icons/BringForward";
import { BringToFront } from "../../../icons/BringToFront";
import { SendBackward } from "../../../icons/SendBackward";
import { SendToBack } from "../../../icons/SendToBack";
import { StackOrder as StackOrderIcon } from "../../../icons/StackOrder";
import { DiagramMenuPositioner } from "../DiagramMenu/DiagramMenuStyled";
import { DiagramMenuControl } from "../DiagramMenuControl";
import { DiagramMenuItemNew } from "../DiagramMenuItem/DiagramMenuItemNew";

type StackOrderMenuProps = {
	isOpen: boolean;
	onToggle: () => void;
	selectedItemId: string;
};

const StackOrderMenuComponent: React.FC<StackOrderMenuProps> = ({
	isOpen,
	onToggle,
	selectedItemId,
}) => {
	const onStackOrderChange = useStackOrderChange();

	return (
		<DiagramMenuPositioner>
			<DiagramMenuItemNew isActive={isOpen} onClick={onToggle}>
				<StackOrderIcon title="Stack Order" />
			</DiagramMenuItemNew>
			{isOpen && (
				<DiagramMenuControl>
					<StackOrderMenuWrapper>
						<StackOrderButton
							isActive={false}
							onClick={() =>
								onStackOrderChange({
									eventId: newEventId(),
									changeType: "bringToFront",
									id: selectedItemId,
								})
							}
							title="Bring to Front"
						>
							<BringToFront />
						</StackOrderButton>
						<StackOrderButton
							isActive={false}
							onClick={() =>
								onStackOrderChange({
									eventId: newEventId(),
									changeType: "bringForward",
									id: selectedItemId,
								})
							}
							title="Bring Forward"
						>
							<BringForward />
						</StackOrderButton>
						<StackOrderButton
							isActive={false}
							onClick={() =>
								onStackOrderChange({
									eventId: newEventId(),
									changeType: "sendBackward",
									id: selectedItemId,
								})
							}
							title="Send Backward"
						>
							<SendBackward />
						</StackOrderButton>
						<StackOrderButton
							isActive={false}
							onClick={() =>
								onStackOrderChange({
									eventId: newEventId(),
									changeType: "sendToBack",
									id: selectedItemId,
								})
							}
							title="Send to Back"
						>
							<SendToBack />
						</StackOrderButton>
					</StackOrderMenuWrapper>
				</DiagramMenuControl>
			)}
		</DiagramMenuPositioner>
	);
};

export const StackOrderMenu = memo(StackOrderMenuComponent);
