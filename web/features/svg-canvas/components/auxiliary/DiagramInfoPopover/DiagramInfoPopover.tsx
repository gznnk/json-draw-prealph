import React, { memo } from "react";

import { PopoverContainer, PopoverContent, PopoverTitle, PopoverDescription } from "./DiagramInfoPopoverStyled";
import type { SvgCanvasProps } from "../../../canvas/types/SvgCanvasProps";
import type { Diagram } from "../../../types/state/core/Diagram";

export type DiagramInfoPopoverProps = {
	diagram: Diagram;
	position: { x: number; y: number };
	canvasProps: SvgCanvasProps;
};

const DiagramInfoPopoverComponent = ({ diagram, position }: DiagramInfoPopoverProps): React.JSX.Element => {
	const hasName = diagram.name && diagram.name.trim() !== "";
	const hasDescription = diagram.description && diagram.description.trim() !== "";

	if (!hasName && !hasDescription) {
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
				{hasName && (
					<PopoverTitle>{diagram.name}</PopoverTitle>
				)}
				{hasDescription && (
					<PopoverDescription>{diagram.description}</PopoverDescription>
				)}
			</PopoverContent>
		</PopoverContainer>
	);
};

export const DiagramInfoPopover = memo(DiagramInfoPopoverComponent);