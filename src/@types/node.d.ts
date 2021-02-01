declare namespace NodeJS {
  export interface Global {
    __COUNTERS__: {
      user: number;
      post: number;
      community: number;
    };
  }
}
