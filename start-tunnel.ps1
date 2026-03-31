$ErrorActionPreference = "Stop"

$ProjectRoot = $PSScriptRoot
$WatchdogScript = Join-Path $ProjectRoot "tunnel-watchdog.ps1"
$WatchdogPidFile = Join-Path $ProjectRoot ".tunnel-watchdog.pid"
$StatusScript = Join-Path $ProjectRoot "tunnel-status.ps1"
$PowerShellExe = (Get-Command powershell.exe -ErrorAction Stop).Source

function Get-ManagedProcess {
  param([string]$PidFile)

  if (-not (Test-Path -LiteralPath $PidFile)) {
    return $null
  }

  $rawValue = (Get-Content -LiteralPath $PidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
  if (-not $rawValue) {
    Remove-Item -LiteralPath $PidFile -Force -ErrorAction SilentlyContinue
    return $null
  }

  try {
    return Get-Process -Id ([int]$rawValue.Trim()) -ErrorAction Stop
  } catch {
    Remove-Item -LiteralPath $PidFile -Force -ErrorAction SilentlyContinue
    return $null
  }
}

if (Get-ManagedProcess -PidFile $WatchdogPidFile) {
  Write-Host "Tunnel watchdog is already running."
  & $StatusScript
  exit 0
}

$process = Start-Process `
  -FilePath $PowerShellExe `
  -ArgumentList @(
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    $WatchdogScript
  ) `
  -WorkingDirectory $ProjectRoot `
  -WindowStyle Hidden `
  -PassThru

Start-Sleep -Seconds 4

Write-Host ("Tunnel watchdog started with PID {0}." -f $process.Id)
& $StatusScript
