declare namespace NodeJS {
  export interface Counters {
    user: number;
    post: number;
    tag: number;
    community: number;
    product: number;
    card: number;
  }
  export interface Global {
    __COUNTERS__: Counters;
    __MONGO_URI__: string;
    __MONGO_DB_NAME__: string;
  }
}
