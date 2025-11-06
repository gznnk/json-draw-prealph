/**
 * Path type definitions for different path rendering modes.
 *
 * - Straight: A single straight line from the first to the last point
 * - Polyline: Straight line segments connecting all path points (zigzag)
 * - Curve: Quadratic Bézier curves using path points as control points
 * - Rounded: Straight line segments with rounded corners between path points
 */
export type PathType = "Straight" | "Polyline" | "Curve" | "Rounded";
