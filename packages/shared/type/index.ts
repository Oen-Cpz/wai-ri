
/**
 * 参考：https://github.com/millsp/ts-toolbelt
 */
export * as Function from './Function'
export * as Number from './Number'
export * as String from './String'
export * as Tuple from './Tuple'
export * as Union from './Union'



import * as Union from './Union'
import { SetParams, UnaryFn } from './Function'




/** 对象类型，用来取代 object | {} */
export type ObjectType<K extends keyof any = keyof any, V = unknown> = Record<K, V>


/** 函数 */
export type Fn<Args extends any[] = any[], Return = any> = (...args: Args) => Return



/** 异步函数 */
export type AsyncFn<Args extends any[] = any[], Return = any> = (...args: Args) => Promise<Return>



/** 数组的元素类型 */
export type ArrayType<A extends any[]> = A extends Array<infer P> ? P : never



/** T 类型 L 长度的 Tuple */
export type FixedArray<T, L extends number, A extends unknown[] = []> = A['length'] extends L ? A : FixedArray<T, L, [T, ...A]>



/** F 异步函数的返回 异步 数据类型 */
export type AwaitedReturn<F extends AsyncFn> = Awaited<ReturnType<F>>



/** O 对象的 value 类型 */
export type ValueOf<O extends Record<keyof any, any>> = O[keyof O]



/** 扩展 为 可以是数组 */
export type Arrayable<T> = T | T[]



/** 根据 value 获取 key 类型 */
export type KeysMatching<Obj, Val> = { [Key in keyof Obj]-?: Obj[Key] extends Val ? Key : never }[keyof Obj]
// 另一种 解法
// export type KeysMatching<Obj, Val> = keyof { [Key in keyof Obj as (Obj[Key] extends Val ? Key : never)]: Key }



/** 相等 */
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false



/** 是否为 any */
export type IsAny<T> = 0 extends (1 & T) ? true : false



type SetValuesToString<T extends Record<keyof any, keyof any | boolean | null | undefined>> = {
  [K in keyof T]:
  T[K] extends keyof any
  ? T[K]
  : T[K] extends bigint | boolean | undefined | null
  ? `${T[K]}`
  : never
}

/** 反转 对象 值与键 */
export type Reverse<Obj extends Record<keyof Obj, Obj[keyof Obj]>> = { [Val in ValueOf<Obj>]: KeysMatching<Obj, Val> }
export type ReverseLoose<T extends Record<keyof any, keyof any | boolean | null | undefined>> = Reverse<SetValuesToString<T>>



/** 展开类型 */
// export type Expand<T> = ExpandDeep<T, 2>
export type Expand<T, Deep extends 0 | 1 | 2 = 2> =
  Deep extends 0 ? T :
  T extends ObjectType ? { [K in keyof T]: Expand<T[K], Deep extends 2 ? 1 : 0> } :
  Union.IsUnion<T> extends true ? Expand<Union.ToTuple<T>[number], Deep extends 2 ? 1 : 0> :
  T extends Fn<infer Params, infer Return> ? Fn<Expand<Params, Deep extends 2 ? 1 : 0>, Expand<Return, Deep extends 2 ? 1 : 0>> :
  T extends Promise<infer Pro> ? Promise<Expand<Pro, Deep extends 2 ? 1 : 0>> :
  T



/** 递归展开，TODO: 增加递归深度？递归类型？ */
export type ExpandDeep<T, Deep extends number = 5> =
  T extends ObjectType ? { [K in keyof T]: ExpandDeep<T[K]> } :
  Union.IsUnion<T> extends true ? ExpandDeep<Union.ToTuple<T>[number]> :
  T extends Fn<infer Params, infer Return> ? Fn<ExpandDeep<Params>, ExpandDeep<Return>> :
  T extends Promise<infer Pro> ? Promise<ExpandDeep<Pro>> :
  T



/** 管道函数 参数类型 */
type PipeParams<Funcs extends UnaryFn[], SourceT = never, Len = Funcs['length']> =
  Len extends 0
  ? []
  : Funcs extends [infer First extends UnaryFn, infer Second extends UnaryFn, ...infer Rest extends UnaryFn[]]
  ? [
    // [SourceT] extends [never] ? First :
    SetParams<First, [SourceT]>,

    ...PipeParams<
      [SetParams<Second, [ReturnType<First>]>, ...Rest],
      ReturnType<First>
    >
  ]
  : Funcs

/** 管道函数 返回类型 */
type PipeReturn<Funcs extends UnaryFn[], FirstArg = never,> = Funcs extends [...unknown[], (arg: any) => infer R] ? R : FirstArg

// declare function pipe<Funcs extends UnaryFn[]>(...args: PipeParams<Funcs, number>): PipeReturn<Funcs, number>

// 测试 pipe ---
// declare function num2str(a: number): string
// declare function num2boo(a: number): boolean
// declare function str2num(a: string): number
// declare function str2boo(a: string): boolean
// declare function boo2num(a: boolean): number
// declare function boo2str(a: boolean): string

// pipe(num2str, str2num, num2boo, boo2num)
// // @ts-expect-error 'number' not assignable to 'string'
// pipe(str2num, num2boo, boo2num)
// // @ts-expect-error 'boolean' not assignable to 'string'
// pipe(num2boo, str2num, num2boo)
// pipe(num2boo, boo2str)
// // @ts-expect-error 'boolean' not assignable to 'number'
// pipe(num2boo, num2str)
// pipe(num2boo)
// pipe()




/** 用 New 类型 扩展 Org 类型*/
export type Assign<Org extends ObjectType, New extends ObjectType> = Expand<New & Omit<Org, keyof New>>



/** 可扩展类型 */
export type Extensible<O extends ObjectType> = Expand<O & ObjectType>
