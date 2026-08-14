# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: locale-coverage.spec.ts >> Locale Coverage — FA/RTL & EN/LTR >> FA/RTL — Default Locale >> should have no layout overflow on FA/RTL at 390px
- Location: apps/web/e2e/locale-coverage.spec.ts:47:9

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/codespace/.cache/ms-playwright/firefox-1538/firefox/firefox
╔════════════════════════════════════════════════════════════╗
║ Looks like Playwright was just installed or updated.       ║
║ Please run the following command to download new browsers: ║
║                                                            ║
║     pnpm exec playwright install                           ║
║                                                            ║
║ <3 Playwright Team                                         ║
╚════════════════════════════════════════════════════════════╝
```