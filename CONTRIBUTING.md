# Contributing to Lexora AI

Thank you for your interest in contributing to Lexora AI! We're building the world's most trusted legal intelligence platform and welcome contributions from the global legal tech community.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)
- [Commit Conventions](#commit-conventions)
- [Issue Reporting](#issue-reporting)

---

## Code of Conduct

By participating in this project, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment for all contributors.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AI-Job-Automation.git
   cd AI-Job-Automation
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/bsgusa/AI-Job-Automation.git
   ```
4. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Development Setup

No build tools required! This project is pure HTML, CSS, and JavaScript.

```bash
# Serve locally with live reload
npx serve .

# Or use Python's built-in server
python3 -m http.server 3000

# → Open http://localhost:3000
```

---

## How to Contribute

### 🐛 Reporting Bugs

Before submitting a bug report:
- Check the [existing issues](../../issues) to avoid duplicates
- Verify the bug exists on the latest version

Use the **Bug Report** issue template and include:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots or screen recordings if applicable

### 💡 Suggesting Features

Use the **Feature Request** issue template. Describe:
- The problem your feature solves
- Your proposed solution
- Alternative approaches you've considered
- Mockups or wireframes if applicable

### 🔧 Contributing Code

We welcome:
- Bug fixes
- Performance improvements
- Accessibility improvements
- New UI components and animations
- Documentation improvements
- Translation and localization

---

## Pull Request Process

1. **Update** your branch with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure** your code follows our [Style Guide](#style-guide)

3. **Test** your changes across browsers (Chrome, Firefox, Safari, Edge)

4. **Test** on mobile viewport sizes

5. **Submit** your PR with:
   - A clear title following our [commit conventions](#commit-conventions)
   - A description of what changes were made and why
   - Screenshots for visual changes
   - Reference to any related issues (`Closes #123`)

6. **Address** review feedback promptly

7. PRs require **at least one approval** before merging

---

## Style Guide

### HTML
- Use semantic HTML5 elements
- Include `aria-*` attributes for accessibility
- Validate with the [W3C Validator](https://validator.w3.org/)

### CSS
- Use CSS custom properties (variables) defined in `:root`
- Follow the existing naming convention: `block-element--modifier`
- Keep specificity low — avoid `!important`
- Mobile-first responsive design

### JavaScript
- Vanilla JS only — no frameworks or build tools
- Use `const`/`let`, never `var`
- Prefer `IntersectionObserver` over scroll event listeners for performance
- Clean up event listeners and animation frames when appropriate
- No comments unless the WHY is genuinely non-obvious

---

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types:**

| Type | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no behavior change |
| `perf` | Performance improvement |
| `a11y` | Accessibility improvement |
| `chore` | Build/tooling changes |

**Examples:**
```
feat(hero): add particle density slider
fix(navbar): resolve scroll event memory leak
docs(api): update authentication examples
a11y(forms): add aria-live regions for error messages
```

---

## Issue Reporting

| Issue Type | Template | Use When |
|---|---|---|
| 🐛 Bug Report | `bug_report.md` | Something isn't working |
| 💡 Feature Request | `feature_request.md` | Suggest a new idea |
| 🔐 Security Issue | [SECURITY.md](SECURITY.md) | Potential vulnerability |
| 📖 Documentation | Open a blank issue | Docs are wrong or missing |

---

## Questions?

- Open a [GitHub Discussion](../../discussions)
- Email us at **contributors@lexora.ai**

We review all PRs and issues within **2 business days**.

Thank you for helping build the future of legal technology! ⚖️
