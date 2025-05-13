/**
 * 単一のメッセージを表す型定義.
 * AIとのインタラクションにおける各メッセージを定義します.
 */
export type MessageParam = {
	role: "system" | "user" | "assistant";
	content: string;
};

/**
 * 関数コールの情報を表す型定義.
 * AIによる関数呼び出し要求を定義します.
 */
export type FunctionCallInfo = {
	/**
	 * 呼び出される関数の名前.
	 */
	name: string;

	/**
	 * 関数に渡される引数（JSON文字列）.
	 */
	arguments: string;

	/**
	 * 関数呼び出しの一意識別子.
	 */
	callId: string;
};

/**
 * 関数コールのハンドラ関数の型.
 * @param functionCall - 処理する関数コール情報
 * @returns 関数の戻り値（JSON文字列変換可能なオブジェクト）またはnullまたはPromise
 */
export type FunctionCallHandler = (
	functionCall: FunctionCallInfo,
) => Promise<Record<string, unknown> | null> | Record<string, unknown> | null;

/**
 * ツールパラメータの定義.
 */
export type ToolParameter = {
	name: string;
	description: string;
};

/**
 * LLMで使用可能なツールの定義.
 */
export type ToolDefinition = {
	name: string;
	description: string;
	parameters: ToolParameter[];
};
