# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: locale-coverage.spec.ts >> Locale Coverage — FA/RTL & EN/LTR >> Locale Switching — Navigation Consistency >> should have valid landmarks on both locales
- Location: apps/web/e2e/locale-coverage.spec.ts:184:9

# Error details

```
Error: browserType.launch: 
╔══════════════════════════════════════════════════════╗
║ Host system is missing dependencies to run browsers. ║
║ Missing libraries:                                   ║
║     libgtk-4.so.1                                    ║
║     libvulkan.so.1                                   ║
║     libgraphene-1.0.so.0                             ║
║     libopus.so.0                                     ║
║     libgstallocators-1.0.so.0                        ║
║     libgstapp-1.0.so.0                               ║
║     libgstpbutils-1.0.so.0                           ║
║     libgstaudio-1.0.so.0                             ║
║     libgsttag-1.0.so.0                               ║
║     libgstvideo-1.0.so.0                             ║
║     libgstgl-1.0.so.0                                ║
║     libgstcodecparsers-1.0.so.0                      ║
║     libgstfft-1.0.so.0                               ║
║     libflite.so.1                                    ║
║     libflite_usenglish.so.1                          ║
║     libflite_cmu_grapheme_lang.so.1                  ║
║     libflite_cmu_grapheme_lex.so.1                   ║
║     libflite_cmu_indic_lang.so.1                     ║
║     libflite_cmu_indic_lex.so.1                      ║
║     libflite_cmulex.so.1                             ║
║     libflite_cmu_time_awb.so.1                       ║
║     libflite_cmu_us_awb.so.1                         ║
║     libflite_cmu_us_kal16.so.1                       ║
║     libflite_cmu_us_kal.so.1                         ║
║     libflite_cmu_us_rms.so.1                         ║
║     libflite_cmu_us_slt.so.1                         ║
║     libwebpdemux.so.2                                ║
║     libavif.so.16                                    ║
║     libharfbuzz-icu.so.0                             ║
║     libwebpmux.so.3                                  ║
║     libwayland-server.so.0                           ║
║     libmanette-0.2.so.0                              ║
║     libenchant-2.so.2                                ║
║     libgbm.so.1                                      ║
║     libdrm.so.2                                      ║
║     libhyphen.so.0                                   ║
║     libGLESv2.so.2                                   ║
║     libx264.so                                       ║
╚══════════════════════════════════════════════════════╝
```