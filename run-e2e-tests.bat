@echo off
REM This script follows the guidelines in Agents.md for testing pure frontend applications

REM Define environment variables
set SERVER_HOST=127.0.0.1
set SERVER_PORT=23000
set SERVER_LOG=dev_server.log
set TEST_TIMEOUT=30

echo "Ensuring a clean slate by killing any process using port %SERVER_PORT%"

REM Kill any process using the specified port
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%SERVER_PORT%') do taskkill /PID %%a /F 2>nul

REM Start the development server in the background
echo "Starting the development server in the background..."
start /b npm start > %SERVER_LOG% 2>&1

REM Wait for the server to be ready
echo "Waiting for the server to be ready..."
set /a "WAIT_TIME=0"
:WAIT_LOOP
timeout /t 2 /nobreak >nul
curl -s http://%SERVER_HOST%:%SERVER_PORT% >nul 2>&1
if %errorlevel% equ 0 (
    echo "Server is ready!"
    goto SERVER_READY
)
set /a "WAIT_TIME+=2"
if %WAIT_TIME% GEQ %TEST_TIMEOUT% (
    echo "ERROR: Server failed to start within %TEST_TIMEOUT% seconds"
    goto CLEANUP_AND_EXIT
)
echo "Server not ready yet, waiting... (Waited %WAIT_TIME% seconds)"
goto WAIT_LOOP

:SERVER_READY
REM Run Playwright tests with timeout
echo "Running Playwright tests with %TEST_TIMEOUT% second timeout..."
echo "Test started at: %date% %time%"
npx playwright test
set TEST_RESULT=%errorlevel%
echo "Test finished at: %date% %time%"

REM Store the test result
if %TEST_RESULT% equ 0 (
    echo "Tests completed successfully"
) else (
    echo "Tests failed with exit code %TEST_RESULT%"
)

:CLEANUP_AND_EXIT
REM Shutdown the development server
echo "Shutting down the development server..."
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%SERVER_PORT%') do taskkill /PID %%a /F 2>nul

REM Display server log for debugging
echo "=== Server Log ==="
type %SERVER_LOG%
echo "=== End Server Log ==="

REM Exit with the test result
exit /b %TEST_RESULT%