# Pre-Commit Hook Configuration

## Current State

A dedicated `lint:colors` script has been added to `package.json` to validate semantic color token usage:

```bash
npm run lint:colors
```

This script runs ESLint with the strengthened `no-raw-primary-class` rule across all TypeScript/TSX files in apps/ and packages/.

## Recommended: Husky Pre-Commit Hook

For automatic enforcement before commits, install and configure husky:

### Installation

```bash
npm install --save-dev husky
npx husky init
```

### Configuration

Create `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run color token validation
npm run lint:colors

# Optionally add other checks
# npm run format:check
# npm run type-check
```

Make it executable:

```bash
chmod +x .husky/pre-commit
```

### Benefits

- **Automatic validation**: Prevents raw color violations from being committed
- **Fast feedback**: Catches issues before CI/CD pipeline
- **Team consistency**: Enforces design system rules for all contributors
- **Zero-config for teammates**: Hooks install automatically with `npm install`

### Alternative: Manual Validation

Without husky, developers should manually run before committing:

```bash
npm run lint:colors
```

## Current Implementation Status

- ✅ Strengthened ESLint rule catches all raw color patterns (blue-500, gray-900, dark:, hover:, etc.)
- ✅ `npm run lint:colors` script added for manual/CI validation
- ⏳ Husky pre-commit hook: Recommended for future implementation
- ✅ CI/CD validation: Existing `npm run lint` script runs ESLint in pipeline

## Validation

Test the lint:colors script:

```bash
npm run lint:colors
```

Expected result: Zero violations (all raw colors have been replaced with semantic tokens)
