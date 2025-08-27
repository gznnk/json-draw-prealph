// Import types.
import type { TextFeatures } from "../../data/elements/TextData";
import type { TextState } from "../../state/elements/TextState";
import type { SelectableProps } from "../core/SelectableProps";
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";

/**
 * Props for Text component
 */
export type TextProps = CreateDiagramProps<TextState, typeof TextFeatures> &
	SelectableProps;
