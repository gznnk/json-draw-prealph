// Import React.
import type React from "react";
import { memo, useEffect, useState, useRef } from "react";

// Import other libraries.
import { OpenAI } from "openai";

// Import types related to SvgCanvas.
import type { ExecuteEvent, NewItemEvent } from "../../../types/EventTypes";

// Import components related to SvgCanvas.
import { Rectangle, type RectangleProps } from "../../shapes/Rectangle";
import { IconContainer } from "../../core/IconContainer";

// Import hooks related to SvgCanvas.
import { useExecutionChain } from "../../../hooks/useExecutionChain";

// Import functions related to SvgCanvas.
import { newEventId } from "../../../utils/Util";

// Import utilities.
import { OpenAiKeyManager } from "../../../../../utils/KeyManager";

// Import related to this component.
import { RectangleWrapper } from "./AgentNodeStyled";
import { Agent } from "../../icons/Agent";
import { createLLMNodeData } from "../LLMNode";

/**
 * Props for the AgentNode component.
 */
// TODO: CreateDiagramPropsで生成
type AgentProps = RectangleProps & {
	onExecute: (e: ExecuteEvent) => void;
	onNewItem: (e: NewItemEvent) => void;
};

/**
 * AgentNode component.
 */
const AgentNodeComponent: React.FC<AgentProps> = (props) => {
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

	// Handle execution events for the Agent node.
	useExecutionChain({
		id: props.id,
		onPropagation: async (e) => {
			if (e.data.text === "") return;
			if (e.eventType !== "Instant" && e.eventType !== "End") return;

			const processId = newEventId();
			setProcessIdList((prev) => [...prev, processId]);

			const openai = new OpenAI({
				apiKey: apiKey,
				dangerouslyAllowBrowser: true, // ブラウザで直接使用する場合に必要
			});

			try {
				const stream = await openai.responses.create({
					model: "gpt-4o",
					// instructions: props.text,
					instructions:
						"You are a ai agent. You can call functions to perform tasks.",
					input: e.data.text,
					stream: true, // 必須！
					tools: [
						{
							type: "function",
							name: "add_llm_node",
							description: "Adds a new LLM node to the canvas.",
							parameters: {
								type: "object",
								properties: {
									instructions: {
										type: "string",
										description:
											"Inserts a system message as the first item in the model's context.",
									},
								},
								additionalProperties: false,
								required: ["instructions"],
							},
							strict: true,
						},
					],
				});

				let fullOutput = "";

				props.onExecute({
					id: props.id,
					eventId: newEventId(),
					eventType: "Start",
					data: {
						text: "",
					},
				});

				for await (const event of stream) {
					console.log(event);
					if (event.type === "response.function_call_arguments.delta") {
						const delta = event.delta;
						fullOutput += delta;
					}
					if (
						event.type === "response.output_item.done" &&
						event.item?.type === "function_call"
					) {
						const functionName = event.item.name;
						const functionCallArguments = JSON.parse(event.item.arguments);
						if (functionName === "add_llm_node") {
							const llmNode = createLLMNodeData({
								x: props.x + (Math.random() - 0.5) * 300,
								y: props.y + (Math.random() - 0.5) * 300,
								text: functionCallArguments.instructions,
							});
							props.onNewItem({
								item: llmNode,
							});
						}
					}
				}

				props.onExecute({
					id: props.id,
					eventId: newEventId(),
					eventType: "End",
					data: {
						text: fullOutput,
					},
				});
			} catch (error) {
				console.error("Error fetching data from OpenAI API:", error);
				alert("APIリクエスト中にエラーが発生しました。");
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
					iconWidth={80}
					iconHeight={80}
				>
					<Agent width={80} height={80} animate={processIdList.length !== 0} />
				</IconContainer>
			)}
			<RectangleWrapper visible={props.isTextEditing}>
				<Rectangle {...props} />
			</RectangleWrapper>
		</>
	);
};

export const AgentNode = memo(AgentNodeComponent);
