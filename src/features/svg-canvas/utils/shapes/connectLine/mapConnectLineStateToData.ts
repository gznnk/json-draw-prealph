import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { ConnectLineDefaultData } from "../../../constants/data/shapes/ConnectLineDefaultData";
import type {
	ConnectLineData,
	ConnectLineState,
} from "../../../types/diagrams/shapes/ConnectTypes";

export const mapConnectLineStateToData =
	createStateToDataMapper<ConnectLineData>(ConnectLineDefaultData);

export const connectLineStateToData = (
	state: ConnectLineState,
): ConnectLineData => mapConnectLineStateToData(state);
