import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { ConnectPointDefaultData } from "../../../constants/data/shapes/ConnectPointDefaultData";
import type { ConnectPointData } from "../../../types/diagrams/shapes/ConnectTypes";
import type { ConnectPointState } from "../../../types/diagrams/shapes/ConnectTypes";

export const mapConnectPointStateToData =
	createStateToDataMapper<ConnectPointData>(ConnectPointDefaultData);

export const connectPointStateToData = (
	state: ConnectPointState,
): ConnectPointData => mapConnectPointStateToData(state);
