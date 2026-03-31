$ErrorActionPreference = "Stop"

$ProjectRoot = $PSScriptRoot
$PidFiles = @(
  (Join-Path $ProjectRoot ".cloudflared.pid"),
  (Join-Path $ProjectRoot ".server.pid"),
  (Join-Path $ProjectRoot ".tunnel-watchdog.pid")
)

foreach ($pidFile in $PidFiles) {
  if (-not (Test-Path -LiteralPath $pidFile)) {
    continue
  }

  $rawValue = (Get-Content -LiteralPath $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
  if ($rawValue) {
    try {
      Stop-Process -Id ([int]$rawValue.Trim()) -Force -ErrorAction Stop
    } catch {
    }
  }

  Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
}

Write-Host "Managed tunnel processes stopped."
