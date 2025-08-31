// Import types.
import type { Optional } from "../../../../../shared/utility-types";
import type { InputFeatures } from "../../data/elements/InputData";
import type { InputState } from "../../state/elements/InputState";
import type { SelectableProps } from "../core/SelectableProps";
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";

/**
 * Props for Input component
 */
export type InputProps = Optional<
	CreateDiagramProps<InputState, typeof InputFeatures> & SelectableProps,
	| "fill"
	| "stroke"
	| "strokeWidth"
	| "cornerRadius"
	| "fontColor"
	| "fontSize"
	| "fontFamily"
	| "fontWeight"
	| "textAlign"
	| "verticalAlign"
>;
