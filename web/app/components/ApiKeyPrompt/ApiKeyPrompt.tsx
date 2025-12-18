import type { ReactElement } from "react";
import { memo, useState } from "react";

import {
	Button,
	ButtonGroup,
	CloseButton,
	Description,
	Input,
	PromptContainer,
	PromptContent,
	Title,
} from "./styles";
import { useApiKey } from "../../contexts/ApiKeyContext";

const ApiKeyPromptComponent = (): ReactElement | null => {
	const { apiKey, setApiKey } = useApiKey();
	const [inputValue, setInputValue] = useState("");
	const [isVisible, setIsVisible] = useState(true);

	// ポップアップを閉じる
	const handleClose = () => {
		setIsVisible(false);
	};

	// APIキーを設定
	const handleSubmit = () => {
		if (inputValue.trim()) {
			setApiKey(inputValue.trim());
			setIsVisible(false);
		}
	};

	// すでにAPIキーが設定されているか、非表示の場合は表示しない
	if (apiKey || !isVisible) {
		return null;
	}

	return (
		<PromptContainer>
			<PromptContent>
				<CloseButton onClick={handleClose} aria-label="Close">
					×
				</CloseButton>
				<Title>OpenAI API Key</Title>
				<Description>
					Enter your OpenAI API key to use AI features.
					<br />
					The key is stored in memory only and will be cleared on page reload.
				</Description>
				<Input
					type="password"
					placeholder="sk-..."
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleSubmit();
						}
					}}
				/>
				<ButtonGroup>
					<Button onClick={handleSubmit} disabled={!inputValue.trim()}>
						Set Key
					</Button>
					<Button onClick={handleClose} $variant="secondary">
						Close
					</Button>
				</ButtonGroup>
			</PromptContent>
		</PromptContainer>
	);
};

export const ApiKeyPrompt = memo(ApiKeyPromptComponent);
