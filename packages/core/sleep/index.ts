import type { Fn } from '@wai-ri/shared'



/** 等待 0 毫秒 */
export async function sleep(): Promise<void>

/** 等待`ms`毫秒 */
export async function sleep(ms: number): Promise<void>

/** 等待`ms`毫秒后执行函数 */
export async function sleep<P extends any[], R = void>(ms: number, fn: Fn<P, R>, ...args: P): Promise<Awaited<R>>

export async function sleep<P extends any[], R = void>(ms?: number, fn?: Fn<P, R>, ...args: P): Promise<R | undefined> {
  return new Promise(res => setTimeout(() => res(fn?.(...args)), ms))
}