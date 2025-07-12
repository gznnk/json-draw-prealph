## Code Formatting Preservation Guidelines

These guidelines ensure that Copilot maintains the existing code structure and formatting when making edits.

## Blank Line Preservation

- **Never remove existing blank lines** unless explicitly requested by the user
- **Do not add unnecessary blank lines** that change the visual structure of the code
- **Maintain spacing between logical code blocks** as they appear in the original file
- **Preserve vertical spacing around comments** and documentation blocks

## Comment Formatting Rules

- **Keep original line breaks** within multi-line comments and JSDoc blocks
- **Maintain comment indentation** exactly as it appears in the source code
- **Preserve inline comment positioning** relative to the code they annotate
- **Do not reflow comment text** unless specifically asked to do so
- **Keep JSDoc parameter alignment** and formatting intact

## Whitespace and Indentation

- **Respect existing indentation style** (spaces vs tabs, indentation levels)
- **Maintain spacing around operators** and punctuation as originally formatted
- **Preserve alignment of multi-line structures** (object literals, arrays, function parameters)
- **Keep consistent spacing** within code blocks and expressions

## Automatic Formatting Restrictions

- **Avoid automatic code reformatting** that changes visual structure
- **Do not apply linting fixes** unless they address actual errors
- **Preserve code style consistency** with the existing codebase
- **Keep original bracket and brace placement** unless it causes syntax errors

## Best Practices

- **Make minimal changes** that only address the specific request
- **Preserve the author's intentional formatting choices**
- **Maintain consistency** with the surrounding code context
- **Focus on functionality** rather than stylistic improvements
- **When in doubt, preserve the original formatting**

These rules help maintain code readability and prevent unnecessary formatting changes that can clutter git diffs and make code reviews more difficult.
