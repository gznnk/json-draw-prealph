// Import types related to SvgCanvas.
import type {
	CreateDiagramProps,
	CreateDiagramType,
} from "../../../types/DiagramTypes";

/**
 * 楕円のデータ
 */
export type EllipseData = CreateDiagramType<{
	selectable: true;
	transformative: true;
	connectable: true;
	strokable: true;
	fillable: true;
	textable: true;
}>;

/**
 * 楕円コンポーネントのプロパティ
 */
export type EllipseProps = CreateDiagramProps<
	EllipseData,
	{
		selectable: true;
		transformative: true;
		connectable: true;
		textable: true;
	}
>;
