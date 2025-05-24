import type { SvgCanvas } from "../../models/SvgCanvas";

/**
 * Repository interface for SvgCanvas operations.
 * Defines the contract for storing and retrieving SvgCanvas objects.
 */
export interface SvgCanvasRepository {
	/**
	 * Updates a specific SvgCanvas in storage.
	 *
	 * @param canvas - The SvgCanvas object to update
	 * @returns Promise that resolves when the operation completes
	 */
	updateCanvas(canvas: SvgCanvas): Promise<void>;

	/**
	 * Retrieves a specific SvgCanvas by its ID.
	 *
	 * @param id - The ID of the SvgCanvas to retrieve
	 * @returns Promise resolving to the SvgCanvas if found, undefined otherwise
	 */
	getCanvasById(id: string): Promise<SvgCanvas | undefined>;

	/**
	 * Deletes a specific SvgCanvas by its ID.
	 *
	 * @param id - The ID of the SvgCanvas to delete
	 * @returns Promise that resolves when the operation completes
	 */
	deleteCanvasById(id: string): Promise<void>;
}
