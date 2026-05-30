# SalesLens AI

Monorepo for the SalesLens sales analytics platform.

| Package | Description |
|---------|-------------|
| [saleslens-api](./saleslens-api/) | FastAPI backend — Excel upload, dashboard metrics, PostgreSQL |
| [saleslens-app](./saleslens-app/) | React Native (Expo) mobile app — dashboards and file upload |

## Quick start

1. Start PostgreSQL and configure the API (see [saleslens-api/README.md](./saleslens-api/README.md)).
2. Run the API on port `8000`.
3. Point the mobile app at your API host (see [saleslens-app/README.md](./saleslens-app/README.md)).
4. Start the Expo dev server and open the app on a device or simulator.

## Repository layout

```text
Saleslens-AI/
├── saleslens-api/    # Python FastAPI service
├── saleslens-app/    # Expo React Native client
└── .gitignore        # Shared ignores (node_modules, uploads, secrets, etc.)
```

Both packages are tracked in this single Git repository. Commit changes to either or both from the repo root.
