# envguard

Validate required environment variables at app startup and throw a clear, readable error listing exactly what's missing.

Zero dependencies. TypeScript-first. Works with Node.js ESM and CJS.

## Install

```bash
npm install @padmaj/envguard
```

## Usage

### `requireEnv` — throw if anything is missing

```ts
import { requireEnv } from '@padmaj/envguard'

const env = requireEnv(['DATABASE_URL', 'API_KEY', 'PORT'])

// env.DATABASE_URL — string, fully typed
// env.API_KEY      — string, fully typed
// env.PORT         — string, fully typed
```

If `DATABASE_URL` and `PORT` are not set, you get:

```
MissingEnvError: Missing required environment variables:
  - DATABASE_URL
  - PORT
```

### `checkEnv` — soft check, no throw

```ts
import { checkEnv } from '@padmaj/envguard'

const { ok, missing } = checkEnv(['DATABASE_URL', 'API_KEY'])

if (!ok) {
  console.warn('Some env vars are missing:', missing)
}
```

### Custom source

Both functions accept an optional `source` to validate against something other than `process.env` — useful in tests:

```ts
requireEnv(['FOO'], { source: { FOO: 'bar' } })
```

## API

### `requireEnv(keys, options?)`

| Param | Type | Description |
|---|---|---|
| `keys` | `string[]` | Names of required env vars |
| `options.source` | `NodeJS.ProcessEnv` | Defaults to `process.env` |

Returns a typed `Record<K, string>`. Throws `MissingEnvError` if any key is missing or empty.

### `checkEnv(keys, options?)`

Same params as `requireEnv`. Returns `{ ok: boolean, missing: string[] }`. Never throws.

### `MissingEnvError`

Extends `Error`. Has a `missing: string[]` property you can inspect programmatically.

## License

MIT
