# Repository Structure and Commit Guidelines

## Files and Directories to Commit

The following files and directories should be committed to the remote repository:

### Source Code
- `/src` - All application source code
  - `/src/features` - Feature modules
  - `/src/components` - Shared components (if any)
  - `/src/lib` - Shared application logic (if any)
  - `/src/hooks` - Shared custom hooks (if any)
  - `/src/assets` - Static assets processed by build tools (if any)
  - Core files: `App.js`, `index.js`, `index.css`, `setupTests.js`

### Configuration Files
- `.babelrc` - Babel configuration
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `jest.config.js` - Jest testing configuration
- `package.json` - Project dependencies and scripts
- `webpack.config.js` - Webpack build configuration
- `README.md` - Project documentation
- `PLAN.md` - Project plan and task tracking
- `PRD.md` - Product requirements document
- `Agents.md` - Agent operational protocol

### Documentation
- `/docs` - Project documentation
  - `/docs/_architecture` - Architecture documentation
  - `/docs/user-guide.md` - User guide
- `/public` - Static assets
  - `/public/index.html` - Main HTML file

## Files and Directories to Ignore

See `.gitignore` for a complete list of ignored files and directories.

The following are particularly important:
- `node_modules/` - Dependencies (reinstalled via npm install)
- `dist/` - Build outputs (regenerated via npm run build)
- `.env*` - Environment files (should never be committed)
- `status.md` - Agent status file
- IDE/editor specific files
- OS generated files
- Log files

## Commit Strategy

1. Only commit source code and resources necessary for the application to run
2. Never commit sensitive information like API keys or passwords
3. Always ensure the project can be built and run from a clean clone
4. Use meaningful commit messages following the Conventional Commits specification

## Testing Guidelines

### Unit Testing
- Use Jest for unit testing
- Run tests with `npm test`
- Maintain 85% code coverage

### End-to-End Testing
- Use Playwright with the MCP server tool for end-to-end testing
- Before running e2e tests, ask the user to start the development server:
  ```
  npm start
  ```
- Run e2e tests with:
  ```
  npm run test:e2e
  ```
- After tests complete, ask the user to stop the development server
- For automated testing, use the provided scripts:
  - `run-e2e-tests.bat` for Windows
  - `run-e2e-tests.ps1` for PowerShell