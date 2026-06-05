param(
  [Parameter(Mandatory = $true)]
  [string] $Path
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $Path)) {
  throw "Missing file: $Path"
}

# Read as UTF-8 (without mangling on Windows PowerShell default encoding) and strip BOM if present.
$bytes = [System.IO.File]::ReadAllBytes($Path)
if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
  if ($bytes.Length -eq 3) {
    $bytes = [byte[]]::new(0)
  } else {
    $bytes = $bytes[3..($bytes.Length - 1)]
  }
}

$text = [System.Text.Encoding]::UTF8.GetString($bytes)

try {
  $null = $text | ConvertFrom-Json
  "OK JSON (utf8): $Path"
  exit 0
} catch {
  "BAD JSON (utf8): $Path"
  throw
}
