# Betazed MongoDB — authentication API

A NestJS API demonstrating MongoDB-backed users, password authentication, and JWT-protected profiles. Unlike the in-memory [Betazed tutorial](https://github.com/TheArchitect71/betazed), this application persists users in local MongoDB. It has no frontend.

## API

- `POST /users`: create a user with `name` and `age`; legacy `price` is accepted as an age alias.
- Include `username` and `password` (at least eight characters) to create a login-capable user. Passwords are hashed; duplicate usernames return 409.
- `POST /auth/login`: exchange username/password for an `access_token`.
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
npm run start:prod
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). Keep both processes in the foreground and stop them with **Ctrl+C**. Setup creates a private, ignored `.env.local` without overwriting an existing file. Database initialization creates no application records. These defaults use local MongoDB; no Atlas account is required.

## Development

```sh
npm run start:dev
```

Checks: `npm run build`, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run test:e2e`. Integration tests use and remove a separate local database. The Node version in `.nvmrc` supports the Jest ESM flags included in the test scripts.
