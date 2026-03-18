param(
  [string]$WorkspacePath = (Join-Path $PSScriptRoot "..\\workspace"),
  [string]$OutFile = (Join-Path $PSScriptRoot "..\\workspace\\manifest.json")
)

# Generates workspace/manifest.json from the real files on disk.
# Browser JS cannot list directories on its own, so we use a build step.

$resolvedWorkspace = Resolve-Path -Path $WorkspacePath -ErrorAction Stop

$files = Get-ChildItem -Path $resolvedWorkspace -File |
  Where-Object { $_.Name -ne "manifest.json" } |
  Select-Object -ExpandProperty Name |
  Sort-Object

$payload = [ordered]@{
  root        = "workspace"
  generatedAt = (Get-Date).ToString("o")
  files       = $files
}

$json = $payload | ConvertTo-Json -Depth 4

# UTF8 without BOM for web-friendliness.
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$outDir = Split-Path -Parent $OutFile
if (!(Test-Path -Path $outDir)) {
  New-Item -ItemType Directory -Path $outDir | Out-Null
}
[System.IO.File]::WriteAllText($OutFile, $json + "`n", $utf8NoBom)

Write-Output "Wrote manifest: $OutFile"
Write-Output ("Files: {0}" -f $files.Count)
