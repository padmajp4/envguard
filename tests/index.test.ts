import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { requireEnv, checkEnv, MissingEnvError } from '../src/index'

const TEST_ENV: NodeJS.ProcessEnv = {}

describe('requireEnv', () => {
  it('returns typed record when all vars are present', () => {
    const env = requireEnv(['FOO', 'BAR'], {
      source: { FOO: 'hello', BAR: 'world' },
    })
    expect(env.FOO).toBe('hello')
    expect(env.BAR).toBe('world')
  })

  it('throws MissingEnvError when a var is missing', () => {
    expect(() =>
      requireEnv(['FOO', 'BAR'], { source: { FOO: 'hello' } })
    ).toThrow(MissingEnvError)
  })

  it('error message lists all missing vars', () => {
    try {
      requireEnv(['FOO', 'BAR', 'BAZ'], { source: {} })
    } catch (e) {
      expect(e).toBeInstanceOf(MissingEnvError)
      const err = e as MissingEnvError
      expect(err.missing).toEqual(['FOO', 'BAR', 'BAZ'])
      expect(err.message).toContain('FOO')
      expect(err.message).toContain('BAR')
      expect(err.message).toContain('BAZ')
    }
  })

  it('treats empty string as missing', () => {
    expect(() =>
      requireEnv(['FOO'], { source: { FOO: '' } })
    ).toThrow(MissingEnvError)
  })

  it('uses plural in error for multiple missing vars', () => {
    try {
      requireEnv(['A', 'B'], { source: {} })
    } catch (e) {
      expect((e as MissingEnvError).message).toContain('variables')
    }
  })

  it('uses singular in error for one missing var', () => {
    try {
      requireEnv(['A'], { source: {} })
    } catch (e) {
      expect((e as MissingEnvError).message).not.toContain('variables')
    }
  })
})

describe('checkEnv', () => {
  it('returns ok: true when all vars are present', () => {
    const result = checkEnv(['FOO'], { source: { FOO: 'bar' } })
    expect(result.ok).toBe(true)
    expect(result.missing).toEqual([])
  })

  it('returns ok: false with missing list when vars are absent', () => {
    const result = checkEnv(['FOO', 'BAR'], { source: { FOO: 'x' } })
    expect(result.ok).toBe(false)
    expect(result.missing).toEqual(['BAR'])
  })
})
