// Import types.
import type { ButtonData } from "../../../types/data/diagrams/ButtonData";

// Import constants.
import { ButtonDefaultData } from "../../../constants/data/diagrams/ButtonDefaultData";

// Import utils.
import { createStateToDataMapper } from "../../core/createStateToDataMapper";

export const mapButtonStateToData = createStateToDataMapper<ButtonData>(
	ButtonDefaultData,
);