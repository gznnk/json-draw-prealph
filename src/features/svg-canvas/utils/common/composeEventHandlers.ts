export const composeEventHandlers = <T>(
	...listeners: Array<(event: T) => void>
): ((event: T) => void) => {
	return (event: T) => {
		for (const listener of listeners) {
			listener(event);
		}
	};
};
