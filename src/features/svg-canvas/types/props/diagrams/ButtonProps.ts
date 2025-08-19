// Import types.
import type { ButtonFeatures } from "../../data/diagrams/ButtonData";
import type { ButtonState } from "../../state/diagrams/ButtonState";
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";

/**
 * Props for Button component
 */
export type ButtonProps = CreateDiagramProps<ButtonState, typeof ButtonFeatures>;