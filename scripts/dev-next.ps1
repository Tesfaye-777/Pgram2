$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$nextBin = Join-Path $root "node_modules\next\dist\bin\next"

if (-not (Test-Path -LiteralPath $nextBin)) {
  Write-Error "Cannot find Next.js CLI. Please run bun install first."
  exit 1
}

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
  & $nodeCommand.Source $nextBin dev
  exit $LASTEXITCODE
}

$codexRuntimeRoot = Join-Path $env:LOCALAPPDATA "OpenAI\Codex\runtimes\cua_node"
$codexNode = $null
if (Test-Path -LiteralPath $codexRuntimeRoot) {
  $codexNode = Get-ChildItem -LiteralPath $codexRuntimeRoot -Recurse -Filter node.exe -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
}

if (-not $codexNode) {
  Write-Error "Cannot find node.exe. Please install Node.js or start the project from Codex so its bundled Node runtime is available."
  exit 1
}

& $codexNode.FullName $nextBin dev
exit $LASTEXITCODE
