export const ema = (prev: number, curr: number, alpha: number) =>
  alpha * curr + (1 - alpha) * prev;