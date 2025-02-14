// 入力欄のコンポーネント
// プロパティは以下の通り
// - className: クラス名
// - type: 入力欄のタイプ
// - value: 入力値
// - placeholder: プレースホルダー
// - required: 入力必須かどうか
// - readOnly: 読み取り専用かどうか
// - disabled: 無効状態かどうか
// - visible: 表示状態かどうか
// - onChange: 入力値変更時のイベントハンドラ
// - onBlur: フォーカスが外れた時のイベントハンドラ
// - onFocus: フォーカスされた時のイベントハンドラ
// - onDoubleClick: ダブルクリック時のイベントハンドラ
// - onEnter: Enterキー押下時のイベントハンドラ

import type React from "react";
import classnames from "classnames";

/**
 * 入力欄のプロパティ
 *
 * @property {string} [className] クラス名
 * @property {("text" | "password" | "number")} [type] 入力欄のタイプ
 * @property {string} value 入力値
 * @property {string} [placeholder] プレースホルダー
 * @property {boolean} [required] 入力必須かどうか
 * @property {boolean} [readOnly] 読み取り専用かどうか
 * @property {boolean} [disabled] 無効状態かどうか
 * @property {boolean} [visible] 表示状態かどうか
 * @property {string} [regex] 入力値の正規表現
 * @property {(e: React.ChangeEvent<HTMLInputElement>)} onChange 入力値変更時のイベントハンドラ
 * @property {(e: React.FocusEvent<HTMLInputElement>) => void} [onBlur] フォーカスが外れた時のイベントハンドラ
 * @property {() => void} [onFocus] フォーカスされた時のイベントハンドラ
 * @property {() => void} [onDoubleClick] ダブルクリック時のイベントハンドラ
 * @property {() => void} [onEnter] Enterキー押下時のイベントハンドラ
 */
type InputProps = {
	className?: string;
	type?: "text" | "password" | "number";
	value: string;
	placeholder?: string;
	required?: boolean;
	readOnly?: boolean;
	disabled?: boolean;
	visible?: boolean;
	regex?: RegExp;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	onFocus?: () => void;
	onDoubleClick?: () => void;
	onEnter?: () => void;
};

const Input: React.FC<InputProps> = ({
	className = "",
	type = "text",
	value,
	placeholder = "",
	required = false,
	readOnly = false,
	disabled = false,
	visible = true,
	regex,
	onChange,
	onBlur,
	onFocus,
	onDoubleClick,
	onEnter,
}) => {
	if (!visible) {
		return null;
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && onEnter) {
			onEnter();
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (regex) {
			const matchResult = e.target.value.match(regex);
			e.target.value = matchResult ? matchResult.join("") : "";
			onChange(e);
		}
		if (onBlur) {
			onBlur(e);
		}
	};

	return (
		<input
			type={type}
			value={value}
			placeholder={placeholder}
			required={required}
			readOnly={readOnly}
			disabled={disabled}
			className={classnames("input", className)}
			onChange={handleChange}
			onBlur={handleBlur}
			onFocus={onFocus}
			onDoubleClick={onDoubleClick}
			onKeyDown={handleKeyDown}
		/>
	);
};

export default Input;
