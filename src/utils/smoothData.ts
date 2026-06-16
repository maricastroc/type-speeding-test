/* eslint-disable @typescript-eslint/no-explicit-any */
export const smoothData = <T extends Record<string, any>>(
  data: T[],
  windowSize: number
): T[] => {
  if (!data.length || windowSize <= 1) return data;

  const result: T[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.floor(windowSize / 2) + 1);
    const window = data.slice(start, end);

    const smoothedPoint = { ...data[i] } as T;

    Object.keys(data[i]).forEach((key) => {
      const value = data[i][key];

      if (
        key === 'second' ||
        key === 'errors' ||
        value === null ||
        value === undefined
      ) {
        return;
      }

      if (typeof value === 'number') {
        const sum = window.reduce((acc, item) => {
          const itemValue = item[key];
          return (
            acc +
            (typeof itemValue === 'number' && !isNaN(itemValue) ? itemValue : 0)
          );
        }, 0);

        const avg = sum / window.length;

        smoothedPoint[key as keyof T] = (
          Number.isFinite(avg) ? Math.round(avg) : 0
        ) as any;
      }
    });

    result.push(smoothedPoint);
  }

  return result;
};
