# Development Workflow

## Daily Development Commands

### Starting Development
```bash
npm run dev          # Start development server (usually runs on localhost:5173)
```

### Before Committing Changes
1. **Build verification** (MANDATORY):
   ```bash
   npm run build
   ```

2. **Code quality check**:
   ```bash
   npm run lint
   ```

3. **Run tests** (if applicable):
   ```bash
   npm test
   ```

4. **Check dependencies** (for complex changes):
   ```bash
   npm run dep:check
   ```

## Project-Specific Patterns

### Canvas Development
- Canvas state managed through hooks in `features/svg-canvas/canvas/hooks/`
- New node types registered in `features/svg-canvas/registry/`
- Event-driven architecture using custom event bus
- Multi-select, undo/redo, and transformation operations

### AI Integration
- LLM client abstraction supports OpenAI and Anthropic APIs
- Workflow agent generates canvas diagrams from natural language
- Function calling system for AI tool integration
- Streaming responses in chat UI

### Component Development
- Each feature module is self-contained
- Use event bus for cross-feature communication
- Follow the memo + named export pattern
- Maintain type safety throughout

## Environment Setup
- Node.js 18+ required
- Windows environment (use appropriate commands)
- Git repository with develop branch as main working branch
- Biome for code formatting and linting
- Jest for testing with jsdom environment