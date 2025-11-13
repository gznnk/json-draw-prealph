import { DiagramRegistry } from "../../../../registry/DiagramRegistry";
import type { DiagramMenuConfig } from "../../../../types/menu/DiagramMenuConfig";
import type { Diagram } from "../../../../types/state/core/Diagram";
import { collectDiagramTypes } from "../../../../utils/core/collectDiagramTypes";

/**
 * Merge a boolean property: only include if all configs have it set to true.
 */
const mergeBooleanProperty = (
	configs: DiagramMenuConfig[],
	key: keyof DiagramMenuConfig,
): boolean | undefined => {
	// Check if all configs have this property set to true
	const allTrue = configs.every((config) => config[key] === true);
	return allTrue ? true : undefined;
};

/**
 * Merge borderStyle property: only include if all configs have it,
 * and merge nested properties individually.
 */
const mergeBorderStyle = (
	configs: DiagramMenuConfig[],
): { radius?: boolean } | undefined => {
	// Check if all configs have borderStyle
	const allHaveBorderStyle = configs.every(
		(config) =>
			config.borderStyle !== undefined &&
			typeof config.borderStyle === "object",
	);

	if (!allHaveBorderStyle) {
		return undefined;
	}

	// Merge radius property: true if all configs have it set to true, false otherwise
	const allHaveRadius = configs.every(
		(config) => config.borderStyle?.radius === true,
	);

	return {
		radius: allHaveRadius,
	};
};

/**
 * Get the common menu configuration for diagrams.
 * Only returns menu items that are enabled (true) for all diagram types.
 * Each menu property is merged individually with its own merge logic.
 *
 * @param diagrams - Array of diagrams
 * @returns DiagramMenuConfig with only commonly enabled menu items set to true
 */
export const getCommonMenuConfig = (diagrams: Diagram[]): DiagramMenuConfig => {
	const types = collectDiagramTypes(diagrams);
	types.delete("Group"); // Exclude Group type

	if (types.size === 0) {
		return {};
	}

	const menuConfigs: DiagramMenuConfig[] = [];
	for (const type of types) {
		const config = DiagramRegistry.getMenuConfig(type);
		if (config) {
			menuConfigs.push(config);
		}
	}

	if (menuConfigs.length === 0) {
		return {};
	}

	// Merge boolean properties using a loop for DRY principle
	const result: DiagramMenuConfig = {};

	// List of boolean properties to merge
	const booleanKeys: Array<keyof DiagramMenuConfig> = [
		"backgroundColor",
		"borderColor",
		"lineColor",
		"arrowHead",
		"lineStyle",
		"fontStyle",
		"textAlignment",
	];

	// Merge each boolean property
	for (const key of booleanKeys) {
		const value = mergeBooleanProperty(menuConfigs, key);
		if (value !== undefined) {
			result[key] = value;
		}
	}

	// Merge borderStyle (nested object with special handling)
	const borderStyle = mergeBorderStyle(menuConfigs);
	if (borderStyle !== undefined) {
		result.borderStyle = borderStyle;
	}

	// aspectRatio is not merged here - it's always undefined
	// Display control is handled in DiagramMenu based on single/multi selection
	// Active/inactive state is determined in KeepAspectRatioMenu itself
	result.aspectRatio = undefined;

	return result;
};
