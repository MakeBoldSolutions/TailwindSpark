# Shared helpers for bold's PowerShell collector scripts.

# Emits an array of {principle,reason,ratified_by,date}, one per
# `- Waiver: ...` line in the given spec file. See
# source/commands/WAIVERS.md for the line format.
function Get-WaiversForSpec {
  param([string]$SpecPath)
  $waivers = @()
  if (Test-Path $SpecPath) {
    Get-Content $SpecPath | Select-String '^- Waiver: (.+)$' | ForEach-Object {
      $line = $_.Matches.Groups[1].Value
      $principleMatch = [regex]::Match($line, 'principle=(\d+)')
      $reasonMatch = [regex]::Match($line, 'reason="([^"]*)"')
      $ratifiedByMatch = [regex]::Match($line, 'ratified_by="([^"]*)"')
      $dateMatch = [regex]::Match($line, 'date=([\d-]+)')
      $waivers += [ordered]@{
        principle   = if ($principleMatch.Success) { [int]$principleMatch.Groups[1].Value } else { $null }
        reason      = $reasonMatch.Groups[1].Value
        ratified_by = $ratifiedByMatch.Groups[1].Value
        date        = $dateMatch.Groups[1].Value
      }
    }
  }
  return ,$waivers
}

function Get-ActiveFeatures {
  param([string]$DocsDir)
  $features = @()
  $featuresDir = Join-Path $DocsDir 'features'
  if (Test-Path $featuresDir) {
    Get-ChildItem -Path $featuresDir -Directory | ForEach-Object {
      $specPath = Join-Path $_.FullName 'spec.md'
      if (Test-Path $specPath) {
        $content = Get-Content $specPath
        $status = ($content | Select-String '^\*\*Status\*\*: (.+)$' | Select-Object -First 1).Matches.Groups[1].Value
        $tier   = ($content | Select-String '^\*\*Tier\*\*: (.+)$' | Select-Object -First 1).Matches.Groups[1].Value
        $features += [ordered]@{
          id      = $_.Name
          status  = if ($status) { $status } else { 'unknown' }
          tier    = if ($tier) { $tier } else { 'unknown' }
          waivers = Get-WaiversForSpec -SpecPath $specPath
        }
      }
    }
  }
  return ,$features
}

function Get-SystemDocs {
  param([string]$RepoRoot, [string]$DocsDir)
  $docs = @()
  $systemDir = Join-Path $DocsDir 'system'
  if (Test-Path $systemDir) {
    $docs = @(Get-ChildItem -Path $systemDir -File -Recurse |
      Where-Object { $_.Name -ne '.gitkeep' } |
      ForEach-Object { $_.FullName.Substring($RepoRoot.Length + 1) -replace '\\', '/' } |
      Sort-Object)
  }
  return ,$docs
}

function Get-BackbonePrinciples {
  param([string]$DocsDir)
  $principles = @()
  $backboneFile = Join-Path $DocsDir 'backbone.md'
  if (Test-Path $backboneFile) {
    $n = 0
    Get-Content $backboneFile | Select-String '^\s*\*\*Status\*\*: (.+)$' | ForEach-Object {
      $n++
      $principles += [ordered]@{ n = $n; status = $_.Matches.Groups[1].Value }
    }
  }
  return ,$principles
}
