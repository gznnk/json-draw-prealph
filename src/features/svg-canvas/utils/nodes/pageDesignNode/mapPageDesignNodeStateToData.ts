import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { PageDesignNodeDefaultData } from "../../../constants/data/nodes/PageDesignNodeDefaultData";
import type { PageDesignNodeData } from "../../../types/diagrams/nodes/PageDesignNodeTypes";
import type { PageDesignNodeState } from "../../../types/diagrams/nodes/PageDesignNodeTypes";

export const mapPageDesignNodeStateToData =
	createStateToDataMapper<PageDesignNodeData>(PageDesignNodeDefaultData);

export const pageDesignNodeStateToData = (
	state: PageDesignNodeState,
): PageDesignNodeData => mapPageDesignNodeStateToData(state);
