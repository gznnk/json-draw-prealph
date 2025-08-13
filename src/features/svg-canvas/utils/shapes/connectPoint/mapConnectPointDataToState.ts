import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultConnectPointState } from "../../../constants/state/shapes/DefaultConnectPointState";
import type { ConnectPointData } from "../../../types/diagrams/shapes/ConnectTypes";
import type { ConnectPointState } from "../../../types/diagrams/shapes/ConnectTypes";

export const mapConnectPointDataToState =
	createDataToStateMapper<ConnectPointState>(DefaultConnectPointState);

export const connectPointDataToState = (
	data: ConnectPointData,
): ConnectPointState => mapConnectPointDataToState(data);
