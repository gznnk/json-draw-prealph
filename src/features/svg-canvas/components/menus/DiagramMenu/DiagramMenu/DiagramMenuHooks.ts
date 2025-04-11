// Import React.
import { useCallback, useRef } from "react";

// TODO: 場所
import { getSelectedItems } from "../../../diagrams/SvgCanvas/SvgCanvasFunctions";

// Import types related to SvgCanvas.
import type { SvgCanvasProps } from "../../../diagrams/SvgCanvas/SvgCanvasTypes";

// Import functions related to SvgCanvas.
import {
	isItemableData,
	isTextableData,
	isTransformativeData,
} from "../../../../utils/Diagram";
import { newEventId } from "../../../../utils/Util";

// Imports related to this component.
import type { DiagramMenuProps, DiagramMenuStateMap } from "./DiagramMenuTypes";
import type { Diagram } from "../../../../types/DiagramTypes";

export const useDiagramMenu = (canvasProps: SvgCanvasProps) => {
	// Extract properties from canvasProps.
	const { items, isDiagramChanging, multiSelectGroup } = canvasProps;

	// Default menu props (invisible).
	let diagramMenuProps = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		rotation: 0,
		scaleX: 1,
		scaleY: 1,
		isVisible: false,
		onMenuClick: (_menuType: string) => {},
	} as DiagramMenuProps;

	// Default menu state map.
	const menuStateMap = {
		BgColor: "Show",
		BorderColor: "Show",
		FontSize: "Hidden",
		Bold: "Hidden",
		FontColor: "Hidden",
		AlignLeft: "Hidden",
		AlignCenter: "Hidden",
		AlignRight: "Hidden",
		AlignTop: "Hidden",
		AlignMiddle: "Hidden",
		AlignBottom: "Hidden",
		Group: "Hidden",
	} as DiagramMenuStateMap;

	// Get selected items and check if the diagram menu should be shown.
	const selectedItems = getSelectedItems(items);
	const showDiagramMenu = 0 < selectedItems.length && !isDiagramChanging;
	const diagram = selectedItems[0];

	// If the diagram menu should be shown, set the properties for the menu.
	if (showDiagramMenu) {
		// TODO: 共通化するか移動する
		const findFirstTextableRecursive = (
			items: Diagram[],
		): Diagram | undefined => {
			for (const item of items) {
				if (isTextableData(item)) {
					return item;
				}
				if (isItemableData(item)) {
					const foundItem = findFirstTextableRecursive(item.items);
					if (foundItem) {
						return foundItem;
					}
				}
			}
			return undefined;
		};
		const firstTextableItem = findFirstTextableRecursive(selectedItems);

		if (firstTextableItem) {
			menuStateMap.FontSize = "Show";
			menuStateMap.Bold = "Show";
			menuStateMap.FontColor = "Show";
			menuStateMap.AlignLeft = "Show";
			menuStateMap.AlignCenter = "Show";
			menuStateMap.AlignRight = "Show";
			menuStateMap.AlignTop = "Show";
			menuStateMap.AlignMiddle = "Show";
			menuStateMap.AlignBottom = "Show";

			if (isTextableData(firstTextableItem)) {
				if (firstTextableItem.fontWeight === "bold") {
					menuStateMap.Bold = "Active";
				}
				if (firstTextableItem.textAlign === "left") {
					menuStateMap.AlignLeft = "Active";
				}
				if (firstTextableItem.textAlign === "center") {
					menuStateMap.AlignCenter = "Active";
				}
				if (firstTextableItem.textAlign === "right") {
					menuStateMap.AlignRight = "Active";
				}
				if (firstTextableItem.verticalAlign === "top") {
					menuStateMap.AlignTop = "Active";
				}
				if (firstTextableItem.verticalAlign === "center") {
					menuStateMap.AlignMiddle = "Active";
				}
				if (firstTextableItem.verticalAlign === "bottom") {
					menuStateMap.AlignBottom = "Active";
				}
			}
		}

		// Set the group menu state.
		if (multiSelectGroup) {
			menuStateMap.Group = "Show";
		} else if (diagram.type === "Group") {
			menuStateMap.Group = "Active";
		}

		if (multiSelectGroup) {
			const { x, y, width, height, rotation, scaleX, scaleY } =
				multiSelectGroup;
			diagramMenuProps = {
				x,
				y,
				width,
				height,
				rotation,
				scaleX,
				scaleY,
				isVisible: true,
				menuStateMap,
				onMenuClick: (_menuType: string) => {}, // Temporarily empty.
			};
		} else {
			if (isTransformativeData(diagram)) {
				diagramMenuProps = {
					x: diagram.x,
					y: diagram.y,
					width: diagram.width,
					height: diagram.height,
					rotation: diagram.rotation,
					scaleX: diagram.scaleX,
					scaleY: diagram.scaleY,
					isVisible: true,
					menuStateMap,
					onMenuClick: (_menuType: string) => {}, // Temporarily empty.
				};
			}
		}
	}

	const changeRecursive = (
		items: Diagram[],
		data: Partial<Diagram>,
		eventId: string = newEventId(),
	) => {
		for (const item of items) {
			// Apply the changes to the item.
			const newItem = { ...item };
			for (const key of Object.keys(data) as (keyof Diagram)[]) {
				if (key in newItem) {
					(newItem[key] as (typeof data)[keyof Diagram]) = data[key];
				}
			}

			// Trigger the change event.
			canvasProps.onDiagramChange?.({
				eventId,
				eventType: "Immediate", // TODO: 履歴に保存されない
				id: item.id,
				startDiagram: item,
				endDiagram: newItem,
			});

			if (isItemableData(newItem)) {
				// Check if the item has children and recursively change their properties.
				changeRecursive(newItem.items, data, eventId);
			}
		}
	};

	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		// Component properties
		canvasProps,
		// Internal variables and functions
		selectedItems,
		menuStateMap,
		changeRecursive,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	diagramMenuProps.onMenuClick = useCallback((menuType: string) => {
		// Bypass references to avoid function creation in every render.
		const {
			canvasProps: { onGroup, onUngroup },
			selectedItems,
			menuStateMap,
			changeRecursive,
		} = refBus.current;

		switch (menuType) {
			case "BgColor":
				// Handle background color change.
				break;
			case "BorderColor":
				// Handle border color change.
				break;
			case "FontSize":
				// Handle font size change.
				break;
			case "Bold":
				changeRecursive(selectedItems, {
					fontWeight: menuStateMap.Bold === "Active" ? "normal" : "bold",
				});
				break;
			case "FontColor":
				// Handle font color change.
				break;
			case "AlignLeft":
				changeRecursive(selectedItems, {
					textAlign: "left",
				});
				break;
			case "AlignCenter":
				changeRecursive(selectedItems, {
					textAlign: "center",
				});
				break;
			case "AlignRight":
				changeRecursive(selectedItems, {
					textAlign: "right",
				});
				break;
			case "AlignTop":
				changeRecursive(selectedItems, {
					verticalAlign: "top",
				});
				break;
			case "AlignMiddle":
				changeRecursive(selectedItems, {
					verticalAlign: "center",
				});
				break;
			case "AlignBottom":
				changeRecursive(selectedItems, {
					verticalAlign: "bottom",
				});
				break;
			case "Group":
				if (menuStateMap.Group === "Show") {
					onGroup?.();
				}
				if (menuStateMap.Group === "Active") {
					onUngroup?.();
				}
				break;
		}
	}, []);

	return {
		diagramMenuProps,
	};
};
