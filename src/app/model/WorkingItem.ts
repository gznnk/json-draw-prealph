import type { ContentType } from "../types/ContentType";

export type WorkingItem = {
	id: string;
	content: string;
	isEditing: boolean;
	contentType?: ContentType;
};
