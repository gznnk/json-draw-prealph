// Import React.
import type React from "react";
import { memo } from "react";

// Import types.
import type { LLMNodeProps } from "../../../types/diagrams/nodes/LLMNodeProps";

// Import components related to SvgCanvas.
import { IconContainer } from "../../core/IconContainer";
import { CPU_1 } from "../../icons/CPU_1";

/**
 * LLMNode minimap component - lightweight version without outlines, controls, and labels.
 */
const LLMNodeMinimapComponent: React.FC<LLMNodeProps> = (props) => {
	return (
		<IconContainer
			x={props.x}
			y={props.y}
			width={props.width}
			height={props.height}
			rotation={props.rotation}
			scaleX={props.scaleX}
			scaleY={props.scaleY}
		>
			<CPU_1 width={props.width} height={props.height} animation={false} />
		</IconContainer>
	);
};

export const LLMNodeMinimap = memo(LLMNodeMinimapComponent);
