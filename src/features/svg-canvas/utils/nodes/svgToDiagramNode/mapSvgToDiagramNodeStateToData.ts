import { createStateToDataMapper } from "../../core/createStateToDataMapper";
import { SvgToDiagramNodeDefaultData } from "../../../constants/data/nodes/SvgToDiagramNodeDefaultData";
import type { SvgToDiagramNodeData } from "../../../types/diagrams/nodes/SvgToDiagramNodeTypes";
import type { SvgToDiagramNodeState } from "../../../types/diagrams/nodes/SvgToDiagramNodeTypes";

export const mapSvgToDiagramNodeStateToData =
	createStateToDataMapper<SvgToDiagramNodeData>(SvgToDiagramNodeDefaultData);

export const svgToDiagramNodeStateToData = (
	state: SvgToDiagramNodeState,
): SvgToDiagramNodeData => mapSvgToDiagramNodeStateToData(state);
