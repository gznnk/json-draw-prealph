import type { TextableType, TextAlign, VerticalAlign } from "../base";

/**
 * テキストを持つ図形のデータ
 */
export type TextableData = {
	text: string;
	textType: TextableType;
	textAlign: TextAlign;
	verticalAlign: VerticalAlign;
	fontColor: string;
	fontSize: number;
	fontFamily: string;
	fontWeight: string;
	isTextEditing: boolean; // 永続化されないプロパティ TODO: 永続化されるプロパティと分ける
};
