// 型チェック関数を集約したユーティリティ
import {
	DiagramExportFunctions,
	type DiagramType,
} from "../types/DiagramCatalog";
import type {
	Shape,
	SelectableData,
	ConnectableData,
	TransformativeData,
	TextableData,
	ItemableData,
} from "../types/DiagramTypes";

// biome-ignore lint/suspicious/noExplicitAny: 型チェック関数のため
export const isShape = (obj: any): obj is Shape => {
	return (
		obj &&
		typeof obj.x === "number" &&
		typeof obj.y === "number" &&
		typeof obj.width === "number" &&
		typeof obj.height === "number" &&
		typeof obj.rotation === "number" &&
		typeof obj.scaleX === "number" &&
		typeof obj.scaleY === "number"
	);
};

// biome-ignore lint/suspicious/noExplicitAny: 型チェック関数のため
export const isSelectableData = (obj: any): obj is SelectableData => {
	return obj && typeof obj.isSelected === "boolean";
};

// biome-ignore lint/suspicious/noExplicitAny: 型チェック関数のため
export const isItemableData = (obj: any): obj is ItemableData => {
	return obj && Array.isArray(obj.items);
};

// biome-ignore lint/suspicious/noExplicitAny: 型チェック関数のため
export const isConnectableData = (obj: any): obj is ConnectableData => {
	return obj && Array.isArray(obj.connectPoints);
};

// biome-ignore lint/suspicious/noExplicitAny: 型チェック関数のため
export const isTransformativeData = (obj: any): obj is TransformativeData => {
	return (
		obj &&
		typeof obj.x === "number" &&
		typeof obj.y === "number" &&
		typeof obj.width === "number" &&
		typeof obj.height === "number" &&
		typeof obj.rotation === "number" &&
		typeof obj.scaleX === "number" &&
		typeof obj.scaleY === "number" &&
		typeof obj.keepProportion === "boolean"
	);
};

// biome-ignore lint/suspicious/noExplicitAny: 型チェック関数のため
export const isTextableData = (obj: any): obj is TextableData => {
	return (
		obj &&
		typeof obj.text === "string" &&
		typeof obj.fontSize === "number" &&
		typeof obj.fontColor === "string" &&
		typeof obj.fontFamily === "string" &&
		typeof obj.fontWeight === "string" &&
		typeof obj.isTextEditing === "boolean"
	);
};

// biome-ignore lint/suspicious/noExplicitAny: 型チェック関数のため
export const isStrokableData = (obj: any): obj is Shape => {
	return (
		obj && typeof obj.stroke === "string" && typeof obj.strokeWidth === "string"
	);
};

// biome-ignore lint/suspicious/noExplicitAny: 型チェック関数のため
export const isFillableData = (obj: any): obj is Shape => {
	return obj && typeof obj.fill === "string";
};

export const isExportable = (obj: unknown): boolean => {
	return (
		obj !== null &&
		typeof obj === "object" &&
		"type" in obj &&
		DiagramExportFunctions[obj.type as DiagramType] !== undefined
	);
};
