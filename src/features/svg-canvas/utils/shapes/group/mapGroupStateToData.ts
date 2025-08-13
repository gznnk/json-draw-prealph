import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { GroupDefaultData } from "../../../constants/data/shapes/GroupDefaultData";
import type {
	GroupData,
	GroupState,
} from "../../../types/diagrams/shapes/GroupTypes";

export const mapGroupStateToData =
	createStateToDataMapper<GroupData>(GroupDefaultData);

export const groupStateToData = (state: GroupState): GroupData =>
	mapGroupStateToData(state);
