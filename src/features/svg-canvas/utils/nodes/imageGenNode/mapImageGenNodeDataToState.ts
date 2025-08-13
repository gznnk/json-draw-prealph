import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultImageGenNodeState } from "../../../constants/state/nodes/DefaultImageGenNodeState";
import type { ImageGenNodeData } from "../../../types/diagrams/nodes/ImageGenNodeTypes";
import type { ImageGenNodeState } from "../../../types/diagrams/nodes/ImageGenNodeTypes";

export const mapImageGenNodeDataToState =
	createDataToStateMapper<ImageGenNodeState>(DefaultImageGenNodeState);

export const imageGenNodeDataToState = (
	data: ImageGenNodeData,
): ImageGenNodeState => mapImageGenNodeDataToState(data);
