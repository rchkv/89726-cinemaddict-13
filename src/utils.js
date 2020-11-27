export const getRandomInt = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (a = 0, b = 10) => {
  return (Math.random() * (a - b) + b).toFixed(2);
};

export const getRandomValue = (list) => {
  const randomIndex = getRandomInt(0, list.length - 1);
  return list[randomIndex];
};

export const generateRandomDate = (start, end) => {
  return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};
