/**
 * Sheet information structure with content
 */
export interface SheetItem {
	/** Unique identifier for the sheet */
	id: string;
	/** Display title for the sheet */
	title: string;
	/** Content to be displayed inside the sheet */
	content: React.ReactNode;
}

/**
 * Props for Sheets component
 */
export interface SheetsProps {
	/** Array of sheet items containing sheet info and content */
	tabs: SheetItem[];
	/** ID of the currently active sheet */
	activeTabId: string;
	/** Callback when a sheet is selected */
	onTabSelect?: (tabId: string) => void;
	/** Callback when the add sheet button is clicked */
	onAddTab?: () => void;
}
