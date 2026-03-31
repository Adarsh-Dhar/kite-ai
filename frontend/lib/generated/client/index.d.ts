
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Market
 * 
 */
export type Market = $Result.DefaultSelection<Prisma.$MarketPayload>
/**
 * Model DeployedPR
 * 
 */
export type DeployedPR = $Result.DefaultSelection<Prisma.$DeployedPRPayload>
/**
 * Model ResolutionLog
 * 
 */
export type ResolutionLog = $Result.DefaultSelection<Prisma.$ResolutionLogPayload>
/**
 * Model AgentCycle
 * 
 */
export type AgentCycle = $Result.DefaultSelection<Prisma.$AgentCyclePayload>
/**
 * Model SecurityAdvisory
 * 
 */
export type SecurityAdvisory = $Result.DefaultSelection<Prisma.$SecurityAdvisoryPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const MarketStatus: {
  OPEN: 'OPEN',
  PENDING_RESOLUTION: 'PENDING_RESOLUTION',
  RESOLVED: 'RESOLVED',
  INVALID: 'INVALID',
  PAUSED: 'PAUSED'
};

export type MarketStatus = (typeof MarketStatus)[keyof typeof MarketStatus]


export const Outcome: {
  UNRESOLVED: 'UNRESOLVED',
  YES: 'YES',
  NO: 'NO',
  INVALID: 'INVALID'
};

export type Outcome = (typeof Outcome)[keyof typeof Outcome]


export const ResolutionType: {
  GITHUB_PR: 'GITHUB_PR',
  GITHUB_RELEASE: 'GITHUB_RELEASE',
  GITHUB_ISSUE: 'GITHUB_ISSUE',
  CI_METRIC: 'CI_METRIC',
  CVE_SECURITY: 'CVE_SECURITY',
  WEB3_RPC: 'WEB3_RPC',
  DAO_GOVERNANCE: 'DAO_GOVERNANCE',
  LLM_JUDGE: 'LLM_JUDGE'
};

export type ResolutionType = (typeof ResolutionType)[keyof typeof ResolutionType]

}

export type MarketStatus = $Enums.MarketStatus

export const MarketStatus: typeof $Enums.MarketStatus

export type Outcome = $Enums.Outcome

export const Outcome: typeof $Enums.Outcome

export type ResolutionType = $Enums.ResolutionType

export const ResolutionType: typeof $Enums.ResolutionType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Markets
 * const markets = await prisma.market.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Markets
   * const markets = await prisma.market.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.market`: Exposes CRUD operations for the **Market** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Markets
    * const markets = await prisma.market.findMany()
    * ```
    */
  get market(): Prisma.MarketDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.deployedPR`: Exposes CRUD operations for the **DeployedPR** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DeployedPRS
    * const deployedPRS = await prisma.deployedPR.findMany()
    * ```
    */
  get deployedPR(): Prisma.DeployedPRDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resolutionLog`: Exposes CRUD operations for the **ResolutionLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ResolutionLogs
    * const resolutionLogs = await prisma.resolutionLog.findMany()
    * ```
    */
  get resolutionLog(): Prisma.ResolutionLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentCycle`: Exposes CRUD operations for the **AgentCycle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentCycles
    * const agentCycles = await prisma.agentCycle.findMany()
    * ```
    */
  get agentCycle(): Prisma.AgentCycleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.securityAdvisory`: Exposes CRUD operations for the **SecurityAdvisory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SecurityAdvisories
    * const securityAdvisories = await prisma.securityAdvisory.findMany()
    * ```
    */
  get securityAdvisory(): Prisma.SecurityAdvisoryDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.6.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Market: 'Market',
    DeployedPR: 'DeployedPR',
    ResolutionLog: 'ResolutionLog',
    AgentCycle: 'AgentCycle',
    SecurityAdvisory: 'SecurityAdvisory'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "market" | "deployedPR" | "resolutionLog" | "agentCycle" | "securityAdvisory"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Market: {
        payload: Prisma.$MarketPayload<ExtArgs>
        fields: Prisma.MarketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MarketFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MarketFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>
          }
          findFirst: {
            args: Prisma.MarketFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MarketFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>
          }
          findMany: {
            args: Prisma.MarketFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>[]
          }
          create: {
            args: Prisma.MarketCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>
          }
          createMany: {
            args: Prisma.MarketCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MarketCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>[]
          }
          delete: {
            args: Prisma.MarketDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>
          }
          update: {
            args: Prisma.MarketUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>
          }
          deleteMany: {
            args: Prisma.MarketDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MarketUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MarketUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>[]
          }
          upsert: {
            args: Prisma.MarketUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketPayload>
          }
          aggregate: {
            args: Prisma.MarketAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMarket>
          }
          groupBy: {
            args: Prisma.MarketGroupByArgs<ExtArgs>
            result: $Utils.Optional<MarketGroupByOutputType>[]
          }
          count: {
            args: Prisma.MarketCountArgs<ExtArgs>
            result: $Utils.Optional<MarketCountAggregateOutputType> | number
          }
        }
      }
      DeployedPR: {
        payload: Prisma.$DeployedPRPayload<ExtArgs>
        fields: Prisma.DeployedPRFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeployedPRFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployedPRPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeployedPRFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployedPRPayload>
          }
          findFirst: {
            args: Prisma.DeployedPRFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployedPRPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeployedPRFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployedPRPayload>
          }
          findMany: {
            args: Prisma.DeployedPRFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployedPRPayload>[]
          }
          create: {
            args: Prisma.DeployedPRCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployedPRPayload>
          }
          createMany: {
            args: Prisma.DeployedPRCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeployedPRCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployedPRPayload>[]
          }
          delete: {
            args: Prisma.DeployedPRDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployedPRPayload>
          }
          update: {
            args: Prisma.DeployedPRUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployedPRPayload>
          }
          deleteMany: {
            args: Prisma.DeployedPRDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeployedPRUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeployedPRUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployedPRPayload>[]
          }
          upsert: {
            args: Prisma.DeployedPRUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeployedPRPayload>
          }
          aggregate: {
            args: Prisma.DeployedPRAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeployedPR>
          }
          groupBy: {
            args: Prisma.DeployedPRGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeployedPRGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeployedPRCountArgs<ExtArgs>
            result: $Utils.Optional<DeployedPRCountAggregateOutputType> | number
          }
        }
      }
      ResolutionLog: {
        payload: Prisma.$ResolutionLogPayload<ExtArgs>
        fields: Prisma.ResolutionLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResolutionLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResolutionLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResolutionLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResolutionLogPayload>
          }
          findFirst: {
            args: Prisma.ResolutionLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResolutionLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResolutionLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResolutionLogPayload>
          }
          findMany: {
            args: Prisma.ResolutionLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResolutionLogPayload>[]
          }
          create: {
            args: Prisma.ResolutionLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResolutionLogPayload>
          }
          createMany: {
            args: Prisma.ResolutionLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResolutionLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResolutionLogPayload>[]
          }
          delete: {
            args: Prisma.ResolutionLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResolutionLogPayload>
          }
          update: {
            args: Prisma.ResolutionLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResolutionLogPayload>
          }
          deleteMany: {
            args: Prisma.ResolutionLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResolutionLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ResolutionLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResolutionLogPayload>[]
          }
          upsert: {
            args: Prisma.ResolutionLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResolutionLogPayload>
          }
          aggregate: {
            args: Prisma.ResolutionLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResolutionLog>
          }
          groupBy: {
            args: Prisma.ResolutionLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResolutionLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResolutionLogCountArgs<ExtArgs>
            result: $Utils.Optional<ResolutionLogCountAggregateOutputType> | number
          }
        }
      }
      AgentCycle: {
        payload: Prisma.$AgentCyclePayload<ExtArgs>
        fields: Prisma.AgentCycleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentCycleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentCyclePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentCycleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentCyclePayload>
          }
          findFirst: {
            args: Prisma.AgentCycleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentCyclePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentCycleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentCyclePayload>
          }
          findMany: {
            args: Prisma.AgentCycleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentCyclePayload>[]
          }
          create: {
            args: Prisma.AgentCycleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentCyclePayload>
          }
          createMany: {
            args: Prisma.AgentCycleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentCycleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentCyclePayload>[]
          }
          delete: {
            args: Prisma.AgentCycleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentCyclePayload>
          }
          update: {
            args: Prisma.AgentCycleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentCyclePayload>
          }
          deleteMany: {
            args: Prisma.AgentCycleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentCycleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentCycleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentCyclePayload>[]
          }
          upsert: {
            args: Prisma.AgentCycleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentCyclePayload>
          }
          aggregate: {
            args: Prisma.AgentCycleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentCycle>
          }
          groupBy: {
            args: Prisma.AgentCycleGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentCycleGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentCycleCountArgs<ExtArgs>
            result: $Utils.Optional<AgentCycleCountAggregateOutputType> | number
          }
        }
      }
      SecurityAdvisory: {
        payload: Prisma.$SecurityAdvisoryPayload<ExtArgs>
        fields: Prisma.SecurityAdvisoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SecurityAdvisoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityAdvisoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SecurityAdvisoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityAdvisoryPayload>
          }
          findFirst: {
            args: Prisma.SecurityAdvisoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityAdvisoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SecurityAdvisoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityAdvisoryPayload>
          }
          findMany: {
            args: Prisma.SecurityAdvisoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityAdvisoryPayload>[]
          }
          create: {
            args: Prisma.SecurityAdvisoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityAdvisoryPayload>
          }
          createMany: {
            args: Prisma.SecurityAdvisoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SecurityAdvisoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityAdvisoryPayload>[]
          }
          delete: {
            args: Prisma.SecurityAdvisoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityAdvisoryPayload>
          }
          update: {
            args: Prisma.SecurityAdvisoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityAdvisoryPayload>
          }
          deleteMany: {
            args: Prisma.SecurityAdvisoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SecurityAdvisoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SecurityAdvisoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityAdvisoryPayload>[]
          }
          upsert: {
            args: Prisma.SecurityAdvisoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityAdvisoryPayload>
          }
          aggregate: {
            args: Prisma.SecurityAdvisoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSecurityAdvisory>
          }
          groupBy: {
            args: Prisma.SecurityAdvisoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<SecurityAdvisoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.SecurityAdvisoryCountArgs<ExtArgs>
            result: $Utils.Optional<SecurityAdvisoryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    market?: MarketOmit
    deployedPR?: DeployedPROmit
    resolutionLog?: ResolutionLogOmit
    agentCycle?: AgentCycleOmit
    securityAdvisory?: SecurityAdvisoryOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type MarketCountOutputType
   */

  export type MarketCountOutputType = {
    resolutionLogs: number
  }

  export type MarketCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resolutionLogs?: boolean | MarketCountOutputTypeCountResolutionLogsArgs
  }

  // Custom InputTypes
  /**
   * MarketCountOutputType without action
   */
  export type MarketCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketCountOutputType
     */
    select?: MarketCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MarketCountOutputType without action
   */
  export type MarketCountOutputTypeCountResolutionLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResolutionLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Market
   */

  export type AggregateMarket = {
    _count: MarketCountAggregateOutputType | null
    _avg: MarketAvgAggregateOutputType | null
    _sum: MarketSumAggregateOutputType | null
    _min: MarketMinAggregateOutputType | null
    _max: MarketMaxAggregateOutputType | null
  }

  export type MarketAvgAggregateOutputType = {
    onchainMarketId: number | null
    blockNumber: number | null
    sourcePrNumber: number | null
    tssScore: number | null
    initialLiquidityEth: number | null
    resolveAttempts: number | null
  }

  export type MarketSumAggregateOutputType = {
    onchainMarketId: number | null
    blockNumber: number | null
    sourcePrNumber: number | null
    tssScore: number | null
    initialLiquidityEth: number | null
    resolveAttempts: number | null
  }

  export type MarketMinAggregateOutputType = {
    id: string | null
    onchainMarketId: number | null
    transactionHash: string | null
    blockNumber: number | null
    contractAddress: string | null
    title: string | null
    question: string | null
    category: string | null
    agentReason: string | null
    resolutionType: $Enums.ResolutionType | null
    dataSourceUrl: string | null
    sourcePrNumber: number | null
    sourcePrUrl: string | null
    tssScore: number | null
    status: $Enums.MarketStatus | null
    outcome: $Enums.Outcome | null
    resolvedAt: Date | null
    resolutionTxHash: string | null
    resolutionNote: string | null
    initialLiquidityEth: number | null
    resolutionDeadline: Date | null
    resolveAttempts: number | null
    lastAttemptAt: Date | null
    nextRetryAt: Date | null
    lastError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MarketMaxAggregateOutputType = {
    id: string | null
    onchainMarketId: number | null
    transactionHash: string | null
    blockNumber: number | null
    contractAddress: string | null
    title: string | null
    question: string | null
    category: string | null
    agentReason: string | null
    resolutionType: $Enums.ResolutionType | null
    dataSourceUrl: string | null
    sourcePrNumber: number | null
    sourcePrUrl: string | null
    tssScore: number | null
    status: $Enums.MarketStatus | null
    outcome: $Enums.Outcome | null
    resolvedAt: Date | null
    resolutionTxHash: string | null
    resolutionNote: string | null
    initialLiquidityEth: number | null
    resolutionDeadline: Date | null
    resolveAttempts: number | null
    lastAttemptAt: Date | null
    nextRetryAt: Date | null
    lastError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MarketCountAggregateOutputType = {
    id: number
    onchainMarketId: number
    transactionHash: number
    blockNumber: number
    contractAddress: number
    title: number
    question: number
    category: number
    options: number
    agentReason: number
    resolutionType: number
    dataSourceUrl: number
    evaluationLogic: number
    sourcePrNumber: number
    sourcePrUrl: number
    tssScore: number
    status: number
    outcome: number
    resolvedAt: number
    resolutionTxHash: number
    resolutionNote: number
    initialLiquidityEth: number
    resolutionDeadline: number
    resolveAttempts: number
    lastAttemptAt: number
    nextRetryAt: number
    lastError: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MarketAvgAggregateInputType = {
    onchainMarketId?: true
    blockNumber?: true
    sourcePrNumber?: true
    tssScore?: true
    initialLiquidityEth?: true
    resolveAttempts?: true
  }

  export type MarketSumAggregateInputType = {
    onchainMarketId?: true
    blockNumber?: true
    sourcePrNumber?: true
    tssScore?: true
    initialLiquidityEth?: true
    resolveAttempts?: true
  }

  export type MarketMinAggregateInputType = {
    id?: true
    onchainMarketId?: true
    transactionHash?: true
    blockNumber?: true
    contractAddress?: true
    title?: true
    question?: true
    category?: true
    agentReason?: true
    resolutionType?: true
    dataSourceUrl?: true
    sourcePrNumber?: true
    sourcePrUrl?: true
    tssScore?: true
    status?: true
    outcome?: true
    resolvedAt?: true
    resolutionTxHash?: true
    resolutionNote?: true
    initialLiquidityEth?: true
    resolutionDeadline?: true
    resolveAttempts?: true
    lastAttemptAt?: true
    nextRetryAt?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MarketMaxAggregateInputType = {
    id?: true
    onchainMarketId?: true
    transactionHash?: true
    blockNumber?: true
    contractAddress?: true
    title?: true
    question?: true
    category?: true
    agentReason?: true
    resolutionType?: true
    dataSourceUrl?: true
    sourcePrNumber?: true
    sourcePrUrl?: true
    tssScore?: true
    status?: true
    outcome?: true
    resolvedAt?: true
    resolutionTxHash?: true
    resolutionNote?: true
    initialLiquidityEth?: true
    resolutionDeadline?: true
    resolveAttempts?: true
    lastAttemptAt?: true
    nextRetryAt?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MarketCountAggregateInputType = {
    id?: true
    onchainMarketId?: true
    transactionHash?: true
    blockNumber?: true
    contractAddress?: true
    title?: true
    question?: true
    category?: true
    options?: true
    agentReason?: true
    resolutionType?: true
    dataSourceUrl?: true
    evaluationLogic?: true
    sourcePrNumber?: true
    sourcePrUrl?: true
    tssScore?: true
    status?: true
    outcome?: true
    resolvedAt?: true
    resolutionTxHash?: true
    resolutionNote?: true
    initialLiquidityEth?: true
    resolutionDeadline?: true
    resolveAttempts?: true
    lastAttemptAt?: true
    nextRetryAt?: true
    lastError?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MarketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Market to aggregate.
     */
    where?: MarketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Markets to fetch.
     */
    orderBy?: MarketOrderByWithRelationInput | MarketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MarketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Markets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Markets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Markets
    **/
    _count?: true | MarketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MarketAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MarketSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MarketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MarketMaxAggregateInputType
  }

  export type GetMarketAggregateType<T extends MarketAggregateArgs> = {
        [P in keyof T & keyof AggregateMarket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMarket[P]>
      : GetScalarType<T[P], AggregateMarket[P]>
  }




  export type MarketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MarketWhereInput
    orderBy?: MarketOrderByWithAggregationInput | MarketOrderByWithAggregationInput[]
    by: MarketScalarFieldEnum[] | MarketScalarFieldEnum
    having?: MarketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MarketCountAggregateInputType | true
    _avg?: MarketAvgAggregateInputType
    _sum?: MarketSumAggregateInputType
    _min?: MarketMinAggregateInputType
    _max?: MarketMaxAggregateInputType
  }

  export type MarketGroupByOutputType = {
    id: string
    onchainMarketId: number | null
    transactionHash: string | null
    blockNumber: number | null
    contractAddress: string | null
    title: string
    question: string
    category: string
    options: string[]
    agentReason: string
    resolutionType: $Enums.ResolutionType
    dataSourceUrl: string
    evaluationLogic: JsonValue
    sourcePrNumber: number | null
    sourcePrUrl: string | null
    tssScore: number | null
    status: $Enums.MarketStatus
    outcome: $Enums.Outcome
    resolvedAt: Date | null
    resolutionTxHash: string | null
    resolutionNote: string | null
    initialLiquidityEth: number | null
    resolutionDeadline: Date | null
    resolveAttempts: number
    lastAttemptAt: Date | null
    nextRetryAt: Date | null
    lastError: string | null
    createdAt: Date
    updatedAt: Date
    _count: MarketCountAggregateOutputType | null
    _avg: MarketAvgAggregateOutputType | null
    _sum: MarketSumAggregateOutputType | null
    _min: MarketMinAggregateOutputType | null
    _max: MarketMaxAggregateOutputType | null
  }

  type GetMarketGroupByPayload<T extends MarketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MarketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MarketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MarketGroupByOutputType[P]>
            : GetScalarType<T[P], MarketGroupByOutputType[P]>
        }
      >
    >


  export type MarketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    onchainMarketId?: boolean
    transactionHash?: boolean
    blockNumber?: boolean
    contractAddress?: boolean
    title?: boolean
    question?: boolean
    category?: boolean
    options?: boolean
    agentReason?: boolean
    resolutionType?: boolean
    dataSourceUrl?: boolean
    evaluationLogic?: boolean
    sourcePrNumber?: boolean
    sourcePrUrl?: boolean
    tssScore?: boolean
    status?: boolean
    outcome?: boolean
    resolvedAt?: boolean
    resolutionTxHash?: boolean
    resolutionNote?: boolean
    initialLiquidityEth?: boolean
    resolutionDeadline?: boolean
    resolveAttempts?: boolean
    lastAttemptAt?: boolean
    nextRetryAt?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resolutionLogs?: boolean | Market$resolutionLogsArgs<ExtArgs>
    prRecord?: boolean | Market$prRecordArgs<ExtArgs>
    _count?: boolean | MarketCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["market"]>

  export type MarketSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    onchainMarketId?: boolean
    transactionHash?: boolean
    blockNumber?: boolean
    contractAddress?: boolean
    title?: boolean
    question?: boolean
    category?: boolean
    options?: boolean
    agentReason?: boolean
    resolutionType?: boolean
    dataSourceUrl?: boolean
    evaluationLogic?: boolean
    sourcePrNumber?: boolean
    sourcePrUrl?: boolean
    tssScore?: boolean
    status?: boolean
    outcome?: boolean
    resolvedAt?: boolean
    resolutionTxHash?: boolean
    resolutionNote?: boolean
    initialLiquidityEth?: boolean
    resolutionDeadline?: boolean
    resolveAttempts?: boolean
    lastAttemptAt?: boolean
    nextRetryAt?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["market"]>

  export type MarketSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    onchainMarketId?: boolean
    transactionHash?: boolean
    blockNumber?: boolean
    contractAddress?: boolean
    title?: boolean
    question?: boolean
    category?: boolean
    options?: boolean
    agentReason?: boolean
    resolutionType?: boolean
    dataSourceUrl?: boolean
    evaluationLogic?: boolean
    sourcePrNumber?: boolean
    sourcePrUrl?: boolean
    tssScore?: boolean
    status?: boolean
    outcome?: boolean
    resolvedAt?: boolean
    resolutionTxHash?: boolean
    resolutionNote?: boolean
    initialLiquidityEth?: boolean
    resolutionDeadline?: boolean
    resolveAttempts?: boolean
    lastAttemptAt?: boolean
    nextRetryAt?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["market"]>

  export type MarketSelectScalar = {
    id?: boolean
    onchainMarketId?: boolean
    transactionHash?: boolean
    blockNumber?: boolean
    contractAddress?: boolean
    title?: boolean
    question?: boolean
    category?: boolean
    options?: boolean
    agentReason?: boolean
    resolutionType?: boolean
    dataSourceUrl?: boolean
    evaluationLogic?: boolean
    sourcePrNumber?: boolean
    sourcePrUrl?: boolean
    tssScore?: boolean
    status?: boolean
    outcome?: boolean
    resolvedAt?: boolean
    resolutionTxHash?: boolean
    resolutionNote?: boolean
    initialLiquidityEth?: boolean
    resolutionDeadline?: boolean
    resolveAttempts?: boolean
    lastAttemptAt?: boolean
    nextRetryAt?: boolean
    lastError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MarketOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "onchainMarketId" | "transactionHash" | "blockNumber" | "contractAddress" | "title" | "question" | "category" | "options" | "agentReason" | "resolutionType" | "dataSourceUrl" | "evaluationLogic" | "sourcePrNumber" | "sourcePrUrl" | "tssScore" | "status" | "outcome" | "resolvedAt" | "resolutionTxHash" | "resolutionNote" | "initialLiquidityEth" | "resolutionDeadline" | "resolveAttempts" | "lastAttemptAt" | "nextRetryAt" | "lastError" | "createdAt" | "updatedAt", ExtArgs["result"]["market"]>
  export type MarketInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resolutionLogs?: boolean | Market$resolutionLogsArgs<ExtArgs>
    prRecord?: boolean | Market$prRecordArgs<ExtArgs>
    _count?: boolean | MarketCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MarketIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MarketIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MarketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Market"
    objects: {
      resolutionLogs: Prisma.$ResolutionLogPayload<ExtArgs>[]
      prRecord: Prisma.$DeployedPRPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      onchainMarketId: number | null
      transactionHash: string | null
      blockNumber: number | null
      contractAddress: string | null
      title: string
      question: string
      category: string
      options: string[]
      agentReason: string
      resolutionType: $Enums.ResolutionType
      dataSourceUrl: string
      evaluationLogic: Prisma.JsonValue
      sourcePrNumber: number | null
      sourcePrUrl: string | null
      tssScore: number | null
      status: $Enums.MarketStatus
      outcome: $Enums.Outcome
      resolvedAt: Date | null
      resolutionTxHash: string | null
      resolutionNote: string | null
      initialLiquidityEth: number | null
      resolutionDeadline: Date | null
      resolveAttempts: number
      lastAttemptAt: Date | null
      nextRetryAt: Date | null
      lastError: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["market"]>
    composites: {}
  }

  type MarketGetPayload<S extends boolean | null | undefined | MarketDefaultArgs> = $Result.GetResult<Prisma.$MarketPayload, S>

  type MarketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MarketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MarketCountAggregateInputType | true
    }

  export interface MarketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Market'], meta: { name: 'Market' } }
    /**
     * Find zero or one Market that matches the filter.
     * @param {MarketFindUniqueArgs} args - Arguments to find a Market
     * @example
     * // Get one Market
     * const market = await prisma.market.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MarketFindUniqueArgs>(args: SelectSubset<T, MarketFindUniqueArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Market that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MarketFindUniqueOrThrowArgs} args - Arguments to find a Market
     * @example
     * // Get one Market
     * const market = await prisma.market.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MarketFindUniqueOrThrowArgs>(args: SelectSubset<T, MarketFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Market that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketFindFirstArgs} args - Arguments to find a Market
     * @example
     * // Get one Market
     * const market = await prisma.market.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MarketFindFirstArgs>(args?: SelectSubset<T, MarketFindFirstArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Market that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketFindFirstOrThrowArgs} args - Arguments to find a Market
     * @example
     * // Get one Market
     * const market = await prisma.market.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MarketFindFirstOrThrowArgs>(args?: SelectSubset<T, MarketFindFirstOrThrowArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Markets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Markets
     * const markets = await prisma.market.findMany()
     * 
     * // Get first 10 Markets
     * const markets = await prisma.market.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const marketWithIdOnly = await prisma.market.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MarketFindManyArgs>(args?: SelectSubset<T, MarketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Market.
     * @param {MarketCreateArgs} args - Arguments to create a Market.
     * @example
     * // Create one Market
     * const Market = await prisma.market.create({
     *   data: {
     *     // ... data to create a Market
     *   }
     * })
     * 
     */
    create<T extends MarketCreateArgs>(args: SelectSubset<T, MarketCreateArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Markets.
     * @param {MarketCreateManyArgs} args - Arguments to create many Markets.
     * @example
     * // Create many Markets
     * const market = await prisma.market.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MarketCreateManyArgs>(args?: SelectSubset<T, MarketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Markets and returns the data saved in the database.
     * @param {MarketCreateManyAndReturnArgs} args - Arguments to create many Markets.
     * @example
     * // Create many Markets
     * const market = await prisma.market.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Markets and only return the `id`
     * const marketWithIdOnly = await prisma.market.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MarketCreateManyAndReturnArgs>(args?: SelectSubset<T, MarketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Market.
     * @param {MarketDeleteArgs} args - Arguments to delete one Market.
     * @example
     * // Delete one Market
     * const Market = await prisma.market.delete({
     *   where: {
     *     // ... filter to delete one Market
     *   }
     * })
     * 
     */
    delete<T extends MarketDeleteArgs>(args: SelectSubset<T, MarketDeleteArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Market.
     * @param {MarketUpdateArgs} args - Arguments to update one Market.
     * @example
     * // Update one Market
     * const market = await prisma.market.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MarketUpdateArgs>(args: SelectSubset<T, MarketUpdateArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Markets.
     * @param {MarketDeleteManyArgs} args - Arguments to filter Markets to delete.
     * @example
     * // Delete a few Markets
     * const { count } = await prisma.market.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MarketDeleteManyArgs>(args?: SelectSubset<T, MarketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Markets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Markets
     * const market = await prisma.market.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MarketUpdateManyArgs>(args: SelectSubset<T, MarketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Markets and returns the data updated in the database.
     * @param {MarketUpdateManyAndReturnArgs} args - Arguments to update many Markets.
     * @example
     * // Update many Markets
     * const market = await prisma.market.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Markets and only return the `id`
     * const marketWithIdOnly = await prisma.market.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MarketUpdateManyAndReturnArgs>(args: SelectSubset<T, MarketUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Market.
     * @param {MarketUpsertArgs} args - Arguments to update or create a Market.
     * @example
     * // Update or create a Market
     * const market = await prisma.market.upsert({
     *   create: {
     *     // ... data to create a Market
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Market we want to update
     *   }
     * })
     */
    upsert<T extends MarketUpsertArgs>(args: SelectSubset<T, MarketUpsertArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Markets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketCountArgs} args - Arguments to filter Markets to count.
     * @example
     * // Count the number of Markets
     * const count = await prisma.market.count({
     *   where: {
     *     // ... the filter for the Markets we want to count
     *   }
     * })
    **/
    count<T extends MarketCountArgs>(
      args?: Subset<T, MarketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MarketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Market.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MarketAggregateArgs>(args: Subset<T, MarketAggregateArgs>): Prisma.PrismaPromise<GetMarketAggregateType<T>>

    /**
     * Group by Market.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MarketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MarketGroupByArgs['orderBy'] }
        : { orderBy?: MarketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MarketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMarketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Market model
   */
  readonly fields: MarketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Market.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MarketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    resolutionLogs<T extends Market$resolutionLogsArgs<ExtArgs> = {}>(args?: Subset<T, Market$resolutionLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResolutionLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    prRecord<T extends Market$prRecordArgs<ExtArgs> = {}>(args?: Subset<T, Market$prRecordArgs<ExtArgs>>): Prisma__DeployedPRClient<$Result.GetResult<Prisma.$DeployedPRPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Market model
   */
  interface MarketFieldRefs {
    readonly id: FieldRef<"Market", 'String'>
    readonly onchainMarketId: FieldRef<"Market", 'Int'>
    readonly transactionHash: FieldRef<"Market", 'String'>
    readonly blockNumber: FieldRef<"Market", 'Int'>
    readonly contractAddress: FieldRef<"Market", 'String'>
    readonly title: FieldRef<"Market", 'String'>
    readonly question: FieldRef<"Market", 'String'>
    readonly category: FieldRef<"Market", 'String'>
    readonly options: FieldRef<"Market", 'String[]'>
    readonly agentReason: FieldRef<"Market", 'String'>
    readonly resolutionType: FieldRef<"Market", 'ResolutionType'>
    readonly dataSourceUrl: FieldRef<"Market", 'String'>
    readonly evaluationLogic: FieldRef<"Market", 'Json'>
    readonly sourcePrNumber: FieldRef<"Market", 'Int'>
    readonly sourcePrUrl: FieldRef<"Market", 'String'>
    readonly tssScore: FieldRef<"Market", 'Float'>
    readonly status: FieldRef<"Market", 'MarketStatus'>
    readonly outcome: FieldRef<"Market", 'Outcome'>
    readonly resolvedAt: FieldRef<"Market", 'DateTime'>
    readonly resolutionTxHash: FieldRef<"Market", 'String'>
    readonly resolutionNote: FieldRef<"Market", 'String'>
    readonly initialLiquidityEth: FieldRef<"Market", 'Float'>
    readonly resolutionDeadline: FieldRef<"Market", 'DateTime'>
    readonly resolveAttempts: FieldRef<"Market", 'Int'>
    readonly lastAttemptAt: FieldRef<"Market", 'DateTime'>
    readonly nextRetryAt: FieldRef<"Market", 'DateTime'>
    readonly lastError: FieldRef<"Market", 'String'>
    readonly createdAt: FieldRef<"Market", 'DateTime'>
    readonly updatedAt: FieldRef<"Market", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Market findUnique
   */
  export type MarketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Market
     */
    omit?: MarketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * Filter, which Market to fetch.
     */
    where: MarketWhereUniqueInput
  }

  /**
   * Market findUniqueOrThrow
   */
  export type MarketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Market
     */
    omit?: MarketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * Filter, which Market to fetch.
     */
    where: MarketWhereUniqueInput
  }

  /**
   * Market findFirst
   */
  export type MarketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Market
     */
    omit?: MarketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * Filter, which Market to fetch.
     */
    where?: MarketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Markets to fetch.
     */
    orderBy?: MarketOrderByWithRelationInput | MarketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Markets.
     */
    cursor?: MarketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Markets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Markets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Markets.
     */
    distinct?: MarketScalarFieldEnum | MarketScalarFieldEnum[]
  }

  /**
   * Market findFirstOrThrow
   */
  export type MarketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Market
     */
    omit?: MarketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * Filter, which Market to fetch.
     */
    where?: MarketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Markets to fetch.
     */
    orderBy?: MarketOrderByWithRelationInput | MarketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Markets.
     */
    cursor?: MarketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Markets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Markets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Markets.
     */
    distinct?: MarketScalarFieldEnum | MarketScalarFieldEnum[]
  }

  /**
   * Market findMany
   */
  export type MarketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Market
     */
    omit?: MarketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * Filter, which Markets to fetch.
     */
    where?: MarketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Markets to fetch.
     */
    orderBy?: MarketOrderByWithRelationInput | MarketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Markets.
     */
    cursor?: MarketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Markets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Markets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Markets.
     */
    distinct?: MarketScalarFieldEnum | MarketScalarFieldEnum[]
  }

  /**
   * Market create
   */
  export type MarketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Market
     */
    omit?: MarketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * The data needed to create a Market.
     */
    data: XOR<MarketCreateInput, MarketUncheckedCreateInput>
  }

  /**
   * Market createMany
   */
  export type MarketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Markets.
     */
    data: MarketCreateManyInput | MarketCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Market createManyAndReturn
   */
  export type MarketCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Market
     */
    omit?: MarketOmit<ExtArgs> | null
    /**
     * The data used to create many Markets.
     */
    data: MarketCreateManyInput | MarketCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Market update
   */
  export type MarketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Market
     */
    omit?: MarketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * The data needed to update a Market.
     */
    data: XOR<MarketUpdateInput, MarketUncheckedUpdateInput>
    /**
     * Choose, which Market to update.
     */
    where: MarketWhereUniqueInput
  }

  /**
   * Market updateMany
   */
  export type MarketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Markets.
     */
    data: XOR<MarketUpdateManyMutationInput, MarketUncheckedUpdateManyInput>
    /**
     * Filter which Markets to update
     */
    where?: MarketWhereInput
    /**
     * Limit how many Markets to update.
     */
    limit?: number
  }

  /**
   * Market updateManyAndReturn
   */
  export type MarketUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Market
     */
    omit?: MarketOmit<ExtArgs> | null
    /**
     * The data used to update Markets.
     */
    data: XOR<MarketUpdateManyMutationInput, MarketUncheckedUpdateManyInput>
    /**
     * Filter which Markets to update
     */
    where?: MarketWhereInput
    /**
     * Limit how many Markets to update.
     */
    limit?: number
  }

  /**
   * Market upsert
   */
  export type MarketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Market
     */
    omit?: MarketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * The filter to search for the Market to update in case it exists.
     */
    where: MarketWhereUniqueInput
    /**
     * In case the Market found by the `where` argument doesn't exist, create a new Market with this data.
     */
    create: XOR<MarketCreateInput, MarketUncheckedCreateInput>
    /**
     * In case the Market was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MarketUpdateInput, MarketUncheckedUpdateInput>
  }

  /**
   * Market delete
   */
  export type MarketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Market
     */
    omit?: MarketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    /**
     * Filter which Market to delete.
     */
    where: MarketWhereUniqueInput
  }

  /**
   * Market deleteMany
   */
  export type MarketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Markets to delete
     */
    where?: MarketWhereInput
    /**
     * Limit how many Markets to delete.
     */
    limit?: number
  }

  /**
   * Market.resolutionLogs
   */
  export type Market$resolutionLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResolutionLog
     */
    select?: ResolutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResolutionLog
     */
    omit?: ResolutionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResolutionLogInclude<ExtArgs> | null
    where?: ResolutionLogWhereInput
    orderBy?: ResolutionLogOrderByWithRelationInput | ResolutionLogOrderByWithRelationInput[]
    cursor?: ResolutionLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ResolutionLogScalarFieldEnum | ResolutionLogScalarFieldEnum[]
  }

  /**
   * Market.prRecord
   */
  export type Market$prRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployedPR
     */
    select?: DeployedPRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployedPR
     */
    omit?: DeployedPROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployedPRInclude<ExtArgs> | null
    where?: DeployedPRWhereInput
  }

  /**
   * Market without action
   */
  export type MarketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Market
     */
    omit?: MarketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
  }


  /**
   * Model DeployedPR
   */

  export type AggregateDeployedPR = {
    _count: DeployedPRCountAggregateOutputType | null
    _avg: DeployedPRAvgAggregateOutputType | null
    _sum: DeployedPRSumAggregateOutputType | null
    _min: DeployedPRMinAggregateOutputType | null
    _max: DeployedPRMaxAggregateOutputType | null
  }

  export type DeployedPRAvgAggregateOutputType = {
    prNumber: number | null
    tssScore: number | null
  }

  export type DeployedPRSumAggregateOutputType = {
    prNumber: number | null
    tssScore: number | null
  }

  export type DeployedPRMinAggregateOutputType = {
    id: string | null
    prNumber: number | null
    prTitle: string | null
    prUrl: string | null
    mergedAt: Date | null
    tssScore: number | null
    deployedAt: Date | null
    repoName: string | null
    marketId: string | null
  }

  export type DeployedPRMaxAggregateOutputType = {
    id: string | null
    prNumber: number | null
    prTitle: string | null
    prUrl: string | null
    mergedAt: Date | null
    tssScore: number | null
    deployedAt: Date | null
    repoName: string | null
    marketId: string | null
  }

  export type DeployedPRCountAggregateOutputType = {
    id: number
    prNumber: number
    prTitle: number
    prUrl: number
    mergedAt: number
    tssScore: number
    deployedAt: number
    repoName: number
    marketId: number
    _all: number
  }


  export type DeployedPRAvgAggregateInputType = {
    prNumber?: true
    tssScore?: true
  }

  export type DeployedPRSumAggregateInputType = {
    prNumber?: true
    tssScore?: true
  }

  export type DeployedPRMinAggregateInputType = {
    id?: true
    prNumber?: true
    prTitle?: true
    prUrl?: true
    mergedAt?: true
    tssScore?: true
    deployedAt?: true
    repoName?: true
    marketId?: true
  }

  export type DeployedPRMaxAggregateInputType = {
    id?: true
    prNumber?: true
    prTitle?: true
    prUrl?: true
    mergedAt?: true
    tssScore?: true
    deployedAt?: true
    repoName?: true
    marketId?: true
  }

  export type DeployedPRCountAggregateInputType = {
    id?: true
    prNumber?: true
    prTitle?: true
    prUrl?: true
    mergedAt?: true
    tssScore?: true
    deployedAt?: true
    repoName?: true
    marketId?: true
    _all?: true
  }

  export type DeployedPRAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeployedPR to aggregate.
     */
    where?: DeployedPRWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeployedPRS to fetch.
     */
    orderBy?: DeployedPROrderByWithRelationInput | DeployedPROrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeployedPRWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeployedPRS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeployedPRS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DeployedPRS
    **/
    _count?: true | DeployedPRCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DeployedPRAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DeployedPRSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeployedPRMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeployedPRMaxAggregateInputType
  }

  export type GetDeployedPRAggregateType<T extends DeployedPRAggregateArgs> = {
        [P in keyof T & keyof AggregateDeployedPR]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeployedPR[P]>
      : GetScalarType<T[P], AggregateDeployedPR[P]>
  }




  export type DeployedPRGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeployedPRWhereInput
    orderBy?: DeployedPROrderByWithAggregationInput | DeployedPROrderByWithAggregationInput[]
    by: DeployedPRScalarFieldEnum[] | DeployedPRScalarFieldEnum
    having?: DeployedPRScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeployedPRCountAggregateInputType | true
    _avg?: DeployedPRAvgAggregateInputType
    _sum?: DeployedPRSumAggregateInputType
    _min?: DeployedPRMinAggregateInputType
    _max?: DeployedPRMaxAggregateInputType
  }

  export type DeployedPRGroupByOutputType = {
    id: string
    prNumber: number
    prTitle: string
    prUrl: string | null
    mergedAt: Date | null
    tssScore: number | null
    deployedAt: Date
    repoName: string | null
    marketId: string | null
    _count: DeployedPRCountAggregateOutputType | null
    _avg: DeployedPRAvgAggregateOutputType | null
    _sum: DeployedPRSumAggregateOutputType | null
    _min: DeployedPRMinAggregateOutputType | null
    _max: DeployedPRMaxAggregateOutputType | null
  }

  type GetDeployedPRGroupByPayload<T extends DeployedPRGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeployedPRGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeployedPRGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeployedPRGroupByOutputType[P]>
            : GetScalarType<T[P], DeployedPRGroupByOutputType[P]>
        }
      >
    >


  export type DeployedPRSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prNumber?: boolean
    prTitle?: boolean
    prUrl?: boolean
    mergedAt?: boolean
    tssScore?: boolean
    deployedAt?: boolean
    repoName?: boolean
    marketId?: boolean
    market?: boolean | DeployedPR$marketArgs<ExtArgs>
  }, ExtArgs["result"]["deployedPR"]>

  export type DeployedPRSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prNumber?: boolean
    prTitle?: boolean
    prUrl?: boolean
    mergedAt?: boolean
    tssScore?: boolean
    deployedAt?: boolean
    repoName?: boolean
    marketId?: boolean
    market?: boolean | DeployedPR$marketArgs<ExtArgs>
  }, ExtArgs["result"]["deployedPR"]>

  export type DeployedPRSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prNumber?: boolean
    prTitle?: boolean
    prUrl?: boolean
    mergedAt?: boolean
    tssScore?: boolean
    deployedAt?: boolean
    repoName?: boolean
    marketId?: boolean
    market?: boolean | DeployedPR$marketArgs<ExtArgs>
  }, ExtArgs["result"]["deployedPR"]>

  export type DeployedPRSelectScalar = {
    id?: boolean
    prNumber?: boolean
    prTitle?: boolean
    prUrl?: boolean
    mergedAt?: boolean
    tssScore?: boolean
    deployedAt?: boolean
    repoName?: boolean
    marketId?: boolean
  }

  export type DeployedPROmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "prNumber" | "prTitle" | "prUrl" | "mergedAt" | "tssScore" | "deployedAt" | "repoName" | "marketId", ExtArgs["result"]["deployedPR"]>
  export type DeployedPRInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    market?: boolean | DeployedPR$marketArgs<ExtArgs>
  }
  export type DeployedPRIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    market?: boolean | DeployedPR$marketArgs<ExtArgs>
  }
  export type DeployedPRIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    market?: boolean | DeployedPR$marketArgs<ExtArgs>
  }

  export type $DeployedPRPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DeployedPR"
    objects: {
      market: Prisma.$MarketPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      prNumber: number
      prTitle: string
      prUrl: string | null
      mergedAt: Date | null
      tssScore: number | null
      deployedAt: Date
      repoName: string | null
      marketId: string | null
    }, ExtArgs["result"]["deployedPR"]>
    composites: {}
  }

  type DeployedPRGetPayload<S extends boolean | null | undefined | DeployedPRDefaultArgs> = $Result.GetResult<Prisma.$DeployedPRPayload, S>

  type DeployedPRCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeployedPRFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeployedPRCountAggregateInputType | true
    }

  export interface DeployedPRDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DeployedPR'], meta: { name: 'DeployedPR' } }
    /**
     * Find zero or one DeployedPR that matches the filter.
     * @param {DeployedPRFindUniqueArgs} args - Arguments to find a DeployedPR
     * @example
     * // Get one DeployedPR
     * const deployedPR = await prisma.deployedPR.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeployedPRFindUniqueArgs>(args: SelectSubset<T, DeployedPRFindUniqueArgs<ExtArgs>>): Prisma__DeployedPRClient<$Result.GetResult<Prisma.$DeployedPRPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DeployedPR that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeployedPRFindUniqueOrThrowArgs} args - Arguments to find a DeployedPR
     * @example
     * // Get one DeployedPR
     * const deployedPR = await prisma.deployedPR.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeployedPRFindUniqueOrThrowArgs>(args: SelectSubset<T, DeployedPRFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeployedPRClient<$Result.GetResult<Prisma.$DeployedPRPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeployedPR that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployedPRFindFirstArgs} args - Arguments to find a DeployedPR
     * @example
     * // Get one DeployedPR
     * const deployedPR = await prisma.deployedPR.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeployedPRFindFirstArgs>(args?: SelectSubset<T, DeployedPRFindFirstArgs<ExtArgs>>): Prisma__DeployedPRClient<$Result.GetResult<Prisma.$DeployedPRPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeployedPR that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployedPRFindFirstOrThrowArgs} args - Arguments to find a DeployedPR
     * @example
     * // Get one DeployedPR
     * const deployedPR = await prisma.deployedPR.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeployedPRFindFirstOrThrowArgs>(args?: SelectSubset<T, DeployedPRFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeployedPRClient<$Result.GetResult<Prisma.$DeployedPRPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DeployedPRS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployedPRFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DeployedPRS
     * const deployedPRS = await prisma.deployedPR.findMany()
     * 
     * // Get first 10 DeployedPRS
     * const deployedPRS = await prisma.deployedPR.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deployedPRWithIdOnly = await prisma.deployedPR.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeployedPRFindManyArgs>(args?: SelectSubset<T, DeployedPRFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeployedPRPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DeployedPR.
     * @param {DeployedPRCreateArgs} args - Arguments to create a DeployedPR.
     * @example
     * // Create one DeployedPR
     * const DeployedPR = await prisma.deployedPR.create({
     *   data: {
     *     // ... data to create a DeployedPR
     *   }
     * })
     * 
     */
    create<T extends DeployedPRCreateArgs>(args: SelectSubset<T, DeployedPRCreateArgs<ExtArgs>>): Prisma__DeployedPRClient<$Result.GetResult<Prisma.$DeployedPRPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DeployedPRS.
     * @param {DeployedPRCreateManyArgs} args - Arguments to create many DeployedPRS.
     * @example
     * // Create many DeployedPRS
     * const deployedPR = await prisma.deployedPR.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeployedPRCreateManyArgs>(args?: SelectSubset<T, DeployedPRCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DeployedPRS and returns the data saved in the database.
     * @param {DeployedPRCreateManyAndReturnArgs} args - Arguments to create many DeployedPRS.
     * @example
     * // Create many DeployedPRS
     * const deployedPR = await prisma.deployedPR.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DeployedPRS and only return the `id`
     * const deployedPRWithIdOnly = await prisma.deployedPR.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeployedPRCreateManyAndReturnArgs>(args?: SelectSubset<T, DeployedPRCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeployedPRPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DeployedPR.
     * @param {DeployedPRDeleteArgs} args - Arguments to delete one DeployedPR.
     * @example
     * // Delete one DeployedPR
     * const DeployedPR = await prisma.deployedPR.delete({
     *   where: {
     *     // ... filter to delete one DeployedPR
     *   }
     * })
     * 
     */
    delete<T extends DeployedPRDeleteArgs>(args: SelectSubset<T, DeployedPRDeleteArgs<ExtArgs>>): Prisma__DeployedPRClient<$Result.GetResult<Prisma.$DeployedPRPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DeployedPR.
     * @param {DeployedPRUpdateArgs} args - Arguments to update one DeployedPR.
     * @example
     * // Update one DeployedPR
     * const deployedPR = await prisma.deployedPR.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeployedPRUpdateArgs>(args: SelectSubset<T, DeployedPRUpdateArgs<ExtArgs>>): Prisma__DeployedPRClient<$Result.GetResult<Prisma.$DeployedPRPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DeployedPRS.
     * @param {DeployedPRDeleteManyArgs} args - Arguments to filter DeployedPRS to delete.
     * @example
     * // Delete a few DeployedPRS
     * const { count } = await prisma.deployedPR.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeployedPRDeleteManyArgs>(args?: SelectSubset<T, DeployedPRDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeployedPRS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployedPRUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DeployedPRS
     * const deployedPR = await prisma.deployedPR.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeployedPRUpdateManyArgs>(args: SelectSubset<T, DeployedPRUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeployedPRS and returns the data updated in the database.
     * @param {DeployedPRUpdateManyAndReturnArgs} args - Arguments to update many DeployedPRS.
     * @example
     * // Update many DeployedPRS
     * const deployedPR = await prisma.deployedPR.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DeployedPRS and only return the `id`
     * const deployedPRWithIdOnly = await prisma.deployedPR.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DeployedPRUpdateManyAndReturnArgs>(args: SelectSubset<T, DeployedPRUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeployedPRPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DeployedPR.
     * @param {DeployedPRUpsertArgs} args - Arguments to update or create a DeployedPR.
     * @example
     * // Update or create a DeployedPR
     * const deployedPR = await prisma.deployedPR.upsert({
     *   create: {
     *     // ... data to create a DeployedPR
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DeployedPR we want to update
     *   }
     * })
     */
    upsert<T extends DeployedPRUpsertArgs>(args: SelectSubset<T, DeployedPRUpsertArgs<ExtArgs>>): Prisma__DeployedPRClient<$Result.GetResult<Prisma.$DeployedPRPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DeployedPRS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployedPRCountArgs} args - Arguments to filter DeployedPRS to count.
     * @example
     * // Count the number of DeployedPRS
     * const count = await prisma.deployedPR.count({
     *   where: {
     *     // ... the filter for the DeployedPRS we want to count
     *   }
     * })
    **/
    count<T extends DeployedPRCountArgs>(
      args?: Subset<T, DeployedPRCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeployedPRCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DeployedPR.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployedPRAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeployedPRAggregateArgs>(args: Subset<T, DeployedPRAggregateArgs>): Prisma.PrismaPromise<GetDeployedPRAggregateType<T>>

    /**
     * Group by DeployedPR.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeployedPRGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeployedPRGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeployedPRGroupByArgs['orderBy'] }
        : { orderBy?: DeployedPRGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeployedPRGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeployedPRGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DeployedPR model
   */
  readonly fields: DeployedPRFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DeployedPR.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeployedPRClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    market<T extends DeployedPR$marketArgs<ExtArgs> = {}>(args?: Subset<T, DeployedPR$marketArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DeployedPR model
   */
  interface DeployedPRFieldRefs {
    readonly id: FieldRef<"DeployedPR", 'String'>
    readonly prNumber: FieldRef<"DeployedPR", 'Int'>
    readonly prTitle: FieldRef<"DeployedPR", 'String'>
    readonly prUrl: FieldRef<"DeployedPR", 'String'>
    readonly mergedAt: FieldRef<"DeployedPR", 'DateTime'>
    readonly tssScore: FieldRef<"DeployedPR", 'Float'>
    readonly deployedAt: FieldRef<"DeployedPR", 'DateTime'>
    readonly repoName: FieldRef<"DeployedPR", 'String'>
    readonly marketId: FieldRef<"DeployedPR", 'String'>
  }
    

  // Custom InputTypes
  /**
   * DeployedPR findUnique
   */
  export type DeployedPRFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployedPR
     */
    select?: DeployedPRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployedPR
     */
    omit?: DeployedPROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployedPRInclude<ExtArgs> | null
    /**
     * Filter, which DeployedPR to fetch.
     */
    where: DeployedPRWhereUniqueInput
  }

  /**
   * DeployedPR findUniqueOrThrow
   */
  export type DeployedPRFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployedPR
     */
    select?: DeployedPRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployedPR
     */
    omit?: DeployedPROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployedPRInclude<ExtArgs> | null
    /**
     * Filter, which DeployedPR to fetch.
     */
    where: DeployedPRWhereUniqueInput
  }

  /**
   * DeployedPR findFirst
   */
  export type DeployedPRFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployedPR
     */
    select?: DeployedPRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployedPR
     */
    omit?: DeployedPROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployedPRInclude<ExtArgs> | null
    /**
     * Filter, which DeployedPR to fetch.
     */
    where?: DeployedPRWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeployedPRS to fetch.
     */
    orderBy?: DeployedPROrderByWithRelationInput | DeployedPROrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeployedPRS.
     */
    cursor?: DeployedPRWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeployedPRS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeployedPRS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeployedPRS.
     */
    distinct?: DeployedPRScalarFieldEnum | DeployedPRScalarFieldEnum[]
  }

  /**
   * DeployedPR findFirstOrThrow
   */
  export type DeployedPRFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployedPR
     */
    select?: DeployedPRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployedPR
     */
    omit?: DeployedPROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployedPRInclude<ExtArgs> | null
    /**
     * Filter, which DeployedPR to fetch.
     */
    where?: DeployedPRWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeployedPRS to fetch.
     */
    orderBy?: DeployedPROrderByWithRelationInput | DeployedPROrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeployedPRS.
     */
    cursor?: DeployedPRWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeployedPRS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeployedPRS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeployedPRS.
     */
    distinct?: DeployedPRScalarFieldEnum | DeployedPRScalarFieldEnum[]
  }

  /**
   * DeployedPR findMany
   */
  export type DeployedPRFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployedPR
     */
    select?: DeployedPRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployedPR
     */
    omit?: DeployedPROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployedPRInclude<ExtArgs> | null
    /**
     * Filter, which DeployedPRS to fetch.
     */
    where?: DeployedPRWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeployedPRS to fetch.
     */
    orderBy?: DeployedPROrderByWithRelationInput | DeployedPROrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DeployedPRS.
     */
    cursor?: DeployedPRWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeployedPRS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeployedPRS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeployedPRS.
     */
    distinct?: DeployedPRScalarFieldEnum | DeployedPRScalarFieldEnum[]
  }

  /**
   * DeployedPR create
   */
  export type DeployedPRCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployedPR
     */
    select?: DeployedPRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployedPR
     */
    omit?: DeployedPROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployedPRInclude<ExtArgs> | null
    /**
     * The data needed to create a DeployedPR.
     */
    data: XOR<DeployedPRCreateInput, DeployedPRUncheckedCreateInput>
  }

  /**
   * DeployedPR createMany
   */
  export type DeployedPRCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DeployedPRS.
     */
    data: DeployedPRCreateManyInput | DeployedPRCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DeployedPR createManyAndReturn
   */
  export type DeployedPRCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployedPR
     */
    select?: DeployedPRSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeployedPR
     */
    omit?: DeployedPROmit<ExtArgs> | null
    /**
     * The data used to create many DeployedPRS.
     */
    data: DeployedPRCreateManyInput | DeployedPRCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployedPRIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeployedPR update
   */
  export type DeployedPRUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployedPR
     */
    select?: DeployedPRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployedPR
     */
    omit?: DeployedPROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployedPRInclude<ExtArgs> | null
    /**
     * The data needed to update a DeployedPR.
     */
    data: XOR<DeployedPRUpdateInput, DeployedPRUncheckedUpdateInput>
    /**
     * Choose, which DeployedPR to update.
     */
    where: DeployedPRWhereUniqueInput
  }

  /**
   * DeployedPR updateMany
   */
  export type DeployedPRUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DeployedPRS.
     */
    data: XOR<DeployedPRUpdateManyMutationInput, DeployedPRUncheckedUpdateManyInput>
    /**
     * Filter which DeployedPRS to update
     */
    where?: DeployedPRWhereInput
    /**
     * Limit how many DeployedPRS to update.
     */
    limit?: number
  }

  /**
   * DeployedPR updateManyAndReturn
   */
  export type DeployedPRUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployedPR
     */
    select?: DeployedPRSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeployedPR
     */
    omit?: DeployedPROmit<ExtArgs> | null
    /**
     * The data used to update DeployedPRS.
     */
    data: XOR<DeployedPRUpdateManyMutationInput, DeployedPRUncheckedUpdateManyInput>
    /**
     * Filter which DeployedPRS to update
     */
    where?: DeployedPRWhereInput
    /**
     * Limit how many DeployedPRS to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployedPRIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeployedPR upsert
   */
  export type DeployedPRUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployedPR
     */
    select?: DeployedPRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployedPR
     */
    omit?: DeployedPROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployedPRInclude<ExtArgs> | null
    /**
     * The filter to search for the DeployedPR to update in case it exists.
     */
    where: DeployedPRWhereUniqueInput
    /**
     * In case the DeployedPR found by the `where` argument doesn't exist, create a new DeployedPR with this data.
     */
    create: XOR<DeployedPRCreateInput, DeployedPRUncheckedCreateInput>
    /**
     * In case the DeployedPR was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeployedPRUpdateInput, DeployedPRUncheckedUpdateInput>
  }

  /**
   * DeployedPR delete
   */
  export type DeployedPRDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployedPR
     */
    select?: DeployedPRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployedPR
     */
    omit?: DeployedPROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployedPRInclude<ExtArgs> | null
    /**
     * Filter which DeployedPR to delete.
     */
    where: DeployedPRWhereUniqueInput
  }

  /**
   * DeployedPR deleteMany
   */
  export type DeployedPRDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeployedPRS to delete
     */
    where?: DeployedPRWhereInput
    /**
     * Limit how many DeployedPRS to delete.
     */
    limit?: number
  }

  /**
   * DeployedPR.market
   */
  export type DeployedPR$marketArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: MarketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Market
     */
    omit?: MarketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarketInclude<ExtArgs> | null
    where?: MarketWhereInput
  }

  /**
   * DeployedPR without action
   */
  export type DeployedPRDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeployedPR
     */
    select?: DeployedPRSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeployedPR
     */
    omit?: DeployedPROmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeployedPRInclude<ExtArgs> | null
  }


  /**
   * Model ResolutionLog
   */

  export type AggregateResolutionLog = {
    _count: ResolutionLogCountAggregateOutputType | null
    _avg: ResolutionLogAvgAggregateOutputType | null
    _sum: ResolutionLogSumAggregateOutputType | null
    _min: ResolutionLogMinAggregateOutputType | null
    _max: ResolutionLogMaxAggregateOutputType | null
  }

  export type ResolutionLogAvgAggregateOutputType = {
    attemptNumber: number | null
    blockNumber: number | null
  }

  export type ResolutionLogSumAggregateOutputType = {
    attemptNumber: number | null
    blockNumber: number | null
  }

  export type ResolutionLogMinAggregateOutputType = {
    id: string | null
    marketId: string | null
    attemptNumber: number | null
    resolverType: string | null
    decision: string | null
    reasoning: string | null
    txHash: string | null
    blockNumber: number | null
    error: string | null
    attemptedAt: Date | null
  }

  export type ResolutionLogMaxAggregateOutputType = {
    id: string | null
    marketId: string | null
    attemptNumber: number | null
    resolverType: string | null
    decision: string | null
    reasoning: string | null
    txHash: string | null
    blockNumber: number | null
    error: string | null
    attemptedAt: Date | null
  }

  export type ResolutionLogCountAggregateOutputType = {
    id: number
    marketId: number
    attemptNumber: number
    resolverType: number
    rawResponse: number
    decision: number
    reasoning: number
    txHash: number
    blockNumber: number
    error: number
    attemptedAt: number
    _all: number
  }


  export type ResolutionLogAvgAggregateInputType = {
    attemptNumber?: true
    blockNumber?: true
  }

  export type ResolutionLogSumAggregateInputType = {
    attemptNumber?: true
    blockNumber?: true
  }

  export type ResolutionLogMinAggregateInputType = {
    id?: true
    marketId?: true
    attemptNumber?: true
    resolverType?: true
    decision?: true
    reasoning?: true
    txHash?: true
    blockNumber?: true
    error?: true
    attemptedAt?: true
  }

  export type ResolutionLogMaxAggregateInputType = {
    id?: true
    marketId?: true
    attemptNumber?: true
    resolverType?: true
    decision?: true
    reasoning?: true
    txHash?: true
    blockNumber?: true
    error?: true
    attemptedAt?: true
  }

  export type ResolutionLogCountAggregateInputType = {
    id?: true
    marketId?: true
    attemptNumber?: true
    resolverType?: true
    rawResponse?: true
    decision?: true
    reasoning?: true
    txHash?: true
    blockNumber?: true
    error?: true
    attemptedAt?: true
    _all?: true
  }

  export type ResolutionLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResolutionLog to aggregate.
     */
    where?: ResolutionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResolutionLogs to fetch.
     */
    orderBy?: ResolutionLogOrderByWithRelationInput | ResolutionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResolutionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResolutionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResolutionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ResolutionLogs
    **/
    _count?: true | ResolutionLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ResolutionLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ResolutionLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResolutionLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResolutionLogMaxAggregateInputType
  }

  export type GetResolutionLogAggregateType<T extends ResolutionLogAggregateArgs> = {
        [P in keyof T & keyof AggregateResolutionLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResolutionLog[P]>
      : GetScalarType<T[P], AggregateResolutionLog[P]>
  }




  export type ResolutionLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResolutionLogWhereInput
    orderBy?: ResolutionLogOrderByWithAggregationInput | ResolutionLogOrderByWithAggregationInput[]
    by: ResolutionLogScalarFieldEnum[] | ResolutionLogScalarFieldEnum
    having?: ResolutionLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResolutionLogCountAggregateInputType | true
    _avg?: ResolutionLogAvgAggregateInputType
    _sum?: ResolutionLogSumAggregateInputType
    _min?: ResolutionLogMinAggregateInputType
    _max?: ResolutionLogMaxAggregateInputType
  }

  export type ResolutionLogGroupByOutputType = {
    id: string
    marketId: string
    attemptNumber: number
    resolverType: string
    rawResponse: JsonValue | null
    decision: string
    reasoning: string | null
    txHash: string | null
    blockNumber: number | null
    error: string | null
    attemptedAt: Date
    _count: ResolutionLogCountAggregateOutputType | null
    _avg: ResolutionLogAvgAggregateOutputType | null
    _sum: ResolutionLogSumAggregateOutputType | null
    _min: ResolutionLogMinAggregateOutputType | null
    _max: ResolutionLogMaxAggregateOutputType | null
  }

  type GetResolutionLogGroupByPayload<T extends ResolutionLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResolutionLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResolutionLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResolutionLogGroupByOutputType[P]>
            : GetScalarType<T[P], ResolutionLogGroupByOutputType[P]>
        }
      >
    >


  export type ResolutionLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    marketId?: boolean
    attemptNumber?: boolean
    resolverType?: boolean
    rawResponse?: boolean
    decision?: boolean
    reasoning?: boolean
    txHash?: boolean
    blockNumber?: boolean
    error?: boolean
    attemptedAt?: boolean
    market?: boolean | MarketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resolutionLog"]>

  export type ResolutionLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    marketId?: boolean
    attemptNumber?: boolean
    resolverType?: boolean
    rawResponse?: boolean
    decision?: boolean
    reasoning?: boolean
    txHash?: boolean
    blockNumber?: boolean
    error?: boolean
    attemptedAt?: boolean
    market?: boolean | MarketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resolutionLog"]>

  export type ResolutionLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    marketId?: boolean
    attemptNumber?: boolean
    resolverType?: boolean
    rawResponse?: boolean
    decision?: boolean
    reasoning?: boolean
    txHash?: boolean
    blockNumber?: boolean
    error?: boolean
    attemptedAt?: boolean
    market?: boolean | MarketDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resolutionLog"]>

  export type ResolutionLogSelectScalar = {
    id?: boolean
    marketId?: boolean
    attemptNumber?: boolean
    resolverType?: boolean
    rawResponse?: boolean
    decision?: boolean
    reasoning?: boolean
    txHash?: boolean
    blockNumber?: boolean
    error?: boolean
    attemptedAt?: boolean
  }

  export type ResolutionLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "marketId" | "attemptNumber" | "resolverType" | "rawResponse" | "decision" | "reasoning" | "txHash" | "blockNumber" | "error" | "attemptedAt", ExtArgs["result"]["resolutionLog"]>
  export type ResolutionLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    market?: boolean | MarketDefaultArgs<ExtArgs>
  }
  export type ResolutionLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    market?: boolean | MarketDefaultArgs<ExtArgs>
  }
  export type ResolutionLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    market?: boolean | MarketDefaultArgs<ExtArgs>
  }

  export type $ResolutionLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ResolutionLog"
    objects: {
      market: Prisma.$MarketPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      marketId: string
      attemptNumber: number
      resolverType: string
      rawResponse: Prisma.JsonValue | null
      decision: string
      reasoning: string | null
      txHash: string | null
      blockNumber: number | null
      error: string | null
      attemptedAt: Date
    }, ExtArgs["result"]["resolutionLog"]>
    composites: {}
  }

  type ResolutionLogGetPayload<S extends boolean | null | undefined | ResolutionLogDefaultArgs> = $Result.GetResult<Prisma.$ResolutionLogPayload, S>

  type ResolutionLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ResolutionLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResolutionLogCountAggregateInputType | true
    }

  export interface ResolutionLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ResolutionLog'], meta: { name: 'ResolutionLog' } }
    /**
     * Find zero or one ResolutionLog that matches the filter.
     * @param {ResolutionLogFindUniqueArgs} args - Arguments to find a ResolutionLog
     * @example
     * // Get one ResolutionLog
     * const resolutionLog = await prisma.resolutionLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResolutionLogFindUniqueArgs>(args: SelectSubset<T, ResolutionLogFindUniqueArgs<ExtArgs>>): Prisma__ResolutionLogClient<$Result.GetResult<Prisma.$ResolutionLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ResolutionLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResolutionLogFindUniqueOrThrowArgs} args - Arguments to find a ResolutionLog
     * @example
     * // Get one ResolutionLog
     * const resolutionLog = await prisma.resolutionLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResolutionLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ResolutionLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResolutionLogClient<$Result.GetResult<Prisma.$ResolutionLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ResolutionLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResolutionLogFindFirstArgs} args - Arguments to find a ResolutionLog
     * @example
     * // Get one ResolutionLog
     * const resolutionLog = await prisma.resolutionLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResolutionLogFindFirstArgs>(args?: SelectSubset<T, ResolutionLogFindFirstArgs<ExtArgs>>): Prisma__ResolutionLogClient<$Result.GetResult<Prisma.$ResolutionLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ResolutionLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResolutionLogFindFirstOrThrowArgs} args - Arguments to find a ResolutionLog
     * @example
     * // Get one ResolutionLog
     * const resolutionLog = await prisma.resolutionLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResolutionLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ResolutionLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResolutionLogClient<$Result.GetResult<Prisma.$ResolutionLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ResolutionLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResolutionLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ResolutionLogs
     * const resolutionLogs = await prisma.resolutionLog.findMany()
     * 
     * // Get first 10 ResolutionLogs
     * const resolutionLogs = await prisma.resolutionLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const resolutionLogWithIdOnly = await prisma.resolutionLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResolutionLogFindManyArgs>(args?: SelectSubset<T, ResolutionLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResolutionLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ResolutionLog.
     * @param {ResolutionLogCreateArgs} args - Arguments to create a ResolutionLog.
     * @example
     * // Create one ResolutionLog
     * const ResolutionLog = await prisma.resolutionLog.create({
     *   data: {
     *     // ... data to create a ResolutionLog
     *   }
     * })
     * 
     */
    create<T extends ResolutionLogCreateArgs>(args: SelectSubset<T, ResolutionLogCreateArgs<ExtArgs>>): Prisma__ResolutionLogClient<$Result.GetResult<Prisma.$ResolutionLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ResolutionLogs.
     * @param {ResolutionLogCreateManyArgs} args - Arguments to create many ResolutionLogs.
     * @example
     * // Create many ResolutionLogs
     * const resolutionLog = await prisma.resolutionLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResolutionLogCreateManyArgs>(args?: SelectSubset<T, ResolutionLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ResolutionLogs and returns the data saved in the database.
     * @param {ResolutionLogCreateManyAndReturnArgs} args - Arguments to create many ResolutionLogs.
     * @example
     * // Create many ResolutionLogs
     * const resolutionLog = await prisma.resolutionLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ResolutionLogs and only return the `id`
     * const resolutionLogWithIdOnly = await prisma.resolutionLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResolutionLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ResolutionLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResolutionLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ResolutionLog.
     * @param {ResolutionLogDeleteArgs} args - Arguments to delete one ResolutionLog.
     * @example
     * // Delete one ResolutionLog
     * const ResolutionLog = await prisma.resolutionLog.delete({
     *   where: {
     *     // ... filter to delete one ResolutionLog
     *   }
     * })
     * 
     */
    delete<T extends ResolutionLogDeleteArgs>(args: SelectSubset<T, ResolutionLogDeleteArgs<ExtArgs>>): Prisma__ResolutionLogClient<$Result.GetResult<Prisma.$ResolutionLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ResolutionLog.
     * @param {ResolutionLogUpdateArgs} args - Arguments to update one ResolutionLog.
     * @example
     * // Update one ResolutionLog
     * const resolutionLog = await prisma.resolutionLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResolutionLogUpdateArgs>(args: SelectSubset<T, ResolutionLogUpdateArgs<ExtArgs>>): Prisma__ResolutionLogClient<$Result.GetResult<Prisma.$ResolutionLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ResolutionLogs.
     * @param {ResolutionLogDeleteManyArgs} args - Arguments to filter ResolutionLogs to delete.
     * @example
     * // Delete a few ResolutionLogs
     * const { count } = await prisma.resolutionLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResolutionLogDeleteManyArgs>(args?: SelectSubset<T, ResolutionLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ResolutionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResolutionLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ResolutionLogs
     * const resolutionLog = await prisma.resolutionLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResolutionLogUpdateManyArgs>(args: SelectSubset<T, ResolutionLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ResolutionLogs and returns the data updated in the database.
     * @param {ResolutionLogUpdateManyAndReturnArgs} args - Arguments to update many ResolutionLogs.
     * @example
     * // Update many ResolutionLogs
     * const resolutionLog = await prisma.resolutionLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ResolutionLogs and only return the `id`
     * const resolutionLogWithIdOnly = await prisma.resolutionLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ResolutionLogUpdateManyAndReturnArgs>(args: SelectSubset<T, ResolutionLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResolutionLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ResolutionLog.
     * @param {ResolutionLogUpsertArgs} args - Arguments to update or create a ResolutionLog.
     * @example
     * // Update or create a ResolutionLog
     * const resolutionLog = await prisma.resolutionLog.upsert({
     *   create: {
     *     // ... data to create a ResolutionLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ResolutionLog we want to update
     *   }
     * })
     */
    upsert<T extends ResolutionLogUpsertArgs>(args: SelectSubset<T, ResolutionLogUpsertArgs<ExtArgs>>): Prisma__ResolutionLogClient<$Result.GetResult<Prisma.$ResolutionLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ResolutionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResolutionLogCountArgs} args - Arguments to filter ResolutionLogs to count.
     * @example
     * // Count the number of ResolutionLogs
     * const count = await prisma.resolutionLog.count({
     *   where: {
     *     // ... the filter for the ResolutionLogs we want to count
     *   }
     * })
    **/
    count<T extends ResolutionLogCountArgs>(
      args?: Subset<T, ResolutionLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResolutionLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ResolutionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResolutionLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ResolutionLogAggregateArgs>(args: Subset<T, ResolutionLogAggregateArgs>): Prisma.PrismaPromise<GetResolutionLogAggregateType<T>>

    /**
     * Group by ResolutionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResolutionLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ResolutionLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResolutionLogGroupByArgs['orderBy'] }
        : { orderBy?: ResolutionLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ResolutionLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResolutionLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ResolutionLog model
   */
  readonly fields: ResolutionLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ResolutionLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResolutionLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    market<T extends MarketDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MarketDefaultArgs<ExtArgs>>): Prisma__MarketClient<$Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ResolutionLog model
   */
  interface ResolutionLogFieldRefs {
    readonly id: FieldRef<"ResolutionLog", 'String'>
    readonly marketId: FieldRef<"ResolutionLog", 'String'>
    readonly attemptNumber: FieldRef<"ResolutionLog", 'Int'>
    readonly resolverType: FieldRef<"ResolutionLog", 'String'>
    readonly rawResponse: FieldRef<"ResolutionLog", 'Json'>
    readonly decision: FieldRef<"ResolutionLog", 'String'>
    readonly reasoning: FieldRef<"ResolutionLog", 'String'>
    readonly txHash: FieldRef<"ResolutionLog", 'String'>
    readonly blockNumber: FieldRef<"ResolutionLog", 'Int'>
    readonly error: FieldRef<"ResolutionLog", 'String'>
    readonly attemptedAt: FieldRef<"ResolutionLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ResolutionLog findUnique
   */
  export type ResolutionLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResolutionLog
     */
    select?: ResolutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResolutionLog
     */
    omit?: ResolutionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResolutionLogInclude<ExtArgs> | null
    /**
     * Filter, which ResolutionLog to fetch.
     */
    where: ResolutionLogWhereUniqueInput
  }

  /**
   * ResolutionLog findUniqueOrThrow
   */
  export type ResolutionLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResolutionLog
     */
    select?: ResolutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResolutionLog
     */
    omit?: ResolutionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResolutionLogInclude<ExtArgs> | null
    /**
     * Filter, which ResolutionLog to fetch.
     */
    where: ResolutionLogWhereUniqueInput
  }

  /**
   * ResolutionLog findFirst
   */
  export type ResolutionLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResolutionLog
     */
    select?: ResolutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResolutionLog
     */
    omit?: ResolutionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResolutionLogInclude<ExtArgs> | null
    /**
     * Filter, which ResolutionLog to fetch.
     */
    where?: ResolutionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResolutionLogs to fetch.
     */
    orderBy?: ResolutionLogOrderByWithRelationInput | ResolutionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResolutionLogs.
     */
    cursor?: ResolutionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResolutionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResolutionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResolutionLogs.
     */
    distinct?: ResolutionLogScalarFieldEnum | ResolutionLogScalarFieldEnum[]
  }

  /**
   * ResolutionLog findFirstOrThrow
   */
  export type ResolutionLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResolutionLog
     */
    select?: ResolutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResolutionLog
     */
    omit?: ResolutionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResolutionLogInclude<ExtArgs> | null
    /**
     * Filter, which ResolutionLog to fetch.
     */
    where?: ResolutionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResolutionLogs to fetch.
     */
    orderBy?: ResolutionLogOrderByWithRelationInput | ResolutionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResolutionLogs.
     */
    cursor?: ResolutionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResolutionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResolutionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResolutionLogs.
     */
    distinct?: ResolutionLogScalarFieldEnum | ResolutionLogScalarFieldEnum[]
  }

  /**
   * ResolutionLog findMany
   */
  export type ResolutionLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResolutionLog
     */
    select?: ResolutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResolutionLog
     */
    omit?: ResolutionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResolutionLogInclude<ExtArgs> | null
    /**
     * Filter, which ResolutionLogs to fetch.
     */
    where?: ResolutionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResolutionLogs to fetch.
     */
    orderBy?: ResolutionLogOrderByWithRelationInput | ResolutionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ResolutionLogs.
     */
    cursor?: ResolutionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResolutionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResolutionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResolutionLogs.
     */
    distinct?: ResolutionLogScalarFieldEnum | ResolutionLogScalarFieldEnum[]
  }

  /**
   * ResolutionLog create
   */
  export type ResolutionLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResolutionLog
     */
    select?: ResolutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResolutionLog
     */
    omit?: ResolutionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResolutionLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ResolutionLog.
     */
    data: XOR<ResolutionLogCreateInput, ResolutionLogUncheckedCreateInput>
  }

  /**
   * ResolutionLog createMany
   */
  export type ResolutionLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ResolutionLogs.
     */
    data: ResolutionLogCreateManyInput | ResolutionLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ResolutionLog createManyAndReturn
   */
  export type ResolutionLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResolutionLog
     */
    select?: ResolutionLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ResolutionLog
     */
    omit?: ResolutionLogOmit<ExtArgs> | null
    /**
     * The data used to create many ResolutionLogs.
     */
    data: ResolutionLogCreateManyInput | ResolutionLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResolutionLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ResolutionLog update
   */
  export type ResolutionLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResolutionLog
     */
    select?: ResolutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResolutionLog
     */
    omit?: ResolutionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResolutionLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ResolutionLog.
     */
    data: XOR<ResolutionLogUpdateInput, ResolutionLogUncheckedUpdateInput>
    /**
     * Choose, which ResolutionLog to update.
     */
    where: ResolutionLogWhereUniqueInput
  }

  /**
   * ResolutionLog updateMany
   */
  export type ResolutionLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ResolutionLogs.
     */
    data: XOR<ResolutionLogUpdateManyMutationInput, ResolutionLogUncheckedUpdateManyInput>
    /**
     * Filter which ResolutionLogs to update
     */
    where?: ResolutionLogWhereInput
    /**
     * Limit how many ResolutionLogs to update.
     */
    limit?: number
  }

  /**
   * ResolutionLog updateManyAndReturn
   */
  export type ResolutionLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResolutionLog
     */
    select?: ResolutionLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ResolutionLog
     */
    omit?: ResolutionLogOmit<ExtArgs> | null
    /**
     * The data used to update ResolutionLogs.
     */
    data: XOR<ResolutionLogUpdateManyMutationInput, ResolutionLogUncheckedUpdateManyInput>
    /**
     * Filter which ResolutionLogs to update
     */
    where?: ResolutionLogWhereInput
    /**
     * Limit how many ResolutionLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResolutionLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ResolutionLog upsert
   */
  export type ResolutionLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResolutionLog
     */
    select?: ResolutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResolutionLog
     */
    omit?: ResolutionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResolutionLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ResolutionLog to update in case it exists.
     */
    where: ResolutionLogWhereUniqueInput
    /**
     * In case the ResolutionLog found by the `where` argument doesn't exist, create a new ResolutionLog with this data.
     */
    create: XOR<ResolutionLogCreateInput, ResolutionLogUncheckedCreateInput>
    /**
     * In case the ResolutionLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResolutionLogUpdateInput, ResolutionLogUncheckedUpdateInput>
  }

  /**
   * ResolutionLog delete
   */
  export type ResolutionLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResolutionLog
     */
    select?: ResolutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResolutionLog
     */
    omit?: ResolutionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResolutionLogInclude<ExtArgs> | null
    /**
     * Filter which ResolutionLog to delete.
     */
    where: ResolutionLogWhereUniqueInput
  }

  /**
   * ResolutionLog deleteMany
   */
  export type ResolutionLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResolutionLogs to delete
     */
    where?: ResolutionLogWhereInput
    /**
     * Limit how many ResolutionLogs to delete.
     */
    limit?: number
  }

  /**
   * ResolutionLog without action
   */
  export type ResolutionLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResolutionLog
     */
    select?: ResolutionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResolutionLog
     */
    omit?: ResolutionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResolutionLogInclude<ExtArgs> | null
  }


  /**
   * Model AgentCycle
   */

  export type AggregateAgentCycle = {
    _count: AgentCycleCountAggregateOutputType | null
    _avg: AgentCycleAvgAggregateOutputType | null
    _sum: AgentCycleSumAggregateOutputType | null
    _min: AgentCycleMinAggregateOutputType | null
    _max: AgentCycleMaxAggregateOutputType | null
  }

  export type AgentCycleAvgAggregateOutputType = {
    durationMs: number | null
    prsAnalysed: number | null
    marketsProposed: number | null
    marketsDeployed: number | null
    marketsResolved: number | null
  }

  export type AgentCycleSumAggregateOutputType = {
    durationMs: number | null
    prsAnalysed: number | null
    marketsProposed: number | null
    marketsDeployed: number | null
    marketsResolved: number | null
  }

  export type AgentCycleMinAggregateOutputType = {
    id: string | null
    cycleType: string | null
    startedAt: Date | null
    completedAt: Date | null
    durationMs: number | null
    prsAnalysed: number | null
    marketsProposed: number | null
    marketsDeployed: number | null
    marketsResolved: number | null
  }

  export type AgentCycleMaxAggregateOutputType = {
    id: string | null
    cycleType: string | null
    startedAt: Date | null
    completedAt: Date | null
    durationMs: number | null
    prsAnalysed: number | null
    marketsProposed: number | null
    marketsDeployed: number | null
    marketsResolved: number | null
  }

  export type AgentCycleCountAggregateOutputType = {
    id: number
    cycleType: number
    startedAt: number
    completedAt: number
    durationMs: number
    prsAnalysed: number
    marketsProposed: number
    marketsDeployed: number
    marketsResolved: number
    errors: number
    metadata: number
    _all: number
  }


  export type AgentCycleAvgAggregateInputType = {
    durationMs?: true
    prsAnalysed?: true
    marketsProposed?: true
    marketsDeployed?: true
    marketsResolved?: true
  }

  export type AgentCycleSumAggregateInputType = {
    durationMs?: true
    prsAnalysed?: true
    marketsProposed?: true
    marketsDeployed?: true
    marketsResolved?: true
  }

  export type AgentCycleMinAggregateInputType = {
    id?: true
    cycleType?: true
    startedAt?: true
    completedAt?: true
    durationMs?: true
    prsAnalysed?: true
    marketsProposed?: true
    marketsDeployed?: true
    marketsResolved?: true
  }

  export type AgentCycleMaxAggregateInputType = {
    id?: true
    cycleType?: true
    startedAt?: true
    completedAt?: true
    durationMs?: true
    prsAnalysed?: true
    marketsProposed?: true
    marketsDeployed?: true
    marketsResolved?: true
  }

  export type AgentCycleCountAggregateInputType = {
    id?: true
    cycleType?: true
    startedAt?: true
    completedAt?: true
    durationMs?: true
    prsAnalysed?: true
    marketsProposed?: true
    marketsDeployed?: true
    marketsResolved?: true
    errors?: true
    metadata?: true
    _all?: true
  }

  export type AgentCycleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentCycle to aggregate.
     */
    where?: AgentCycleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentCycles to fetch.
     */
    orderBy?: AgentCycleOrderByWithRelationInput | AgentCycleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentCycleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentCycles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentCycles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentCycles
    **/
    _count?: true | AgentCycleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AgentCycleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AgentCycleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentCycleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentCycleMaxAggregateInputType
  }

  export type GetAgentCycleAggregateType<T extends AgentCycleAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentCycle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentCycle[P]>
      : GetScalarType<T[P], AggregateAgentCycle[P]>
  }




  export type AgentCycleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentCycleWhereInput
    orderBy?: AgentCycleOrderByWithAggregationInput | AgentCycleOrderByWithAggregationInput[]
    by: AgentCycleScalarFieldEnum[] | AgentCycleScalarFieldEnum
    having?: AgentCycleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentCycleCountAggregateInputType | true
    _avg?: AgentCycleAvgAggregateInputType
    _sum?: AgentCycleSumAggregateInputType
    _min?: AgentCycleMinAggregateInputType
    _max?: AgentCycleMaxAggregateInputType
  }

  export type AgentCycleGroupByOutputType = {
    id: string
    cycleType: string
    startedAt: Date
    completedAt: Date | null
    durationMs: number | null
    prsAnalysed: number | null
    marketsProposed: number | null
    marketsDeployed: number | null
    marketsResolved: number | null
    errors: string[]
    metadata: JsonValue | null
    _count: AgentCycleCountAggregateOutputType | null
    _avg: AgentCycleAvgAggregateOutputType | null
    _sum: AgentCycleSumAggregateOutputType | null
    _min: AgentCycleMinAggregateOutputType | null
    _max: AgentCycleMaxAggregateOutputType | null
  }

  type GetAgentCycleGroupByPayload<T extends AgentCycleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentCycleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentCycleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentCycleGroupByOutputType[P]>
            : GetScalarType<T[P], AgentCycleGroupByOutputType[P]>
        }
      >
    >


  export type AgentCycleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cycleType?: boolean
    startedAt?: boolean
    completedAt?: boolean
    durationMs?: boolean
    prsAnalysed?: boolean
    marketsProposed?: boolean
    marketsDeployed?: boolean
    marketsResolved?: boolean
    errors?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["agentCycle"]>

  export type AgentCycleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cycleType?: boolean
    startedAt?: boolean
    completedAt?: boolean
    durationMs?: boolean
    prsAnalysed?: boolean
    marketsProposed?: boolean
    marketsDeployed?: boolean
    marketsResolved?: boolean
    errors?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["agentCycle"]>

  export type AgentCycleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cycleType?: boolean
    startedAt?: boolean
    completedAt?: boolean
    durationMs?: boolean
    prsAnalysed?: boolean
    marketsProposed?: boolean
    marketsDeployed?: boolean
    marketsResolved?: boolean
    errors?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["agentCycle"]>

  export type AgentCycleSelectScalar = {
    id?: boolean
    cycleType?: boolean
    startedAt?: boolean
    completedAt?: boolean
    durationMs?: boolean
    prsAnalysed?: boolean
    marketsProposed?: boolean
    marketsDeployed?: boolean
    marketsResolved?: boolean
    errors?: boolean
    metadata?: boolean
  }

  export type AgentCycleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cycleType" | "startedAt" | "completedAt" | "durationMs" | "prsAnalysed" | "marketsProposed" | "marketsDeployed" | "marketsResolved" | "errors" | "metadata", ExtArgs["result"]["agentCycle"]>

  export type $AgentCyclePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentCycle"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cycleType: string
      startedAt: Date
      completedAt: Date | null
      durationMs: number | null
      prsAnalysed: number | null
      marketsProposed: number | null
      marketsDeployed: number | null
      marketsResolved: number | null
      errors: string[]
      metadata: Prisma.JsonValue | null
    }, ExtArgs["result"]["agentCycle"]>
    composites: {}
  }

  type AgentCycleGetPayload<S extends boolean | null | undefined | AgentCycleDefaultArgs> = $Result.GetResult<Prisma.$AgentCyclePayload, S>

  type AgentCycleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentCycleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentCycleCountAggregateInputType | true
    }

  export interface AgentCycleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentCycle'], meta: { name: 'AgentCycle' } }
    /**
     * Find zero or one AgentCycle that matches the filter.
     * @param {AgentCycleFindUniqueArgs} args - Arguments to find a AgentCycle
     * @example
     * // Get one AgentCycle
     * const agentCycle = await prisma.agentCycle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentCycleFindUniqueArgs>(args: SelectSubset<T, AgentCycleFindUniqueArgs<ExtArgs>>): Prisma__AgentCycleClient<$Result.GetResult<Prisma.$AgentCyclePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentCycle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentCycleFindUniqueOrThrowArgs} args - Arguments to find a AgentCycle
     * @example
     * // Get one AgentCycle
     * const agentCycle = await prisma.agentCycle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentCycleFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentCycleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentCycleClient<$Result.GetResult<Prisma.$AgentCyclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentCycle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentCycleFindFirstArgs} args - Arguments to find a AgentCycle
     * @example
     * // Get one AgentCycle
     * const agentCycle = await prisma.agentCycle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentCycleFindFirstArgs>(args?: SelectSubset<T, AgentCycleFindFirstArgs<ExtArgs>>): Prisma__AgentCycleClient<$Result.GetResult<Prisma.$AgentCyclePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentCycle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentCycleFindFirstOrThrowArgs} args - Arguments to find a AgentCycle
     * @example
     * // Get one AgentCycle
     * const agentCycle = await prisma.agentCycle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentCycleFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentCycleFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentCycleClient<$Result.GetResult<Prisma.$AgentCyclePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentCycles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentCycleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentCycles
     * const agentCycles = await prisma.agentCycle.findMany()
     * 
     * // Get first 10 AgentCycles
     * const agentCycles = await prisma.agentCycle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentCycleWithIdOnly = await prisma.agentCycle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentCycleFindManyArgs>(args?: SelectSubset<T, AgentCycleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentCyclePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentCycle.
     * @param {AgentCycleCreateArgs} args - Arguments to create a AgentCycle.
     * @example
     * // Create one AgentCycle
     * const AgentCycle = await prisma.agentCycle.create({
     *   data: {
     *     // ... data to create a AgentCycle
     *   }
     * })
     * 
     */
    create<T extends AgentCycleCreateArgs>(args: SelectSubset<T, AgentCycleCreateArgs<ExtArgs>>): Prisma__AgentCycleClient<$Result.GetResult<Prisma.$AgentCyclePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentCycles.
     * @param {AgentCycleCreateManyArgs} args - Arguments to create many AgentCycles.
     * @example
     * // Create many AgentCycles
     * const agentCycle = await prisma.agentCycle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentCycleCreateManyArgs>(args?: SelectSubset<T, AgentCycleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentCycles and returns the data saved in the database.
     * @param {AgentCycleCreateManyAndReturnArgs} args - Arguments to create many AgentCycles.
     * @example
     * // Create many AgentCycles
     * const agentCycle = await prisma.agentCycle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentCycles and only return the `id`
     * const agentCycleWithIdOnly = await prisma.agentCycle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentCycleCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentCycleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentCyclePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentCycle.
     * @param {AgentCycleDeleteArgs} args - Arguments to delete one AgentCycle.
     * @example
     * // Delete one AgentCycle
     * const AgentCycle = await prisma.agentCycle.delete({
     *   where: {
     *     // ... filter to delete one AgentCycle
     *   }
     * })
     * 
     */
    delete<T extends AgentCycleDeleteArgs>(args: SelectSubset<T, AgentCycleDeleteArgs<ExtArgs>>): Prisma__AgentCycleClient<$Result.GetResult<Prisma.$AgentCyclePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentCycle.
     * @param {AgentCycleUpdateArgs} args - Arguments to update one AgentCycle.
     * @example
     * // Update one AgentCycle
     * const agentCycle = await prisma.agentCycle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentCycleUpdateArgs>(args: SelectSubset<T, AgentCycleUpdateArgs<ExtArgs>>): Prisma__AgentCycleClient<$Result.GetResult<Prisma.$AgentCyclePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentCycles.
     * @param {AgentCycleDeleteManyArgs} args - Arguments to filter AgentCycles to delete.
     * @example
     * // Delete a few AgentCycles
     * const { count } = await prisma.agentCycle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentCycleDeleteManyArgs>(args?: SelectSubset<T, AgentCycleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentCycles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentCycleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentCycles
     * const agentCycle = await prisma.agentCycle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentCycleUpdateManyArgs>(args: SelectSubset<T, AgentCycleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentCycles and returns the data updated in the database.
     * @param {AgentCycleUpdateManyAndReturnArgs} args - Arguments to update many AgentCycles.
     * @example
     * // Update many AgentCycles
     * const agentCycle = await prisma.agentCycle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentCycles and only return the `id`
     * const agentCycleWithIdOnly = await prisma.agentCycle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentCycleUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentCycleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentCyclePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentCycle.
     * @param {AgentCycleUpsertArgs} args - Arguments to update or create a AgentCycle.
     * @example
     * // Update or create a AgentCycle
     * const agentCycle = await prisma.agentCycle.upsert({
     *   create: {
     *     // ... data to create a AgentCycle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentCycle we want to update
     *   }
     * })
     */
    upsert<T extends AgentCycleUpsertArgs>(args: SelectSubset<T, AgentCycleUpsertArgs<ExtArgs>>): Prisma__AgentCycleClient<$Result.GetResult<Prisma.$AgentCyclePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentCycles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentCycleCountArgs} args - Arguments to filter AgentCycles to count.
     * @example
     * // Count the number of AgentCycles
     * const count = await prisma.agentCycle.count({
     *   where: {
     *     // ... the filter for the AgentCycles we want to count
     *   }
     * })
    **/
    count<T extends AgentCycleCountArgs>(
      args?: Subset<T, AgentCycleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentCycleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentCycle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentCycleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentCycleAggregateArgs>(args: Subset<T, AgentCycleAggregateArgs>): Prisma.PrismaPromise<GetAgentCycleAggregateType<T>>

    /**
     * Group by AgentCycle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentCycleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentCycleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentCycleGroupByArgs['orderBy'] }
        : { orderBy?: AgentCycleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentCycleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentCycleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentCycle model
   */
  readonly fields: AgentCycleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentCycle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentCycleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentCycle model
   */
  interface AgentCycleFieldRefs {
    readonly id: FieldRef<"AgentCycle", 'String'>
    readonly cycleType: FieldRef<"AgentCycle", 'String'>
    readonly startedAt: FieldRef<"AgentCycle", 'DateTime'>
    readonly completedAt: FieldRef<"AgentCycle", 'DateTime'>
    readonly durationMs: FieldRef<"AgentCycle", 'Int'>
    readonly prsAnalysed: FieldRef<"AgentCycle", 'Int'>
    readonly marketsProposed: FieldRef<"AgentCycle", 'Int'>
    readonly marketsDeployed: FieldRef<"AgentCycle", 'Int'>
    readonly marketsResolved: FieldRef<"AgentCycle", 'Int'>
    readonly errors: FieldRef<"AgentCycle", 'String[]'>
    readonly metadata: FieldRef<"AgentCycle", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * AgentCycle findUnique
   */
  export type AgentCycleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentCycle
     */
    select?: AgentCycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentCycle
     */
    omit?: AgentCycleOmit<ExtArgs> | null
    /**
     * Filter, which AgentCycle to fetch.
     */
    where: AgentCycleWhereUniqueInput
  }

  /**
   * AgentCycle findUniqueOrThrow
   */
  export type AgentCycleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentCycle
     */
    select?: AgentCycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentCycle
     */
    omit?: AgentCycleOmit<ExtArgs> | null
    /**
     * Filter, which AgentCycle to fetch.
     */
    where: AgentCycleWhereUniqueInput
  }

  /**
   * AgentCycle findFirst
   */
  export type AgentCycleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentCycle
     */
    select?: AgentCycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentCycle
     */
    omit?: AgentCycleOmit<ExtArgs> | null
    /**
     * Filter, which AgentCycle to fetch.
     */
    where?: AgentCycleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentCycles to fetch.
     */
    orderBy?: AgentCycleOrderByWithRelationInput | AgentCycleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentCycles.
     */
    cursor?: AgentCycleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentCycles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentCycles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentCycles.
     */
    distinct?: AgentCycleScalarFieldEnum | AgentCycleScalarFieldEnum[]
  }

  /**
   * AgentCycle findFirstOrThrow
   */
  export type AgentCycleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentCycle
     */
    select?: AgentCycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentCycle
     */
    omit?: AgentCycleOmit<ExtArgs> | null
    /**
     * Filter, which AgentCycle to fetch.
     */
    where?: AgentCycleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentCycles to fetch.
     */
    orderBy?: AgentCycleOrderByWithRelationInput | AgentCycleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentCycles.
     */
    cursor?: AgentCycleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentCycles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentCycles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentCycles.
     */
    distinct?: AgentCycleScalarFieldEnum | AgentCycleScalarFieldEnum[]
  }

  /**
   * AgentCycle findMany
   */
  export type AgentCycleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentCycle
     */
    select?: AgentCycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentCycle
     */
    omit?: AgentCycleOmit<ExtArgs> | null
    /**
     * Filter, which AgentCycles to fetch.
     */
    where?: AgentCycleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentCycles to fetch.
     */
    orderBy?: AgentCycleOrderByWithRelationInput | AgentCycleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentCycles.
     */
    cursor?: AgentCycleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentCycles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentCycles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentCycles.
     */
    distinct?: AgentCycleScalarFieldEnum | AgentCycleScalarFieldEnum[]
  }

  /**
   * AgentCycle create
   */
  export type AgentCycleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentCycle
     */
    select?: AgentCycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentCycle
     */
    omit?: AgentCycleOmit<ExtArgs> | null
    /**
     * The data needed to create a AgentCycle.
     */
    data: XOR<AgentCycleCreateInput, AgentCycleUncheckedCreateInput>
  }

  /**
   * AgentCycle createMany
   */
  export type AgentCycleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentCycles.
     */
    data: AgentCycleCreateManyInput | AgentCycleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentCycle createManyAndReturn
   */
  export type AgentCycleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentCycle
     */
    select?: AgentCycleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentCycle
     */
    omit?: AgentCycleOmit<ExtArgs> | null
    /**
     * The data used to create many AgentCycles.
     */
    data: AgentCycleCreateManyInput | AgentCycleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentCycle update
   */
  export type AgentCycleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentCycle
     */
    select?: AgentCycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentCycle
     */
    omit?: AgentCycleOmit<ExtArgs> | null
    /**
     * The data needed to update a AgentCycle.
     */
    data: XOR<AgentCycleUpdateInput, AgentCycleUncheckedUpdateInput>
    /**
     * Choose, which AgentCycle to update.
     */
    where: AgentCycleWhereUniqueInput
  }

  /**
   * AgentCycle updateMany
   */
  export type AgentCycleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentCycles.
     */
    data: XOR<AgentCycleUpdateManyMutationInput, AgentCycleUncheckedUpdateManyInput>
    /**
     * Filter which AgentCycles to update
     */
    where?: AgentCycleWhereInput
    /**
     * Limit how many AgentCycles to update.
     */
    limit?: number
  }

  /**
   * AgentCycle updateManyAndReturn
   */
  export type AgentCycleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentCycle
     */
    select?: AgentCycleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentCycle
     */
    omit?: AgentCycleOmit<ExtArgs> | null
    /**
     * The data used to update AgentCycles.
     */
    data: XOR<AgentCycleUpdateManyMutationInput, AgentCycleUncheckedUpdateManyInput>
    /**
     * Filter which AgentCycles to update
     */
    where?: AgentCycleWhereInput
    /**
     * Limit how many AgentCycles to update.
     */
    limit?: number
  }

  /**
   * AgentCycle upsert
   */
  export type AgentCycleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentCycle
     */
    select?: AgentCycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentCycle
     */
    omit?: AgentCycleOmit<ExtArgs> | null
    /**
     * The filter to search for the AgentCycle to update in case it exists.
     */
    where: AgentCycleWhereUniqueInput
    /**
     * In case the AgentCycle found by the `where` argument doesn't exist, create a new AgentCycle with this data.
     */
    create: XOR<AgentCycleCreateInput, AgentCycleUncheckedCreateInput>
    /**
     * In case the AgentCycle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentCycleUpdateInput, AgentCycleUncheckedUpdateInput>
  }

  /**
   * AgentCycle delete
   */
  export type AgentCycleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentCycle
     */
    select?: AgentCycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentCycle
     */
    omit?: AgentCycleOmit<ExtArgs> | null
    /**
     * Filter which AgentCycle to delete.
     */
    where: AgentCycleWhereUniqueInput
  }

  /**
   * AgentCycle deleteMany
   */
  export type AgentCycleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentCycles to delete
     */
    where?: AgentCycleWhereInput
    /**
     * Limit how many AgentCycles to delete.
     */
    limit?: number
  }

  /**
   * AgentCycle without action
   */
  export type AgentCycleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentCycle
     */
    select?: AgentCycleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentCycle
     */
    omit?: AgentCycleOmit<ExtArgs> | null
  }


  /**
   * Model SecurityAdvisory
   */

  export type AggregateSecurityAdvisory = {
    _count: SecurityAdvisoryCountAggregateOutputType | null
    _min: SecurityAdvisoryMinAggregateOutputType | null
    _max: SecurityAdvisoryMaxAggregateOutputType | null
  }

  export type SecurityAdvisoryMinAggregateOutputType = {
    id: string | null
    cveId: string | null
    ghsaId: string | null
    severity: string | null
    packageName: string | null
    summary: string | null
    publishedAt: Date | null
    fetchedAt: Date | null
  }

  export type SecurityAdvisoryMaxAggregateOutputType = {
    id: string | null
    cveId: string | null
    ghsaId: string | null
    severity: string | null
    packageName: string | null
    summary: string | null
    publishedAt: Date | null
    fetchedAt: Date | null
  }

  export type SecurityAdvisoryCountAggregateOutputType = {
    id: number
    cveId: number
    ghsaId: number
    severity: number
    packageName: number
    summary: number
    publishedAt: number
    rawPayload: number
    fetchedAt: number
    _all: number
  }


  export type SecurityAdvisoryMinAggregateInputType = {
    id?: true
    cveId?: true
    ghsaId?: true
    severity?: true
    packageName?: true
    summary?: true
    publishedAt?: true
    fetchedAt?: true
  }

  export type SecurityAdvisoryMaxAggregateInputType = {
    id?: true
    cveId?: true
    ghsaId?: true
    severity?: true
    packageName?: true
    summary?: true
    publishedAt?: true
    fetchedAt?: true
  }

  export type SecurityAdvisoryCountAggregateInputType = {
    id?: true
    cveId?: true
    ghsaId?: true
    severity?: true
    packageName?: true
    summary?: true
    publishedAt?: true
    rawPayload?: true
    fetchedAt?: true
    _all?: true
  }

  export type SecurityAdvisoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecurityAdvisory to aggregate.
     */
    where?: SecurityAdvisoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityAdvisories to fetch.
     */
    orderBy?: SecurityAdvisoryOrderByWithRelationInput | SecurityAdvisoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SecurityAdvisoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityAdvisories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityAdvisories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SecurityAdvisories
    **/
    _count?: true | SecurityAdvisoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SecurityAdvisoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SecurityAdvisoryMaxAggregateInputType
  }

  export type GetSecurityAdvisoryAggregateType<T extends SecurityAdvisoryAggregateArgs> = {
        [P in keyof T & keyof AggregateSecurityAdvisory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSecurityAdvisory[P]>
      : GetScalarType<T[P], AggregateSecurityAdvisory[P]>
  }




  export type SecurityAdvisoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecurityAdvisoryWhereInput
    orderBy?: SecurityAdvisoryOrderByWithAggregationInput | SecurityAdvisoryOrderByWithAggregationInput[]
    by: SecurityAdvisoryScalarFieldEnum[] | SecurityAdvisoryScalarFieldEnum
    having?: SecurityAdvisoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SecurityAdvisoryCountAggregateInputType | true
    _min?: SecurityAdvisoryMinAggregateInputType
    _max?: SecurityAdvisoryMaxAggregateInputType
  }

  export type SecurityAdvisoryGroupByOutputType = {
    id: string
    cveId: string | null
    ghsaId: string | null
    severity: string
    packageName: string | null
    summary: string | null
    publishedAt: Date | null
    rawPayload: JsonValue | null
    fetchedAt: Date
    _count: SecurityAdvisoryCountAggregateOutputType | null
    _min: SecurityAdvisoryMinAggregateOutputType | null
    _max: SecurityAdvisoryMaxAggregateOutputType | null
  }

  type GetSecurityAdvisoryGroupByPayload<T extends SecurityAdvisoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SecurityAdvisoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SecurityAdvisoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SecurityAdvisoryGroupByOutputType[P]>
            : GetScalarType<T[P], SecurityAdvisoryGroupByOutputType[P]>
        }
      >
    >


  export type SecurityAdvisorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cveId?: boolean
    ghsaId?: boolean
    severity?: boolean
    packageName?: boolean
    summary?: boolean
    publishedAt?: boolean
    rawPayload?: boolean
    fetchedAt?: boolean
  }, ExtArgs["result"]["securityAdvisory"]>

  export type SecurityAdvisorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cveId?: boolean
    ghsaId?: boolean
    severity?: boolean
    packageName?: boolean
    summary?: boolean
    publishedAt?: boolean
    rawPayload?: boolean
    fetchedAt?: boolean
  }, ExtArgs["result"]["securityAdvisory"]>

  export type SecurityAdvisorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cveId?: boolean
    ghsaId?: boolean
    severity?: boolean
    packageName?: boolean
    summary?: boolean
    publishedAt?: boolean
    rawPayload?: boolean
    fetchedAt?: boolean
  }, ExtArgs["result"]["securityAdvisory"]>

  export type SecurityAdvisorySelectScalar = {
    id?: boolean
    cveId?: boolean
    ghsaId?: boolean
    severity?: boolean
    packageName?: boolean
    summary?: boolean
    publishedAt?: boolean
    rawPayload?: boolean
    fetchedAt?: boolean
  }

  export type SecurityAdvisoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cveId" | "ghsaId" | "severity" | "packageName" | "summary" | "publishedAt" | "rawPayload" | "fetchedAt", ExtArgs["result"]["securityAdvisory"]>

  export type $SecurityAdvisoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SecurityAdvisory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cveId: string | null
      ghsaId: string | null
      severity: string
      packageName: string | null
      summary: string | null
      publishedAt: Date | null
      rawPayload: Prisma.JsonValue | null
      fetchedAt: Date
    }, ExtArgs["result"]["securityAdvisory"]>
    composites: {}
  }

  type SecurityAdvisoryGetPayload<S extends boolean | null | undefined | SecurityAdvisoryDefaultArgs> = $Result.GetResult<Prisma.$SecurityAdvisoryPayload, S>

  type SecurityAdvisoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SecurityAdvisoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SecurityAdvisoryCountAggregateInputType | true
    }

  export interface SecurityAdvisoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SecurityAdvisory'], meta: { name: 'SecurityAdvisory' } }
    /**
     * Find zero or one SecurityAdvisory that matches the filter.
     * @param {SecurityAdvisoryFindUniqueArgs} args - Arguments to find a SecurityAdvisory
     * @example
     * // Get one SecurityAdvisory
     * const securityAdvisory = await prisma.securityAdvisory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SecurityAdvisoryFindUniqueArgs>(args: SelectSubset<T, SecurityAdvisoryFindUniqueArgs<ExtArgs>>): Prisma__SecurityAdvisoryClient<$Result.GetResult<Prisma.$SecurityAdvisoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SecurityAdvisory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SecurityAdvisoryFindUniqueOrThrowArgs} args - Arguments to find a SecurityAdvisory
     * @example
     * // Get one SecurityAdvisory
     * const securityAdvisory = await prisma.securityAdvisory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SecurityAdvisoryFindUniqueOrThrowArgs>(args: SelectSubset<T, SecurityAdvisoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SecurityAdvisoryClient<$Result.GetResult<Prisma.$SecurityAdvisoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SecurityAdvisory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityAdvisoryFindFirstArgs} args - Arguments to find a SecurityAdvisory
     * @example
     * // Get one SecurityAdvisory
     * const securityAdvisory = await prisma.securityAdvisory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SecurityAdvisoryFindFirstArgs>(args?: SelectSubset<T, SecurityAdvisoryFindFirstArgs<ExtArgs>>): Prisma__SecurityAdvisoryClient<$Result.GetResult<Prisma.$SecurityAdvisoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SecurityAdvisory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityAdvisoryFindFirstOrThrowArgs} args - Arguments to find a SecurityAdvisory
     * @example
     * // Get one SecurityAdvisory
     * const securityAdvisory = await prisma.securityAdvisory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SecurityAdvisoryFindFirstOrThrowArgs>(args?: SelectSubset<T, SecurityAdvisoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__SecurityAdvisoryClient<$Result.GetResult<Prisma.$SecurityAdvisoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SecurityAdvisories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityAdvisoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SecurityAdvisories
     * const securityAdvisories = await prisma.securityAdvisory.findMany()
     * 
     * // Get first 10 SecurityAdvisories
     * const securityAdvisories = await prisma.securityAdvisory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const securityAdvisoryWithIdOnly = await prisma.securityAdvisory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SecurityAdvisoryFindManyArgs>(args?: SelectSubset<T, SecurityAdvisoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecurityAdvisoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SecurityAdvisory.
     * @param {SecurityAdvisoryCreateArgs} args - Arguments to create a SecurityAdvisory.
     * @example
     * // Create one SecurityAdvisory
     * const SecurityAdvisory = await prisma.securityAdvisory.create({
     *   data: {
     *     // ... data to create a SecurityAdvisory
     *   }
     * })
     * 
     */
    create<T extends SecurityAdvisoryCreateArgs>(args: SelectSubset<T, SecurityAdvisoryCreateArgs<ExtArgs>>): Prisma__SecurityAdvisoryClient<$Result.GetResult<Prisma.$SecurityAdvisoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SecurityAdvisories.
     * @param {SecurityAdvisoryCreateManyArgs} args - Arguments to create many SecurityAdvisories.
     * @example
     * // Create many SecurityAdvisories
     * const securityAdvisory = await prisma.securityAdvisory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SecurityAdvisoryCreateManyArgs>(args?: SelectSubset<T, SecurityAdvisoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SecurityAdvisories and returns the data saved in the database.
     * @param {SecurityAdvisoryCreateManyAndReturnArgs} args - Arguments to create many SecurityAdvisories.
     * @example
     * // Create many SecurityAdvisories
     * const securityAdvisory = await prisma.securityAdvisory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SecurityAdvisories and only return the `id`
     * const securityAdvisoryWithIdOnly = await prisma.securityAdvisory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SecurityAdvisoryCreateManyAndReturnArgs>(args?: SelectSubset<T, SecurityAdvisoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecurityAdvisoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SecurityAdvisory.
     * @param {SecurityAdvisoryDeleteArgs} args - Arguments to delete one SecurityAdvisory.
     * @example
     * // Delete one SecurityAdvisory
     * const SecurityAdvisory = await prisma.securityAdvisory.delete({
     *   where: {
     *     // ... filter to delete one SecurityAdvisory
     *   }
     * })
     * 
     */
    delete<T extends SecurityAdvisoryDeleteArgs>(args: SelectSubset<T, SecurityAdvisoryDeleteArgs<ExtArgs>>): Prisma__SecurityAdvisoryClient<$Result.GetResult<Prisma.$SecurityAdvisoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SecurityAdvisory.
     * @param {SecurityAdvisoryUpdateArgs} args - Arguments to update one SecurityAdvisory.
     * @example
     * // Update one SecurityAdvisory
     * const securityAdvisory = await prisma.securityAdvisory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SecurityAdvisoryUpdateArgs>(args: SelectSubset<T, SecurityAdvisoryUpdateArgs<ExtArgs>>): Prisma__SecurityAdvisoryClient<$Result.GetResult<Prisma.$SecurityAdvisoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SecurityAdvisories.
     * @param {SecurityAdvisoryDeleteManyArgs} args - Arguments to filter SecurityAdvisories to delete.
     * @example
     * // Delete a few SecurityAdvisories
     * const { count } = await prisma.securityAdvisory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SecurityAdvisoryDeleteManyArgs>(args?: SelectSubset<T, SecurityAdvisoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SecurityAdvisories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityAdvisoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SecurityAdvisories
     * const securityAdvisory = await prisma.securityAdvisory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SecurityAdvisoryUpdateManyArgs>(args: SelectSubset<T, SecurityAdvisoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SecurityAdvisories and returns the data updated in the database.
     * @param {SecurityAdvisoryUpdateManyAndReturnArgs} args - Arguments to update many SecurityAdvisories.
     * @example
     * // Update many SecurityAdvisories
     * const securityAdvisory = await prisma.securityAdvisory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SecurityAdvisories and only return the `id`
     * const securityAdvisoryWithIdOnly = await prisma.securityAdvisory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SecurityAdvisoryUpdateManyAndReturnArgs>(args: SelectSubset<T, SecurityAdvisoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecurityAdvisoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SecurityAdvisory.
     * @param {SecurityAdvisoryUpsertArgs} args - Arguments to update or create a SecurityAdvisory.
     * @example
     * // Update or create a SecurityAdvisory
     * const securityAdvisory = await prisma.securityAdvisory.upsert({
     *   create: {
     *     // ... data to create a SecurityAdvisory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SecurityAdvisory we want to update
     *   }
     * })
     */
    upsert<T extends SecurityAdvisoryUpsertArgs>(args: SelectSubset<T, SecurityAdvisoryUpsertArgs<ExtArgs>>): Prisma__SecurityAdvisoryClient<$Result.GetResult<Prisma.$SecurityAdvisoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SecurityAdvisories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityAdvisoryCountArgs} args - Arguments to filter SecurityAdvisories to count.
     * @example
     * // Count the number of SecurityAdvisories
     * const count = await prisma.securityAdvisory.count({
     *   where: {
     *     // ... the filter for the SecurityAdvisories we want to count
     *   }
     * })
    **/
    count<T extends SecurityAdvisoryCountArgs>(
      args?: Subset<T, SecurityAdvisoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SecurityAdvisoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SecurityAdvisory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityAdvisoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SecurityAdvisoryAggregateArgs>(args: Subset<T, SecurityAdvisoryAggregateArgs>): Prisma.PrismaPromise<GetSecurityAdvisoryAggregateType<T>>

    /**
     * Group by SecurityAdvisory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityAdvisoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SecurityAdvisoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SecurityAdvisoryGroupByArgs['orderBy'] }
        : { orderBy?: SecurityAdvisoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SecurityAdvisoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSecurityAdvisoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SecurityAdvisory model
   */
  readonly fields: SecurityAdvisoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SecurityAdvisory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SecurityAdvisoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SecurityAdvisory model
   */
  interface SecurityAdvisoryFieldRefs {
    readonly id: FieldRef<"SecurityAdvisory", 'String'>
    readonly cveId: FieldRef<"SecurityAdvisory", 'String'>
    readonly ghsaId: FieldRef<"SecurityAdvisory", 'String'>
    readonly severity: FieldRef<"SecurityAdvisory", 'String'>
    readonly packageName: FieldRef<"SecurityAdvisory", 'String'>
    readonly summary: FieldRef<"SecurityAdvisory", 'String'>
    readonly publishedAt: FieldRef<"SecurityAdvisory", 'DateTime'>
    readonly rawPayload: FieldRef<"SecurityAdvisory", 'Json'>
    readonly fetchedAt: FieldRef<"SecurityAdvisory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SecurityAdvisory findUnique
   */
  export type SecurityAdvisoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityAdvisory
     */
    select?: SecurityAdvisorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityAdvisory
     */
    omit?: SecurityAdvisoryOmit<ExtArgs> | null
    /**
     * Filter, which SecurityAdvisory to fetch.
     */
    where: SecurityAdvisoryWhereUniqueInput
  }

  /**
   * SecurityAdvisory findUniqueOrThrow
   */
  export type SecurityAdvisoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityAdvisory
     */
    select?: SecurityAdvisorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityAdvisory
     */
    omit?: SecurityAdvisoryOmit<ExtArgs> | null
    /**
     * Filter, which SecurityAdvisory to fetch.
     */
    where: SecurityAdvisoryWhereUniqueInput
  }

  /**
   * SecurityAdvisory findFirst
   */
  export type SecurityAdvisoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityAdvisory
     */
    select?: SecurityAdvisorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityAdvisory
     */
    omit?: SecurityAdvisoryOmit<ExtArgs> | null
    /**
     * Filter, which SecurityAdvisory to fetch.
     */
    where?: SecurityAdvisoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityAdvisories to fetch.
     */
    orderBy?: SecurityAdvisoryOrderByWithRelationInput | SecurityAdvisoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecurityAdvisories.
     */
    cursor?: SecurityAdvisoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityAdvisories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityAdvisories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecurityAdvisories.
     */
    distinct?: SecurityAdvisoryScalarFieldEnum | SecurityAdvisoryScalarFieldEnum[]
  }

  /**
   * SecurityAdvisory findFirstOrThrow
   */
  export type SecurityAdvisoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityAdvisory
     */
    select?: SecurityAdvisorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityAdvisory
     */
    omit?: SecurityAdvisoryOmit<ExtArgs> | null
    /**
     * Filter, which SecurityAdvisory to fetch.
     */
    where?: SecurityAdvisoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityAdvisories to fetch.
     */
    orderBy?: SecurityAdvisoryOrderByWithRelationInput | SecurityAdvisoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecurityAdvisories.
     */
    cursor?: SecurityAdvisoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityAdvisories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityAdvisories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecurityAdvisories.
     */
    distinct?: SecurityAdvisoryScalarFieldEnum | SecurityAdvisoryScalarFieldEnum[]
  }

  /**
   * SecurityAdvisory findMany
   */
  export type SecurityAdvisoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityAdvisory
     */
    select?: SecurityAdvisorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityAdvisory
     */
    omit?: SecurityAdvisoryOmit<ExtArgs> | null
    /**
     * Filter, which SecurityAdvisories to fetch.
     */
    where?: SecurityAdvisoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityAdvisories to fetch.
     */
    orderBy?: SecurityAdvisoryOrderByWithRelationInput | SecurityAdvisoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SecurityAdvisories.
     */
    cursor?: SecurityAdvisoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityAdvisories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityAdvisories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecurityAdvisories.
     */
    distinct?: SecurityAdvisoryScalarFieldEnum | SecurityAdvisoryScalarFieldEnum[]
  }

  /**
   * SecurityAdvisory create
   */
  export type SecurityAdvisoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityAdvisory
     */
    select?: SecurityAdvisorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityAdvisory
     */
    omit?: SecurityAdvisoryOmit<ExtArgs> | null
    /**
     * The data needed to create a SecurityAdvisory.
     */
    data: XOR<SecurityAdvisoryCreateInput, SecurityAdvisoryUncheckedCreateInput>
  }

  /**
   * SecurityAdvisory createMany
   */
  export type SecurityAdvisoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SecurityAdvisories.
     */
    data: SecurityAdvisoryCreateManyInput | SecurityAdvisoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SecurityAdvisory createManyAndReturn
   */
  export type SecurityAdvisoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityAdvisory
     */
    select?: SecurityAdvisorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityAdvisory
     */
    omit?: SecurityAdvisoryOmit<ExtArgs> | null
    /**
     * The data used to create many SecurityAdvisories.
     */
    data: SecurityAdvisoryCreateManyInput | SecurityAdvisoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SecurityAdvisory update
   */
  export type SecurityAdvisoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityAdvisory
     */
    select?: SecurityAdvisorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityAdvisory
     */
    omit?: SecurityAdvisoryOmit<ExtArgs> | null
    /**
     * The data needed to update a SecurityAdvisory.
     */
    data: XOR<SecurityAdvisoryUpdateInput, SecurityAdvisoryUncheckedUpdateInput>
    /**
     * Choose, which SecurityAdvisory to update.
     */
    where: SecurityAdvisoryWhereUniqueInput
  }

  /**
   * SecurityAdvisory updateMany
   */
  export type SecurityAdvisoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SecurityAdvisories.
     */
    data: XOR<SecurityAdvisoryUpdateManyMutationInput, SecurityAdvisoryUncheckedUpdateManyInput>
    /**
     * Filter which SecurityAdvisories to update
     */
    where?: SecurityAdvisoryWhereInput
    /**
     * Limit how many SecurityAdvisories to update.
     */
    limit?: number
  }

  /**
   * SecurityAdvisory updateManyAndReturn
   */
  export type SecurityAdvisoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityAdvisory
     */
    select?: SecurityAdvisorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityAdvisory
     */
    omit?: SecurityAdvisoryOmit<ExtArgs> | null
    /**
     * The data used to update SecurityAdvisories.
     */
    data: XOR<SecurityAdvisoryUpdateManyMutationInput, SecurityAdvisoryUncheckedUpdateManyInput>
    /**
     * Filter which SecurityAdvisories to update
     */
    where?: SecurityAdvisoryWhereInput
    /**
     * Limit how many SecurityAdvisories to update.
     */
    limit?: number
  }

  /**
   * SecurityAdvisory upsert
   */
  export type SecurityAdvisoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityAdvisory
     */
    select?: SecurityAdvisorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityAdvisory
     */
    omit?: SecurityAdvisoryOmit<ExtArgs> | null
    /**
     * The filter to search for the SecurityAdvisory to update in case it exists.
     */
    where: SecurityAdvisoryWhereUniqueInput
    /**
     * In case the SecurityAdvisory found by the `where` argument doesn't exist, create a new SecurityAdvisory with this data.
     */
    create: XOR<SecurityAdvisoryCreateInput, SecurityAdvisoryUncheckedCreateInput>
    /**
     * In case the SecurityAdvisory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SecurityAdvisoryUpdateInput, SecurityAdvisoryUncheckedUpdateInput>
  }

  /**
   * SecurityAdvisory delete
   */
  export type SecurityAdvisoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityAdvisory
     */
    select?: SecurityAdvisorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityAdvisory
     */
    omit?: SecurityAdvisoryOmit<ExtArgs> | null
    /**
     * Filter which SecurityAdvisory to delete.
     */
    where: SecurityAdvisoryWhereUniqueInput
  }

  /**
   * SecurityAdvisory deleteMany
   */
  export type SecurityAdvisoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecurityAdvisories to delete
     */
    where?: SecurityAdvisoryWhereInput
    /**
     * Limit how many SecurityAdvisories to delete.
     */
    limit?: number
  }

  /**
   * SecurityAdvisory without action
   */
  export type SecurityAdvisoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityAdvisory
     */
    select?: SecurityAdvisorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityAdvisory
     */
    omit?: SecurityAdvisoryOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const MarketScalarFieldEnum: {
    id: 'id',
    onchainMarketId: 'onchainMarketId',
    transactionHash: 'transactionHash',
    blockNumber: 'blockNumber',
    contractAddress: 'contractAddress',
    title: 'title',
    question: 'question',
    category: 'category',
    options: 'options',
    agentReason: 'agentReason',
    resolutionType: 'resolutionType',
    dataSourceUrl: 'dataSourceUrl',
    evaluationLogic: 'evaluationLogic',
    sourcePrNumber: 'sourcePrNumber',
    sourcePrUrl: 'sourcePrUrl',
    tssScore: 'tssScore',
    status: 'status',
    outcome: 'outcome',
    resolvedAt: 'resolvedAt',
    resolutionTxHash: 'resolutionTxHash',
    resolutionNote: 'resolutionNote',
    initialLiquidityEth: 'initialLiquidityEth',
    resolutionDeadline: 'resolutionDeadline',
    resolveAttempts: 'resolveAttempts',
    lastAttemptAt: 'lastAttemptAt',
    nextRetryAt: 'nextRetryAt',
    lastError: 'lastError',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MarketScalarFieldEnum = (typeof MarketScalarFieldEnum)[keyof typeof MarketScalarFieldEnum]


  export const DeployedPRScalarFieldEnum: {
    id: 'id',
    prNumber: 'prNumber',
    prTitle: 'prTitle',
    prUrl: 'prUrl',
    mergedAt: 'mergedAt',
    tssScore: 'tssScore',
    deployedAt: 'deployedAt',
    repoName: 'repoName',
    marketId: 'marketId'
  };

  export type DeployedPRScalarFieldEnum = (typeof DeployedPRScalarFieldEnum)[keyof typeof DeployedPRScalarFieldEnum]


  export const ResolutionLogScalarFieldEnum: {
    id: 'id',
    marketId: 'marketId',
    attemptNumber: 'attemptNumber',
    resolverType: 'resolverType',
    rawResponse: 'rawResponse',
    decision: 'decision',
    reasoning: 'reasoning',
    txHash: 'txHash',
    blockNumber: 'blockNumber',
    error: 'error',
    attemptedAt: 'attemptedAt'
  };

  export type ResolutionLogScalarFieldEnum = (typeof ResolutionLogScalarFieldEnum)[keyof typeof ResolutionLogScalarFieldEnum]


  export const AgentCycleScalarFieldEnum: {
    id: 'id',
    cycleType: 'cycleType',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    durationMs: 'durationMs',
    prsAnalysed: 'prsAnalysed',
    marketsProposed: 'marketsProposed',
    marketsDeployed: 'marketsDeployed',
    marketsResolved: 'marketsResolved',
    errors: 'errors',
    metadata: 'metadata'
  };

  export type AgentCycleScalarFieldEnum = (typeof AgentCycleScalarFieldEnum)[keyof typeof AgentCycleScalarFieldEnum]


  export const SecurityAdvisoryScalarFieldEnum: {
    id: 'id',
    cveId: 'cveId',
    ghsaId: 'ghsaId',
    severity: 'severity',
    packageName: 'packageName',
    summary: 'summary',
    publishedAt: 'publishedAt',
    rawPayload: 'rawPayload',
    fetchedAt: 'fetchedAt'
  };

  export type SecurityAdvisoryScalarFieldEnum = (typeof SecurityAdvisoryScalarFieldEnum)[keyof typeof SecurityAdvisoryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'ResolutionType'
   */
  export type EnumResolutionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ResolutionType'>
    


  /**
   * Reference to a field of type 'ResolutionType[]'
   */
  export type ListEnumResolutionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ResolutionType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'MarketStatus'
   */
  export type EnumMarketStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MarketStatus'>
    


  /**
   * Reference to a field of type 'MarketStatus[]'
   */
  export type ListEnumMarketStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MarketStatus[]'>
    


  /**
   * Reference to a field of type 'Outcome'
   */
  export type EnumOutcomeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Outcome'>
    


  /**
   * Reference to a field of type 'Outcome[]'
   */
  export type ListEnumOutcomeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Outcome[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    
  /**
   * Deep Input Types
   */


  export type MarketWhereInput = {
    AND?: MarketWhereInput | MarketWhereInput[]
    OR?: MarketWhereInput[]
    NOT?: MarketWhereInput | MarketWhereInput[]
    id?: StringFilter<"Market"> | string
    onchainMarketId?: IntNullableFilter<"Market"> | number | null
    transactionHash?: StringNullableFilter<"Market"> | string | null
    blockNumber?: IntNullableFilter<"Market"> | number | null
    contractAddress?: StringNullableFilter<"Market"> | string | null
    title?: StringFilter<"Market"> | string
    question?: StringFilter<"Market"> | string
    category?: StringFilter<"Market"> | string
    options?: StringNullableListFilter<"Market">
    agentReason?: StringFilter<"Market"> | string
    resolutionType?: EnumResolutionTypeFilter<"Market"> | $Enums.ResolutionType
    dataSourceUrl?: StringFilter<"Market"> | string
    evaluationLogic?: JsonFilter<"Market">
    sourcePrNumber?: IntNullableFilter<"Market"> | number | null
    sourcePrUrl?: StringNullableFilter<"Market"> | string | null
    tssScore?: FloatNullableFilter<"Market"> | number | null
    status?: EnumMarketStatusFilter<"Market"> | $Enums.MarketStatus
    outcome?: EnumOutcomeFilter<"Market"> | $Enums.Outcome
    resolvedAt?: DateTimeNullableFilter<"Market"> | Date | string | null
    resolutionTxHash?: StringNullableFilter<"Market"> | string | null
    resolutionNote?: StringNullableFilter<"Market"> | string | null
    initialLiquidityEth?: FloatNullableFilter<"Market"> | number | null
    resolutionDeadline?: DateTimeNullableFilter<"Market"> | Date | string | null
    resolveAttempts?: IntFilter<"Market"> | number
    lastAttemptAt?: DateTimeNullableFilter<"Market"> | Date | string | null
    nextRetryAt?: DateTimeNullableFilter<"Market"> | Date | string | null
    lastError?: StringNullableFilter<"Market"> | string | null
    createdAt?: DateTimeFilter<"Market"> | Date | string
    updatedAt?: DateTimeFilter<"Market"> | Date | string
    resolutionLogs?: ResolutionLogListRelationFilter
    prRecord?: XOR<DeployedPRNullableScalarRelationFilter, DeployedPRWhereInput> | null
  }

  export type MarketOrderByWithRelationInput = {
    id?: SortOrder
    onchainMarketId?: SortOrderInput | SortOrder
    transactionHash?: SortOrderInput | SortOrder
    blockNumber?: SortOrderInput | SortOrder
    contractAddress?: SortOrderInput | SortOrder
    title?: SortOrder
    question?: SortOrder
    category?: SortOrder
    options?: SortOrder
    agentReason?: SortOrder
    resolutionType?: SortOrder
    dataSourceUrl?: SortOrder
    evaluationLogic?: SortOrder
    sourcePrNumber?: SortOrderInput | SortOrder
    sourcePrUrl?: SortOrderInput | SortOrder
    tssScore?: SortOrderInput | SortOrder
    status?: SortOrder
    outcome?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    resolutionTxHash?: SortOrderInput | SortOrder
    resolutionNote?: SortOrderInput | SortOrder
    initialLiquidityEth?: SortOrderInput | SortOrder
    resolutionDeadline?: SortOrderInput | SortOrder
    resolveAttempts?: SortOrder
    lastAttemptAt?: SortOrderInput | SortOrder
    nextRetryAt?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resolutionLogs?: ResolutionLogOrderByRelationAggregateInput
    prRecord?: DeployedPROrderByWithRelationInput
  }

  export type MarketWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    onchainMarketId?: number
    transactionHash?: string
    AND?: MarketWhereInput | MarketWhereInput[]
    OR?: MarketWhereInput[]
    NOT?: MarketWhereInput | MarketWhereInput[]
    blockNumber?: IntNullableFilter<"Market"> | number | null
    contractAddress?: StringNullableFilter<"Market"> | string | null
    title?: StringFilter<"Market"> | string
    question?: StringFilter<"Market"> | string
    category?: StringFilter<"Market"> | string
    options?: StringNullableListFilter<"Market">
    agentReason?: StringFilter<"Market"> | string
    resolutionType?: EnumResolutionTypeFilter<"Market"> | $Enums.ResolutionType
    dataSourceUrl?: StringFilter<"Market"> | string
    evaluationLogic?: JsonFilter<"Market">
    sourcePrNumber?: IntNullableFilter<"Market"> | number | null
    sourcePrUrl?: StringNullableFilter<"Market"> | string | null
    tssScore?: FloatNullableFilter<"Market"> | number | null
    status?: EnumMarketStatusFilter<"Market"> | $Enums.MarketStatus
    outcome?: EnumOutcomeFilter<"Market"> | $Enums.Outcome
    resolvedAt?: DateTimeNullableFilter<"Market"> | Date | string | null
    resolutionTxHash?: StringNullableFilter<"Market"> | string | null
    resolutionNote?: StringNullableFilter<"Market"> | string | null
    initialLiquidityEth?: FloatNullableFilter<"Market"> | number | null
    resolutionDeadline?: DateTimeNullableFilter<"Market"> | Date | string | null
    resolveAttempts?: IntFilter<"Market"> | number
    lastAttemptAt?: DateTimeNullableFilter<"Market"> | Date | string | null
    nextRetryAt?: DateTimeNullableFilter<"Market"> | Date | string | null
    lastError?: StringNullableFilter<"Market"> | string | null
    createdAt?: DateTimeFilter<"Market"> | Date | string
    updatedAt?: DateTimeFilter<"Market"> | Date | string
    resolutionLogs?: ResolutionLogListRelationFilter
    prRecord?: XOR<DeployedPRNullableScalarRelationFilter, DeployedPRWhereInput> | null
  }, "id" | "onchainMarketId" | "transactionHash">

  export type MarketOrderByWithAggregationInput = {
    id?: SortOrder
    onchainMarketId?: SortOrderInput | SortOrder
    transactionHash?: SortOrderInput | SortOrder
    blockNumber?: SortOrderInput | SortOrder
    contractAddress?: SortOrderInput | SortOrder
    title?: SortOrder
    question?: SortOrder
    category?: SortOrder
    options?: SortOrder
    agentReason?: SortOrder
    resolutionType?: SortOrder
    dataSourceUrl?: SortOrder
    evaluationLogic?: SortOrder
    sourcePrNumber?: SortOrderInput | SortOrder
    sourcePrUrl?: SortOrderInput | SortOrder
    tssScore?: SortOrderInput | SortOrder
    status?: SortOrder
    outcome?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    resolutionTxHash?: SortOrderInput | SortOrder
    resolutionNote?: SortOrderInput | SortOrder
    initialLiquidityEth?: SortOrderInput | SortOrder
    resolutionDeadline?: SortOrderInput | SortOrder
    resolveAttempts?: SortOrder
    lastAttemptAt?: SortOrderInput | SortOrder
    nextRetryAt?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MarketCountOrderByAggregateInput
    _avg?: MarketAvgOrderByAggregateInput
    _max?: MarketMaxOrderByAggregateInput
    _min?: MarketMinOrderByAggregateInput
    _sum?: MarketSumOrderByAggregateInput
  }

  export type MarketScalarWhereWithAggregatesInput = {
    AND?: MarketScalarWhereWithAggregatesInput | MarketScalarWhereWithAggregatesInput[]
    OR?: MarketScalarWhereWithAggregatesInput[]
    NOT?: MarketScalarWhereWithAggregatesInput | MarketScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Market"> | string
    onchainMarketId?: IntNullableWithAggregatesFilter<"Market"> | number | null
    transactionHash?: StringNullableWithAggregatesFilter<"Market"> | string | null
    blockNumber?: IntNullableWithAggregatesFilter<"Market"> | number | null
    contractAddress?: StringNullableWithAggregatesFilter<"Market"> | string | null
    title?: StringWithAggregatesFilter<"Market"> | string
    question?: StringWithAggregatesFilter<"Market"> | string
    category?: StringWithAggregatesFilter<"Market"> | string
    options?: StringNullableListFilter<"Market">
    agentReason?: StringWithAggregatesFilter<"Market"> | string
    resolutionType?: EnumResolutionTypeWithAggregatesFilter<"Market"> | $Enums.ResolutionType
    dataSourceUrl?: StringWithAggregatesFilter<"Market"> | string
    evaluationLogic?: JsonWithAggregatesFilter<"Market">
    sourcePrNumber?: IntNullableWithAggregatesFilter<"Market"> | number | null
    sourcePrUrl?: StringNullableWithAggregatesFilter<"Market"> | string | null
    tssScore?: FloatNullableWithAggregatesFilter<"Market"> | number | null
    status?: EnumMarketStatusWithAggregatesFilter<"Market"> | $Enums.MarketStatus
    outcome?: EnumOutcomeWithAggregatesFilter<"Market"> | $Enums.Outcome
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"Market"> | Date | string | null
    resolutionTxHash?: StringNullableWithAggregatesFilter<"Market"> | string | null
    resolutionNote?: StringNullableWithAggregatesFilter<"Market"> | string | null
    initialLiquidityEth?: FloatNullableWithAggregatesFilter<"Market"> | number | null
    resolutionDeadline?: DateTimeNullableWithAggregatesFilter<"Market"> | Date | string | null
    resolveAttempts?: IntWithAggregatesFilter<"Market"> | number
    lastAttemptAt?: DateTimeNullableWithAggregatesFilter<"Market"> | Date | string | null
    nextRetryAt?: DateTimeNullableWithAggregatesFilter<"Market"> | Date | string | null
    lastError?: StringNullableWithAggregatesFilter<"Market"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Market"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Market"> | Date | string
  }

  export type DeployedPRWhereInput = {
    AND?: DeployedPRWhereInput | DeployedPRWhereInput[]
    OR?: DeployedPRWhereInput[]
    NOT?: DeployedPRWhereInput | DeployedPRWhereInput[]
    id?: StringFilter<"DeployedPR"> | string
    prNumber?: IntFilter<"DeployedPR"> | number
    prTitle?: StringFilter<"DeployedPR"> | string
    prUrl?: StringNullableFilter<"DeployedPR"> | string | null
    mergedAt?: DateTimeNullableFilter<"DeployedPR"> | Date | string | null
    tssScore?: FloatNullableFilter<"DeployedPR"> | number | null
    deployedAt?: DateTimeFilter<"DeployedPR"> | Date | string
    repoName?: StringNullableFilter<"DeployedPR"> | string | null
    marketId?: StringNullableFilter<"DeployedPR"> | string | null
    market?: XOR<MarketNullableScalarRelationFilter, MarketWhereInput> | null
  }

  export type DeployedPROrderByWithRelationInput = {
    id?: SortOrder
    prNumber?: SortOrder
    prTitle?: SortOrder
    prUrl?: SortOrderInput | SortOrder
    mergedAt?: SortOrderInput | SortOrder
    tssScore?: SortOrderInput | SortOrder
    deployedAt?: SortOrder
    repoName?: SortOrderInput | SortOrder
    marketId?: SortOrderInput | SortOrder
    market?: MarketOrderByWithRelationInput
  }

  export type DeployedPRWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    prNumber?: number
    marketId?: string
    AND?: DeployedPRWhereInput | DeployedPRWhereInput[]
    OR?: DeployedPRWhereInput[]
    NOT?: DeployedPRWhereInput | DeployedPRWhereInput[]
    prTitle?: StringFilter<"DeployedPR"> | string
    prUrl?: StringNullableFilter<"DeployedPR"> | string | null
    mergedAt?: DateTimeNullableFilter<"DeployedPR"> | Date | string | null
    tssScore?: FloatNullableFilter<"DeployedPR"> | number | null
    deployedAt?: DateTimeFilter<"DeployedPR"> | Date | string
    repoName?: StringNullableFilter<"DeployedPR"> | string | null
    market?: XOR<MarketNullableScalarRelationFilter, MarketWhereInput> | null
  }, "id" | "prNumber" | "marketId">

  export type DeployedPROrderByWithAggregationInput = {
    id?: SortOrder
    prNumber?: SortOrder
    prTitle?: SortOrder
    prUrl?: SortOrderInput | SortOrder
    mergedAt?: SortOrderInput | SortOrder
    tssScore?: SortOrderInput | SortOrder
    deployedAt?: SortOrder
    repoName?: SortOrderInput | SortOrder
    marketId?: SortOrderInput | SortOrder
    _count?: DeployedPRCountOrderByAggregateInput
    _avg?: DeployedPRAvgOrderByAggregateInput
    _max?: DeployedPRMaxOrderByAggregateInput
    _min?: DeployedPRMinOrderByAggregateInput
    _sum?: DeployedPRSumOrderByAggregateInput
  }

  export type DeployedPRScalarWhereWithAggregatesInput = {
    AND?: DeployedPRScalarWhereWithAggregatesInput | DeployedPRScalarWhereWithAggregatesInput[]
    OR?: DeployedPRScalarWhereWithAggregatesInput[]
    NOT?: DeployedPRScalarWhereWithAggregatesInput | DeployedPRScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DeployedPR"> | string
    prNumber?: IntWithAggregatesFilter<"DeployedPR"> | number
    prTitle?: StringWithAggregatesFilter<"DeployedPR"> | string
    prUrl?: StringNullableWithAggregatesFilter<"DeployedPR"> | string | null
    mergedAt?: DateTimeNullableWithAggregatesFilter<"DeployedPR"> | Date | string | null
    tssScore?: FloatNullableWithAggregatesFilter<"DeployedPR"> | number | null
    deployedAt?: DateTimeWithAggregatesFilter<"DeployedPR"> | Date | string
    repoName?: StringNullableWithAggregatesFilter<"DeployedPR"> | string | null
    marketId?: StringNullableWithAggregatesFilter<"DeployedPR"> | string | null
  }

  export type ResolutionLogWhereInput = {
    AND?: ResolutionLogWhereInput | ResolutionLogWhereInput[]
    OR?: ResolutionLogWhereInput[]
    NOT?: ResolutionLogWhereInput | ResolutionLogWhereInput[]
    id?: StringFilter<"ResolutionLog"> | string
    marketId?: StringFilter<"ResolutionLog"> | string
    attemptNumber?: IntFilter<"ResolutionLog"> | number
    resolverType?: StringFilter<"ResolutionLog"> | string
    rawResponse?: JsonNullableFilter<"ResolutionLog">
    decision?: StringFilter<"ResolutionLog"> | string
    reasoning?: StringNullableFilter<"ResolutionLog"> | string | null
    txHash?: StringNullableFilter<"ResolutionLog"> | string | null
    blockNumber?: IntNullableFilter<"ResolutionLog"> | number | null
    error?: StringNullableFilter<"ResolutionLog"> | string | null
    attemptedAt?: DateTimeFilter<"ResolutionLog"> | Date | string
    market?: XOR<MarketScalarRelationFilter, MarketWhereInput>
  }

  export type ResolutionLogOrderByWithRelationInput = {
    id?: SortOrder
    marketId?: SortOrder
    attemptNumber?: SortOrder
    resolverType?: SortOrder
    rawResponse?: SortOrderInput | SortOrder
    decision?: SortOrder
    reasoning?: SortOrderInput | SortOrder
    txHash?: SortOrderInput | SortOrder
    blockNumber?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    attemptedAt?: SortOrder
    market?: MarketOrderByWithRelationInput
  }

  export type ResolutionLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ResolutionLogWhereInput | ResolutionLogWhereInput[]
    OR?: ResolutionLogWhereInput[]
    NOT?: ResolutionLogWhereInput | ResolutionLogWhereInput[]
    marketId?: StringFilter<"ResolutionLog"> | string
    attemptNumber?: IntFilter<"ResolutionLog"> | number
    resolverType?: StringFilter<"ResolutionLog"> | string
    rawResponse?: JsonNullableFilter<"ResolutionLog">
    decision?: StringFilter<"ResolutionLog"> | string
    reasoning?: StringNullableFilter<"ResolutionLog"> | string | null
    txHash?: StringNullableFilter<"ResolutionLog"> | string | null
    blockNumber?: IntNullableFilter<"ResolutionLog"> | number | null
    error?: StringNullableFilter<"ResolutionLog"> | string | null
    attemptedAt?: DateTimeFilter<"ResolutionLog"> | Date | string
    market?: XOR<MarketScalarRelationFilter, MarketWhereInput>
  }, "id">

  export type ResolutionLogOrderByWithAggregationInput = {
    id?: SortOrder
    marketId?: SortOrder
    attemptNumber?: SortOrder
    resolverType?: SortOrder
    rawResponse?: SortOrderInput | SortOrder
    decision?: SortOrder
    reasoning?: SortOrderInput | SortOrder
    txHash?: SortOrderInput | SortOrder
    blockNumber?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    attemptedAt?: SortOrder
    _count?: ResolutionLogCountOrderByAggregateInput
    _avg?: ResolutionLogAvgOrderByAggregateInput
    _max?: ResolutionLogMaxOrderByAggregateInput
    _min?: ResolutionLogMinOrderByAggregateInput
    _sum?: ResolutionLogSumOrderByAggregateInput
  }

  export type ResolutionLogScalarWhereWithAggregatesInput = {
    AND?: ResolutionLogScalarWhereWithAggregatesInput | ResolutionLogScalarWhereWithAggregatesInput[]
    OR?: ResolutionLogScalarWhereWithAggregatesInput[]
    NOT?: ResolutionLogScalarWhereWithAggregatesInput | ResolutionLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ResolutionLog"> | string
    marketId?: StringWithAggregatesFilter<"ResolutionLog"> | string
    attemptNumber?: IntWithAggregatesFilter<"ResolutionLog"> | number
    resolverType?: StringWithAggregatesFilter<"ResolutionLog"> | string
    rawResponse?: JsonNullableWithAggregatesFilter<"ResolutionLog">
    decision?: StringWithAggregatesFilter<"ResolutionLog"> | string
    reasoning?: StringNullableWithAggregatesFilter<"ResolutionLog"> | string | null
    txHash?: StringNullableWithAggregatesFilter<"ResolutionLog"> | string | null
    blockNumber?: IntNullableWithAggregatesFilter<"ResolutionLog"> | number | null
    error?: StringNullableWithAggregatesFilter<"ResolutionLog"> | string | null
    attemptedAt?: DateTimeWithAggregatesFilter<"ResolutionLog"> | Date | string
  }

  export type AgentCycleWhereInput = {
    AND?: AgentCycleWhereInput | AgentCycleWhereInput[]
    OR?: AgentCycleWhereInput[]
    NOT?: AgentCycleWhereInput | AgentCycleWhereInput[]
    id?: StringFilter<"AgentCycle"> | string
    cycleType?: StringFilter<"AgentCycle"> | string
    startedAt?: DateTimeFilter<"AgentCycle"> | Date | string
    completedAt?: DateTimeNullableFilter<"AgentCycle"> | Date | string | null
    durationMs?: IntNullableFilter<"AgentCycle"> | number | null
    prsAnalysed?: IntNullableFilter<"AgentCycle"> | number | null
    marketsProposed?: IntNullableFilter<"AgentCycle"> | number | null
    marketsDeployed?: IntNullableFilter<"AgentCycle"> | number | null
    marketsResolved?: IntNullableFilter<"AgentCycle"> | number | null
    errors?: StringNullableListFilter<"AgentCycle">
    metadata?: JsonNullableFilter<"AgentCycle">
  }

  export type AgentCycleOrderByWithRelationInput = {
    id?: SortOrder
    cycleType?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    prsAnalysed?: SortOrderInput | SortOrder
    marketsProposed?: SortOrderInput | SortOrder
    marketsDeployed?: SortOrderInput | SortOrder
    marketsResolved?: SortOrderInput | SortOrder
    errors?: SortOrder
    metadata?: SortOrderInput | SortOrder
  }

  export type AgentCycleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AgentCycleWhereInput | AgentCycleWhereInput[]
    OR?: AgentCycleWhereInput[]
    NOT?: AgentCycleWhereInput | AgentCycleWhereInput[]
    cycleType?: StringFilter<"AgentCycle"> | string
    startedAt?: DateTimeFilter<"AgentCycle"> | Date | string
    completedAt?: DateTimeNullableFilter<"AgentCycle"> | Date | string | null
    durationMs?: IntNullableFilter<"AgentCycle"> | number | null
    prsAnalysed?: IntNullableFilter<"AgentCycle"> | number | null
    marketsProposed?: IntNullableFilter<"AgentCycle"> | number | null
    marketsDeployed?: IntNullableFilter<"AgentCycle"> | number | null
    marketsResolved?: IntNullableFilter<"AgentCycle"> | number | null
    errors?: StringNullableListFilter<"AgentCycle">
    metadata?: JsonNullableFilter<"AgentCycle">
  }, "id">

  export type AgentCycleOrderByWithAggregationInput = {
    id?: SortOrder
    cycleType?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    prsAnalysed?: SortOrderInput | SortOrder
    marketsProposed?: SortOrderInput | SortOrder
    marketsDeployed?: SortOrderInput | SortOrder
    marketsResolved?: SortOrderInput | SortOrder
    errors?: SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: AgentCycleCountOrderByAggregateInput
    _avg?: AgentCycleAvgOrderByAggregateInput
    _max?: AgentCycleMaxOrderByAggregateInput
    _min?: AgentCycleMinOrderByAggregateInput
    _sum?: AgentCycleSumOrderByAggregateInput
  }

  export type AgentCycleScalarWhereWithAggregatesInput = {
    AND?: AgentCycleScalarWhereWithAggregatesInput | AgentCycleScalarWhereWithAggregatesInput[]
    OR?: AgentCycleScalarWhereWithAggregatesInput[]
    NOT?: AgentCycleScalarWhereWithAggregatesInput | AgentCycleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentCycle"> | string
    cycleType?: StringWithAggregatesFilter<"AgentCycle"> | string
    startedAt?: DateTimeWithAggregatesFilter<"AgentCycle"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"AgentCycle"> | Date | string | null
    durationMs?: IntNullableWithAggregatesFilter<"AgentCycle"> | number | null
    prsAnalysed?: IntNullableWithAggregatesFilter<"AgentCycle"> | number | null
    marketsProposed?: IntNullableWithAggregatesFilter<"AgentCycle"> | number | null
    marketsDeployed?: IntNullableWithAggregatesFilter<"AgentCycle"> | number | null
    marketsResolved?: IntNullableWithAggregatesFilter<"AgentCycle"> | number | null
    errors?: StringNullableListFilter<"AgentCycle">
    metadata?: JsonNullableWithAggregatesFilter<"AgentCycle">
  }

  export type SecurityAdvisoryWhereInput = {
    AND?: SecurityAdvisoryWhereInput | SecurityAdvisoryWhereInput[]
    OR?: SecurityAdvisoryWhereInput[]
    NOT?: SecurityAdvisoryWhereInput | SecurityAdvisoryWhereInput[]
    id?: StringFilter<"SecurityAdvisory"> | string
    cveId?: StringNullableFilter<"SecurityAdvisory"> | string | null
    ghsaId?: StringNullableFilter<"SecurityAdvisory"> | string | null
    severity?: StringFilter<"SecurityAdvisory"> | string
    packageName?: StringNullableFilter<"SecurityAdvisory"> | string | null
    summary?: StringNullableFilter<"SecurityAdvisory"> | string | null
    publishedAt?: DateTimeNullableFilter<"SecurityAdvisory"> | Date | string | null
    rawPayload?: JsonNullableFilter<"SecurityAdvisory">
    fetchedAt?: DateTimeFilter<"SecurityAdvisory"> | Date | string
  }

  export type SecurityAdvisoryOrderByWithRelationInput = {
    id?: SortOrder
    cveId?: SortOrderInput | SortOrder
    ghsaId?: SortOrderInput | SortOrder
    severity?: SortOrder
    packageName?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    publishedAt?: SortOrderInput | SortOrder
    rawPayload?: SortOrderInput | SortOrder
    fetchedAt?: SortOrder
  }

  export type SecurityAdvisoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cveId?: string
    ghsaId?: string
    AND?: SecurityAdvisoryWhereInput | SecurityAdvisoryWhereInput[]
    OR?: SecurityAdvisoryWhereInput[]
    NOT?: SecurityAdvisoryWhereInput | SecurityAdvisoryWhereInput[]
    severity?: StringFilter<"SecurityAdvisory"> | string
    packageName?: StringNullableFilter<"SecurityAdvisory"> | string | null
    summary?: StringNullableFilter<"SecurityAdvisory"> | string | null
    publishedAt?: DateTimeNullableFilter<"SecurityAdvisory"> | Date | string | null
    rawPayload?: JsonNullableFilter<"SecurityAdvisory">
    fetchedAt?: DateTimeFilter<"SecurityAdvisory"> | Date | string
  }, "id" | "cveId" | "ghsaId">

  export type SecurityAdvisoryOrderByWithAggregationInput = {
    id?: SortOrder
    cveId?: SortOrderInput | SortOrder
    ghsaId?: SortOrderInput | SortOrder
    severity?: SortOrder
    packageName?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    publishedAt?: SortOrderInput | SortOrder
    rawPayload?: SortOrderInput | SortOrder
    fetchedAt?: SortOrder
    _count?: SecurityAdvisoryCountOrderByAggregateInput
    _max?: SecurityAdvisoryMaxOrderByAggregateInput
    _min?: SecurityAdvisoryMinOrderByAggregateInput
  }

  export type SecurityAdvisoryScalarWhereWithAggregatesInput = {
    AND?: SecurityAdvisoryScalarWhereWithAggregatesInput | SecurityAdvisoryScalarWhereWithAggregatesInput[]
    OR?: SecurityAdvisoryScalarWhereWithAggregatesInput[]
    NOT?: SecurityAdvisoryScalarWhereWithAggregatesInput | SecurityAdvisoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SecurityAdvisory"> | string
    cveId?: StringNullableWithAggregatesFilter<"SecurityAdvisory"> | string | null
    ghsaId?: StringNullableWithAggregatesFilter<"SecurityAdvisory"> | string | null
    severity?: StringWithAggregatesFilter<"SecurityAdvisory"> | string
    packageName?: StringNullableWithAggregatesFilter<"SecurityAdvisory"> | string | null
    summary?: StringNullableWithAggregatesFilter<"SecurityAdvisory"> | string | null
    publishedAt?: DateTimeNullableWithAggregatesFilter<"SecurityAdvisory"> | Date | string | null
    rawPayload?: JsonNullableWithAggregatesFilter<"SecurityAdvisory">
    fetchedAt?: DateTimeWithAggregatesFilter<"SecurityAdvisory"> | Date | string
  }

  export type MarketCreateInput = {
    id?: string
    onchainMarketId?: number | null
    transactionHash?: string | null
    blockNumber?: number | null
    contractAddress?: string | null
    title: string
    question: string
    category: string
    options?: MarketCreateoptionsInput | string[]
    agentReason: string
    resolutionType: $Enums.ResolutionType
    dataSourceUrl: string
    evaluationLogic: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: number | null
    sourcePrUrl?: string | null
    tssScore?: number | null
    status?: $Enums.MarketStatus
    outcome?: $Enums.Outcome
    resolvedAt?: Date | string | null
    resolutionTxHash?: string | null
    resolutionNote?: string | null
    initialLiquidityEth?: number | null
    resolutionDeadline?: Date | string | null
    resolveAttempts?: number
    lastAttemptAt?: Date | string | null
    nextRetryAt?: Date | string | null
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolutionLogs?: ResolutionLogCreateNestedManyWithoutMarketInput
    prRecord?: DeployedPRCreateNestedOneWithoutMarketInput
  }

  export type MarketUncheckedCreateInput = {
    id?: string
    onchainMarketId?: number | null
    transactionHash?: string | null
    blockNumber?: number | null
    contractAddress?: string | null
    title: string
    question: string
    category: string
    options?: MarketCreateoptionsInput | string[]
    agentReason: string
    resolutionType: $Enums.ResolutionType
    dataSourceUrl: string
    evaluationLogic: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: number | null
    sourcePrUrl?: string | null
    tssScore?: number | null
    status?: $Enums.MarketStatus
    outcome?: $Enums.Outcome
    resolvedAt?: Date | string | null
    resolutionTxHash?: string | null
    resolutionNote?: string | null
    initialLiquidityEth?: number | null
    resolutionDeadline?: Date | string | null
    resolveAttempts?: number
    lastAttemptAt?: Date | string | null
    nextRetryAt?: Date | string | null
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolutionLogs?: ResolutionLogUncheckedCreateNestedManyWithoutMarketInput
    prRecord?: DeployedPRUncheckedCreateNestedOneWithoutMarketInput
  }

  export type MarketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    onchainMarketId?: NullableIntFieldUpdateOperationsInput | number | null
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    options?: MarketUpdateoptionsInput | string[]
    agentReason?: StringFieldUpdateOperationsInput | string
    resolutionType?: EnumResolutionTypeFieldUpdateOperationsInput | $Enums.ResolutionType
    dataSourceUrl?: StringFieldUpdateOperationsInput | string
    evaluationLogic?: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sourcePrUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus
    outcome?: EnumOutcomeFieldUpdateOperationsInput | $Enums.Outcome
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolutionTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    resolutionNote?: NullableStringFieldUpdateOperationsInput | string | null
    initialLiquidityEth?: NullableFloatFieldUpdateOperationsInput | number | null
    resolutionDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolveAttempts?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextRetryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolutionLogs?: ResolutionLogUpdateManyWithoutMarketNestedInput
    prRecord?: DeployedPRUpdateOneWithoutMarketNestedInput
  }

  export type MarketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    onchainMarketId?: NullableIntFieldUpdateOperationsInput | number | null
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    options?: MarketUpdateoptionsInput | string[]
    agentReason?: StringFieldUpdateOperationsInput | string
    resolutionType?: EnumResolutionTypeFieldUpdateOperationsInput | $Enums.ResolutionType
    dataSourceUrl?: StringFieldUpdateOperationsInput | string
    evaluationLogic?: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sourcePrUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus
    outcome?: EnumOutcomeFieldUpdateOperationsInput | $Enums.Outcome
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolutionTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    resolutionNote?: NullableStringFieldUpdateOperationsInput | string | null
    initialLiquidityEth?: NullableFloatFieldUpdateOperationsInput | number | null
    resolutionDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolveAttempts?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextRetryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolutionLogs?: ResolutionLogUncheckedUpdateManyWithoutMarketNestedInput
    prRecord?: DeployedPRUncheckedUpdateOneWithoutMarketNestedInput
  }

  export type MarketCreateManyInput = {
    id?: string
    onchainMarketId?: number | null
    transactionHash?: string | null
    blockNumber?: number | null
    contractAddress?: string | null
    title: string
    question: string
    category: string
    options?: MarketCreateoptionsInput | string[]
    agentReason: string
    resolutionType: $Enums.ResolutionType
    dataSourceUrl: string
    evaluationLogic: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: number | null
    sourcePrUrl?: string | null
    tssScore?: number | null
    status?: $Enums.MarketStatus
    outcome?: $Enums.Outcome
    resolvedAt?: Date | string | null
    resolutionTxHash?: string | null
    resolutionNote?: string | null
    initialLiquidityEth?: number | null
    resolutionDeadline?: Date | string | null
    resolveAttempts?: number
    lastAttemptAt?: Date | string | null
    nextRetryAt?: Date | string | null
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MarketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    onchainMarketId?: NullableIntFieldUpdateOperationsInput | number | null
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    options?: MarketUpdateoptionsInput | string[]
    agentReason?: StringFieldUpdateOperationsInput | string
    resolutionType?: EnumResolutionTypeFieldUpdateOperationsInput | $Enums.ResolutionType
    dataSourceUrl?: StringFieldUpdateOperationsInput | string
    evaluationLogic?: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sourcePrUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus
    outcome?: EnumOutcomeFieldUpdateOperationsInput | $Enums.Outcome
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolutionTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    resolutionNote?: NullableStringFieldUpdateOperationsInput | string | null
    initialLiquidityEth?: NullableFloatFieldUpdateOperationsInput | number | null
    resolutionDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolveAttempts?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextRetryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    onchainMarketId?: NullableIntFieldUpdateOperationsInput | number | null
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    options?: MarketUpdateoptionsInput | string[]
    agentReason?: StringFieldUpdateOperationsInput | string
    resolutionType?: EnumResolutionTypeFieldUpdateOperationsInput | $Enums.ResolutionType
    dataSourceUrl?: StringFieldUpdateOperationsInput | string
    evaluationLogic?: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sourcePrUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus
    outcome?: EnumOutcomeFieldUpdateOperationsInput | $Enums.Outcome
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolutionTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    resolutionNote?: NullableStringFieldUpdateOperationsInput | string | null
    initialLiquidityEth?: NullableFloatFieldUpdateOperationsInput | number | null
    resolutionDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolveAttempts?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextRetryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeployedPRCreateInput = {
    id?: string
    prNumber: number
    prTitle: string
    prUrl?: string | null
    mergedAt?: Date | string | null
    tssScore?: number | null
    deployedAt?: Date | string
    repoName?: string | null
    market?: MarketCreateNestedOneWithoutPrRecordInput
  }

  export type DeployedPRUncheckedCreateInput = {
    id?: string
    prNumber: number
    prTitle: string
    prUrl?: string | null
    mergedAt?: Date | string | null
    tssScore?: number | null
    deployedAt?: Date | string
    repoName?: string | null
    marketId?: string | null
  }

  export type DeployedPRUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: IntFieldUpdateOperationsInput | number
    prTitle?: StringFieldUpdateOperationsInput | string
    prUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mergedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    deployedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repoName?: NullableStringFieldUpdateOperationsInput | string | null
    market?: MarketUpdateOneWithoutPrRecordNestedInput
  }

  export type DeployedPRUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: IntFieldUpdateOperationsInput | number
    prTitle?: StringFieldUpdateOperationsInput | string
    prUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mergedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    deployedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repoName?: NullableStringFieldUpdateOperationsInput | string | null
    marketId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DeployedPRCreateManyInput = {
    id?: string
    prNumber: number
    prTitle: string
    prUrl?: string | null
    mergedAt?: Date | string | null
    tssScore?: number | null
    deployedAt?: Date | string
    repoName?: string | null
    marketId?: string | null
  }

  export type DeployedPRUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: IntFieldUpdateOperationsInput | number
    prTitle?: StringFieldUpdateOperationsInput | string
    prUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mergedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    deployedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repoName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DeployedPRUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: IntFieldUpdateOperationsInput | number
    prTitle?: StringFieldUpdateOperationsInput | string
    prUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mergedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    deployedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repoName?: NullableStringFieldUpdateOperationsInput | string | null
    marketId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ResolutionLogCreateInput = {
    id?: string
    attemptNumber: number
    resolverType: string
    rawResponse?: NullableJsonNullValueInput | InputJsonValue
    decision: string
    reasoning?: string | null
    txHash?: string | null
    blockNumber?: number | null
    error?: string | null
    attemptedAt?: Date | string
    market: MarketCreateNestedOneWithoutResolutionLogsInput
  }

  export type ResolutionLogUncheckedCreateInput = {
    id?: string
    marketId: string
    attemptNumber: number
    resolverType: string
    rawResponse?: NullableJsonNullValueInput | InputJsonValue
    decision: string
    reasoning?: string | null
    txHash?: string | null
    blockNumber?: number | null
    error?: string | null
    attemptedAt?: Date | string
  }

  export type ResolutionLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    attemptNumber?: IntFieldUpdateOperationsInput | number
    resolverType?: StringFieldUpdateOperationsInput | string
    rawResponse?: NullableJsonNullValueInput | InputJsonValue
    decision?: StringFieldUpdateOperationsInput | string
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    attemptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    market?: MarketUpdateOneRequiredWithoutResolutionLogsNestedInput
  }

  export type ResolutionLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    marketId?: StringFieldUpdateOperationsInput | string
    attemptNumber?: IntFieldUpdateOperationsInput | number
    resolverType?: StringFieldUpdateOperationsInput | string
    rawResponse?: NullableJsonNullValueInput | InputJsonValue
    decision?: StringFieldUpdateOperationsInput | string
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    attemptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResolutionLogCreateManyInput = {
    id?: string
    marketId: string
    attemptNumber: number
    resolverType: string
    rawResponse?: NullableJsonNullValueInput | InputJsonValue
    decision: string
    reasoning?: string | null
    txHash?: string | null
    blockNumber?: number | null
    error?: string | null
    attemptedAt?: Date | string
  }

  export type ResolutionLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    attemptNumber?: IntFieldUpdateOperationsInput | number
    resolverType?: StringFieldUpdateOperationsInput | string
    rawResponse?: NullableJsonNullValueInput | InputJsonValue
    decision?: StringFieldUpdateOperationsInput | string
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    attemptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResolutionLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    marketId?: StringFieldUpdateOperationsInput | string
    attemptNumber?: IntFieldUpdateOperationsInput | number
    resolverType?: StringFieldUpdateOperationsInput | string
    rawResponse?: NullableJsonNullValueInput | InputJsonValue
    decision?: StringFieldUpdateOperationsInput | string
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    attemptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentCycleCreateInput = {
    id?: string
    cycleType: string
    startedAt?: Date | string
    completedAt?: Date | string | null
    durationMs?: number | null
    prsAnalysed?: number | null
    marketsProposed?: number | null
    marketsDeployed?: number | null
    marketsResolved?: number | null
    errors?: AgentCycleCreateerrorsInput | string[]
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AgentCycleUncheckedCreateInput = {
    id?: string
    cycleType: string
    startedAt?: Date | string
    completedAt?: Date | string | null
    durationMs?: number | null
    prsAnalysed?: number | null
    marketsProposed?: number | null
    marketsDeployed?: number | null
    marketsResolved?: number | null
    errors?: AgentCycleCreateerrorsInput | string[]
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AgentCycleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleType?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    prsAnalysed?: NullableIntFieldUpdateOperationsInput | number | null
    marketsProposed?: NullableIntFieldUpdateOperationsInput | number | null
    marketsDeployed?: NullableIntFieldUpdateOperationsInput | number | null
    marketsResolved?: NullableIntFieldUpdateOperationsInput | number | null
    errors?: AgentCycleUpdateerrorsInput | string[]
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AgentCycleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleType?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    prsAnalysed?: NullableIntFieldUpdateOperationsInput | number | null
    marketsProposed?: NullableIntFieldUpdateOperationsInput | number | null
    marketsDeployed?: NullableIntFieldUpdateOperationsInput | number | null
    marketsResolved?: NullableIntFieldUpdateOperationsInput | number | null
    errors?: AgentCycleUpdateerrorsInput | string[]
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AgentCycleCreateManyInput = {
    id?: string
    cycleType: string
    startedAt?: Date | string
    completedAt?: Date | string | null
    durationMs?: number | null
    prsAnalysed?: number | null
    marketsProposed?: number | null
    marketsDeployed?: number | null
    marketsResolved?: number | null
    errors?: AgentCycleCreateerrorsInput | string[]
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AgentCycleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleType?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    prsAnalysed?: NullableIntFieldUpdateOperationsInput | number | null
    marketsProposed?: NullableIntFieldUpdateOperationsInput | number | null
    marketsDeployed?: NullableIntFieldUpdateOperationsInput | number | null
    marketsResolved?: NullableIntFieldUpdateOperationsInput | number | null
    errors?: AgentCycleUpdateerrorsInput | string[]
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AgentCycleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cycleType?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    prsAnalysed?: NullableIntFieldUpdateOperationsInput | number | null
    marketsProposed?: NullableIntFieldUpdateOperationsInput | number | null
    marketsDeployed?: NullableIntFieldUpdateOperationsInput | number | null
    marketsResolved?: NullableIntFieldUpdateOperationsInput | number | null
    errors?: AgentCycleUpdateerrorsInput | string[]
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SecurityAdvisoryCreateInput = {
    id?: string
    cveId?: string | null
    ghsaId?: string | null
    severity: string
    packageName?: string | null
    summary?: string | null
    publishedAt?: Date | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    fetchedAt?: Date | string
  }

  export type SecurityAdvisoryUncheckedCreateInput = {
    id?: string
    cveId?: string | null
    ghsaId?: string | null
    severity: string
    packageName?: string | null
    summary?: string | null
    publishedAt?: Date | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    fetchedAt?: Date | string
  }

  export type SecurityAdvisoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cveId?: NullableStringFieldUpdateOperationsInput | string | null
    ghsaId?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: StringFieldUpdateOperationsInput | string
    packageName?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityAdvisoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cveId?: NullableStringFieldUpdateOperationsInput | string | null
    ghsaId?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: StringFieldUpdateOperationsInput | string
    packageName?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityAdvisoryCreateManyInput = {
    id?: string
    cveId?: string | null
    ghsaId?: string | null
    severity: string
    packageName?: string | null
    summary?: string | null
    publishedAt?: Date | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    fetchedAt?: Date | string
  }

  export type SecurityAdvisoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cveId?: NullableStringFieldUpdateOperationsInput | string | null
    ghsaId?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: StringFieldUpdateOperationsInput | string
    packageName?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityAdvisoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cveId?: NullableStringFieldUpdateOperationsInput | string | null
    ghsaId?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: StringFieldUpdateOperationsInput | string
    packageName?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPayload?: NullableJsonNullValueInput | InputJsonValue
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumResolutionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ResolutionType | EnumResolutionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ResolutionType[] | ListEnumResolutionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ResolutionType[] | ListEnumResolutionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumResolutionTypeFilter<$PrismaModel> | $Enums.ResolutionType
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type EnumMarketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketStatus | EnumMarketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MarketStatus[] | ListEnumMarketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MarketStatus[] | ListEnumMarketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMarketStatusFilter<$PrismaModel> | $Enums.MarketStatus
  }

  export type EnumOutcomeFilter<$PrismaModel = never> = {
    equals?: $Enums.Outcome | EnumOutcomeFieldRefInput<$PrismaModel>
    in?: $Enums.Outcome[] | ListEnumOutcomeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Outcome[] | ListEnumOutcomeFieldRefInput<$PrismaModel>
    not?: NestedEnumOutcomeFilter<$PrismaModel> | $Enums.Outcome
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ResolutionLogListRelationFilter = {
    every?: ResolutionLogWhereInput
    some?: ResolutionLogWhereInput
    none?: ResolutionLogWhereInput
  }

  export type DeployedPRNullableScalarRelationFilter = {
    is?: DeployedPRWhereInput | null
    isNot?: DeployedPRWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ResolutionLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MarketCountOrderByAggregateInput = {
    id?: SortOrder
    onchainMarketId?: SortOrder
    transactionHash?: SortOrder
    blockNumber?: SortOrder
    contractAddress?: SortOrder
    title?: SortOrder
    question?: SortOrder
    category?: SortOrder
    options?: SortOrder
    agentReason?: SortOrder
    resolutionType?: SortOrder
    dataSourceUrl?: SortOrder
    evaluationLogic?: SortOrder
    sourcePrNumber?: SortOrder
    sourcePrUrl?: SortOrder
    tssScore?: SortOrder
    status?: SortOrder
    outcome?: SortOrder
    resolvedAt?: SortOrder
    resolutionTxHash?: SortOrder
    resolutionNote?: SortOrder
    initialLiquidityEth?: SortOrder
    resolutionDeadline?: SortOrder
    resolveAttempts?: SortOrder
    lastAttemptAt?: SortOrder
    nextRetryAt?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MarketAvgOrderByAggregateInput = {
    onchainMarketId?: SortOrder
    blockNumber?: SortOrder
    sourcePrNumber?: SortOrder
    tssScore?: SortOrder
    initialLiquidityEth?: SortOrder
    resolveAttempts?: SortOrder
  }

  export type MarketMaxOrderByAggregateInput = {
    id?: SortOrder
    onchainMarketId?: SortOrder
    transactionHash?: SortOrder
    blockNumber?: SortOrder
    contractAddress?: SortOrder
    title?: SortOrder
    question?: SortOrder
    category?: SortOrder
    agentReason?: SortOrder
    resolutionType?: SortOrder
    dataSourceUrl?: SortOrder
    sourcePrNumber?: SortOrder
    sourcePrUrl?: SortOrder
    tssScore?: SortOrder
    status?: SortOrder
    outcome?: SortOrder
    resolvedAt?: SortOrder
    resolutionTxHash?: SortOrder
    resolutionNote?: SortOrder
    initialLiquidityEth?: SortOrder
    resolutionDeadline?: SortOrder
    resolveAttempts?: SortOrder
    lastAttemptAt?: SortOrder
    nextRetryAt?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MarketMinOrderByAggregateInput = {
    id?: SortOrder
    onchainMarketId?: SortOrder
    transactionHash?: SortOrder
    blockNumber?: SortOrder
    contractAddress?: SortOrder
    title?: SortOrder
    question?: SortOrder
    category?: SortOrder
    agentReason?: SortOrder
    resolutionType?: SortOrder
    dataSourceUrl?: SortOrder
    sourcePrNumber?: SortOrder
    sourcePrUrl?: SortOrder
    tssScore?: SortOrder
    status?: SortOrder
    outcome?: SortOrder
    resolvedAt?: SortOrder
    resolutionTxHash?: SortOrder
    resolutionNote?: SortOrder
    initialLiquidityEth?: SortOrder
    resolutionDeadline?: SortOrder
    resolveAttempts?: SortOrder
    lastAttemptAt?: SortOrder
    nextRetryAt?: SortOrder
    lastError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MarketSumOrderByAggregateInput = {
    onchainMarketId?: SortOrder
    blockNumber?: SortOrder
    sourcePrNumber?: SortOrder
    tssScore?: SortOrder
    initialLiquidityEth?: SortOrder
    resolveAttempts?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumResolutionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ResolutionType | EnumResolutionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ResolutionType[] | ListEnumResolutionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ResolutionType[] | ListEnumResolutionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumResolutionTypeWithAggregatesFilter<$PrismaModel> | $Enums.ResolutionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumResolutionTypeFilter<$PrismaModel>
    _max?: NestedEnumResolutionTypeFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type EnumMarketStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketStatus | EnumMarketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MarketStatus[] | ListEnumMarketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MarketStatus[] | ListEnumMarketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMarketStatusWithAggregatesFilter<$PrismaModel> | $Enums.MarketStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMarketStatusFilter<$PrismaModel>
    _max?: NestedEnumMarketStatusFilter<$PrismaModel>
  }

  export type EnumOutcomeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Outcome | EnumOutcomeFieldRefInput<$PrismaModel>
    in?: $Enums.Outcome[] | ListEnumOutcomeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Outcome[] | ListEnumOutcomeFieldRefInput<$PrismaModel>
    not?: NestedEnumOutcomeWithAggregatesFilter<$PrismaModel> | $Enums.Outcome
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOutcomeFilter<$PrismaModel>
    _max?: NestedEnumOutcomeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type MarketNullableScalarRelationFilter = {
    is?: MarketWhereInput | null
    isNot?: MarketWhereInput | null
  }

  export type DeployedPRCountOrderByAggregateInput = {
    id?: SortOrder
    prNumber?: SortOrder
    prTitle?: SortOrder
    prUrl?: SortOrder
    mergedAt?: SortOrder
    tssScore?: SortOrder
    deployedAt?: SortOrder
    repoName?: SortOrder
    marketId?: SortOrder
  }

  export type DeployedPRAvgOrderByAggregateInput = {
    prNumber?: SortOrder
    tssScore?: SortOrder
  }

  export type DeployedPRMaxOrderByAggregateInput = {
    id?: SortOrder
    prNumber?: SortOrder
    prTitle?: SortOrder
    prUrl?: SortOrder
    mergedAt?: SortOrder
    tssScore?: SortOrder
    deployedAt?: SortOrder
    repoName?: SortOrder
    marketId?: SortOrder
  }

  export type DeployedPRMinOrderByAggregateInput = {
    id?: SortOrder
    prNumber?: SortOrder
    prTitle?: SortOrder
    prUrl?: SortOrder
    mergedAt?: SortOrder
    tssScore?: SortOrder
    deployedAt?: SortOrder
    repoName?: SortOrder
    marketId?: SortOrder
  }

  export type DeployedPRSumOrderByAggregateInput = {
    prNumber?: SortOrder
    tssScore?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type MarketScalarRelationFilter = {
    is?: MarketWhereInput
    isNot?: MarketWhereInput
  }

  export type ResolutionLogCountOrderByAggregateInput = {
    id?: SortOrder
    marketId?: SortOrder
    attemptNumber?: SortOrder
    resolverType?: SortOrder
    rawResponse?: SortOrder
    decision?: SortOrder
    reasoning?: SortOrder
    txHash?: SortOrder
    blockNumber?: SortOrder
    error?: SortOrder
    attemptedAt?: SortOrder
  }

  export type ResolutionLogAvgOrderByAggregateInput = {
    attemptNumber?: SortOrder
    blockNumber?: SortOrder
  }

  export type ResolutionLogMaxOrderByAggregateInput = {
    id?: SortOrder
    marketId?: SortOrder
    attemptNumber?: SortOrder
    resolverType?: SortOrder
    decision?: SortOrder
    reasoning?: SortOrder
    txHash?: SortOrder
    blockNumber?: SortOrder
    error?: SortOrder
    attemptedAt?: SortOrder
  }

  export type ResolutionLogMinOrderByAggregateInput = {
    id?: SortOrder
    marketId?: SortOrder
    attemptNumber?: SortOrder
    resolverType?: SortOrder
    decision?: SortOrder
    reasoning?: SortOrder
    txHash?: SortOrder
    blockNumber?: SortOrder
    error?: SortOrder
    attemptedAt?: SortOrder
  }

  export type ResolutionLogSumOrderByAggregateInput = {
    attemptNumber?: SortOrder
    blockNumber?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type AgentCycleCountOrderByAggregateInput = {
    id?: SortOrder
    cycleType?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    durationMs?: SortOrder
    prsAnalysed?: SortOrder
    marketsProposed?: SortOrder
    marketsDeployed?: SortOrder
    marketsResolved?: SortOrder
    errors?: SortOrder
    metadata?: SortOrder
  }

  export type AgentCycleAvgOrderByAggregateInput = {
    durationMs?: SortOrder
    prsAnalysed?: SortOrder
    marketsProposed?: SortOrder
    marketsDeployed?: SortOrder
    marketsResolved?: SortOrder
  }

  export type AgentCycleMaxOrderByAggregateInput = {
    id?: SortOrder
    cycleType?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    durationMs?: SortOrder
    prsAnalysed?: SortOrder
    marketsProposed?: SortOrder
    marketsDeployed?: SortOrder
    marketsResolved?: SortOrder
  }

  export type AgentCycleMinOrderByAggregateInput = {
    id?: SortOrder
    cycleType?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    durationMs?: SortOrder
    prsAnalysed?: SortOrder
    marketsProposed?: SortOrder
    marketsDeployed?: SortOrder
    marketsResolved?: SortOrder
  }

  export type AgentCycleSumOrderByAggregateInput = {
    durationMs?: SortOrder
    prsAnalysed?: SortOrder
    marketsProposed?: SortOrder
    marketsDeployed?: SortOrder
    marketsResolved?: SortOrder
  }

  export type SecurityAdvisoryCountOrderByAggregateInput = {
    id?: SortOrder
    cveId?: SortOrder
    ghsaId?: SortOrder
    severity?: SortOrder
    packageName?: SortOrder
    summary?: SortOrder
    publishedAt?: SortOrder
    rawPayload?: SortOrder
    fetchedAt?: SortOrder
  }

  export type SecurityAdvisoryMaxOrderByAggregateInput = {
    id?: SortOrder
    cveId?: SortOrder
    ghsaId?: SortOrder
    severity?: SortOrder
    packageName?: SortOrder
    summary?: SortOrder
    publishedAt?: SortOrder
    fetchedAt?: SortOrder
  }

  export type SecurityAdvisoryMinOrderByAggregateInput = {
    id?: SortOrder
    cveId?: SortOrder
    ghsaId?: SortOrder
    severity?: SortOrder
    packageName?: SortOrder
    summary?: SortOrder
    publishedAt?: SortOrder
    fetchedAt?: SortOrder
  }

  export type MarketCreateoptionsInput = {
    set: string[]
  }

  export type ResolutionLogCreateNestedManyWithoutMarketInput = {
    create?: XOR<ResolutionLogCreateWithoutMarketInput, ResolutionLogUncheckedCreateWithoutMarketInput> | ResolutionLogCreateWithoutMarketInput[] | ResolutionLogUncheckedCreateWithoutMarketInput[]
    connectOrCreate?: ResolutionLogCreateOrConnectWithoutMarketInput | ResolutionLogCreateOrConnectWithoutMarketInput[]
    createMany?: ResolutionLogCreateManyMarketInputEnvelope
    connect?: ResolutionLogWhereUniqueInput | ResolutionLogWhereUniqueInput[]
  }

  export type DeployedPRCreateNestedOneWithoutMarketInput = {
    create?: XOR<DeployedPRCreateWithoutMarketInput, DeployedPRUncheckedCreateWithoutMarketInput>
    connectOrCreate?: DeployedPRCreateOrConnectWithoutMarketInput
    connect?: DeployedPRWhereUniqueInput
  }

  export type ResolutionLogUncheckedCreateNestedManyWithoutMarketInput = {
    create?: XOR<ResolutionLogCreateWithoutMarketInput, ResolutionLogUncheckedCreateWithoutMarketInput> | ResolutionLogCreateWithoutMarketInput[] | ResolutionLogUncheckedCreateWithoutMarketInput[]
    connectOrCreate?: ResolutionLogCreateOrConnectWithoutMarketInput | ResolutionLogCreateOrConnectWithoutMarketInput[]
    createMany?: ResolutionLogCreateManyMarketInputEnvelope
    connect?: ResolutionLogWhereUniqueInput | ResolutionLogWhereUniqueInput[]
  }

  export type DeployedPRUncheckedCreateNestedOneWithoutMarketInput = {
    create?: XOR<DeployedPRCreateWithoutMarketInput, DeployedPRUncheckedCreateWithoutMarketInput>
    connectOrCreate?: DeployedPRCreateOrConnectWithoutMarketInput
    connect?: DeployedPRWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type MarketUpdateoptionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumResolutionTypeFieldUpdateOperationsInput = {
    set?: $Enums.ResolutionType
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumMarketStatusFieldUpdateOperationsInput = {
    set?: $Enums.MarketStatus
  }

  export type EnumOutcomeFieldUpdateOperationsInput = {
    set?: $Enums.Outcome
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ResolutionLogUpdateManyWithoutMarketNestedInput = {
    create?: XOR<ResolutionLogCreateWithoutMarketInput, ResolutionLogUncheckedCreateWithoutMarketInput> | ResolutionLogCreateWithoutMarketInput[] | ResolutionLogUncheckedCreateWithoutMarketInput[]
    connectOrCreate?: ResolutionLogCreateOrConnectWithoutMarketInput | ResolutionLogCreateOrConnectWithoutMarketInput[]
    upsert?: ResolutionLogUpsertWithWhereUniqueWithoutMarketInput | ResolutionLogUpsertWithWhereUniqueWithoutMarketInput[]
    createMany?: ResolutionLogCreateManyMarketInputEnvelope
    set?: ResolutionLogWhereUniqueInput | ResolutionLogWhereUniqueInput[]
    disconnect?: ResolutionLogWhereUniqueInput | ResolutionLogWhereUniqueInput[]
    delete?: ResolutionLogWhereUniqueInput | ResolutionLogWhereUniqueInput[]
    connect?: ResolutionLogWhereUniqueInput | ResolutionLogWhereUniqueInput[]
    update?: ResolutionLogUpdateWithWhereUniqueWithoutMarketInput | ResolutionLogUpdateWithWhereUniqueWithoutMarketInput[]
    updateMany?: ResolutionLogUpdateManyWithWhereWithoutMarketInput | ResolutionLogUpdateManyWithWhereWithoutMarketInput[]
    deleteMany?: ResolutionLogScalarWhereInput | ResolutionLogScalarWhereInput[]
  }

  export type DeployedPRUpdateOneWithoutMarketNestedInput = {
    create?: XOR<DeployedPRCreateWithoutMarketInput, DeployedPRUncheckedCreateWithoutMarketInput>
    connectOrCreate?: DeployedPRCreateOrConnectWithoutMarketInput
    upsert?: DeployedPRUpsertWithoutMarketInput
    disconnect?: DeployedPRWhereInput | boolean
    delete?: DeployedPRWhereInput | boolean
    connect?: DeployedPRWhereUniqueInput
    update?: XOR<XOR<DeployedPRUpdateToOneWithWhereWithoutMarketInput, DeployedPRUpdateWithoutMarketInput>, DeployedPRUncheckedUpdateWithoutMarketInput>
  }

  export type ResolutionLogUncheckedUpdateManyWithoutMarketNestedInput = {
    create?: XOR<ResolutionLogCreateWithoutMarketInput, ResolutionLogUncheckedCreateWithoutMarketInput> | ResolutionLogCreateWithoutMarketInput[] | ResolutionLogUncheckedCreateWithoutMarketInput[]
    connectOrCreate?: ResolutionLogCreateOrConnectWithoutMarketInput | ResolutionLogCreateOrConnectWithoutMarketInput[]
    upsert?: ResolutionLogUpsertWithWhereUniqueWithoutMarketInput | ResolutionLogUpsertWithWhereUniqueWithoutMarketInput[]
    createMany?: ResolutionLogCreateManyMarketInputEnvelope
    set?: ResolutionLogWhereUniqueInput | ResolutionLogWhereUniqueInput[]
    disconnect?: ResolutionLogWhereUniqueInput | ResolutionLogWhereUniqueInput[]
    delete?: ResolutionLogWhereUniqueInput | ResolutionLogWhereUniqueInput[]
    connect?: ResolutionLogWhereUniqueInput | ResolutionLogWhereUniqueInput[]
    update?: ResolutionLogUpdateWithWhereUniqueWithoutMarketInput | ResolutionLogUpdateWithWhereUniqueWithoutMarketInput[]
    updateMany?: ResolutionLogUpdateManyWithWhereWithoutMarketInput | ResolutionLogUpdateManyWithWhereWithoutMarketInput[]
    deleteMany?: ResolutionLogScalarWhereInput | ResolutionLogScalarWhereInput[]
  }

  export type DeployedPRUncheckedUpdateOneWithoutMarketNestedInput = {
    create?: XOR<DeployedPRCreateWithoutMarketInput, DeployedPRUncheckedCreateWithoutMarketInput>
    connectOrCreate?: DeployedPRCreateOrConnectWithoutMarketInput
    upsert?: DeployedPRUpsertWithoutMarketInput
    disconnect?: DeployedPRWhereInput | boolean
    delete?: DeployedPRWhereInput | boolean
    connect?: DeployedPRWhereUniqueInput
    update?: XOR<XOR<DeployedPRUpdateToOneWithWhereWithoutMarketInput, DeployedPRUpdateWithoutMarketInput>, DeployedPRUncheckedUpdateWithoutMarketInput>
  }

  export type MarketCreateNestedOneWithoutPrRecordInput = {
    create?: XOR<MarketCreateWithoutPrRecordInput, MarketUncheckedCreateWithoutPrRecordInput>
    connectOrCreate?: MarketCreateOrConnectWithoutPrRecordInput
    connect?: MarketWhereUniqueInput
  }

  export type MarketUpdateOneWithoutPrRecordNestedInput = {
    create?: XOR<MarketCreateWithoutPrRecordInput, MarketUncheckedCreateWithoutPrRecordInput>
    connectOrCreate?: MarketCreateOrConnectWithoutPrRecordInput
    upsert?: MarketUpsertWithoutPrRecordInput
    disconnect?: MarketWhereInput | boolean
    delete?: MarketWhereInput | boolean
    connect?: MarketWhereUniqueInput
    update?: XOR<XOR<MarketUpdateToOneWithWhereWithoutPrRecordInput, MarketUpdateWithoutPrRecordInput>, MarketUncheckedUpdateWithoutPrRecordInput>
  }

  export type MarketCreateNestedOneWithoutResolutionLogsInput = {
    create?: XOR<MarketCreateWithoutResolutionLogsInput, MarketUncheckedCreateWithoutResolutionLogsInput>
    connectOrCreate?: MarketCreateOrConnectWithoutResolutionLogsInput
    connect?: MarketWhereUniqueInput
  }

  export type MarketUpdateOneRequiredWithoutResolutionLogsNestedInput = {
    create?: XOR<MarketCreateWithoutResolutionLogsInput, MarketUncheckedCreateWithoutResolutionLogsInput>
    connectOrCreate?: MarketCreateOrConnectWithoutResolutionLogsInput
    upsert?: MarketUpsertWithoutResolutionLogsInput
    connect?: MarketWhereUniqueInput
    update?: XOR<XOR<MarketUpdateToOneWithWhereWithoutResolutionLogsInput, MarketUpdateWithoutResolutionLogsInput>, MarketUncheckedUpdateWithoutResolutionLogsInput>
  }

  export type AgentCycleCreateerrorsInput = {
    set: string[]
  }

  export type AgentCycleUpdateerrorsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumResolutionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ResolutionType | EnumResolutionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ResolutionType[] | ListEnumResolutionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ResolutionType[] | ListEnumResolutionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumResolutionTypeFilter<$PrismaModel> | $Enums.ResolutionType
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumMarketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketStatus | EnumMarketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MarketStatus[] | ListEnumMarketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MarketStatus[] | ListEnumMarketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMarketStatusFilter<$PrismaModel> | $Enums.MarketStatus
  }

  export type NestedEnumOutcomeFilter<$PrismaModel = never> = {
    equals?: $Enums.Outcome | EnumOutcomeFieldRefInput<$PrismaModel>
    in?: $Enums.Outcome[] | ListEnumOutcomeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Outcome[] | ListEnumOutcomeFieldRefInput<$PrismaModel>
    not?: NestedEnumOutcomeFilter<$PrismaModel> | $Enums.Outcome
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumResolutionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ResolutionType | EnumResolutionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ResolutionType[] | ListEnumResolutionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ResolutionType[] | ListEnumResolutionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumResolutionTypeWithAggregatesFilter<$PrismaModel> | $Enums.ResolutionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumResolutionTypeFilter<$PrismaModel>
    _max?: NestedEnumResolutionTypeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumMarketStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MarketStatus | EnumMarketStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MarketStatus[] | ListEnumMarketStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MarketStatus[] | ListEnumMarketStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMarketStatusWithAggregatesFilter<$PrismaModel> | $Enums.MarketStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMarketStatusFilter<$PrismaModel>
    _max?: NestedEnumMarketStatusFilter<$PrismaModel>
  }

  export type NestedEnumOutcomeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Outcome | EnumOutcomeFieldRefInput<$PrismaModel>
    in?: $Enums.Outcome[] | ListEnumOutcomeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Outcome[] | ListEnumOutcomeFieldRefInput<$PrismaModel>
    not?: NestedEnumOutcomeWithAggregatesFilter<$PrismaModel> | $Enums.Outcome
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOutcomeFilter<$PrismaModel>
    _max?: NestedEnumOutcomeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ResolutionLogCreateWithoutMarketInput = {
    id?: string
    attemptNumber: number
    resolverType: string
    rawResponse?: NullableJsonNullValueInput | InputJsonValue
    decision: string
    reasoning?: string | null
    txHash?: string | null
    blockNumber?: number | null
    error?: string | null
    attemptedAt?: Date | string
  }

  export type ResolutionLogUncheckedCreateWithoutMarketInput = {
    id?: string
    attemptNumber: number
    resolverType: string
    rawResponse?: NullableJsonNullValueInput | InputJsonValue
    decision: string
    reasoning?: string | null
    txHash?: string | null
    blockNumber?: number | null
    error?: string | null
    attemptedAt?: Date | string
  }

  export type ResolutionLogCreateOrConnectWithoutMarketInput = {
    where: ResolutionLogWhereUniqueInput
    create: XOR<ResolutionLogCreateWithoutMarketInput, ResolutionLogUncheckedCreateWithoutMarketInput>
  }

  export type ResolutionLogCreateManyMarketInputEnvelope = {
    data: ResolutionLogCreateManyMarketInput | ResolutionLogCreateManyMarketInput[]
    skipDuplicates?: boolean
  }

  export type DeployedPRCreateWithoutMarketInput = {
    id?: string
    prNumber: number
    prTitle: string
    prUrl?: string | null
    mergedAt?: Date | string | null
    tssScore?: number | null
    deployedAt?: Date | string
    repoName?: string | null
  }

  export type DeployedPRUncheckedCreateWithoutMarketInput = {
    id?: string
    prNumber: number
    prTitle: string
    prUrl?: string | null
    mergedAt?: Date | string | null
    tssScore?: number | null
    deployedAt?: Date | string
    repoName?: string | null
  }

  export type DeployedPRCreateOrConnectWithoutMarketInput = {
    where: DeployedPRWhereUniqueInput
    create: XOR<DeployedPRCreateWithoutMarketInput, DeployedPRUncheckedCreateWithoutMarketInput>
  }

  export type ResolutionLogUpsertWithWhereUniqueWithoutMarketInput = {
    where: ResolutionLogWhereUniqueInput
    update: XOR<ResolutionLogUpdateWithoutMarketInput, ResolutionLogUncheckedUpdateWithoutMarketInput>
    create: XOR<ResolutionLogCreateWithoutMarketInput, ResolutionLogUncheckedCreateWithoutMarketInput>
  }

  export type ResolutionLogUpdateWithWhereUniqueWithoutMarketInput = {
    where: ResolutionLogWhereUniqueInput
    data: XOR<ResolutionLogUpdateWithoutMarketInput, ResolutionLogUncheckedUpdateWithoutMarketInput>
  }

  export type ResolutionLogUpdateManyWithWhereWithoutMarketInput = {
    where: ResolutionLogScalarWhereInput
    data: XOR<ResolutionLogUpdateManyMutationInput, ResolutionLogUncheckedUpdateManyWithoutMarketInput>
  }

  export type ResolutionLogScalarWhereInput = {
    AND?: ResolutionLogScalarWhereInput | ResolutionLogScalarWhereInput[]
    OR?: ResolutionLogScalarWhereInput[]
    NOT?: ResolutionLogScalarWhereInput | ResolutionLogScalarWhereInput[]
    id?: StringFilter<"ResolutionLog"> | string
    marketId?: StringFilter<"ResolutionLog"> | string
    attemptNumber?: IntFilter<"ResolutionLog"> | number
    resolverType?: StringFilter<"ResolutionLog"> | string
    rawResponse?: JsonNullableFilter<"ResolutionLog">
    decision?: StringFilter<"ResolutionLog"> | string
    reasoning?: StringNullableFilter<"ResolutionLog"> | string | null
    txHash?: StringNullableFilter<"ResolutionLog"> | string | null
    blockNumber?: IntNullableFilter<"ResolutionLog"> | number | null
    error?: StringNullableFilter<"ResolutionLog"> | string | null
    attemptedAt?: DateTimeFilter<"ResolutionLog"> | Date | string
  }

  export type DeployedPRUpsertWithoutMarketInput = {
    update: XOR<DeployedPRUpdateWithoutMarketInput, DeployedPRUncheckedUpdateWithoutMarketInput>
    create: XOR<DeployedPRCreateWithoutMarketInput, DeployedPRUncheckedCreateWithoutMarketInput>
    where?: DeployedPRWhereInput
  }

  export type DeployedPRUpdateToOneWithWhereWithoutMarketInput = {
    where?: DeployedPRWhereInput
    data: XOR<DeployedPRUpdateWithoutMarketInput, DeployedPRUncheckedUpdateWithoutMarketInput>
  }

  export type DeployedPRUpdateWithoutMarketInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: IntFieldUpdateOperationsInput | number
    prTitle?: StringFieldUpdateOperationsInput | string
    prUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mergedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    deployedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repoName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DeployedPRUncheckedUpdateWithoutMarketInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: IntFieldUpdateOperationsInput | number
    prTitle?: StringFieldUpdateOperationsInput | string
    prUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mergedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    deployedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repoName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MarketCreateWithoutPrRecordInput = {
    id?: string
    onchainMarketId?: number | null
    transactionHash?: string | null
    blockNumber?: number | null
    contractAddress?: string | null
    title: string
    question: string
    category: string
    options?: MarketCreateoptionsInput | string[]
    agentReason: string
    resolutionType: $Enums.ResolutionType
    dataSourceUrl: string
    evaluationLogic: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: number | null
    sourcePrUrl?: string | null
    tssScore?: number | null
    status?: $Enums.MarketStatus
    outcome?: $Enums.Outcome
    resolvedAt?: Date | string | null
    resolutionTxHash?: string | null
    resolutionNote?: string | null
    initialLiquidityEth?: number | null
    resolutionDeadline?: Date | string | null
    resolveAttempts?: number
    lastAttemptAt?: Date | string | null
    nextRetryAt?: Date | string | null
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolutionLogs?: ResolutionLogCreateNestedManyWithoutMarketInput
  }

  export type MarketUncheckedCreateWithoutPrRecordInput = {
    id?: string
    onchainMarketId?: number | null
    transactionHash?: string | null
    blockNumber?: number | null
    contractAddress?: string | null
    title: string
    question: string
    category: string
    options?: MarketCreateoptionsInput | string[]
    agentReason: string
    resolutionType: $Enums.ResolutionType
    dataSourceUrl: string
    evaluationLogic: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: number | null
    sourcePrUrl?: string | null
    tssScore?: number | null
    status?: $Enums.MarketStatus
    outcome?: $Enums.Outcome
    resolvedAt?: Date | string | null
    resolutionTxHash?: string | null
    resolutionNote?: string | null
    initialLiquidityEth?: number | null
    resolutionDeadline?: Date | string | null
    resolveAttempts?: number
    lastAttemptAt?: Date | string | null
    nextRetryAt?: Date | string | null
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolutionLogs?: ResolutionLogUncheckedCreateNestedManyWithoutMarketInput
  }

  export type MarketCreateOrConnectWithoutPrRecordInput = {
    where: MarketWhereUniqueInput
    create: XOR<MarketCreateWithoutPrRecordInput, MarketUncheckedCreateWithoutPrRecordInput>
  }

  export type MarketUpsertWithoutPrRecordInput = {
    update: XOR<MarketUpdateWithoutPrRecordInput, MarketUncheckedUpdateWithoutPrRecordInput>
    create: XOR<MarketCreateWithoutPrRecordInput, MarketUncheckedCreateWithoutPrRecordInput>
    where?: MarketWhereInput
  }

  export type MarketUpdateToOneWithWhereWithoutPrRecordInput = {
    where?: MarketWhereInput
    data: XOR<MarketUpdateWithoutPrRecordInput, MarketUncheckedUpdateWithoutPrRecordInput>
  }

  export type MarketUpdateWithoutPrRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    onchainMarketId?: NullableIntFieldUpdateOperationsInput | number | null
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    options?: MarketUpdateoptionsInput | string[]
    agentReason?: StringFieldUpdateOperationsInput | string
    resolutionType?: EnumResolutionTypeFieldUpdateOperationsInput | $Enums.ResolutionType
    dataSourceUrl?: StringFieldUpdateOperationsInput | string
    evaluationLogic?: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sourcePrUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus
    outcome?: EnumOutcomeFieldUpdateOperationsInput | $Enums.Outcome
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolutionTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    resolutionNote?: NullableStringFieldUpdateOperationsInput | string | null
    initialLiquidityEth?: NullableFloatFieldUpdateOperationsInput | number | null
    resolutionDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolveAttempts?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextRetryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolutionLogs?: ResolutionLogUpdateManyWithoutMarketNestedInput
  }

  export type MarketUncheckedUpdateWithoutPrRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    onchainMarketId?: NullableIntFieldUpdateOperationsInput | number | null
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    options?: MarketUpdateoptionsInput | string[]
    agentReason?: StringFieldUpdateOperationsInput | string
    resolutionType?: EnumResolutionTypeFieldUpdateOperationsInput | $Enums.ResolutionType
    dataSourceUrl?: StringFieldUpdateOperationsInput | string
    evaluationLogic?: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sourcePrUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus
    outcome?: EnumOutcomeFieldUpdateOperationsInput | $Enums.Outcome
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolutionTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    resolutionNote?: NullableStringFieldUpdateOperationsInput | string | null
    initialLiquidityEth?: NullableFloatFieldUpdateOperationsInput | number | null
    resolutionDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolveAttempts?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextRetryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolutionLogs?: ResolutionLogUncheckedUpdateManyWithoutMarketNestedInput
  }

  export type MarketCreateWithoutResolutionLogsInput = {
    id?: string
    onchainMarketId?: number | null
    transactionHash?: string | null
    blockNumber?: number | null
    contractAddress?: string | null
    title: string
    question: string
    category: string
    options?: MarketCreateoptionsInput | string[]
    agentReason: string
    resolutionType: $Enums.ResolutionType
    dataSourceUrl: string
    evaluationLogic: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: number | null
    sourcePrUrl?: string | null
    tssScore?: number | null
    status?: $Enums.MarketStatus
    outcome?: $Enums.Outcome
    resolvedAt?: Date | string | null
    resolutionTxHash?: string | null
    resolutionNote?: string | null
    initialLiquidityEth?: number | null
    resolutionDeadline?: Date | string | null
    resolveAttempts?: number
    lastAttemptAt?: Date | string | null
    nextRetryAt?: Date | string | null
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    prRecord?: DeployedPRCreateNestedOneWithoutMarketInput
  }

  export type MarketUncheckedCreateWithoutResolutionLogsInput = {
    id?: string
    onchainMarketId?: number | null
    transactionHash?: string | null
    blockNumber?: number | null
    contractAddress?: string | null
    title: string
    question: string
    category: string
    options?: MarketCreateoptionsInput | string[]
    agentReason: string
    resolutionType: $Enums.ResolutionType
    dataSourceUrl: string
    evaluationLogic: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: number | null
    sourcePrUrl?: string | null
    tssScore?: number | null
    status?: $Enums.MarketStatus
    outcome?: $Enums.Outcome
    resolvedAt?: Date | string | null
    resolutionTxHash?: string | null
    resolutionNote?: string | null
    initialLiquidityEth?: number | null
    resolutionDeadline?: Date | string | null
    resolveAttempts?: number
    lastAttemptAt?: Date | string | null
    nextRetryAt?: Date | string | null
    lastError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    prRecord?: DeployedPRUncheckedCreateNestedOneWithoutMarketInput
  }

  export type MarketCreateOrConnectWithoutResolutionLogsInput = {
    where: MarketWhereUniqueInput
    create: XOR<MarketCreateWithoutResolutionLogsInput, MarketUncheckedCreateWithoutResolutionLogsInput>
  }

  export type MarketUpsertWithoutResolutionLogsInput = {
    update: XOR<MarketUpdateWithoutResolutionLogsInput, MarketUncheckedUpdateWithoutResolutionLogsInput>
    create: XOR<MarketCreateWithoutResolutionLogsInput, MarketUncheckedCreateWithoutResolutionLogsInput>
    where?: MarketWhereInput
  }

  export type MarketUpdateToOneWithWhereWithoutResolutionLogsInput = {
    where?: MarketWhereInput
    data: XOR<MarketUpdateWithoutResolutionLogsInput, MarketUncheckedUpdateWithoutResolutionLogsInput>
  }

  export type MarketUpdateWithoutResolutionLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    onchainMarketId?: NullableIntFieldUpdateOperationsInput | number | null
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    options?: MarketUpdateoptionsInput | string[]
    agentReason?: StringFieldUpdateOperationsInput | string
    resolutionType?: EnumResolutionTypeFieldUpdateOperationsInput | $Enums.ResolutionType
    dataSourceUrl?: StringFieldUpdateOperationsInput | string
    evaluationLogic?: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sourcePrUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus
    outcome?: EnumOutcomeFieldUpdateOperationsInput | $Enums.Outcome
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolutionTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    resolutionNote?: NullableStringFieldUpdateOperationsInput | string | null
    initialLiquidityEth?: NullableFloatFieldUpdateOperationsInput | number | null
    resolutionDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolveAttempts?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextRetryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prRecord?: DeployedPRUpdateOneWithoutMarketNestedInput
  }

  export type MarketUncheckedUpdateWithoutResolutionLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    onchainMarketId?: NullableIntFieldUpdateOperationsInput | number | null
    transactionHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    options?: MarketUpdateoptionsInput | string[]
    agentReason?: StringFieldUpdateOperationsInput | string
    resolutionType?: EnumResolutionTypeFieldUpdateOperationsInput | $Enums.ResolutionType
    dataSourceUrl?: StringFieldUpdateOperationsInput | string
    evaluationLogic?: JsonNullValueInput | InputJsonValue
    sourcePrNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sourcePrUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tssScore?: NullableFloatFieldUpdateOperationsInput | number | null
    status?: EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus
    outcome?: EnumOutcomeFieldUpdateOperationsInput | $Enums.Outcome
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolutionTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    resolutionNote?: NullableStringFieldUpdateOperationsInput | string | null
    initialLiquidityEth?: NullableFloatFieldUpdateOperationsInput | number | null
    resolutionDeadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolveAttempts?: IntFieldUpdateOperationsInput | number
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextRetryAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prRecord?: DeployedPRUncheckedUpdateOneWithoutMarketNestedInput
  }

  export type ResolutionLogCreateManyMarketInput = {
    id?: string
    attemptNumber: number
    resolverType: string
    rawResponse?: NullableJsonNullValueInput | InputJsonValue
    decision: string
    reasoning?: string | null
    txHash?: string | null
    blockNumber?: number | null
    error?: string | null
    attemptedAt?: Date | string
  }

  export type ResolutionLogUpdateWithoutMarketInput = {
    id?: StringFieldUpdateOperationsInput | string
    attemptNumber?: IntFieldUpdateOperationsInput | number
    resolverType?: StringFieldUpdateOperationsInput | string
    rawResponse?: NullableJsonNullValueInput | InputJsonValue
    decision?: StringFieldUpdateOperationsInput | string
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    attemptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResolutionLogUncheckedUpdateWithoutMarketInput = {
    id?: StringFieldUpdateOperationsInput | string
    attemptNumber?: IntFieldUpdateOperationsInput | number
    resolverType?: StringFieldUpdateOperationsInput | string
    rawResponse?: NullableJsonNullValueInput | InputJsonValue
    decision?: StringFieldUpdateOperationsInput | string
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    attemptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResolutionLogUncheckedUpdateManyWithoutMarketInput = {
    id?: StringFieldUpdateOperationsInput | string
    attemptNumber?: IntFieldUpdateOperationsInput | number
    resolverType?: StringFieldUpdateOperationsInput | string
    rawResponse?: NullableJsonNullValueInput | InputJsonValue
    decision?: StringFieldUpdateOperationsInput | string
    reasoning?: NullableStringFieldUpdateOperationsInput | string | null
    txHash?: NullableStringFieldUpdateOperationsInput | string | null
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    attemptedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}