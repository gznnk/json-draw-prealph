import type React from "react";
import { useRef, useCallback, memo } from "react";
import type { ChangeEvent } from "../../types";
import RectangleBase from "../core/RectangleBase";
import type { RectangleBaseProps } from "../core/RectangleBase";

type RectangleProps = RectangleBaseProps & {
	fill?: string;
	stroke?: string;
	strokeWidth?: string;
};

const Rectangle: React.FC<RectangleProps> = memo(
	({
		id,
		initialPoint,
		initialWidth,
		initialHeight,
		fill = "transparent",
		stroke = "black",
		strokeWidth = "1px",
		tabIndex = 0,
		isSelected = false,
		onPointerDown,
		onChangeEnd,
	}) => {
		const rectRef = useRef<SVGRectElement>({} as SVGRectElement);

		const onChange = useCallback((e: ChangeEvent) => {
			rectRef.current?.setAttribute("width", `${e.width}`);
			rectRef.current?.setAttribute("height", `${e.height}`);
		}, []);

		return (
			<RectangleBase
				id={id}
				initialPoint={initialPoint}
				initialWidth={initialWidth}
				initialHeight={initialHeight}
				tabIndex={tabIndex}
				isSelected={isSelected}
				onPointerDown={onPointerDown}
				onChange={onChange}
				onChangeEnd={onChangeEnd}
			>
				<rect
					x={0}
					y={0}
					width={initialWidth}
					height={initialHeight}
					ref={rectRef}
					fill={fill}
					stroke={stroke}
					strokeWidth={strokeWidth}
				/>
			</RectangleBase>
		);
	},
);

export default Rectangle;
