import { memo } from "react";
import type { ReactElement } from "react";

import { FolderTree } from "../../../features/folder-explorer";
import { Page } from "../Page";

/**
 * FolderExplorerView component displays the folder explorer
 */
const FolderExplorerViewComponent = (): ReactElement => {
	return (
		<Page>
			<FolderTree />
		</Page>
	);
};

export const FolderExplorerView = memo(FolderExplorerViewComponent);
