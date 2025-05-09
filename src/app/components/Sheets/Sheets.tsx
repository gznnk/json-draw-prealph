import { memo } from "react";
import type { FC } from "react";
import type { SheetsProps } from "./SheetsTypes";
import {
	SheetsWrapper,
	SheetContentContainer,
	SheetBar,
	SheetButton,
	AddSheetButton,
} from "./SheetsStyled";

/**
 * Sheets component that displays content in tabs at the bottom of the screen
 * similar to Excel spreadsheets.
 *
 * Features:
 * - Shows tabs at the bottom of the container like Excel sheets
 * - Only renders content of the active sheet
 * - Supports absolute positioning for sheet content
 * - Allows switching between sheets by clicking on sheet buttons
 * - Includes an "Add Sheet" button at the end of the sheet bar (Excel-like)
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { Sheets, SheetItem, SheetContentItem } from "../app/components/Sheets";
 *
 * const ExamplePage = () => {
 *   const [activeTabId, setActiveTabId] = useState<string>("dashboard");
 *
 *   // Define sheets
 *   const tabs: SheetItem[] = [
 *     { id: "dashboard", title: "Dashboard" },
 *     { id: "analytics", title: "Analytics" },
 *     { id: "settings", title: "Settings" },
 *   ];
 *
 *   // Define content items
 *   const contentItems: SheetContentItem[] = [
 *     {
 *       id: "dashboard",
 *       content: <div style={{ position: "absolute", top: 0, left: 0 }}>Dashboard Content</div>,
 *     },
 *     {
 *       id: "analytics",
 *       content: <div style={{ position: "absolute", top: 0, left: 0 }}>Analytics Content</div>,
 *     },
 *     {
 *       id: "settings",
 *       content: <div style={{ position: "absolute", top: 0, left: 0 }}>Settings Content</div>,
 *     },
 *   ];
 *
 *   // Handle adding a new sheet
 *   const handleAddTab = () => {
 *     // Logic to add a new sheet
 *   };
 *
 *   return (
 *     <div style={{ width: "100%", height: "500px" }}>
 *       <Sheets
 *         tabs={tabs}
 *         contentItems={contentItems}
 *         activeTabId={activeTabId}
 *         onTabSelect={setActiveTabId}
 *         onAddTab={handleAddTab}
 *       />
 *     </div>
 *   );
 * };
 * ```
 *
 * @param props - Component props including tabs info, content items, active tab ID, and event handlers
 * @returns Sheets component with Excel-like bottom tabs
 */
export const Sheets: FC<SheetsProps> = memo(
	({ tabs, contentItems, activeTabId, onTabSelect, onAddTab }) => {
		// Handle tab selection
		const handleTabClick = (tabId: string) => {
			if (onTabSelect) {
				onTabSelect(tabId);
			}
		};

		// Find the content for active tab
		const activeContent = contentItems.find(
			(item) => item.id === activeTabId,
		)?.content;

		return (
			<SheetsWrapper>
				{/* Content area - content is absolutely positioned inside this container */}
				<SheetContentContainer>
					{/* Render the content for active tab */}
					{activeContent}
				</SheetContentContainer>

				{/* Sheet bar at the bottom */}
				<SheetBar>
					{tabs.map((tab) => (
						<SheetButton
							key={tab.id}
							isActive={activeTabId === tab.id}
							onClick={() => handleTabClick(tab.id)}
						>
							{tab.title}
						</SheetButton>
					))}

					{/* Excel-like Add Sheet button */}
					{onAddTab && (
						<AddSheetButton
							onClick={onAddTab}
							aria-label="Add new sheet"
							title="Add new sheet"
						>
							+
						</AddSheetButton>
					)}
				</SheetBar>
			</SheetsWrapper>
		);
	},
);
