// Import types related to SvgCanvas.
import type { CreateDiagramProps } from "../shapes/CreateDiagramProps";
import type { PageDesignNodeState } from "../../state/nodes/PageDesignNodeState";

/**
 * Type of the PageDesignNode component props.
 */
export type PageDesignNodeProps = CreateDiagramProps<
	PageDesignNodeState,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		executable: true;
		itemCreatable: true;
	}
>;
