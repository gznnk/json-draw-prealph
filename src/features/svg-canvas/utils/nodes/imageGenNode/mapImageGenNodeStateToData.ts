import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { ImageGenNodeDefaultData } from "../../../constants/data/nodes/ImageGenNodeDefaultData";
import type { ImageGenNodeData } from "../../../types/diagrams/nodes/ImageGenNodeTypes";
import type { ImageGenNodeState } from "../../../types/diagrams/nodes/ImageGenNodeTypes";

export const mapImageGenNodeStateToData =
	createStateToDataMapper<ImageGenNodeData>(ImageGenNodeDefaultData);

export const imageGenNodeStateToData = (
	state: ImageGenNodeState,
): ImageGenNodeData => mapImageGenNodeStateToData(state);
