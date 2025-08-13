import { createDataToStateMapper } from "../../core/createDataToStateMapper";
import { DefaultSvgToDiagramNodeState } from "../../../constants/state/nodes/DefaultSvgToDiagramNodeState";
import type { SvgToDiagramNodeData } from "../../../types/diagrams/nodes/SvgToDiagramNodeTypes";
import type { SvgToDiagramNodeState } from "../../../types/diagrams/nodes/SvgToDiagramNodeTypes";

export const mapSvgToDiagramNodeDataToState =
	createDataToStateMapper<SvgToDiagramNodeState>(DefaultSvgToDiagramNodeState);

export const svgToDiagramNodeDataToState = (
	data: SvgToDiagramNodeData,
): SvgToDiagramNodeState => mapSvgToDiagramNodeDataToState(data);
