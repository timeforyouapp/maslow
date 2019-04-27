export const checkFetchState = (fetchState, possibilities) => {
  return possibilities.some(possibility => fetchState === possibility)
};

export default {
    checkFetchState
};