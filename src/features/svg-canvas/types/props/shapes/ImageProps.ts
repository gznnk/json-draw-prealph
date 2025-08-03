// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "./CreateDiagramProps";
import type { ImageState } from "../../state/shapes/ImageState";

/**
 * Props for the Image component.
 */
export type ImageProps = CreateDiagramProps<
	ImageState,
	{
		selectable: true;
		transformative: true;
	}
>;
