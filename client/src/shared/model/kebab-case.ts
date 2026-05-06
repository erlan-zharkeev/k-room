type KebabCaseTailType<T extends string> = T extends `${infer Head}${infer Tail}`
  ? Head extends Lowercase<Head>
    ? `${Head}${KebabCaseTailType<Tail>}`
    : `-${Lowercase<Head>}${KebabCaseTailType<Tail>}`
  : T

export type KebabCaseType<T extends string> = T extends `${infer Head}${infer Tail}`
  ? `${Lowercase<Head>}${KebabCaseTailType<Tail>}`
  : T
