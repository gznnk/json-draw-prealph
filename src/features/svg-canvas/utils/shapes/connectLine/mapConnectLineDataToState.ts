import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultConnectLineState } from "../../../constants/state/shapes/DefaultConnectLineState";
import type {
	ConnectLineData,
	ConnectLineState,
} from "../../../types/diagrams/shapes/ConnectTypes";

export const mapConnectLineDataToState =
	createDataToStateMapper<ConnectLineState>(DefaultConnectLineState);

export const connectLineDataToState = (
	data: ConnectLineData,
): ConnectLineState => mapConnectLineDataToState(data);
