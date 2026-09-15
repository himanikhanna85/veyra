# Commands

Run these commands from the repository root unless a section says otherwise.

## Desktop application

Install dependencies:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm install
```

For a clean, lockfile-exact install (the CI path):

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm ci
```

Start the local renderer preview:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

If port `4173` is occupied, choose an explicit alternate port:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm run dev -- --host 127.0.0.1 --port 4174 --strictPort
```

Open that development renderer in the isolated Electron shell from a second
macOS/Linux terminal:

```bash
cd /Users/anandarora/Veyra/apps/desktop
VEYRA_RENDERER_URL=http://127.0.0.1:4173/ npm run start:desktop
```

When using the alternate port, the Electron URL must match it:

```bash
cd /Users/anandarora/Veyra/apps/desktop
VEYRA_RENDERER_URL=http://127.0.0.1:4174/ npm run start:desktop
```

The equivalent Windows PowerShell command is:

```powershell
Set-Location C:\path\to\Veyra\apps\desktop
$env:VEYRA_RENDERER_URL = "http://127.0.0.1:4173/"
npm run start:desktop
```

Run the component and shell tests:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm test
```

Run the isolated E02 persistence demonstration. It creates a project, immutable
run snapshot and external evidence file; exports and restores a checksummed
backup; cleans old evidence; and prints the retained temporary backup path:

```bash
cd /Users/anandarora/Veyra/apps/desktop
rtk npm run demo:e02
```

Use the printed `backupPath` with **Data → Restore project** to exercise the
native restore picker. The demo operates only in a new temporary directory and
does not modify the normal Veyra application-data store.

Type-check the Electron main/preload boundary:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm run typecheck
```

Build the production renderer, Electron main/preload processes and static
hosting package:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm run build
```

Boot the production app twice under Electron and verify the preload allowlist,
renderer isolation, clean shutdown and persisted lifecycle journal:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm run smoke:desktop
```

Verify static routing and packaging behavior:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm run test:sites
```

Audit production and development dependencies:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm audit --omit=dev
npm audit
```

## Desktop packaging

Regenerate the packaging icon from the approved lossless source:

```bash
cd /Users/anandarora/Veyra
sips -z 1024 1024 docs/brand/veyra-app-icon-source.png --out apps/desktop/build/icon.png
```

Create an unpacked Apple Silicon macOS application for fast local checks:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm run package:dir
```

Create Apple Silicon and Intel macOS DMG/ZIP packages:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm run package:mac
```

Create the x64 Windows NSIS installer:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm run package:win
```

After both packaging commands, verify every expected artifact exists and is
non-empty:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm run verify:packages
```

Smoke-test the unpacked Apple Silicon macOS application through two launches:

```bash
cd /Users/anandarora/Veyra/apps/desktop
VEYRA_EXECUTABLE="release/mac-arm64/Veyra.app/Contents/MacOS/Veyra" node scripts/smoke-electron.mjs
```

Artifacts are written to `/Users/anandarora/Veyra/apps/desktop/release/`.
E01 artifacts use the approved Veyra mark but remain unsigned; signing,
notarization and update channels are E22 work. Run each package on its target
operating system before external distribution.
