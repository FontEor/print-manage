export const formatPercentage = (number: number) => {
  if (typeof number === 'number') {
    return number + '%';
  }
  return number;
};
