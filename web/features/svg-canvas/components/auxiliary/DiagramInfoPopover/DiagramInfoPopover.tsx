import React, { memo } from "react";

import {
	PopoverContainer,
	PopoverContent,
	PopoverLabel,
	PopoverFieldContainer,
	PopoverText,
} from "./DiagramInfoPopoverStyled";
import type { DiagramInfoPopoverProps } from "./iagramInfoPopoverTypes";

const DiagramInfoPopoverComponent = ({
	display,
	diagram,
	position,
}: DiagramInfoPopoverProps): React.JSX.Element => {
	if (!display || !diagram) {
		return <></>;
	}

	return (
		<PopoverContainer
			style={{
				left: position.x,
				top: position.y,
			}}
		>
			<PopoverContent>
				<PopoverFieldContainer>
					<PopoverLabel>Name</PopoverLabel>
					<PopoverText>{diagram.name || "Untitled"}</PopoverText>
				</PopoverFieldContainer>

				<PopoverFieldContainer>
					<PopoverLabel>Description</PopoverLabel>
					<PopoverText>{diagram.description || "No description"}</PopoverText>
				</PopoverFieldContainer>
			</PopoverContent>
		</PopoverContainer>
	);
};

export const DiagramInfoPopover = memo(DiagramInfoPopoverComponent);
