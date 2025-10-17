import type { AiFeatures } from "../../data/diagrams/AiData";
import type { DiagramTextChangeEvent } from "../../events/DiagramTextChangeEvent";
import type { AiState } from "../../state/diagrams/AiState";
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";

/**
 * Props for Ai component
 */
export type AiProps = CreateDiagramProps<
	AiState,
	typeof AiFeatures,
	{
		onTextChange: (e: DiagramTextChangeEvent) => void;
	}
>;
