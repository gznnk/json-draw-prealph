# Coding Conventions

## React Components
- Use arrow function syntax with `const ComponentNameComponent`
- Export as `memo(ComponentNameComponent)` for memoization
- **No default exports** - use named exports only
- Define props using `type` (not `interface`)

Example:
```tsx
import { memo } from "react";

type ButtonProps = {
  onClick: () => void;
};

const ButtonComponent: React.FC<ButtonProps> = ({ onClick }) => {
  return <button onClick={onClick}>Click</button>;
};

export const Button = memo(ButtonComponent);
```

## TypeScript Conventions
- Use explicit typing when intent needs clarity
- Prefer `type` over `interface` for props
- Named exports only (no default exports)
- Use `node:` prefix for Node.js built-in modules

## Code Style (Biome + ESLint)
- **Double quotes** for strings
- **Semicolons required**
- **Tab indentation** (configured in biome.json)
- Trailing commas in multi-line structures
- Template literals over string concatenation

## File Organization
- Each component in its own directory with:
  - `ComponentName.tsx` - main component
  - `ComponentNameStyled.ts` - Emotion styles  
  - `ComponentNameTypes.ts` - type definitions
  - `index.tsx` - barrel export
- Use barrel exports (`index.tsx`) for clean imports

## Documentation
- JSDoc comments for complex functions and components
- Comments in English
- Inline comments for complex logic
- Type definitions should be self-documenting

## Import Order
1. React imports
2. Other library imports  
3. Type imports
4. Local component imports
5. Hook imports
6. Utility imports
7. Related to current component