# App Dependency Rules

## Architecture

```mermaid
graph TD
    app --> features
    app --> shared
    features --> shared
    shared -. NG .-> others
```
