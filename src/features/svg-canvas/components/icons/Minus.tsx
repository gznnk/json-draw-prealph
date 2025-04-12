import { memo } from "react";

type MinusProps = {
	fill?: string;
};

export const Minus = memo<MinusProps>(({ fill = "#333333" }) => {
	return (
		<path
			d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"
			fill={fill}
		/>
	);
});
