// Import types.
import type { DiagramFeatures } from "../../../types/core/DiagramFeatures";
import type { DiagramType } from "../../../types/core/DiagramType";

// Import constants.
import { DiagramBaseDefaultData } from "../core/DiagramBaseDefaultData";
import { FillableDefaultData } from "../core/FillableDefaultData";
import { StrokableDefaultData } from "../core/StrokableDefaultData";
import { TextableDefaultData } from "../core/TextableDefaultData";
import { TransformativeDefaultData } from "../core/TransformativeDefaultData";
import { ConnectableDefaultData } from "./ConnectableDefaultData";

import { ItemableDefaultData } from "../core/ItemableDefaultData";

/**
 * Configuration for creating shape default data.
 */
export type DefaultDataConfig<P extends Record<string, unknown>> = {
	/** Shape type name (e.g., "Rectangle", "Circle") */
	type: string;
	/** Feature options for the shape */
	options: DiagramFeatures;
	/** Additional properties specific to this shape */
	properties: P;
};

/**
 * Creates default data for a shape by combining feature-specific defaults.
 * Uses conditional types to include only the required defaults based on features.
 *
 * @param config - Configuration for the shape
 * @returns Default data object for the shape
 */
export function CreateDefaultData<
	T,
	P extends Record<string, unknown>,
>(config: {
	type: DiagramType;
	options: DiagramFeatures;
	properties: P;
}): T {
	const { type, options, properties } = config;

	// Build default data by combining base data with feature-specific defaults
	const result = {
		...DiagramBaseDefaultData,
		...(options.transformative ? TransformativeDefaultData : {}),
		...(options.itemable ? ItemableDefaultData : {}),
		...(options.connectable ? ConnectableDefaultData : {}),
		...(options.strokable ? StrokableDefaultData : {}),
		...(options.fillable ? FillableDefaultData : {}),
		...(options.textable ? TextableDefaultData : {}),
		...properties,
		type,
	} as const;

	return result as T;
}
