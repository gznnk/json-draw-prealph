# Project Overview

## Purpose
This is an AI-powered visual workflow editor built with React and TypeScript. The application allows users to create interactive workflows on an SVG-based canvas by placing and connecting various node types (LLM, Agent, Text, Image Generation, Web Search, Vector Store, Hub nodes).

## Tech Stack
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.1.0
- **Styling**: Emotion CSS-in-JS library
- **AI Integration**: OpenAI SDK and Anthropic SDK
- **Markdown**: markdown-it with KaTeX math support and highlight.js syntax highlighting
- **Testing**: Jest with jsdom environment and Testing Library
- **Code Quality**: Biome + ESLint for linting and formatting

## Key Features
- **SVG Canvas**: Interactive drag-and-drop canvas with various node types
- **AI Integration**: GPT-4 and Anthropic Claude integration for workflow generation
- **Markdown Support**: Real-time rendering with math equations and code highlighting
- **Chat UI**: Streaming AI responses with markdown rendering
- **Multi-select**: Area selection, grouping, and transformation operations
- **Undo/Redo**: Complete history management system
- **Minimap**: Navigation and overview of large canvases

## Architecture
Follows a layered architecture: `app` → `features` → `shared`
- `app/`: Main application layer with components, models, repository
- `features/`: Feature modules (svg-canvas, llm-chat-ui, markdown-editor)
- `shared/`: Shared utilities (event-bus, llm-client, markdown)
- Cross-feature dependencies minimized, event bus for loose coupling