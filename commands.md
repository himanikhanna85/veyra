# Commands

Run these commands from the repository root unless a section says otherwise.

## Desktop renderer foundation

Install dependencies:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm install
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

Run the component and shell tests:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm test
```

Build the production renderer and prepare the static package:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm run build
```

Verify static routing and packaging behavior:

```bash
cd /Users/anandarora/Veyra/apps/desktop
npm run test:sites
```

