@echo off
setlocal EnableDelayedExpansion

REM Check if there are staged changes
git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
  echo No staged changes found, staging all changes...
  git add .
)

REM Get commit message
set "COMMIT_MSG=%~1"

REM Commit message is required
if "!COMMIT_MSG!"=="" (
  echo Error: Commit message is required
  echo Usage: git-commit-push.bat "commit message"
  exit /b 1
)

echo Using commit message: !COMMIT_MSG!

REM Execute commit
git commit -m "!COMMIT_MSG!"

REM Push only if commit was successful
if %ERRORLEVEL% EQU 0 (
  echo Commit successful, pushing changes...
  git push
  if %ERRORLEVEL% EQU 0 (
    echo Push successful!
  ) else (
    echo Error: Push failed.
  )
) else (
  echo Error: Commit failed.
)

endlocal
pause