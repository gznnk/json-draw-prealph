import type React from "react";
import { memo } from "react";

import { DiagramMenuControl } from "../DiagramMenuControl";
import { AlignmentMenuWrapper, AlignmentButton } from "./AlignmentMenuStyled";
import { AlignCenter } from "../../../icons/AlignCenter";
import { AlignLeft } from "../../../icons/AlignLeft";
import { AlignRight } from "../../../icons/AlignRight";
import { VerticalAlignBottom } from "../../../icons/VerticalAlignBottom";
import { VerticalAlignMiddle } from "../../../icons/VerticalAlignMiddle";
import { VerticalAlignTop } from "../../../icons/VerticalAlignTop";

type AlignmentMenuProps = {
	textAlign: "left" | "center" | "right";
	verticalAlign: "top" | "center" | "bottom";
	onTextAlignChange: (align: "left" | "center" | "right") => void;
	onVerticalAlignChange: (align: "top" | "center" | "bottom") => void;
};

const AlignmentMenuComponent: React.FC<AlignmentMenuProps> = ({
	textAlign,
	verticalAlign,
	onTextAlignChange,
	onVerticalAlignChange,
}) => {
	return (
		<DiagramMenuControl>
			<AlignmentMenuWrapper>
				{/* First row: Horizontal alignment */}
				<AlignmentButton
					isActive={textAlign === "left"}
					onClick={() => onTextAlignChange("left")}
					title="Align Left"
				>
					<AlignLeft />
				</AlignmentButton>
				<AlignmentButton
					isActive={textAlign === "center"}
					onClick={() => onTextAlignChange("center")}
					title="Align Center"
				>
					<AlignCenter />
				</AlignmentButton>
				<AlignmentButton
					isActive={textAlign === "right"}
					onClick={() => onTextAlignChange("right")}
					title="Align Right"
				>
					<AlignRight />
				</AlignmentButton>

				{/* Second row: Vertical alignment */}
				<AlignmentButton
					isActive={verticalAlign === "top"}
					onClick={() => onVerticalAlignChange("top")}
					title="Align Top"
				>
					<VerticalAlignTop />
				</AlignmentButton>
				<AlignmentButton
					isActive={verticalAlign === "center"}
					onClick={() => onVerticalAlignChange("center")}
					title="Align Middle"
				>
					<VerticalAlignMiddle />
				</AlignmentButton>
				<AlignmentButton
					isActive={verticalAlign === "bottom"}
					onClick={() => onVerticalAlignChange("bottom")}
					title="Align Bottom"
				>
					<VerticalAlignBottom />
				</AlignmentButton>
			</AlignmentMenuWrapper>
		</DiagramMenuControl>
	);
};

export const AlignmentMenu = memo(AlignmentMenuComponent);
