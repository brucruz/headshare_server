declare namespace NodeJS {
  export interface Global {
    __COUNTERS__: {
      user: number;
      post: number;
      community: number;
    };
    __MONGO_URI__: string;
    __MONGO_DB_NAME__: string;
  }
}
