/**
 * Types of events in the diagram interaction lifecycle.
 * - Start: Initial event of an interaction sequence
 * - InProgress: Ongoing event during an interaction
 * - End: Final event of an interaction sequence
 * - Instant: One-time event with no duration
 */
export type EventType = "Start" | "InProgress" | "End" | "Instant";
