# This script follows the guidelines in Agents.md for testing pure frontend applications
# It ensures the testing scenario closes within 30 seconds

# Define environment variables
$SERVER_HOST = "127.0.0.1"
$SERVER_PORT = 23000
$SERVER_LOG = "dev_server.log"
$TEST_TIMEOUT = 30

Write-Host "Ensuring a clean slate by killing any process using port $SERVER_PORT"
# Kill any process using the specified port
$netstatOutput = netstat -aon | Select-String ":$SERVER_PORT"
if ($netstatOutput) {
    $netstatOutput | ForEach-Object {
        $line = $_.Line
        if ($line -match '\s+(\d+)$') {
            $pidToKill = $matches[1]
            Write-Host "Killing process $pidToKill"
            taskkill /PID $pidToKill /F 2>$null
        }
    }
}

# Start the development server in the background
Write-Host "Starting the development server in the background..."
$job = Start-Job -ScriptBlock {
    Set-Location -Path $using:PSScriptRoot
    npm start > $using:SERVER_LOG 2>&1
}

# Wait for the server to be ready with timeout
Write-Host "Waiting for the server to be ready (timeout: $TEST_TIMEOUT seconds)..."
$waitTime = 0
$serverReady = $false

while ($waitTime -lt $TEST_TIMEOUT) {
    try {
        $response = Invoke-WebRequest -Uri "http://${SERVER_HOST}:${SERVER_PORT}" -TimeoutSec 2 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "Server is ready!"
            $serverReady = $true
            break
        }
    } catch {
        # Server not ready yet
    }
    
    Start-Sleep -Seconds 2
    $waitTime += 2
    Write-Host "Server not ready yet, waiting... (Waited $waitTime seconds)"
}

if (-not $serverReady) {
    Write-Host "ERROR: Server failed to start within $TEST_TIMEOUT seconds"
    $testResult = 1
    goto CLEANUP
}

# Run Playwright tests with timeout
Write-Host "Running Playwright tests with $TEST_TIMEOUT second timeout..."
Write-Host "Test started at: $(Get-Date)"
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
npx playwright test
$testResult = $LASTEXITCODE
$stopwatch.Stop()
Write-Host "Test finished at: $(Get-Date)"
Write-Host "Test duration: $($stopwatch.Elapsed.TotalSeconds) seconds"

# Store the test result
if ($testResult -eq 0) {
    Write-Host "Tests completed successfully"
} else {
    Write-Host "Tests failed with exit code $testResult"
}

:CLEANUP
# Shutdown the development server
Write-Host "Shutting down the development server..."
# Kill any remaining process using the specified port
$netstatOutput = netstat -aon | Select-String ":$SERVER_PORT"
if ($netstatOutput) {
    $netstatOutput | ForEach-Object {
        $line = $_.Line
        if ($line -match '\s+(\d+)$') {
            $pidToKill = $matches[1]
            Write-Host "Killing process $pidToKill"
            taskkill /PID $pidToKill /F 2>$null
        }
    }
}

# Stop the background job if it's still running
if ($job.State -eq "Running") {
    Write-Host "Stopping background job..."
    Stop-Job $job
}
Remove-Job $job -Force

# Display server log for debugging
Write-Host "=== Server Log ==="
if (Test-Path $SERVER_LOG) {
    Get-Content $SERVER_LOG
} else {
    Write-Host "No server log found"
}
Write-Host "=== End Server Log ==="

# Exit with the test result
exit $testResult