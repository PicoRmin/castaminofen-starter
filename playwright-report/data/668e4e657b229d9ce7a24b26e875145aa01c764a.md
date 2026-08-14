# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: locale-coverage.spec.ts >> Locale Coverage — FA/RTL & EN/LTR >> EN/LTR — English Locale >> should have accessible navigation on EN/LTR (mobile)
- Location: apps/web/e2e/locale-coverage.spec.ts:137:9

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/codespace/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell
╔════════════════════════════════════════════════════════════╗
║ Looks like Playwright was just installed or updated.       ║
║ Please run the following command to download new browsers: ║
║                                                            ║
║     pnpm exec playwright install                           ║
║                                                            ║
║ <3 Playwright Team                                         ║
╚════════════════════════════════════════════════════════════╝
```