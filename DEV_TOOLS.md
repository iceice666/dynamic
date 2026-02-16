# Development Tools

This project uses ESLint, Prettier, and other development tools to maintain code quality and consistency.

## Tools Installed

### ESLint

- **Purpose**: Code linting and quality checks
- **Plugins**:
  - `@typescript-eslint` - TypeScript support
  - `eslint-plugin-astro` - Astro component linting
  - `eslint-plugin-react` - React component linting
  - `eslint-plugin-react-hooks` - React Hooks rules
  - `eslint-plugin-jsx-a11y` - Accessibility checks

### Prettier

- **Purpose**: Code formatting
- **Plugins**:
  - `prettier-plugin-astro` - Astro component formatting
  - `prettier-plugin-tailwindcss` - Tailwind CSS class sorting

### EditorConfig

- **Purpose**: Consistent editor settings across different IDEs

## Available Scripts

```bash
# Linting
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors

# Formatting
npm run format        # Format all files with Prettier
npm run format:check  # Check if files are formatted

# Combined check
npm run check         # Run Astro check, ESLint, and Prettier check
```

## Editor Integration

### VS Code (Recommended)

The project includes VS Code settings that:

- Auto-format files on save
- Auto-fix ESLint errors on save
- Use Prettier as the default formatter

Recommended extensions will be suggested when you open the project:

- Astro (`astro-build.astro-vscode`)
- Prettier (`esbenp.prettier-vscode`)
- ESLint (`dbaeumer.vscode-eslint`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)

### Manual Setup

If auto-format doesn't work:

1. Install the recommended extensions
2. Reload VS Code
3. Check that Prettier is set as the default formatter

## Configuration Files

- `eslint.config.js` - ESLint configuration (flat config format)
- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files to exclude from formatting
- `.editorconfig` - Editor settings for consistent formatting
- `.vscode/settings.json` - VS Code specific settings
- `.vscode/extensions.json` - Recommended VS Code extensions

## Code Style Guidelines

### General

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Maximum line length: 100 characters
- Use LF line endings

### TypeScript

- Avoid using `any` type (warning)
- Unused variables starting with `_` are allowed

### React

- No need to import React in files (React 17+)
- Follow React Hooks rules strictly
- Accessibility warnings enabled

### Astro

- Unused variables in frontmatter are allowed
- Follow Astro best practices

## Pre-commit Hooks (Optional)

To automatically lint and format before commits, you can set up Husky and lint-staged:

```bash
npm install -D husky lint-staged
npx husky init
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,ts,tsx,astro}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

Create `.husky/pre-commit`:

```bash
npx lint-staged
```

## Troubleshooting

### ESLint errors in editor

- Restart VS Code
- Run `npm install` to ensure all packages are installed
- Check that the ESLint extension is enabled

### Prettier not formatting

- Ensure Prettier extension is installed
- Check that Prettier is set as the default formatter
- Look for syntax errors that might prevent formatting

### Peer dependency warnings

This project uses `--legacy-peer-deps` due to some version conflicts between ESLint 10 and plugins. This is normal and doesn't affect functionality.
