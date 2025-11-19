import { isArray, isBoolean, isObject } from "../../../../shared/validation";
import type { ConnectableData } from "../../types/data/shapes/ConnectableData";

/**
 * Check if data has valid connection properties (connectable feature).
 */
export const isConnectableData = (data: unknown): data is ConnectableData => {
	if (!isObject(data)) return false;

	return (
		"connectPointEnabled" in data &&
		isBoolean(data.connectPointEnabled) &&
		"connectPoints" in data &&
		isArray(data.connectPoints) // TODO: Further validation of connectPoints elements can be added here
	);
};
