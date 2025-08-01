# Suggested Shell Commands

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production (runs tsc -b && vite build)
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run Jest tests
```

## Deployment
```bash
npm run deploy       # Build and deploy to GitHub Pages
```

## Dependency Analysis
```bash
npm run dep          # Generate dependency graph, list, and check circular deps
npm run dep:check    # Check for circular dependencies only
npm run dep:graph    # Generate dependency graph SVG
npm run dep:list     # Output dependency list
npm run dep:circle   # Check circular dependencies with madge
```

## Windows System Commands
Since this is a Windows environment, use these commands:
```cmd
dir                  # List directory contents (equivalent to ls)
cd                   # Change directory
type filename        # Display file contents (equivalent to cat)
findstr "pattern" files  # Search in files (equivalent to grep)
where filename       # Find file location (equivalent to which)
```

## Git Commands
```bash
git status           # Check repository status
git add .            # Stage all changes
git commit -m "message"  # Commit changes
git push             # Push to remote
git pull             # Pull from remote
```

## Package Management
```bash
npm install          # Install dependencies
npm install package  # Install specific package
npm uninstall package # Remove package
npm outdated         # Check for outdated packages
```