# Desktop App (Windows) — Build Guide

Framework Command Center ships as a native Windows `.exe` via [Tauri](https://tauri.app) — a Rust-based desktop framework that wraps the Next.js web app in a lightweight native shell (~5MB).

---

## Prerequisites

You need these installed before building:

### 1. Rust and Cargo

```bash
# Install via rustup (the official Rust installer)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Or on Windows, download and run:
# https://win.rustup.rs/x86_64
```

After installing, restart your terminal and verify:

```bash
rustc --version   # should print e.g. rustc 1.75.0
cargo --version   # should print e.g. cargo 1.75.0
```

### 2. WebView2 (Windows only)

WebView2 is Microsoft's browser engine that Tauri uses to render the app. On Windows 11, it's already installed. On Windows 10:

- Download the WebView2 installer from [Microsoft](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
- Or it will auto-install when your users run the app

### 3. Visual Studio Build Tools (Windows)

Required for compiling Rust on Windows:

1. Download [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. Install **"Desktop development with C++"** workload
3. Restart your machine

### 4. Node.js 18+ and npm

Already required for the web app — see [SETUP.md](./SETUP.md).

---

## Development Mode (Desktop)

Run the app as a desktop window while developing:

```bash
npm run desktop:dev
```

This starts both the Next.js dev server and the Tauri window simultaneously. Changes to your React code hot-reload in the desktop window.

> **Note:** The desktop dev build connects to `http://localhost:3000`. Your Supabase credentials must be in `.env.local` for auth to work.

---

## Production Build

Build the distributable Windows installer:

```bash
npm run desktop:build
```

This:
1. Runs `next build` to produce the optimized web app
2. Compiles the Rust Tauri shell
3. Bundles everything into a Windows installer

**Output location:**
```
src-tauri/target/release/bundle/
├── msi/
│   └── Framework Command Center_1.0.0_x64_en-US.msi   ← Windows installer
└── nsis/
    └── Framework Command Center_1.0.0_x64-setup.exe    ← NSIS installer
```

The build takes 5–15 minutes the first time (Rust compilation is slow on first run). Subsequent builds are much faster.

---

## Configuring the Desktop App

The Tauri configuration is in `src-tauri/tauri.conf.json`. Key settings:

```json
{
  "package": {
    "productName": "Framework Command Center",
    "version": "1.0.0"
  },
  "tauri": {
    "windows": [{
      "title": "Framework Command Center",
      "width": 1400,
      "height": 900,
      "minWidth": 900,
      "minHeight": 600,
      "resizable": true,
      "fullscreen": false,
      "center": true
    }]
  }
}
```

To change the app icon, replace the files in `src-tauri/icons/` with your own (Tauri needs `.ico`, `.png` at multiple sizes).

---

## Connecting to Your Live Database

The desktop app works exactly like the web app — it connects to your Supabase database over the internet. There's no local database.

**For a production desktop build** pointing to your live Supabase:

The env vars (`NEXT_PUBLIC_SUPABASE_URL`, etc.) are baked into the Next.js build at build time. Before running `npm run desktop:build`, ensure your `.env.local` has the correct production Supabase credentials.

---

## Distributing the App

### Option A: Share the installer file directly

Copy the `.msi` or `.exe` from `src-tauri/target/release/bundle/` and distribute it via USB, cloud drive, email, etc.

Users run it once to install, and it appears in their Start Menu and `C:\Program Files\`.

### Option B: Auto-update (advanced)

Tauri supports auto-updates via a Tauri updater server. This is optional and not configured by default. See [Tauri Updater docs](https://tauri.app/v1/guides/distribution/updater) if you want to set this up.

---

## Updating the App Version

1. Update `version` in `src-tauri/tauri.conf.json`
2. Update `version` in `package.json`
3. Run `npm run desktop:build`
4. Distribute the new installer

---

## Troubleshooting

### "linker not found" or Rust compilation errors

Install Visual Studio Build Tools with the C++ workload (see Prerequisites).

### White screen in desktop window

Usually means the Next.js build failed. Run `npm run build` first to catch any errors:

```bash
npm run build
npm run desktop:build
```

### App opens but can't log in

The desktop app uses WebView2, which handles cookies and sessions. Make sure:
1. Your Supabase URL and anon key are correct in `.env.local` at build time
2. Your Supabase redirect URLs include the desktop callback

For Tauri, the auth callback is handled differently from the web. If magic links aren't working, use email + password login as a fallback.

### `npm run desktop:dev` fails with "cargo not found"

Rust isn't installed or isn't in your PATH. Run `rustup` installation again and restart your terminal.

### Build is very slow

Rust compilation is slow on first build — this is normal. Subsequent builds use cached artifacts and are much faster (~1–2 minutes).

---

## Cross-Platform Notes

The current build configuration targets **Windows x64**. Tauri also supports macOS and Linux, but no configuration has been added for those platforms. To add macOS support:

1. You'll need a Mac to build for macOS (Apple requirement)
2. Update `src-tauri/tauri.conf.json` with macOS bundle settings
3. Add macOS-specific icons

See [Tauri's cross-platform guide](https://tauri.app/v1/guides/building/cross-platform) for details.
