/**
 * Validation function for Sticky diagram data.
 */

import { StickyFeatures } from "../../../types/data/diagrams/StickyData";
import { createValidatorFromFeatures } from "../../validation/createValidatorFromFeatures";

/**
 * Check if data is valid Sticky diagram data.
 * Uses the base validator from features.
 */
export const isStickyData = createValidatorFromFeatures(StickyFeatures);
