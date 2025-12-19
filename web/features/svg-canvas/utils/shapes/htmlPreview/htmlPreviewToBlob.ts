import { isHtmlPreviewData } from "./isHtmlPreviewData";
import type { Diagram } from "../../../types/state/core/Diagram";

/**
 * Converts HtmlPreview data to a Blob containing a complete HTML file.
 *
 * @param data - The diagram containing HtmlPreview data
 * @returns A Blob representing the HTML file or undefined if not valid
 */
export const htmlPreviewToBlob = (data: Diagram): Blob | undefined => {
	if (!isHtmlPreviewData(data)) {
		return undefined;
	}

	// Create a complete HTML document
	const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>HTML Preview Export</title>
</head>
<body>
${data.htmlContent}
</body>
</html>`;

	return new Blob([htmlDocument], {
		type: "text/html",
	});
};
