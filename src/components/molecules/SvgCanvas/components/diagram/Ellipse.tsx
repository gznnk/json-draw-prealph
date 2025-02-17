import type React from "react";
import { useRef, useCallback, memo } from "react";
import type { ChangeEvent } from "../../types";
import RectangleBase from "../core/RectangleBase";
import type { RectangleBaseProps } from "../core/RectangleBase";

type EllipseProps = RectangleBaseProps & {
	fill?: string;
	stroke?: string;
	strokeWidth?: string;
};

const Ellipse: React.FC<EllipseProps> = memo(
	({
		id,
		point,
		width,
		height,
		fill = "transparent",
		stroke = "black",
		strokeWidth = "1px",
		keepProportion = false,
		tabIndex = 0,
		isSelected = false,
		onPointerDown,
		onChangeEnd,
	}) => {
		const ref = useRef<SVGEllipseElement>({} as SVGEllipseElement);

		const onChange = useCallback((e: ChangeEvent) => {
			ref.current?.setAttribute("cx", `${e.width / 2}`);
			ref.current?.setAttribute("cy", `${e.height / 2}`);
			ref.current?.setAttribute("rx", `${e.width / 2}`);
			ref.current?.setAttribute("ry", `${e.height / 2}`);
		}, []);

		return (
			<RectangleBase
				id={id}
				point={point}
				width={width}
				height={height}
				keepProportion={keepProportion}
				tabIndex={tabIndex}
				isSelected={isSelected}
				onPointerDown={onPointerDown}
				onChange={onChange}
				onChangeEnd={onChangeEnd}
			>
				<ellipse
					cx={width / 2}
					cy={height / 2}
					rx={width / 2}
					ry={height / 2}
					ref={ref}
					fill={fill}
					stroke={stroke}
					strokeWidth={strokeWidth}
				/>
			</RectangleBase>
		);
	},
);

export default Ellipse;
