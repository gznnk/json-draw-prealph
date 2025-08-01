# Task Completion Process

## IMPORTANT: Always verify changes before considering complete

After completing any coding task, follow these mandatory steps:

### 1. Build Verification
```bash
npm run build
```
- **MUST** verify that changes don't introduce build errors
- Fix any TypeScript errors or build issues before considering task complete
- Build must succeed completely

### 2. Code Quality Checks
```bash
npm run lint        # Run ESLint
```
- Fix any linting errors
- Ensure code follows project conventions

### 3. Testing (if applicable)
```bash
npm test           # Run Jest tests
```
- Verify existing tests still pass
- Add tests for new functionality if required

### 4. Dependency Validation (for complex changes)
```bash
npm run dep:check  # Check for circular dependencies
```
- Ensure no circular dependencies introduced
- Maintain clean architecture boundaries

### 5. Git Workflow
- Ask user if they want to commit changes to git
- If approved, create commit with appropriate message
- Follow conventional commit format when possible

## Error Resolution
- If build fails, fix TypeScript/compilation errors first
- If tests fail, investigate and fix failing tests
- If linting fails, address code quality issues
- Never consider a task complete with failing builds or tests

## Architecture Compliance
- Ensure changes follow `app` → `features` → `shared` dependency rules
- Verify no cross-feature dependencies introduced
- Use event bus for loose coupling between features
- Maintain separation of concerns