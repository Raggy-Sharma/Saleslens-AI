# SalesLens App

Expo (React Native) client for SalesLens: sales dashboards, trends, and Excel upload to the API.

## Prerequisites

- Node.js 24.x (see `.nvmrc`)
- [Expo Go](https://expo.dev/go) on a physical device, or iOS Simulator / Android emulator
- SalesLens API running and reachable from your device (see [saleslens-api/README.md](../saleslens-api/README.md))

## Setup

```bash
cd saleslens-app
nvm use          # if you use nvm
npm install
```

## API URL

Set your machine's LAN IP (or `localhost` for simulators) in `env.js`:

```js
baseUrl = 'http://YOUR_IP:8000';
```

Update `src/services/api.js` to use `baseUrl` for the Axios `baseURL` if it still points at a hardcoded address. Physical devices must use your computer's network IP, not `localhost`.

## Run

```bash
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

Other scripts:

| Command | Description |
|---------|-------------|
| `npm run android` | Expo with Android |
| `npm run ios` | Expo with iOS |
| `npm run web` | Expo web |

## Project structure

```text
src/
├── components/     # UI cards (summary, trends, MTD, etc.)
├── screens/        # Home, dashboard, upload
├── navigation/     # Tab navigator
├── services/       # API client
├── store/          # Zustand state
└── theme/          # Colors and theming
```

## Notes

- `node_modules/`, `.expo/`, and native `ios/` / `android/` build folders are gitignored.
- Ensure the API allows requests from your device (same Wi‑Fi, firewall, `--host 0.0.0.0` on uvicorn).
