// Import React.
import type React from "react";
import { memo, useState, useEffect } from "react";

// Import components related to SandboxedIframe.
import { SandboxedIframe } from "../../../features/sandboxed-iframe/SandboxedIframe";

// Import types related to this component.
import type { SandboxSheetProps } from "./SandboxSheetTypes";

// Import functions related to this component.
import { UPDATE_SANDBOX_CONTENT_EVENT_NAME } from "./SandboxSheetFunctions";

/**
 * A component that renders a sandboxed iframe within a container.
 * This provides a safe environment for executing external code.
 * Listens for update events to change the content dynamically.
 *
 * @param props - The component props
 * @param props.id - Unique identifier for the sandbox sheet
 * @returns A sandboxed iframe component
 */
const SandboxSheetComponent: React.FC<SandboxSheetProps> = ({ id }) => {
	// Generate default HTML content for the sandbox
	const generateDefaultContent = (sandboxId: string): string => {
		return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Sandbox ${sandboxId}</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 1rem;
          }
        </style>
      </head>
      <body>
        <h1>Sandbox ${sandboxId}</h1>
        <p>This is a sandboxed environment.</p>
        <script>
          console.log('Sandbox ${sandboxId} initialized');
        </script>
      </body>
    </html>
  `;
	};

	// State to store the current HTML content
	const [content, setContent] = useState<string>(generateDefaultContent(id));

	// Listen for content update events
	useEffect(() => {
		const handleUpdateContent = (e: Event): void => {
			const { id: targetId, htmlContent } = (e as CustomEvent).detail;

			// Only update if this sandbox is targeted
			if (targetId === id && htmlContent) {
				setContent(htmlContent);
			}
		};

		// Add event listener
		window.addEventListener(
			UPDATE_SANDBOX_CONTENT_EVENT_NAME,
			handleUpdateContent,
		);

		// Clean up
		return () => {
			window.removeEventListener(
				UPDATE_SANDBOX_CONTENT_EVENT_NAME,
				handleUpdateContent,
			);
		};
	}, [id]);

	return <SandboxedIframe srcdoc={content} />;
};

export const SandboxSheet = memo(SandboxSheetComponent);
