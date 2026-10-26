export const round = (num) => {
  const n = Number(num);
  return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
};
