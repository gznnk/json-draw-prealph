# Codebase Structure

## Directory Organization

```
src/
├── app/                    # Main application layer
│   ├── components/         # Core UI components (Header, Body, Page, etc.)
│   ├── hooks/             # Application-level hooks
│   ├── models/            # Data models (Conversation, Work, SvgCanvas)
│   ├── repository/        # Data persistence layer (localStorage implementations)
│   ├── tools/             # Application tools
│   └── types/             # Application-wide types
├── features/              # Feature modules
│   ├── svg-canvas/        # Interactive SVG canvas with nodes and connections
│   │   ├── canvas/        # Canvas core functionality and hooks
│   │   ├── components/    # Canvas-specific components (nodes, shapes, menus)
│   │   ├── tools/         # Canvas tools (workflow agent, node creators)
│   │   ├── types/         # Canvas type definitions
│   │   └── utils/         # Canvas utilities
│   ├── llm-chat-ui/       # Chat interface for AI interactions
│   └── markdown-editor/   # Markdown editor with preview
├── shared/                # Shared utilities
│   ├── llm-client/        # LLM client abstraction (OpenAI, Anthropic)
│   ├── event-bus/         # Event system for loose coupling
│   └── markdown/          # Markdown processing utilities
└── utils/                 # General utilities
```

## Key Components

### SVG Canvas Architecture
- **Canvas State**: Managed through hooks in `features/svg-canvas/canvas/hooks/`
- **Node System**: Various node types in `features/svg-canvas/components/nodes/`
- **Tools System**: Extensible tool system in `features/svg-canvas/tools/`
- **Event System**: Custom event bus for component communication
- **Registry Pattern**: Diagram types registered in `features/svg-canvas/registry/`

### Dependency Rules
- Architecture follows: `app` → `features` → `shared`
- `shared` modules must not depend on other layers
- Cross-feature dependencies should be minimized
- Use the event bus for loose coupling between features

## File Naming Conventions
- Components: `ComponentName.tsx`
- Styles: `ComponentNameStyled.ts`
- Types: `ComponentNameTypes.ts`
- Hooks: `useHookName.ts`
- Utilities: `functionName.ts`
- Tests: `ComponentName.test.tsx` or `functionName.test.ts`