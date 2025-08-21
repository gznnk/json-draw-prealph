// Import React.
import type React from "react";
import { memo, useEffect, useRef, useState } from "react";

// Import other libraries.
import { OpenAI } from "openai";

// Import types.
import type { LLMNodeProps } from "../../../types/props/nodes/LLMNodeProps";

// Import components related to SvgCanvas.
import { IconContainer } from "../../core/IconContainer";
import { CPU_1 } from "../../icons/CPU_1";
import { Rectangle } from "../../shapes/Rectangle";

// Import hooks.
import { useExecutionChain } from "../../../hooks/useExecutionChain";

// Import utils.
import { OpenAiKeyManager } from "../../../../../utils/KeyManager";
import { newEventId } from "../../../utils/core/newEventId";

// Import related to this component.
import { RectangleWrapper } from "./LLMNodeStyled";

/**
 * LLMNode component.
 */
const LLMNodeComponent: React.FC<LLMNodeProps> = (props) => {
	const [apiKey, setApiKey] = useState<string>("");
	const [processIdList, setProcessIdList] = useState<string[]>([]);

	// Create references bypass to avoid function creation in every render.
	const refBusVal = {
		props,
	};
	const refBus = useRef(refBusVal);
	refBus.current = refBusVal;

	// Load the API key from local storage when the component mounts.
	useEffect(() => {
		const storedApiKey = OpenAiKeyManager.loadKey();
		if (storedApiKey) {
			setApiKey(storedApiKey);
		}
	}, []);

	// Handle execution events for the LLM node.
	useExecutionChain({
		id: props.id,
		onPropagation: async (e) => {
			if (e.data.text === "") return;
			if (e.eventPhase !== "Ended") return;

			const processId = newEventId();
			setProcessIdList((prev) => [...prev, processId]);
			const openai = new OpenAI({
				apiKey: apiKey,
				dangerouslyAllowBrowser: true, // Required for direct browser usage
			});

			try {
				const stream = await openai.responses.create({
					model: "gpt-4o",
					instructions: props.text,
					input: e.data.text,
					stream: true,
				});

				let fullOutput = "";

				const eventId = newEventId();

				props.onExecute?.({
					id: props.id,
					eventId,
					eventPhase: "Started",
					data: {
						text: "",
					},
				});

				for await (const event of stream) {
					if (event.type === "response.output_text.delta") {
						const delta = event.delta;
						fullOutput += delta;

						props.onExecute?.({
							id: props.id,
							eventId,
							eventPhase: "InProgress",
							data: {
								text: fullOutput,
							},
						});
					}

					if (event.type === "response.output_text.done") {
						props.onExecute?.({
							id: props.id,
							eventId,
							eventPhase: "Ended",
							data: {
								text: fullOutput,
							},
						});
					}
				}
			} catch (error) {
				console.error("Error fetching data from OpenAI API:", error);
				alert("An error occurred during the API request.");
			}

			setProcessIdList((prev) => prev.filter((id) => id !== processId));
		},
	});

	return (
		<>
			{!props.isTextEditing && (
				<IconContainer
					x={props.x}
					y={props.y}
					width={props.width}
					height={props.height}
					rotation={props.rotation}
					scaleX={props.scaleX}
					scaleY={props.scaleY}
				>
					<CPU_1
						width={props.width}
						height={props.height}
						animation={processIdList.length !== 0}
					/>
				</IconContainer>
			)}
			<RectangleWrapper visible={props.isTextEditing}>
				<Rectangle {...props} radius={0}/>
			</RectangleWrapper>
		</>
	);
};

export const LLMNode = memo(LLMNodeComponent);
