import type { DiagramBaseData } from "../../data/core/DiagramBaseData";
import type { DiagramBaseState } from "../core/DiagramBaseState";
import type { FillableState } from "../core/FillableState";
import type { ItemableState } from "../core/ItemableState";
import type { SelectableState } from "../core/SelectableState";
import type { StrokableState } from "../core/StrokableState";
import type { TextableState } from "../core/TextableState";
import type { TransformativeState } from "../core/TransformativeState";
import type { ConnectableState } from "./ConnectableState";

/**
 * Options for creating diagram state types.
 * Controls which feature interfaces should be included in the resulting type.
 */
export type DiagramStateOptions = {
	selectable?: boolean;
	transformative?: boolean;
	itemable?: boolean;
	connectable?: boolean;
	strokable?: boolean;
	fillable?: boolean;
	textable?: boolean;
};

/**
 * Create state type.
 * This type conditionally merges different state interfaces based on specified options,
 * allowing components to selectively inherit specific behaviors and state properties.
 */
export type CreateStateType<
	T extends DiagramBaseData,
	U extends DiagramStateOptions,
> = T &
	DiagramBaseState &
	(U["selectable"] extends true ? SelectableState : object) &
	(U["transformative"] extends true ? TransformativeState : object) &
	(U["itemable"] extends true ? ItemableState<DiagramBaseState> : object) &
	(U["connectable"] extends true ? ConnectableState : object) &
	(U["strokable"] extends true ? StrokableState : object) &
	(U["fillable"] extends true ? FillableState : object) &
	(U["textable"] extends true ? TextableState : object);
