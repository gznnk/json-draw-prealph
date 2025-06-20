import { composeEventHandlers } from "./composeEventHandlers";

type Props = Record<string, unknown>;

export const mergeProps = (...propsList: Props[]): Props => {
	const result: Props = {};

	for (const props of propsList) {
		for (const key of Object.keys(props)) {
			const current = result[key];
			const incoming = props[key];

			if (typeof current === "function" && typeof incoming === "function") {
				result[key] = composeEventHandlers(
					current as (event: unknown) => void,
					incoming as (event: unknown) => void,
				);
			} else {
				result[key] = incoming;
			}
		}
	}

	return result;
};
