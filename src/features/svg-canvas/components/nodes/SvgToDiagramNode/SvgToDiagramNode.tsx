// Import React.
import type React from "react";
import { memo } from "react";
import { Rectangle, type RectangleProps } from "../../shapes/Rectangle";
import type { ExecuteEvent, NewItemEvent } from "../../../types/EventTypes";
import { useExecutionChain } from "../../../hooks/useExecutionChain";
import { createSvgDataFromText } from "../../shapes/Svg/SvgFunctions";
import type { Diagram } from "../../../types/DiagramCatalog";

type SvgToDiagramProps = RectangleProps & {
	onExecute: (e: ExecuteEvent) => void;
	onNewItem: (e: NewItemEvent) => void;
};

const SvgToDiagramNodeComponent: React.FC<SvgToDiagramProps> = (props) => {
	useExecutionChain({
		id: props.id,
		onPropagation: (e) => {
			const data = e.data.text
				.replace("```svg", "")
				.replace("```xml", "")
				.replace("```", "");

			const svgData = createSvgDataFromText(data);
			if (!svgData) return;

			svgData.x = props.x + (Math.random() - 0.5) * 300;
			svgData.y = props.y + (Math.random() - 0.5) * 300;

			props.onNewItem({
				item: svgData as Diagram,
			});
		},
	});

	return <Rectangle {...props} />;
};

export const SvgToDiagramNode = memo(SvgToDiagramNodeComponent);
