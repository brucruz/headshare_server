declare namespace NodeJS {
  export interface Counters {
    user: number;
    community: number;
    tag: number;
    post: number;
    media: number;
    product: number;
    card: number;
  }
  export interface Global {
    __COUNTERS__: Counters;
    __MONGO_URI__: string;
    __MONGO_DB_NAME__: string;
  }
}
