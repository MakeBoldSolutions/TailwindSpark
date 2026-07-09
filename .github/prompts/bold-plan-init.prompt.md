---
description: "Bold: Detect repo entry path (migrate / discover / greenfield) and route accordingly."
---

# bold-plan-init

Resolve the effective prompt via Bold's three-tier resolution (user > team > source —
see `.bold/scripts/*/bold-which.*`):

1. `.bold-user/commands/plan/init.md`
2. `bold-docs/overrides/commands/plan/init.md`
3. `.bold/commands/plan/init.md`

Read whichever resolves first and follow it as your instructions for this invocation,
including running its declared collector `.bold/scripts/{bash,powershell}/collect-entry-path-context.{sh,ps1}` before anything else.