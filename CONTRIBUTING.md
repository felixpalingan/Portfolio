# Contributing to Felix Palingan 3D Portfolio ⚡

Thank you for your interest in contributing to the **Cyberpunk 3D Netrunner Portfolio**! We welcome community contributions, bug fixes, feature proposals, and WebGL optimizations to improve this project.

## Code of Conduct

Please treat everyone with respect, kindness, and professionalism. We are committed to providing a friendly and inclusive experience for all contributors regardless of background or experience level.

## How Can I Contribute?

### 1. Reporting Bugs
- Check existing [GitHub Issues](https://github.com/felixpalingan/Portfolio/issues) before opening a new issue to avoid duplicates.
- Provide a clear and descriptive title.
- Detail the steps to reproduce the issue, expected vs actual behavior, browser version, GPU/hardware setup, and attach screenshots or console logs if relevant.

### 2. Suggesting Enhancements & 3D Features
- Open a GitHub issue with the `[Feature Request]` tag.
- Clearly describe the proposed feature (e.g., new procedural room props, shader effects, sound design, camera transitions) and explain how it enhances the Netrunner aesthetic.

### 3. Submitting Pull Requests

1. **Fork** the repository and clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Portfolio.git
   cd Portfolio
   ```
2. **Create a branch** for your feature or bugfix:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Follow code style & architecture conventions**:
   - Write clean, modular ES6+ JavaScript.
   - Maintain procedural mesh optimizations in Three.js (reusable geometries, shared materials, and minimal draw calls).
   - Ensure high performance (target stable 60 FPS on standard desktop browsers).
   - Keep all code comments, commits, and documentation strictly in **English**.
5. **Verify the build**:
   ```bash
   npm run build
   ```
   Ensure the production bundle completes with zero errors and zero warnings.
6. **Commit with Conventional Commits**:
   - `feat(...)`: New features or interactive 3D elements
   - `fix(...)`: Bug fixes or rendering glitch resolutions
   - `perf(...)`: WebGL draw call and animation optimizations
   - `refactor(...)`: Code refactoring without behavioral changes
   - `docs(...)`: Documentation and README updates
   - `chore(...)`: Maintenance and dependency upgrades
7. **Push to your fork** and open a Pull Request against the `main` branch.

## Testing & Quality Checklist

Before opening a PR, ensure:
- [ ] `npm run build` succeeds cleanly.
- [ ] All interactive anchors (`HOME`, `PROJECTS`, `STATS`, `COMM`, `TOP-DOWN`) transition seamlessly.
- [ ] No memory leaks when switching between camera views or opening the Braindance HUD.
- [ ] Mobile responsive layout and viewport scaling remain intact.
