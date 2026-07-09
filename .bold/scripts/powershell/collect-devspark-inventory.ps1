# Collector for bold.plan init's Migrate path. Inventories a DevSpark
# install so the migration report prompt reasons over structured ground
# truth instead of re-deriving it by hand. First cut, built against a real
# DevSpark repo's actual shape (constitution.md's "### {roman}. Name" headers
# under "## Core Principles"; .documentation/specs/{name}/ as the feature-dir
# location) -- expect this to need refinement once real migrations are run
# (bold-tool-plan.md §15's crucible feedback loop).
$ErrorActionPreference = 'Stop'

$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) { $repoRoot = (Get-Location).Path }

$devsparkDir = Join-Path $repoRoot '.devspark'
$hasDevsparkDir = Test-Path $devsparkDir
$devsparkFileCount = 0
if ($hasDevsparkDir) {
  $devsparkFileCount = (Get-ChildItem -Path $devsparkDir -File -Recurse).Count
}

$docsDir = Join-Path $repoRoot '.documentation'
$hasDocumentationDir = Test-Path $docsDir

$constitutionPath = Join-Path $docsDir 'memory/constitution.md'
$hasConstitution = Test-Path $constitutionPath
$principleCount = 0
if ($hasConstitution) {
  $lines = Get-Content $constitutionPath
  $inCorePrinciples = $false
  foreach ($line in $lines) {
    if ($line -match '^## Core Principles') { $inCorePrinciples = $true; continue }
    if ($inCorePrinciples -and $line -match '^## ') { break }
    if ($inCorePrinciples -and $line -match '^### ') { $principleCount++ }
  }
}

$teamScriptsDir = Join-Path $docsDir 'scripts'
$hasTeamScriptsOverride = Test-Path $teamScriptsDir
$teamScriptsFiles = @()
if ($hasTeamScriptsOverride) {
  $teamScriptsFiles = @(Get-ChildItem -Path $teamScriptsDir -File -Recurse | ForEach-Object {
    $_.FullName.Substring($teamScriptsDir.Length + 1) -replace '\\', '/'
  })
}

$specsDir = Join-Path $docsDir 'specs'
$specDirs = @()
if (Test-Path $specsDir) {
  $specDirs = @(Get-ChildItem -Path $specsDir -Directory | ForEach-Object {
    [ordered]@{
      name       = $_.Name
      file_count = (Get-ChildItem -Path $_.FullName -File -Recurse).Count
    }
  })
}

# Multi-app config: named devspark.json per bold-tool-plan.md's own mapping
# table; not every repo has one (single-app is the common case).
$multiAppConfigPath = Join-Path $repoRoot 'devspark.json'
$hasMultiAppConfig = Test-Path $multiAppConfigPath

[ordered]@{
  has_devspark_dir           = $hasDevsparkDir
  devspark_dir_file_count    = $devsparkFileCount
  has_documentation_dir      = $hasDocumentationDir
  has_constitution           = $hasConstitution
  constitution_principle_count = $principleCount
  has_team_scripts_override = $hasTeamScriptsOverride
  team_scripts_files        = $teamScriptsFiles
  spec_dirs                 = $specDirs
  has_multi_app_config      = $hasMultiAppConfig
} | ConvertTo-Json -Depth 10 -Compress
