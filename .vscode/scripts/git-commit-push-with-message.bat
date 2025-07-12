@echo off
setlocal EnableDelayedExpansion

REM Get commit message from first argument
set "COMMIT_MSG=%~1"

REM Error if commit message is empty
if "!COMMIT_MSG!"=="" (
  echo Error: Commit message is required
  echo Usage: git-commit-push-with-message.bat "commit message"
  exit /b 1
)

REM Check if there are staged changes
git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
  echo No staged changes found, staging all changes...
  git add .
)

REM Check if there are changes to commit
git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
  echo No changes to commit
  exit /b 0
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
    exit /b 1
  )
) else (
  echo Error: Commit failed.
  exit /b 1
)

endlocal
