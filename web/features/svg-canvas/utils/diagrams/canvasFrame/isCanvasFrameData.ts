/**
 * Validation function for CanvasFrame diagram data.
 */

import { CanvasFrameFeatures } from "../../../types/data/diagrams/CanvasFrameData";
import { createValidatorFromFeatures } from "../../validation/createValidatorFromFeatures";

/**
 * Check if data is valid CanvasFrame diagram data.
 * Uses the base validator from features.
 */
export const isCanvasFrameData =
	createValidatorFromFeatures(CanvasFrameFeatures);
