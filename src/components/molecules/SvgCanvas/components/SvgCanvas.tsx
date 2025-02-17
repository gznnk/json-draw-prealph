import styled from "@emotion/styled";
import type React from "react";
import type { Item, ChangeEvent, ItemSelectEvent } from "./../types";
import Rectangle from "./diagram/Rectangle";
import Ellipse from "./diagram/Ellipse";
import { useCallback, memo } from "react";

const ContainerDiv = styled.div`
	position: absolute;
    top: 0;
    left: 0;
	right: 0;
	bottom: 0;
	overflow: auto;
`;

type SvgCanvasProps = {
	title?: string;
	items: Array<Item>;
	onChangeEnd?: (e: ChangeEvent) => void;
	onItemSelect?: (e: ItemSelectEvent) => void;
};

const SvgCanvas: React.FC<SvgCanvasProps> = memo(
	({ title, items, onChangeEnd, onItemSelect }) => {
		// console.log("SvgCanvas render");

		const renderedItems = items.map((item) => {
			switch (item.type) {
				case "rectangle":
					return (
						<Rectangle
							{...item}
							key={item.id}
							onChangeEnd={onChangeEnd}
							onPointerDown={onItemSelect}
						/>
					);
				case "ellipse":
					return (
						<Ellipse
							{...item}
							key={item.id}
							onChangeEnd={onChangeEnd}
							onPointerDown={onItemSelect}
						/>
					);
			}
		});

		const handlePointerDown = useCallback(
			(e: React.PointerEvent<SVGSVGElement>) => {
				if (e.target === e.currentTarget) {
					onItemSelect?.({});
				}
			},
			[onItemSelect],
		);

		const handleKeyDown = useCallback(
			(e: React.KeyboardEvent<SVGSVGElement>) => {
				if (e.target !== e.currentTarget) {
					e.stopPropagation();
					e.preventDefault();
				}
			},
			[],
		);

		return (
			<ContainerDiv>
				<svg
					width="120vw"
					height="120vh"
					onPointerDown={handlePointerDown}
					onKeyDown={handleKeyDown}
				>
					<title>{title}</title>
					{renderedItems}
				</svg>
			</ContainerDiv>
		);
	},
);

export default SvgCanvas;
