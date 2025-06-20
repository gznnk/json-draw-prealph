// Import React.
import { memo, useEffect, useState } from "react";

// Import components related to SvgCanvas.
import { Path } from "../../Path";
import type { PathData } from "../../../../types/data/shapes/PathData";
import { useEventBus } from "../../../../context/EventBusContext";

// Import related to this component.
import { EVENT_NAME_NEW_CONNECT_LINE } from "../../../../constants/EventNames";
import type { NewConnectLineEvent } from "./NewConnectLineTypes";

/**
 * Component for rendering a new connection line.
 */
const NewConnectLineComponent: React.FC = () => {
	const eventBus = useEventBus();
	const [connectLine, setConnectLine] = useState<PathData>();

	useEffect(() => {
		const handleNewConnectLine = (e: Event) => {
			const customEvent = e as CustomEvent<NewConnectLineEvent>;
			const event = customEvent.detail;
			if (event) {
				setConnectLine(event.data);
			}
		};

		eventBus.addEventListener(
			EVENT_NAME_NEW_CONNECT_LINE,
			handleNewConnectLine,
		);
		return () => {
			eventBus.removeEventListener(
				EVENT_NAME_NEW_CONNECT_LINE,
				handleNewConnectLine,
			);
		};
	}, [eventBus]);

	if (!connectLine) {
		return null;
	}

	return <Path {...connectLine} />;
};

export const NewConnectLine = memo(NewConnectLineComponent);
