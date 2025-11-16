import type React from "react";
import { memo, useState } from "react";

// Import types related to SvgCanvas.
import {
	CANVAS_MENU_CATEGORIES,
	type CanvasMenuItem as MenuItemConfig,
} from "../../../../constants/menu/canvas/CanvasMenuItems";
import type { AddDiagramByTypeEvent } from "../../../../types/events/AddDiagramByTypeEvent";
// Import functions related to SvgCanvas.
import { newEventId } from "../../../../utils/core/newEventId";
// Imports related to this component.
import { CanvasMenuItem } from "../CanvasMenuItem";
import {
	CanvasMenuDiv,
	CanvasMenuCategoryDiv,
	CanvasMenuCategoryLabel,
	CanvasMenuItemsDiv,
} from "./CanvasMenuStyled";

type CanvasMenuProps = {
	onAddDiagramByType?: (e: AddDiagramByTypeEvent) => void;
};

const CanvasMenuComponent: React.FC<CanvasMenuProps> = ({
	onAddDiagramByType,
}) => {
	const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
		new Set(),
	);

	const handleToggleCategory = (categoryId: string) => {
		setCollapsedCategories((prev) => {
			const next = new Set(prev);
			if (next.has(categoryId)) {
				next.delete(categoryId);
			} else {
				next.add(categoryId);
			}
			return next;
		});
	};

	const handleItemClick = (config: MenuItemConfig) => {
		onAddDiagramByType?.({
			eventId: newEventId(),
			diagramType: config.diagramType,
			isSelected: true,
			...(config.variant && { variant: config.variant }),
		});
	};

	return (
		<CanvasMenuDiv draggable={false}>
			{CANVAS_MENU_CATEGORIES.map((category) => {
				const isCollapsed = collapsedCategories.has(category.id);

				return (
					<CanvasMenuCategoryDiv key={category.id}>
						<CanvasMenuCategoryLabel
							onClick={() => handleToggleCategory(category.id)}
							data-collapsed={isCollapsed}
						>
							{category.label}
						</CanvasMenuCategoryLabel>

						{!isCollapsed && (
							<CanvasMenuItemsDiv>
								{category.items.map((item) => (
									<CanvasMenuItem
										key={item.id}
										config={item}
										onClick={handleItemClick}
									/>
								))}
							</CanvasMenuItemsDiv>
						)}
					</CanvasMenuCategoryDiv>
				);
			})}
		</CanvasMenuDiv>
	);
};

export const CanvasMenu = memo(CanvasMenuComponent);
