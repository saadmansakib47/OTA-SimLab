# OTA-SimLab

A small visual simulator for distributed algorithms. This repository contains two front-ends: a legacy Create React App under `src/` and a modern Next.js app under `app/`.

Keep it simple — quick commands below work on Windows PowerShell.

## Install

Recommended: pnpm (but npm works).

```powershell
# install dependencies
pnpm install
# or with npm
npm install
```

## Run (dev)

1) Run the default (legacy) React app (uses `react-scripts`):

```powershell
pnpm start
# or
npm start
```

2) Run the Next.js app (modern UI inside `app/`):

```powershell
pnpm exec next dev
# or with npm's npx
npx next dev
```

If ports conflict, run Next on another port:

```powershell
npx next dev -p 3001
```

## Build (production)

Legacy app (react-scripts):

```powershell
pnpm run build
# or
npm run build
```

Next.js production build and start:

```powershell
pnpm exec next build
pnpm exec next start
# or
npx next build; npx next start
```

## Key files & folders

- `app/` — Next.js (app-router) source (modern UI)
- `components/` — shared UI components used by Next app
- `src/` — legacy Create React App source
- `public/` — static assets (legacy app index.html)
- `styles/`, `app/globals.css` — global CSS & Tailwind setup

## About this project

OTA-SimLab is a lightweight, interactive simulator for teaching, experimenting with, and prototyping distributed coordination algorithms. It focuses on visual clarity and quick iteration so you can:

- See how algorithms exchange messages and make decisions in real time.
- Adjust network/clock parameters (latency, message loss, node counts) and observe behavior.
- Collect simple metrics (message count, latency, time-to-complete, fairness) to compare algorithms.

Who it's for

- Students learning distributed systems and concurrency concepts.
- Researchers/engineers prototyping coordination protocols or OTA update strategies.
- Educators who want a simple demo for lectures or labs.

## Features

- Built-in algorithm visualizations: token ring, Lamport logical clocks, Ricart-Agrawala, mutex-based and lock-free approaches, observer pattern (see `src/utils/algorithms` for implementations).
- Interactive simulator controls: start, pause, step, reset, adjustable speed, and node management (add/remove nodes).
- Network fault simulation: configurable message delay, packet loss, and node failures to test robustness.
- Real-time metrics panel (charts) showing messages, latency distribution, and algorithm-specific stats.
- Pluggable algorithm architecture: add a new algorithm module and register it in the selector to see it in the UI.
- Two front-ends in one repo: quick CRA-based dev flow (legacy) and an in-progress Next.js UI (modern) for an improved experience.

## Extending the simulator

To add a new algorithm:

1. Create a module under `src/utils/algorithms/` exporting the algorithm lifecycle (init, onMessage, tick, teardown) following existing files as examples.
2. Register the algorithm in `src/utils/algorithms/index.js` so it appears in `AlgorithmSelector.jsx`.
3. Add UI hooks if the algorithm needs custom controls or metrics. Recharts is used for metric charts (see `src/components/MetricsPanel.jsx`).

Data & wiring notes

- The simulator keeps a model of nodes and message queues in `src/hooks/useSimulation.js`.
- UI components under `src/components` consume the simulation state and dispatch control actions.

## Architecture (high level)

- Simulation core (state + scheduler) — maintains node states and delivers messages (with simulated delay/loss).
- Algorithms — pure logic modules that react to messages and schedule actions.
- UI — React components (legacy CRA or Next.js) that render nodes, messages and charts.

## Limitations

- Not production-grade networking — it simulates behavior in-memory for visualization and experiments only.
- Some features are duplicated between the legacy and Next.js front-ends; choose one to iterate on for larger refactors.

## Want help or changes?

- I can add quick `dev:next` / `build:next` scripts to `package.json`.
- I can add a short CONTRIBUTING.md or example algorithm template file.

---

If you'd like I can now add the `dev:next` scripts to `package.json` or create an `ALGORITHM_TEMPLATE.md` file to make it even easier to add new algorithms.

## Scripts in `package.json`

This repo's `package.json` includes these scripts (legacy CRA): `start`, `build`, `test`, `eject` (uses `react-scripts`).

Tip: I can add convenient scripts like `dev:next`, `build:next`, `start:next` if you want.

## Troubleshooting

- If `pnpm` isn't installed, use `npm install -g pnpm` or run with `npm`/`npx`.
- If you see a port-in-use error, change the port (see Next command above) or stop the other server.

## Contributing

1. Branch from `dev`.
2. Add tests for new logic where possible.
3. Open a PR with a short description and screenshots if the UI changed.


