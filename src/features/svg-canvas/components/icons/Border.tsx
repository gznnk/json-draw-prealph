import { memo } from "react";

type BorderProps = {
	fill?: string;
};

export const Border = memo<BorderProps>(({ fill = "#333333" }) => {
	return (
		<path
			d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"
			fill={fill}
		/>
	);
});
