@echo off
setlocal EnableDelayedExpansion

REM ステージングされた変更があるか確認
git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
  echo No staged changes found, staging all changes...
  git add .
)

REM コミットメッセージを取得
set "COMMIT_MSG=%~1"

REM コミットメッセージが必須
if "!COMMIT_MSG!"=="" (
  echo Error: Commit message is required
  echo Usage: git-commit-push.bat "commit message"
  exit /b 1
)

echo Using commit message: !COMMIT_MSG!

REM コミット実行
git commit -m "!COMMIT_MSG!"

REM コミットが成功した場合のみプッシュ
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