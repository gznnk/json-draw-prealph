import OpenAI from "openai";
import type { LLMClient, ChatParams } from "../interface";
import type {
	MessageParam,
	ToolDefinition,
	FunctionCallHandler,
	FunctionCallInfo,
} from "../types";

/**
 * OpenAIを使用したLLMクライアントの実装.
 * 会話履歴を内部で管理し、APIとの通信を行います.
 */
export class OpenAIClient implements LLMClient {
	private readonly openai: OpenAI;
	private readonly tools?: ToolDefinition[];
	private readonly functionCallHandler?: FunctionCallHandler;
	private messages: MessageParam[] = [];

	/**
	 * OpenAIクライアントを初期化します.
	 *
	 * @param apiKey - OpenAI APIキー
	 * @param options - 初期化オプション
	 * @param options.tools - 利用可能なツール定義のリスト
	 * @param options.systemPrompt - システムプロンプト
	 * @param options.functionCallHandler - 関数コールを処理するハンドラ
	 */
	constructor(
		apiKey: string,
		options?: {
			tools?: ToolDefinition[];
			systemPrompt?: string;
			functionCallHandler?: FunctionCallHandler;
		},
	) {
		this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
		this.tools = options?.tools;
		this.functionCallHandler = options?.functionCallHandler;

		// システムプロンプトが指定されていれば初期メッセージとして追加
		if (options?.systemPrompt) {
			this.messages.push({
				role: "system",
				content: options.systemPrompt,
			});
		}
	}

	/**
	 * ユーザーメッセージを送信し、AIからの応答を処理します.
	 *
	 * @param params - チャットパラメータ
	 */
	async chat({ message, onTextChunk }: ChatParams): Promise<void> {
		// ユーザーメッセージを会話履歴に追加
		this.messages.push({
			role: "user",
			content: message,
		});

		// OpenAI形式のツール定義に変換
		const openaiTools = this.tools?.map((tool) => ({
			type: "function",
			name: tool.name,
			description: tool.description,
			parameters: {
				type: "object",
				properties: tool.parameters.reduce(
					(acc, param) => {
						acc[param.name] = {
							type: "string",
							description: param.description,
						};
						return acc;
					},
					{} as Record<string, unknown>,
				),
				additionalProperties: false,
				required: this.tools?.map((t) => t.name) || [],
			},
			strict: true,
		})) as OpenAI.Responses.Tool[] | undefined; // メッセージ履歴はそのまま使用
		let assistantMessage = "";
		const maxAttempts = 10; // 最大ループ回数を制限

		// 関数コールを処理するためのループ（複数回の関数コールをサポート）
		for (let attempts = 0; attempts < maxAttempts; attempts++) {
			// ストリーミングレスポンスの作成
			const stream = await this.openai.responses.create({
				model: "gpt-4o",
				input: this.messages as unknown as OpenAI.Responses.ResponseInput,
				tools: openaiTools,
				stream: true,
			});

			let foundFunctionCall = false;

			// イベントタイプに基づいてストリームからチャンクを処理
			for await (const event of stream) {
				// テキストデルタイベント - テキストチャンクを処理
				if (event.type === "response.output_text.delta") {
					const delta = event.delta;
					assistantMessage += delta;
					onTextChunk(delta);
				}

				// 関数呼び出しイベント - 関数コールハンドラがあれば処理
				if (
					event.type === "response.output_item.done" &&
					event.item?.type === "function_call" &&
					this.functionCallHandler
				) {
					foundFunctionCall = true;

					const functionCall: FunctionCallInfo = {
						name: event.item.name,
						arguments: event.item.arguments,
						callId: event.item.call_id,
					};

					try {
						// 関数コールを処理
						const result = await this.functionCallHandler(functionCall);

						if (result !== null) {
							// 関数コール情報をコンソールに出力
							console.log(`Function called: ${functionCall.name}`);

							// 関数呼び出しメッセージ（OpenAI APIは特殊な形式を要求）
							this.messages.push({
								role: "assistant",
								content: null,
								function_call: {
									name: functionCall.name,
									arguments: functionCall.arguments,
								},
							} as unknown as MessageParam);

							// 関数の結果メッセージ（OpenAI APIは特殊な形式を要求）
							this.messages.push({
								role: "function",
								name: functionCall.name,
								content: JSON.stringify(result),
							} as unknown as MessageParam);
						}
					} catch (error) {
						console.error("Error handling function call:", error); // 関数呼び出しメッセージ（エラーがあっても記録）
						this.messages.push({
							role: "assistant",
							content: null,
							function_call: {
								name: functionCall.name,
								arguments: functionCall.arguments,
							},
						} as unknown as MessageParam);

						// エラーメッセージを会話履歴に追加
						this.messages.push({
							role: "function",
							name: functionCall.name,
							content: JSON.stringify({ error: "Function execution failed" }),
						} as unknown as MessageParam);
					}
				}
			}

			// 関数コールがなければループを終了
			if (!foundFunctionCall) {
				break;
			}
		}

		// 応答を会話履歴に追加
		if (assistantMessage) {
			this.messages.push({
				role: "assistant",
				content: assistantMessage,
			});
		}
	}

	/**
	 * 会話履歴をクリアします.
	 */
	clearConversation(): void {
		// システムプロンプトを保持する場合は最初のメッセージだけ残す
		const systemMessage = this.messages.find((msg) => msg.role === "system");
		this.messages = systemMessage ? [systemMessage] : [];
	}
}
