// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "./CreateDiagramProps";
import type { ConnectLineState } from "../../state/shapes/ConnectLineState";
import type { ConnectLineFeatures } from "../../data/shapes/ConnectLineData";

/**
 * Props for ConnectLine component.
 */
export type ConnectLineProps = CreateDiagramProps<
	ConnectLineState,
	typeof ConnectLineFeatures
>;