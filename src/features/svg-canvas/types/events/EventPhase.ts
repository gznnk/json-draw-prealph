/**
 * Types of events in the diagram interaction lifecycle.
 * - Started: Initial event of an interaction sequence
 * - InProgress: Ongoing event during an interaction
 * - Ended: Final event of an interaction sequence
 * - Instant: One-time event with no duration
 */
export type EventPhase = "Started" | "InProgress" | "Ended" | "Instant";
