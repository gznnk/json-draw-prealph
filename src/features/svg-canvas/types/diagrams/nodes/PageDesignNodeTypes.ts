import type {
	CreateDataType,
	CreateDiagramProps,
	CreateStateType,
} from "../shapes/CreateDiagramTypes";

/**
 * Type of the PageDesignNode data.
 */
export type PageDesignNodeData = CreateDataType<{
	transformative: true;
	connectable: true;
}>;

/**
 * State type for page design nodes.
 */
export type PageDesignNodeState = CreateStateType<
	PageDesignNodeData,
	{
		transformative: true;
		connectable: true;
		selectable: true;
		executable: true;
	}
>;

/**
 * Type of the page design node component props.
 */
export type PageDesignNodeProps = CreateDiagramProps<
	PageDesignNodeState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		executable: true;
	}
>;
