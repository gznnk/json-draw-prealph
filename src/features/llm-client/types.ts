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
