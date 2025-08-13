import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultGroupState } from "../../../constants/state/shapes/DefaultGroupState";
import type {
	GroupData,
	GroupState,
} from "../../../types/diagrams/shapes/GroupTypes";

export const mapGroupDataToState =
	createDataToStateMapper<GroupState>(DefaultGroupState);

export const groupDataToState = (data: GroupData): GroupState =>
	mapGroupDataToState(data);
