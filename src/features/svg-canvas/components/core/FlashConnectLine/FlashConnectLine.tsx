// Import React.
import { useEffect, useState, memo } from "react";

// Import functions related to SvgCanvas.
import { createDValue } from "../../shapes/Path/Path/PathFunctions";

// Import related to this component.
import { FlashPath } from "./FlashConnectLineStyled";
import { FLASH_CONNECT_LINE_EVENT_NAME } from "./FlashConnectConstants";
import type { FlashConnectLineEvent } from "./FlashConnectLineTypes";

export const FlashConnectLineComponent = () => {
	const [connectLineList, setConnectLineList] = useState<
		FlashConnectLineEvent[]
	>([]);

	useEffect(() => {
		const handleFlashConnectLine = (e: Event) => {
			const customEvent = e as CustomEvent<FlashConnectLineEvent>;
			const event = customEvent.detail;
			if (event) {
				setConnectLineList((prev) => [...prev, event]);
				setTimeout(() => {
					setConnectLineList((prev) =>
						prev.filter(
							(line) =>
								line.data.id !== event.data.id &&
								line.eventId !== event.eventId,
						),
					);
				}, 500); // アニメ後にリセット
			}
		};

		document.addEventListener(
			FLASH_CONNECT_LINE_EVENT_NAME,
			handleFlashConnectLine,
		);
		return () => {
			document.removeEventListener(
				FLASH_CONNECT_LINE_EVENT_NAME,
				handleFlashConnectLine,
			);
		};
	}, []);

	return connectLineList.map((connectLine) => (
		<FlashPath
			key={`${connectLine.data.id}-${connectLine.eventId}`}
			d={createDValue(connectLine.data.items)}
			$flash={true}
			strokeWidth={connectLine.data.strokeWidth}
			stroke={connectLine.data.stroke}
			fill="none"
			pointerEvents="none"
		/>
	));
};

export const FlashConnectLine = memo(FlashConnectLineComponent);
