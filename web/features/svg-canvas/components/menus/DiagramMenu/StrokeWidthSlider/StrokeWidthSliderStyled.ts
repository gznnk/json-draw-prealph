import styled from "@emotion/styled";

/**
 * Wrapper for the entire stroke width slider component.
 */
export const StrokeWidthSliderWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex: 1;
`;

/**
 * Styled range input element for the stroke width slider.
 */
export const StrokeWidthSliderInput = styled.input`
	flex: 1;
	height: 4px;
	-webkit-appearance: none;
	appearance: none;
	background: transparent;
	outline: none;
	cursor: pointer;

	/* Track styles */
	&::-webkit-slider-runnable-track {
		width: 100%;
		height: 4px;
		background: linear-gradient(to right, #e5e7eb 0%, #6b7280 100%);
		border-radius: 2px;
	}

	&::-moz-range-track {
		width: 100%;
		height: 4px;
		background: linear-gradient(to right, #e5e7eb 0%, #6b7280 100%);
		border-radius: 2px;
	}

	/* Thumb styles */
	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		background-color: #ffffff;
		border: 2px solid #6b7280;
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
		margin-top: -6px;
	}

	&::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background-color: #ffffff;
		border: 2px solid #6b7280;
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
	}

	/* Hover and active states */
	&:hover::-webkit-slider-thumb {
		border-color: #374151;
		box-shadow: 0 0 0 4px rgba(107, 114, 128, 0.1);
	}

	&:hover::-moz-range-thumb {
		border-color: #374151;
		box-shadow: 0 0 0 4px rgba(107, 114, 128, 0.1);
	}

	&:active::-webkit-slider-thumb {
		transform: scale(1.1);
		box-shadow: 0 0 0 6px rgba(107, 114, 128, 0.2);
	}

	&:active::-moz-range-thumb {
		transform: scale(1.1);
		box-shadow: 0 0 0 6px rgba(107, 114, 128, 0.2);
	}
`;

/**
 * Footer section containing label and number input.
 */
export const StrokeWidthSliderFooter = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
`;

/**
 * Label for the stroke width slider.
 */
export const StrokeWidthSliderLabel = styled.label`
	font-size: 10px;
	color: #6b7280;
	user-select: none;
`;

/**
 * Number input for direct value entry.
 */
export const StrokeWidthSliderNumberInput = styled.input`
	width: 48px;
	height: 24px;
	padding: 2px 6px;
	font-size: 12px;
	text-align: center;
	color: #374151;
	background-color: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 4px;
	outline: none;
	transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

	&:hover {
		border-color: #d1d5db;
	}

	&:focus {
		border-color: #6b7280;
		background-color: #ffffff;
	}

	/* Hide spinner buttons */
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	&[type="number"] {
		-moz-appearance: textfield;
	}
`;
