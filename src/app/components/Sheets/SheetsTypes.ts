/**
 * Defines the possible types of sheets that can be created in the application.
 */
export enum SheetType {
	/** Standard canvas sheet for diagrams */
	Canvas = "canvas",
	/** Interactive sandbox sheet for HTML content */
	Sandbox = "sandbox",
}

/**
 * Sheet information structure
 */
export type SheetItem = {
	/** Unique identifier for the sheet */
	id: string;
	/** Display title for the sheet */
	title: string;
	/** Type of sheet (canvas or sandbox) */
	type?: SheetType;
};

/**
 * Content item structure for sheets
 */
export type SheetContentItem = {
	/** ID matching to a sheet */
	id: string;
	/** Content to be displayed inside the sheet */
	content: React.ReactNode;
};

/**
 * Props for Sheets component
 */
export type SheetsProps = {
	/** Array of sheet items containing sheet info */
	tabs: SheetItem[];
	/** Array of content items corresponding to tabs */
	contentItems: SheetContentItem[];
	/** ID of the currently active sheet */
	activeTabId: string;
	/** Callback when a sheet is selected */
	onTabSelect?: (tabId: string) => void;
	/** Callback when the add sheet button is clicked */
	onAddTab?: () => void;
};
