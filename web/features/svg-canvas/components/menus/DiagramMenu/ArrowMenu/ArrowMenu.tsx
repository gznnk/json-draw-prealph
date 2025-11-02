import type React from "react";
import { memo, useState } from "react";

import { ArrowIconPreview } from "./ArrowIconPreview";
import { ArrowSelector } from "./ArrowSelector";
import { useStyleChange } from "../../../../hooks/useStyleChange";
import type { ArrowHeadType } from "../../../../types/core/ArrowHeadType";
import type { Diagram } from "../../../../types/state/core/Diagram";
import { ArrowSwap } from "../../../icons/ArrowSwap";
import { DiagramMenuPositioner } from "../DiagramMenu/DiagramMenuStyled";
import { DiagramMenuControl } from "../DiagramMenuControl";
import { DiagramMenuItemNew } from "../DiagramMenuItem/DiagramMenuItemNew";

type ArrowMenuProps = {
	selectedDiagrams: Diagram[];
};

const ArrowMenuComponent: React.FC<ArrowMenuProps> = ({ selectedDiagrams }) => {
	const applyStyleChange = useStyleChange();
	const [startArrowSelectorOpen, setStartArrowSelectorOpen] = useState(false);
	const [endArrowSelectorOpen, setEndArrowSelectorOpen] = useState(false);

	// Get the first diagram's arrow settings
	const firstDiagram = selectedDiagrams[0];
	const startArrowHead = (
		firstDiagram as { startArrowHead?: ArrowHeadType } | undefined
	)?.startArrowHead;
	const endArrowHead = (
		firstDiagram as { endArrowHead?: ArrowHeadType } | undefined
	)?.endArrowHead;

	const handleStartArrowChange = (arrowType: ArrowHeadType) => {
		applyStyleChange({
			items: selectedDiagrams,
			styleData: { startArrowHead: arrowType },
		});
		setStartArrowSelectorOpen(false);
	};

	const handleEndArrowChange = (arrowType: ArrowHeadType) => {
		applyStyleChange({
			items: selectedDiagrams,
			styleData: { endArrowHead: arrowType },
		});
		setEndArrowSelectorOpen(false);
	};

	const handleSwapArrows = () => {
		applyStyleChange({
			items: selectedDiagrams,
			styleData: {
				startArrowHead: endArrowHead || "None",
				endArrowHead: startArrowHead || "None",
			},
		});
	};

	return (
		<>
			{/* Start Arrow Button */}
			<DiagramMenuPositioner>
				<DiagramMenuItemNew
					isActive={startArrowSelectorOpen}
					onClick={() => {
						setStartArrowSelectorOpen(!startArrowSelectorOpen);
						setEndArrowSelectorOpen(false);
					}}
				>
					<ArrowIconPreview arrowType={startArrowHead} direction="start" />
				</DiagramMenuItemNew>
				{startArrowSelectorOpen && (
					<DiagramMenuControl>
						<ArrowSelector
							selectedArrow={startArrowHead}
							onSelect={handleStartArrowChange}
							direction="start"
						/>
					</DiagramMenuControl>
				)}
			</DiagramMenuPositioner>

			{/* Swap Arrows Button */}
			<DiagramMenuItemNew onClick={handleSwapArrows}>
				<ArrowSwap title="Swap arrows" />
			</DiagramMenuItemNew>

			{/* End Arrow Button */}
			<DiagramMenuPositioner>
				<DiagramMenuItemNew
					isActive={endArrowSelectorOpen}
					onClick={() => {
						setEndArrowSelectorOpen(!endArrowSelectorOpen);
						setStartArrowSelectorOpen(false);
					}}
				>
					<ArrowIconPreview arrowType={endArrowHead} direction="end" />
				</DiagramMenuItemNew>
				{endArrowSelectorOpen && (
					<DiagramMenuControl>
						<ArrowSelector
							selectedArrow={endArrowHead}
							onSelect={handleEndArrowChange}
							direction="end"
						/>
					</DiagramMenuControl>
				)}
			</DiagramMenuPositioner>
		</>
	);
};

export const ArrowMenu = memo(ArrowMenuComponent);
