export const calculateSum = (data: number[]): number => {
  return data.reduce((acc, val) => acc + val, 0);
};

export const calculateMean = (data: number[]): number => {
  if (data.length === 0) return 0;
  return calculateSum(data) / data.length;
};

export const calculateDeviations = (data: number[]): number[] => {
  const mean = calculateMean(data);
  return data.map((val) => val - mean);
};

export const calculateVariance = (data: number[]): number => {
  if (data.length === 0) return 0;
  const deviations = calculateDeviations(data);
  const squaredDeviations = deviations.map((d) => d * d);
  return calculateSum(squaredDeviations) / data.length; // Population variance
};

export const calculateStdDev = (data: number[]): number => {
  return Math.sqrt(calculateVariance(data));
};
