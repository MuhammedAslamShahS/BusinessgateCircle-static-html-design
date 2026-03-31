param(
  [int]$Port = 8080,
  [int]$PollSeconds = 8
)

$ErrorActionPreference = "Stop"

$ProjectRoot = $PSScriptRoot
$ServerScript = Join-Path $ProjectRoot ".codex-static-server.js"
$ServerOutLog = Join-Path $ProjectRoot ".server.log"
$ServerErrLog = Join-Path $ProjectRoot ".server-error.log"
$ServerPidFile = Join-Path $ProjectRoot ".server.pid"
$TunnelLog = Join-Path $ProjectRoot ".cloudflared.log"
$TunnelPidFile = Join-Path $ProjectRoot ".cloudflared.pid"
$TunnelUrlFile = Join-Path $ProjectRoot ".cloudflared-url.txt"
$WatchdogPidFile = Join-Path $ProjectRoot ".tunnel-watchdog.pid"
$NodeExe = (Get-Command node.exe -ErrorAction Stop).Source
$CloudflaredExe = (Get-Command cloudflared.exe -ErrorAction Stop).Source

function Write-PidFile {
  param(
    [string]$Path,
    [int]$Value
  )

  Set-Content -LiteralPath $Path -Value $Value -NoNewline
}

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

  $trimmedValue = $rawValue.Trim()
  if (-not $trimmedValue) {
    Remove-Item -LiteralPath $PidFile -Force -ErrorAction SilentlyContinue
    return $null
  }

  try {
    $pidValue = [int]$trimmedValue
  } catch {
    Remove-Item -LiteralPath $PidFile -Force -ErrorAction SilentlyContinue
    return $null
  }

  try {
    return Get-Process -Id $pidValue -ErrorAction Stop
  } catch {
    Remove-Item -LiteralPath $PidFile -Force -ErrorAction SilentlyContinue
    return $null
  }
}

function Update-TunnelUrlFile {
  if (-not (Test-Path -LiteralPath $TunnelLog)) {
    return
  }

  $matches = Select-String -Path $TunnelLog -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' -AllMatches -ErrorAction SilentlyContinue
  if (-not $matches) {
    return
  }

  $lastBatch = $matches | Select-Object -Last 1
  if (-not $lastBatch.Matches.Count) {
    return
  }

  $url = $lastBatch.Matches[$lastBatch.Matches.Count - 1].Value
  Set-Content -LiteralPath $TunnelUrlFile -Value $url -NoNewline
}

function Start-StaticServer {
  if (-not (Test-Path -LiteralPath $ServerScript)) {
    throw "Static server script not found at $ServerScript"
  }

  $process = Start-Process `
    -FilePath $NodeExe `
    -ArgumentList @($ServerScript) `
    -WorkingDirectory $ProjectRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $ServerOutLog `
    -RedirectStandardError $ServerErrLog `
    -PassThru

  Start-Sleep -Milliseconds 700
  Write-PidFile -Path $ServerPidFile -Value $process.Id
}

function Start-QuickTunnel {
  if (Test-Path -LiteralPath $TunnelLog) {
    Clear-Content -LiteralPath $TunnelLog -ErrorAction SilentlyContinue
  }

  $process = Start-Process `
    -FilePath $CloudflaredExe `
    -ArgumentList @(
      "tunnel",
      "--url",
      "http://127.0.0.1:$Port",
      "--logfile",
      $TunnelLog,
      "--no-autoupdate"
    ) `
    -WorkingDirectory $ProjectRoot `
    -WindowStyle Hidden `
    -PassThru

  Start-Sleep -Seconds 3
  Write-PidFile -Path $TunnelPidFile -Value $process.Id
  Update-TunnelUrlFile
}

Write-PidFile -Path $WatchdogPidFile -Value $PID

try {
  while ($true) {
    if (-not (Get-ManagedProcess -PidFile $ServerPidFile)) {
      Start-StaticServer
    }

    if (-not (Get-ManagedProcess -PidFile $TunnelPidFile)) {
      Start-QuickTunnel
    }

    Update-TunnelUrlFile
    Start-Sleep -Seconds $PollSeconds
  }
} finally {
  Remove-Item -LiteralPath $WatchdogPidFile -Force -ErrorAction SilentlyContinue
}
