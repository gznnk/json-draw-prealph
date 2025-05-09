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
 * import { Sheets, SheetItem } from "../app/components/Sheets";
 *
 * const ExamplePage = () => {
 *   const [activeTabId, setActiveTabId] = useState<string>("dashboard");
 *
 *   // Define sheets with their content
 *   const tabs: SheetItem[] = [
 *     {
 *       id: "dashboard",
 *       title: "Dashboard",
 *       content: <div style={{ position: "absolute", top: 0, left: 0 }}>Dashboard Content</div>
 *     },
 *     {
 *       id: "analytics",
 *       title: "Analytics",
 *       content: <div style={{ position: "absolute", top: 0, left: 0 }}>Analytics Content</div>
 *     },
 *     {
 *       id: "settings",
 *       title: "Settings",
 *       content: <div style={{ position: "absolute", top: 0, left: 0 }}>Settings Content</div>
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
 *         activeTabId={activeTabId}
 *         onTabSelect={setActiveTabId}
 *         onAddTab={handleAddTab}
 *       />
 *     </div>
 *   );
 * };
 * ```
 *
 * @param props - Component props including tabs with content, active tab ID, and tab selection handler
 * @returns Sheets component with Excel-like bottom tabs
 */
export const Sheets: FC<SheetsProps> = memo(
	({ tabs, activeTabId, onTabSelect, onAddTab }) => {
		// Handle tab selection
		const handleTabClick = (tabId: string) => {
			if (onTabSelect) {
				onTabSelect(tabId);
			}
		};

		// Find the active tab
		const activeTab = tabs.find((tab) => tab.id === activeTabId);

		return (
			<SheetsWrapper>
				{/* Content area - content is absolutely positioned inside this container */}
				<SheetContentContainer>
					{/* Only render the active tab content */}
					{activeTab?.content}
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
