# B1 - JWT auth API

Express service with three routes: sign up, sign in, and a profile route that only opens with a valid token.

## Run it

```bash
npm install
npm start            # http://localhost:3000
```

Open that address in a browser for a small page where you can try each route by hand.
Prefer curl?

```bash
curl -X POST localhost:3000/register -H "Content-Type: application/json" -d '{"username":"meera","password":"secret123"}'
curl -X POST localhost:3000/login    -H "Content-Type: application/json" -d '{"username":"meera","password":"secret123"}'
curl localhost:3000/profile -H "Authorization: Bearer <paste token>"
```

## What each route answers

| Route | Case | Status | Body |
|---|---|---|---|
| POST /register | ok | 201 | `{ "message": "User registered" }` |
| | username blank/missing, or password under 6 chars | 400 | `{ "error": "Invalid input" }` |
| | username taken | 409 | `{ "error": "Username already exists" }` |
| POST /login | ok | 200 | `{ "token": "<jwt>" }` (payload has `username`, expires in 1h) |
| | unknown user or wrong password | 401 | `{ "error": "Invalid credentials" }` |
| GET /profile | valid token | 200 | `{ "username": "<username>" }` |
| | missing, malformed, bad signature, expired | 401 | `{ "error": "Unauthorized" }` |

## Tests

```bash
npm test
```

## Layout

```
src/app.js      routes
src/auth.js     hashing, token signing, the guard middleware
src/store.js    in-memory users
src/server.js   starts the listener (kept apart so tests can import app.js)
public/         the hand-testing page
tests/          supertest + vitest
```

Set `JWT_SECRET` before running anywhere real (see `.env.example`).
Passwords are hashed with Node's built-in scrypt. Users live in memory, so a restart clears them.
