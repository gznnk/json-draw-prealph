import type {
	CreateDataType,
	CreateDiagramProps,
	CreateStateType,
} from "../shapes/CreateDiagramTypes";

/**
 * Type of the SvgToDiagramNode data.
 */
export type SvgToDiagramNodeData = CreateDataType<{
	transformative: true;
	connectable: true;
}>;

/**
 * State type for SVG to diagram nodes.
 */
export type SvgToDiagramNodeState = CreateStateType<
	SvgToDiagramNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;

/**
 * Type of the SVG to diagram node component props.
 */
export type SvgToDiagramNodeProps = CreateDiagramProps<
	SvgToDiagramNodeState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		executable: true;
	}
>;
