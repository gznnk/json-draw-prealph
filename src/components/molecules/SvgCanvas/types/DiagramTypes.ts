// 図形に関する型定義

// Reactのインポート
import type React from "react";

// SvgCanvas関連型定義をインポート
import type { Point } from "./CoordinateTypes";
import type {
	ConnectPointMoveEvent,
	DiagramClickEvent,
	DiagramConnectEvent,
	DiagramDragDropEvent,
	DiagramDragEvent,
	DiagramHoverEvent,
	DiagramSelectEvent,
	DiagramTransformEvent,
	DiagramTransformStartEvent,
} from "./EventTypes";

// SvgCanvas関連コンポーネントをインポート
import Ellipse from "../components/diagram/Ellipse";
import Group from "../components/diagram/Group";
import Line, { LinePoint } from "../components/diagram/Line";
import Rectangle from "../components/diagram/Rectangle";
import Triangle from "../components/diagram/Triangle";

/**
 * 図形の種類
 */
export type DiagramType =
	| "ConnectPoint"
	| "Ellipse"
	| "Group"
	| "Line"
	| "LinePoint"
	| "Rectangle"
	| "Triangle";

export type DiagramBaseData = {
	id: string;
	type?: DiagramType;
	point: Point;
	isSelected: boolean;
	items?: Diagram[];
};

export type TransformativeData = DiagramBaseData & {
	width: number;
	height: number;
	rotation: number;
	scaleX: number;
	scaleY: number;
	keepProportion: boolean;
};

export type ConnectPointData = DiagramBaseData & {
	name: string;
};

export type EllipseData = TransformativeData & {
	fill: string;
	stroke: string;
	strokeWidth: string;
};
export type LinePointData = DiagramBaseData & {
	isActive?: boolean;
};
export type LineData = TransformativeData & {
	fill?: string;
	stroke: string;
	strokeWidth: string;
};
export type GroupData = TransformativeData & {
	items: Diagram[];
};
export type RectangleData = TransformativeData & {
	fill: string;
	stroke: string;
	strokeWidth: string;
};
export type TriangleData = TransformativeData & {
	fill: string;
	stroke: string;
	strokeWidth: string;
};

const DummyComponent: React.FC<DiagramBaseData> = () => null;

type DiagramCombined =
	| ConnectPointData
	| EllipseData
	| GroupData
	| LineData
	| LinePointData
	| RectangleData;

export type Diagram = DiagramCombined & {
	type: DiagramType;
};

// TODO: 整理
export type DiagramBaseProps = DiagramBaseData & {
	onTransformStart?: (e: DiagramTransformStartEvent) => void;
	onTransform: (e: DiagramTransformEvent) => void;
	onTransformEnd?: (e: DiagramTransformEvent) => void;
	onDiagramClick?: (e: DiagramClickEvent) => void;
	onDiagramDragStart?: (e: DiagramDragEvent) => void;
	onDiagramDrag?: (e: DiagramDragEvent) => void;
	onDiagramDragEnd?: (e: DiagramDragEvent) => void;
	onDiagramDrop?: (e: DiagramDragDropEvent) => void;
	onDiagramSelect?: (e: DiagramSelectEvent) => void;
	onDiagramHoverChange?: (e: DiagramHoverEvent) => void;
	onDiagramConnect?: (e: DiagramConnectEvent) => void;
	onConnectPointMove?: (e: ConnectPointMoveEvent) => void;
};

export type TransformativeProps = TransformativeData & {
	onTransformStart?: (e: DiagramTransformStartEvent) => void; // TODO: 必須にする
	onTransform: (e: DiagramTransformEvent) => void;
	onTransformEnd?: (e: DiagramTransformEvent) => void; // TODO: 必須にする
};

/**
 * 図形の種類とコンポーネントのマッピング
 */
export const DiagramTypeComponentMap: {
	// biome-ignore lint/suspicious/noExplicitAny: 種々の図形の共通の型を作るのは困難なため
	[key in DiagramType]: React.FC<any>;
} = {
	ConnectPoint: DummyComponent,
	Ellipse: Ellipse,
	Group: Group,
	Line: Line,
	LinePoint: LinePoint,
	Rectangle: Rectangle,
	Triangle: Triangle,
};
