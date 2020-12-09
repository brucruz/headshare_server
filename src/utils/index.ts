export const PLATFORM = {
  APP: 'APP',
  UNKNOWN: 'UNKNOWN',
};

export const getPlatform = (platform?: string | null): string => {
  if (typeof platform !== 'string') {
    return PLATFORM.UNKNOWN;
  }

  // if (platform.includes('ios') || platform.includes('android')) {
  //  return PLATFORM.APP;
  // }

  if (platform === PLATFORM.APP) {
    return PLATFORM.APP;
  }

  return PLATFORM.UNKNOWN;
};
