export class MissingEnvError extends Error {
  missing: string[]

  constructor(missing: string[]) {
    super(
      `Missing required environment variable${missing.length > 1 ? 's' : ''}:\n` +
        missing.map((k) => `  - ${k}`).join('\n')
    )
    this.name = 'MissingEnvError'
    this.missing = missing
  }
}

type EnvRecord<K extends string> = Record<K, string>

export function requireEnv<const K extends string>(keys: K[]): EnvRecord<K>
export function requireEnv<const K extends string>(
  keys: K[],
  options: { source?: NodeJS.ProcessEnv }
): EnvRecord<K>
export function requireEnv<const K extends string>(
  keys: K[],
  options: { source?: NodeJS.ProcessEnv } = {}
): EnvRecord<K> {
  const source = options.source ?? process.env
  const missing = keys.filter((k) => !source[k])

  if (missing.length > 0) {
    throw new MissingEnvError(missing)
  }

  return Object.fromEntries(keys.map((k) => [k, source[k] as string])) as EnvRecord<K>
}

export function checkEnv(
  keys: string[],
  options: { source?: NodeJS.ProcessEnv } = {}
): { ok: boolean; missing: string[] } {
  const source = options.source ?? process.env
  const missing = keys.filter((k) => !source[k])
  return { ok: missing.length === 0, missing }
}
