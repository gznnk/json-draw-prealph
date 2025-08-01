# Testing Guidelines

## Test Framework Setup
- **Jest** with jsdom environment for React components
- **Testing Library** for React component testing
- Test files: `**/?(*.)+(spec|test).[tj]s?(x)`

## Test File Organization
- Place test files in `__test__` directories alongside source
- Use descriptive test file names: `ComponentName.test.tsx`
- Follow the same directory structure as source code

## Test Structure
- Use `describe` blocks to group related tests
- Use descriptive test names that explain the expected behavior
- Follow Arrange-Act-Assert pattern

Example test structure:
```typescript
describe("ComponentName", () => {
  describe("Valid input cases", () => {
    it("should return true for valid data", () => {
      // Arrange
      const validData = { /* test data */ };
      
      // Act
      const result = functionUnderTest(validData);
      
      // Assert
      expect(result).toBe(true);
    });
  });

  describe("Invalid input cases", () => {
    it("should return false for invalid data", () => {
      // Test implementation
    });
  });

  describe("Edge cases", () => {
    it("should handle edge case properly", () => {
      // Test implementation
    });
  });
});
```

## Testing Patterns
- Test both positive and negative cases
- Include edge cases and boundary conditions
- Test type validation thoroughly
- Document validation completeness with dedicated tests
- Future-proof tests by documenting expected behavior changes

## Coverage Expectations
- Aim for comprehensive coverage of critical functions
- Focus on business logic and utility functions
- Component testing should focus on behavior, not implementation
- Validation functions should have complete test coverage