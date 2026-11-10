# PulseGrid IoT Sensor Monitor

A responsive telemetry dashboard with an ESP32-style sensor simulator, a Node.js HTTP API, JSON persistence, and automated tests. Node 18+; no runtime dependencies.

## Run locally

```sh
npm test
npm run check
npm start
```

Open http://localhost:3000 and click **Generate sample**.

## Static cPanel deployment

Upload the contents of `deploy/public_html` into `public_html/pulsegrid` in cPanel File Manager. Visit `https://your-domain/pulsegrid/`. The site runs in **demo mode**, storing data in each visitor's own browser. This does not run the Node API.

## Node deployment

On a host supporting Node.js, upload the project and run `npm start` with `PORT` configured by the host. Data persists to `data/readings.json` (ignored by git). This prototype API has no authentication or rate limiting and should not be used for sensitive production devices without hardening.

## API

- `GET /api/health`
- `GET /api/devices`
- `GET /api/readings?deviceId=esp32-1&limit=50`
- `GET /api/readings/latest?deviceId=esp32-1`
- `POST /api/readings` JSON: `{"deviceId":"esp32-1","temperature":25.5,"humidity":60,"timestamp":"2026-01-01T10:00:00Z"}`

## Known issue for future engineering work

The store currently accepts repeated packets and uses **arrival order**, not measurement time, to select the latest reading. Duplicate or delayed older readings can therefore change the dashboard's displayed latest temperature. This is an open issue, not a fixed behavior. The static demo mirrors this behavior. Fixing idempotency and event-time ordering is a suitable focused SWE task.

## Files

`public/`: dashboard; `server/`: Node API and storage; `tests/`: baseline tests; `deploy/public_html/`: static site files.
