$ErrorActionPreference = "Stop"

$ProjectRoot = $PSScriptRoot
$WatchdogPidFile = Join-Path $ProjectRoot ".tunnel-watchdog.pid"
$ServerPidFile = Join-Path $ProjectRoot ".server.pid"
$TunnelPidFile = Join-Path $ProjectRoot ".cloudflared.pid"
$TunnelLog = Join-Path $ProjectRoot ".cloudflared.log"
$TunnelUrlFile = Join-Path $ProjectRoot ".cloudflared-url.txt"

function Get-ManagedProcess {
  param([string]$PidFile)

  if (-not (Test-Path -LiteralPath $PidFile)) {
    return $null
  }

  $rawValue = (Get-Content -LiteralPath $PidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
  if (-not $rawValue) {
    return $null
  }

  try {
    return Get-Process -Id ([int]$rawValue.Trim()) -ErrorAction Stop
  } catch {
    return $null
  }
}

function Get-TunnelUrl {
  if (Test-Path -LiteralPath $TunnelLog) {
    $matches = Select-String -Path $TunnelLog -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' -AllMatches -ErrorAction SilentlyContinue
    if ($matches) {
      $lastBatch = $matches | Select-Object -Last 1
      if ($lastBatch.Matches.Count) {
        return $lastBatch.Matches[$lastBatch.Matches.Count - 1].Value
      }
    }
  }

  if (Test-Path -LiteralPath $TunnelUrlFile) {
    $savedUrl = (Get-Content -LiteralPath $TunnelUrlFile -ErrorAction SilentlyContinue | Select-Object -First 1).Trim()
    if ($savedUrl) {
      return $savedUrl
    }
  }

  return $null
}

$watchdog = Get-ManagedProcess -PidFile $WatchdogPidFile
$server = Get-ManagedProcess -PidFile $ServerPidFile
$tunnel = Get-ManagedProcess -PidFile $TunnelPidFile
$url = Get-TunnelUrl

Write-Host ("Watchdog : {0}" -f ($(if ($watchdog) { "running (PID $($watchdog.Id))" } else { "stopped" })))
Write-Host ("Server   : {0}" -f ($(if ($server) { "running (PID $($server.Id))" } else { "stopped" })))
Write-Host ("Tunnel   : {0}" -f ($(if ($tunnel) { "running (PID $($tunnel.Id))" } else { "stopped" })))
Write-Host ("URL      : {0}" -f ($(if ($url) { $url } else { "not available yet" })))
