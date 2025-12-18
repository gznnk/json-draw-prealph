import { createContext, useContext, useState, type ReactNode } from "react";

type ApiKeyContextType = {
	apiKey: string | null;
	setApiKey: (key: string | null) => void;
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

type ApiKeyProviderProps = {
	children: ReactNode;
};

export const ApiKeyProvider = ({ children }: ApiKeyProviderProps) => {
	const [apiKey, setApiKey] = useState<string | null>(null);

	return (
		<ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
			{children}
		</ApiKeyContext.Provider>
	);
};

export const useApiKey = (): ApiKeyContextType => {
	const context = useContext(ApiKeyContext);
	if (context === undefined) {
		throw new Error("useApiKey must be used within an ApiKeyProvider");
	}
	return context;
};
