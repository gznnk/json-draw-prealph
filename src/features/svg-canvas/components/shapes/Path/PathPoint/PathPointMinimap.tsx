// Import React.
import type React from "react";
import { memo } from "react";

// Import types.
import type { PathPointProps } from "../../../../types/diagrams/shapes/PathPointProps";

/**
 * PathPoint minimap component - lightweight version (essentially invisible for minimap).
 */
const PathPointMinimapComponent: React.FC<PathPointProps> = () => {
	// PathPoints are not displayed in minimap
	return null;
};

export const PathPointMinimap = memo(PathPointMinimapComponent);
