declare namespace NodeJS {
  interface Global {
    __COUNTERS__: {
      user: number;
      post: number;
      community: number;
    };
  }
}
