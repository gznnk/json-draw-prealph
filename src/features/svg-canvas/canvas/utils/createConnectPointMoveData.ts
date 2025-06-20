import { DiagramRegistry } from "../../registry";
import type { Diagram } from "../../types/data/catalog/Diagram";
import type { ConnectPointMoveData } from "../../types/events/ConnectPointMoveData";
import { isConnectableData } from "../../utils/validation/isConnectableData";

/**
 * Create connect point move data for the new item.
 *
 * @param newItem - The new item for which to create connect point move data.
 * @returns {ConnectPointMoveData[]} - The connect point move data for the new item.
 */
export const createConnectPointMoveData = (
	newItem: Diagram,
): ConnectPointMoveData[] => {
	if (isConnectableData(newItem)) {
		// Process connection points for all connectable shapes regardless of multi-selection source status
		const calculator = DiagramRegistry.getConnectPointCalculator(newItem.type);
		return calculator ? calculator(newItem) : [];
	}

	return [];
};
