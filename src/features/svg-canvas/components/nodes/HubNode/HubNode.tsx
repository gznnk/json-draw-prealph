// Import React.
import type React from "react";
import { memo, useState } from "react";

// Import types related to this component.
import type { ExecuteEvent } from "../../../types/EventTypes";

// Import components related to SvgCanvas.
import { Ellipse, type EllipseProps } from "../../shapes/Ellipse";
import { Hub } from "../../icons/Hub";
import { IconContainer } from "../../core/IconContainer";

// Import hooks related to SvgCanvas.
import { useExecutionChain } from "../../../hooks/useExecutionChain";

type HubNodeProps = EllipseProps & {
	onExecute: (e: ExecuteEvent) => void;
};

const HubNodeComponent: React.FC<HubNodeProps> = (props) => {
	const [isFlashing, setIsFlashing] = useState(false);

	useExecutionChain({
		id: props.id,
		onPropagation: (e) => {
			setIsFlashing(true);
			setTimeout(() => setIsFlashing(false), 500); // アニメ終了でリセット

			props.onExecute?.({
				id: props.id,
				eventId: e.eventId,
				data: {
					text: e.data.text,
				},
			});
		},
	});

	return (
		<>
			<IconContainer
				x={props.x}
				y={props.y}
				width={props.width}
				height={props.height}
				rotation={props.rotation}
				scaleX={props.scaleX}
				scaleY={props.scaleY}
				iconWidth={100}
				iconHeight={100}
				pointerEvents="none"
			>
				<Hub flash={isFlashing} />
			</IconContainer>
			<Ellipse {...props} />
		</>
	);
};

export const HubNode = memo(HubNodeComponent);
