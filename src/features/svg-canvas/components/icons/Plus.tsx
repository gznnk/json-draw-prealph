import { memo } from "react";

type PlusProps = {
	fill?: string;
};

export const Plus = memo<PlusProps>(({ fill = "#333333" }) => {
	return (
		<>
			<path
				d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z"
				fill={fill}
			/>
			<path
				d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z"
				fill={fill}
			/>
		</>
	);
});
