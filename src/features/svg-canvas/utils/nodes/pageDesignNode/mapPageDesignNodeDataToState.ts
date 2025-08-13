import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultPageDesignNodeState } from "../../../constants/state/nodes/DefaultPageDesignNodeState";
import type { PageDesignNodeData } from "../../../types/diagrams/nodes/PageDesignNodeTypes";
import type { PageDesignNodeState } from "../../../types/diagrams/nodes/PageDesignNodeTypes";

export const mapPageDesignNodeDataToState =
	createDataToStateMapper<PageDesignNodeState>(DefaultPageDesignNodeState);

export const pageDesignNodeDataToState = (
	data: PageDesignNodeData,
): PageDesignNodeState => mapPageDesignNodeDataToState(data);
