export interface SearchTypeMap {
  [key: string]: {
    [key: string]:
    | {
      $regex: RegExp
    }
    | string
  }
}
