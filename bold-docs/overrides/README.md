# Team Overrides — carried forward from DevSpark

These 12 PowerShell scripts (`powershell/`) were TailwindSpark's DevSpark team-tier overrides. **They don't correspond 1:1 to any current Bold command or collector** — they're named for DevSpark's own commands (`check-prerequisites`, `create-new-feature`, `setup-plan`, `site-audit`, ...), which don't exist under those names in Bold. Bold's own resolution shim (`bold which`, three-tier: user > team > source) only picks up an override if its filename matches a real Bold script name exactly (e.g. `collect-triage-context.ps1`), so none of these will be picked up automatically as-is.

Carried forward for reference, not wired up — review each one and decide whether the customization it represents should become a real Bold override (renamed to match the Bold script it's meant to override) or whether it's now obsolete. No bash equivalents existed in the original DevSpark install either — this repo's team tier was PowerShell-only.
