import { isEnum } from "../../../../shared/validation";
import { VerticalAlignValues, type VerticalAlign } from "../../types/core/VerticalAlign";

/**
 * Check if value is a valid VerticalAlign.
 */
export const isVerticalAlign = isEnum(VerticalAlignValues) as (value: unknown) => value is VerticalAlign;
