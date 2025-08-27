// Import types.
import type { ButtonFeatures } from "../../data/elements/ButtonData";
import type { ButtonState } from "../../state/elements/ButtonState";
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";

/**
 * Props for Button component
 */
export type ButtonProps = CreateDiagramProps<ButtonState, typeof ButtonFeatures>;