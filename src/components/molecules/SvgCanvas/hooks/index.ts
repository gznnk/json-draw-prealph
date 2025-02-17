import { useState, useCallback } from "react";
import type { Item, ItemSelectEvent, ChangeEvent } from "../types";
import type { PartiallyRequired } from "../../../../types/ParticallyRequired";

type SvgCanvasState = {
	items: Item[];
	selectedItemId?: string;
};

type AddItem = Omit<PartiallyRequired<Item, "type">, "id" | "isSelected">;
type UpdateItem = Omit<PartiallyRequired<Item, "id">, "type" | "isSelected">;

const DEFAULT_ITEM_VALUE = {
	point: { x: 10, y: 10 },
	width: 100,
	height: 100,
	fill: "transparent",
	stroke: "black",
	strokeWidth: "1px",
	isSelected: false,
};

export const useSvgCanvas = (initialItems: Item[]) => {
	const [canvasState, setCanvasState] = useState<SvgCanvasState>({
		items: initialItems,
	});

	const onChangeEnd = useCallback((e: ChangeEvent) => {
		setCanvasState((prevState) => ({
			...prevState,
			items: prevState.items.map((item) =>
				item.id === e.id ? { ...item, ...e } : item,
			),
		}));
	}, []);

	const onItemSelect = useCallback((e: ItemSelectEvent) => {
		setCanvasState((prevState) => {
			const items = prevState.items.map((item) =>
				item.id === e.id
					? { ...item, isSelected: true }
					: { ...item, isSelected: false },
			);

			// console.log(items);

			return {
				...prevState,
				items,
				selectedItemId: e.id,
			};
		});
	}, []);

	const canvasProps = {
		...canvasState,
		onChangeEnd,
		onItemSelect,
	};

	const getSelectedItem = useCallback(() => {
		return canvasState.items.find((item) => item.isSelected);
	}, [canvasState.items]);

	const addItem = useCallback((item: AddItem) => {
		setCanvasState((prevState) => ({
			...prevState,
			items: [
				...prevState.items.map((item) => ({ ...item, isSelected: false })),
				{
					...DEFAULT_ITEM_VALUE,
					id: String(prevState.items.length + 1),
					isSelected: true,
					...item,
				},
			],
		}));
	}, []);

	const updateItem = useCallback((item: UpdateItem) => {
		setCanvasState((prevState) => ({
			...prevState,
			items: prevState.items.map((i) =>
				i.id === item.id ? { ...i, ...item } : i,
			),
		}));
	}, []);

	const canvasFunctions = {
		getSelectedItem,
		addItem,
		updateItem,
	};

	return {
		state: [canvasState, setCanvasState],
		canvasProps,
		canvasFunctions,
	} as const;
};
