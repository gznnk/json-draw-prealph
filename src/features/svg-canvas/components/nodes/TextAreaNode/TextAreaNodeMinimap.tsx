// Import React.
import type React from "react";
import { memo } from "react";

// Import types.
import type { TextAreaNodeProps } from "../../../types/props/nodes/TextAreaNodeProps";

// Import components related to SvgCanvas.
import { Rectangle } from "../../shapes/Rectangle";

/**
 * TextAreaNode minimap component - lightweight version without outlines, controls, and labels.
 */
const TextAreaNodeMinimapComponent: React.FC<TextAreaNodeProps> = (props) => {
	return (
		<Rectangle 
			{...props} 
			text={props.text} 
			textType="markdown"
			showOutline={false}
			isSelected={false}
			isTextEditing={false}
		/>
	);
};

export const TextAreaNodeMinimap = memo(TextAreaNodeMinimapComponent);