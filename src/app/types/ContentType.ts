/**
 * コンテンツの種類を定義する列挙型
 */
export enum ContentType {
	/** マークダウンエディタ */
	MARKDOWN = "markdown",
	/** キャンバス */
	CANVAS = "canvas",
	/** サンドボックス */
	SANDBOX = "sandbox",
	/** その他のタイプ（将来の拡張用） */
	OTHER = "other",
}
