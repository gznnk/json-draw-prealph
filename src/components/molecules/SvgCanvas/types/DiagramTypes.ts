// 図形に関する型定義

// SvgCanvas関連型定義をインポート
import type { Point } from "./CoordinateTypes";
import type {
	DiagramChangeEvent,
	DiagramPointerEvent,
	DiagramSelectEvent,
	ParentDiagramResizeEvent,
} from "./EventTypes";

// SvgCanvas関連コンポーネントをインポート
import Ellipse from "../components/diagram/Ellipse";
import Group from "../components/diagram/Group";
import Rectangle from "../components/diagram/Rectangle";

/**
 * 図形の種類
 */
export type DiagramType = "group" | "rectangle" | "ellipse";

/**
 * 子コンポーネントの図形への参照
 */
export type DiagramRef = {
	svgRef?: React.RefObject<SVGGElement>;
	draggableRef?: React.RefObject<SVGGElement>;
	onParentDiagramResize?: (e: ParentDiagramResizeEvent) => void;
	onParentDiagramResizeEnd?: (
		e: ParentDiagramResizeEvent,
	) => DiagramChangeEvent;
};

// TODO: 精査
export type Diagram = {
	id: string;
	type: DiagramType;
	point: Point;
	width: number;
	height: number;
	fill: string;
	stroke: string;
	strokeWidth: string;
	keepProportion: boolean;
	isSelected: boolean;
	items?: Diagram[];
};

export type DiagramProps = Diagram & {
	onDiagramClick?: (e: DiagramPointerEvent) => void; // TODO: 型
	onDiagramChangeEnd?: (e: DiagramChangeEvent) => void;
	onDiagramSelect?: (e: DiagramSelectEvent) => void;
	ref?: React.Ref<DiagramRef>;
};

/**
 * 図形の種類とコンポーネントのマッピング
 */
export const DiagramTypeComponentMap: {
	[key in DiagramType]: React.FC<DiagramProps>;
} = {
	group: Group,
	rectangle: Rectangle,
	ellipse: Ellipse,
};
