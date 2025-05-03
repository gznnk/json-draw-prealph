@echo off
set COMMIT_MSG=%1

REM 引数が空の場合は自動生成メッセージを使用
if "%COMMIT_MSG%"=="" (
  echo Generating commit message based on changes...
  for /f "tokens=*" %%a in ('node "%~dp0generate-commit-message.cjs"') do set AUTO_MSG=%%a
  set COMMIT_MSG="%AUTO_MSG%"
  echo Using auto-generated message: %COMMIT_MSG%
)

REM 変更をステージング
git add .

REM コミット
git commit -m %COMMIT_MSG%

REM プッシュ
git push

REM 結果を表示
if %ERRORLEVEL% EQU 0 (
  echo Commit and push successful!
) else (
  echo Error during commit or push operation.
)

pause