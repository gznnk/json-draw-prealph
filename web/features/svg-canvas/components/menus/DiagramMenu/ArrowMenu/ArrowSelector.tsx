import type React from "react";
import { memo } from "react";

import { ArrowIconPreview } from "./ArrowIconPreview";
import { ArrowSelectorGrid, ArrowSelectorButton } from "./ArrowMenuStyled";
import type { ArrowHeadType } from "../../../../types/core/ArrowHeadType";

type ArrowSelectorProps = {
	selectedArrow: ArrowHeadType | undefined;
	onSelect: (arrowType: ArrowHeadType) => void;
	direction: "start" | "end";
};

const arrowTypes: ArrowHeadType[] = [
	"None",
	"Triangle",
	"ConcaveTriangle",
	"Circle",
];

const ArrowSelectorComponent: React.FC<ArrowSelectorProps> = ({
	selectedArrow,
	onSelect,
	direction,
}) => {
	return (
		<ArrowSelectorGrid>
			{arrowTypes.map((type) => (
				<ArrowSelectorButton
					key={type}
					isActive={selectedArrow === type}
					onClick={() => onSelect(type)}
					title={type}
				>
					<ArrowIconPreview arrowType={type} direction={direction} />
				</ArrowSelectorButton>
			))}
		</ArrowSelectorGrid>
	);
};

export const ArrowSelector = memo(ArrowSelectorComponent);
