# Getting Started with TailwindSpark

## Quick Setup

### Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MakeBoldSolutions/TailwindSpark.git
   cd TailwindSpark
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Development Workflow

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build all packages for production
- `npm run lint` - Run ESLint across all packages
- `npm run test` - Run tests across all packages
- `npm run type-check` - Run TypeScript type checking

### Monorepo Structure

```
TailwindSpark/
├── apps/demo-app/          # Main React application
├── packages/
│   ├── design-tokens/      # Shared design system
│   └── ui-components/      # Reusable UI components
├── .documentation/guides/   # Documentation
└── .github/                # CI/CD workflows
```

### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit files in the appropriate package
   - Add tests for new functionality
   - Update documentation as needed

3. **Run tests and linting**

   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit and push**

   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create a pull request**

## Package Development

### Working with UI Components

```bash
cd packages/ui-components
npm run dev  # Watch mode for component development
npm run test # Run component tests
```

### Working with Design Tokens

The project uses Tailwind CSS v4 with centralized design tokens:

```bash
cd packages/design-tokens
npm run build  # Build token definitions

# The design tokens use the new @theme directive
# and are automatically imported by Tailwind CSS v4
```

### Working with Demo App

```bash
cd apps/demo-app
npm run dev   # Start development server
npm run test  # Run app tests
```

## Troubleshooting

### Common Issues

#### Port already in use

```bash
# Kill process on port 5173
npx kill-port 5173
```

#### Module resolution errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build cache issues

```bash
# Clear Turborepo cache
npx turbo clean
```

### Getting Help

- Check [Architecture Documentation](./ARCHITECTURE.md)
- Review [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Open an issue on GitHub
