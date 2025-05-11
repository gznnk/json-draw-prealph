import type { ConnectPointData } from "./ConnectPointData";

/**
 * Data type for connectable diagram elements.
 * Defines the connection points that allow a diagram element to connect with other elements.
 */
export type ConnectableData = {
	connectPoints: ConnectPointData[];
};
