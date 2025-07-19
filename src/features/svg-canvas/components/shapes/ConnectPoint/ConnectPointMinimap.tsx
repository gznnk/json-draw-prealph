// Import React.
import type React from "react";
import { memo } from "react";

// Import types.
import type { ConnectPointProps } from "../../../types/props/shapes/ConnectPointProps";

/**
 * ConnectPoint minimap component - lightweight version (essentially invisible for minimap).
 */
const ConnectPointMinimapComponent: React.FC<ConnectPointProps> = () => {
	// ConnectPoints are not displayed in minimap
	return null;
};

export const ConnectPointMinimap = memo(ConnectPointMinimapComponent);