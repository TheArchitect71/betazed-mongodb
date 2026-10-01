# Betazed MongoDB — Epsilon backend

A NestJS API demonstrating MongoDB-backed users, password authentication, and JWT-protected profiles. Unlike the in-memory [Betazed tutorial](https://github.com/TheArchitect71/betazed), this application persists users in local MongoDB. Its frontend is [Epsilon Reticuli B](https://github.com/TheArchitect71/epsilon-reticuli-b), the combined Epsilon/Event Horizon people workspace.

## API

- `POST /users`: create a user with `name` and `age`; legacy `price` is accepted as an age alias.
- Include `username` and `password` (at least eight characters) to create a login-capable user. Passwords are hashed; duplicate usernames return 409.
- `POST /auth/login`: exchange username/password for an `access_token`.
- `GET /people`, `GET /people/:id`, `POST /people`, `PUT /people/:id`, and `DELETE /people/:id`: authenticated directory CRUD. Every operation is scoped to the JWT account; another account’s records return 404. New directories start empty.
- People require `name`, `role`, and `status`; optional fields include `organization`, `expertise`, `notes`, and historical mission/education details. Unknown ownership fields are ignored.
- `GET /profile`: send `Authorization: Bearer <access_token>` to retrieve the authenticated user ID and username.

## Run locally

Prerequisites: the Node version in `.nvmrc` (currently 26.10.0), npm, and MongoDB Community 9.0.2. From the repository root:

```sh
npm ci
npm run setup:local
npm run build
```

Start MongoDB in a foreground terminal:

```sh
mkdir -p .local/mongodb
mongod --dbpath .local/mongodb --bind_ip 127.0.0.1 --port 27018 --replSet offline-rs
```

If that local replica set already runs on port 27018, reuse it rather than starting a second instance. In another terminal at the repository root:

```sh
npm run db:init
PORT=3001 npm run start:prod
```

Open [http://127.0.0.1:3001](http://127.0.0.1:3001). Keep both processes in the foreground and stop them with **Ctrl+C**. Setup creates a private, ignored `.env.local` without overwriting an existing file. Database initialization creates no application records. These defaults use local MongoDB; no Atlas account is required.

## Frontend connection

Epsilon runs on http://127.0.0.1:4202 and proxies `/api/**` to this API on port 3001. Launch it from the `epsilon-reticuli-b` checkout with `npm start`. Create an account in Epsilon, sign in, and manage people. JWT sessions last one hour; Epsilon redirects expired sessions to sign-in.

If MongoDB is already running as a standalone instance on port 27017, reuse it:

```sh
npm run setup:local
MONGODB_URI='mongodb://127.0.0.1:27017/betazed' PORT=3001 npm run start:dev
```

This is a foreground process; stop it with **Ctrl+C**. The environment override leaves `.env.local` unchanged. Newly generated local configuration defaults to API port 3001 and the replica set on port 27018; existing configuration is preserved.

## Development

```sh
npm run start:dev
```

Checks: `npm run build`, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run test:e2e`. Integration tests use and remove a separate local database. For a standalone MongoDB on port 27017, use `TEST_MONGODB_URI='mongodb://127.0.0.1:27017/' npm run test:e2e`. Tests cover authenticated CRUD, persistence, input validation, and cross-account isolation. The Node version in `.nvmrc` supports the Jest ESM flags included in the test scripts.
