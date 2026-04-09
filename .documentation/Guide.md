# .documentation/ Guide

Living orientation document for the TailwindSpark documentation structure.

## Purpose

This directory contains all project documentation, development artifacts, and knowledge management for TailwindSpark.

## Directory Structure

```
.documentation/
├── guides/              # User-facing documentation
│   ├── ARCHITECTURE.md  # Monorepo architecture reference
│   ├── BRANDING.md      # Brand guidelines and visual identity
│   ├── CHANGELOG.md     # Project changelog (Keep a Changelog format)
│   ├── DEPLOYMENT.md    # Deployment procedures and workflows
│   ├── GETTING_STARTED.md # Onboarding guide for new developers
│   └── TESTING.md       # Testing standards and practices
├── memory/              # Constitutional knowledge and governance
│   └── constitution.md  # Project constitution and development principles
├── copilot/             # AI agent session artifacts
│   ├── harvest-YYYY-MM-DD.md        # Harvest workflow reports
│   └── [other session docs]         # Temporary working documents
├── specs/               # Feature specifications and planning
│   └── [feature-name]/  # Feature-specific directories
└── Guide.md            # This file - orientation and navigation
```

## Key Files

### guides/

- **ARCHITECTURE.md** - Current monorepo architecture, package structure, and dependencies
- **BRANDING.md** - Brand guidelines including colors, typography, and visual identity
- **CHANGELOG.md** - Project changelog following Keep a Changelog format
- **DEPLOYMENT.md** - Deployment procedures, GitHub Pages setup, and CI/CD workflows
- **GETTING_STARTED.md** - Developer onboarding, local setup, and first steps
- **TESTING.md** - Testing standards, patterns, and coverage requirements

### memory/

- **constitution.md** - Project constitution defining development principles, code standards, and architectural decisions

### copilot/

Session artifacts from AI agent workflows. These are temporary working documents that may be archived periodically.

### specs/

Active feature specifications following the DevSpark framework. Each feature has its own directory with spec.md, plan.md, and tasks.md.

## Constitution Location

The project constitution is located at:

```
.documentation/memory/constitution.md
```

This is the **governing authority** for all development decisions, code patterns, and architectural choices.

## Archive Directory

Completed and historical documentation is preserved in `.archive/` (outside this directory):

```
.archive/
├── 2026-03-07/         # Historical artifacts from March 7
├── 2026-03-26/         # Historical artifacts from March 26
└── 2026-04-09/         # Historical artifacts from April 9
```

**Important**: `.archive/` is write-only from an operational perspective. Do not read from archive during normal development operations. Past decisions are preserved for audit and traceability only.

## DevSpark Commands

DevSpark framework commands are accessed via the `.devspark/` directory:

- `/devspark.archive` - Archive outdated documentation
- `/devspark.harvest` - Extract knowledge from completed work
- `/devspark.specify` - Create feature specifications
- `/devspark.plan` - Generate implementation plans
- `/devspark.tasks` - Create task breakdowns
- `/devspark.implement` - Execute implementation
- `/devspark.pr-review` - Constitution-aware PR review

See `.devspark/defaults/commands/` for all available commands.

## How to Navigate

1. **New to the project?** → Start with [guides/GETTING_STARTED.md](guides/GETTING_STARTED.md)
2. **Understanding the architecture?** → See [guides/ARCHITECTURE.md](guides/ARCHITECTURE.md)
3. **Need deployment info?** → Check [guides/DEPLOYMENT.md](guides/DEPLOYMENT.md)
4. **Writing tests?** → Review [guides/TESTING.md](guides/TESTING.md)
5. **Brand guidelines?** → Read [guides/BRANDING.md](guides/BRANDING.md)
6. **What changed?** → Consult [guides/CHANGELOG.md](guides/CHANGELOG.md)
7. **Project principles?** → Review [memory/constitution.md](memory/constitution.md)

## Documentation Standards

All documentation in this directory follows these standards:

- **Markdown format** for all documents
- **Keep a Changelog** format for CHANGELOG.md
- **Constitution compliance** for all development artifacts
- **Clear headers** using ATX-style (#) headers
- **Relative links** for internal references
- **Current state only** - historical content moves to `.archive/`

## Maintenance

This directory is kept current through:

- **Harvest workflow** - Extracts knowledge from completed specs and session docs
- **Archive workflow** - Moves outdated content to `.archive/` with date stamps
- **Constitution evolution** - Updates governing principles based on learnings

---

**Last Updated**: 2026-04-08  
**DevSpark Version**: 1.3.0
