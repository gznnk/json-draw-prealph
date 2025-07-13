import { isConnectableData } from "../isConnectableData";
import type { ConnectableData } from "../../../types/data/shapes/ConnectableData";
import type { ConnectPointData } from "../../../types/data/shapes/ConnectPointData";

describe("isConnectableData", () => {
	// Valid ConnectableData object for testing
	const validConnectPointData: ConnectPointData = {
		id: "point1",
		type: "Rectangle",
		x: 0,
		y: 0,
		name: "connection-point",
	};

	const validConnectableData: ConnectableData = {
		showConnectPoints: true,
		connectPoints: [validConnectPointData],
	};

	describe("Valid ConnectableData", () => {
		it("should return true for valid ConnectableData with showConnectPoints true", () => {
			expect(isConnectableData(validConnectableData)).toBe(true);
		});

		it("should return true for valid ConnectableData with showConnectPoints false", () => {
			const data: ConnectableData = {
				showConnectPoints: false,
				connectPoints: [validConnectPointData],
			};
			expect(isConnectableData(data)).toBe(true);
		});

		it("should return true for valid ConnectableData with empty connectPoints array", () => {
			const data: ConnectableData = {
				showConnectPoints: true,
				connectPoints: [],
			};
			expect(isConnectableData(data)).toBe(true);
		});

		it("should return true for valid ConnectableData with multiple connectPoints", () => {
			const data: ConnectableData = {
				showConnectPoints: true,
				connectPoints: [
					validConnectPointData,
					{
						id: "point2",
						type: "Ellipse",
						x: 10,
						y: 10,
						name: "another-point",
					},
				],
			};
			expect(isConnectableData(data)).toBe(true);
		});
	});

	describe("Invalid data types", () => {
		it("should return false for null", () => {
			expect(isConnectableData(null)).toBe(false);
		});

		it("should return false for undefined", () => {
			expect(isConnectableData(undefined)).toBe(false);
		});

		it("should return false for string", () => {
			expect(isConnectableData("not an object")).toBe(false);
		});

		it("should return false for number", () => {
			expect(isConnectableData(123)).toBe(false);
		});

		it("should return false for boolean", () => {
			expect(isConnectableData(true)).toBe(false);
		});

		it("should return false for array", () => {
			expect(isConnectableData([])).toBe(false);
		});
	});

	describe("Missing required properties", () => {
		it("should return false for object without connectPoints property", () => {
			const data = {
				showConnectPoints: true,
			};
			expect(isConnectableData(data)).toBe(false);
		});

		it("should return false for object without showConnectPoints property", () => {
			const data = {
				connectPoints: [],
			};
			expect(isConnectableData(data)).toBe(false);
		});

		it("should return false for object with connectPoints that is not an array", () => {
			const data = {
				showConnectPoints: true,
				connectPoints: "not an array",
			};
			expect(isConnectableData(data)).toBe(false);
		});

		it("should return false for object with connectPoints as null", () => {
			const data = {
				showConnectPoints: true,
				connectPoints: null,
			};
			expect(isConnectableData(data)).toBe(false);
		});

		it("should return false for object with connectPoints as undefined", () => {
			const data = {
				showConnectPoints: true,
				connectPoints: undefined,
			};
			expect(isConnectableData(data)).toBe(false);
		});

		it("should return false for object with showConnectPoints that is not a boolean", () => {
			const data = {
				showConnectPoints: "true",
				connectPoints: [],
			};
			expect(isConnectableData(data)).toBe(false);
		});

		it("should return false for object with showConnectPoints as null", () => {
			const data = {
				showConnectPoints: null,
				connectPoints: [],
			};
			expect(isConnectableData(data)).toBe(false);
		});

		it("should return false for object with showConnectPoints as undefined", () => {
			const data = {
				showConnectPoints: undefined,
				connectPoints: [],
			};
			expect(isConnectableData(data)).toBe(false);
		});
	});

	describe("Edge cases", () => {
		it("should return true for object with additional properties", () => {
			const data = {
				showConnectPoints: true,
				connectPoints: [],
				extraProperty: "should be ignored",
			};
			expect(isConnectableData(data)).toBe(true);
		});

		it("should return false for object missing showConnectPoints", () => {
			// Current implementation now checks showConnectPoints property
			const data = {
				connectPoints: [],
			};
			expect(isConnectableData(data)).toBe(false);
		});
	});

	/**
	 * Validation completeness test.
	 * This test ensures that if ConnectableData type definition changes,
	 * the validation function needs to be updated accordingly.
	 *
	 * If this test fails, it means:
	 * 1. ConnectableData type has been modified
	 * 2. isConnectableData validation function needs to be updated
	 * 3. This test suite needs to be updated to include new properties
	 */
	describe("Validation completeness", () => {
		it("should validate all required properties of ConnectableData type", () => {
			// This test creates an object that should match ConnectableData exactly
			const completeValidData: ConnectableData = {
				showConnectPoints: true,
				connectPoints: [validConnectPointData],
			} as const satisfies ConnectableData;

			// Test that our validator accepts the complete valid data
			expect(isConnectableData(completeValidData)).toBe(true);

			// Test missing each required property one by one
			// If ConnectableData gains new required properties, add tests here

			// Missing showConnectPoints - now properly validated, should fail
			const missingShowConnectPoints = {
				connectPoints: [validConnectPointData],
			};
			expect(isConnectableData(missingShowConnectPoints)).toBe(false);

			// Missing connectPoints - should fail
			const missingConnectPoints = {
				showConnectPoints: true,
			};
			expect(isConnectableData(missingConnectPoints)).toBe(false);
		});

		/**
		 * Property coverage test.
		 * This test documents which properties are currently being validated.
		 * When ConnectableData type changes, update this test to maintain coverage.
		 */
		it("should document current validation coverage", () => {
			// Current implementation validates:
			// 1. Object is not null
			// 2. Object is an object type
			// 3. Has 'showConnectPoints' property
			// 4. showConnectPoints is a boolean
			// 5. Has 'connectPoints' property
			// 6. connectPoints is an array

			// Properties NOT currently validated:
			// - connectPoints array contents/structure
			// - connectPoints array element types

			const minimalValidObject = {
				showConnectPoints: true,
				connectPoints: [], // Both properties are now validated
			};

			expect(isConnectableData(minimalValidObject)).toBe(true);

			// This test serves as documentation of current behavior
			// and will need updates when validation logic is enhanced
		});

		/**
		 * Future-proofing test.
		 * If ConnectableData type definition is extended with new required properties,
		 * this test will help identify that the validator needs updating.
		 */
		it("should handle future ConnectableData extensions", () => {
			// Create a type-safe object that satisfies current ConnectableData
			const currentValidData: ConnectableData = {
				showConnectPoints: false,
				connectPoints: [],
			};

			// This should always pass for current valid data
			expect(isConnectableData(currentValidData)).toBe(true);

			// When new required properties are added to ConnectableData:
			// 1. TypeScript will error on the above object creation
			// 2. Add the new properties to make it compile
			// 3. Update isConnectableData function to validate new properties
			// 4. Add specific tests for the new properties
		});
	});
});
