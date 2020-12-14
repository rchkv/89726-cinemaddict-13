export const getRandomInt = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (a = 0, b = 10) => {
  return (Math.random() * (a - b) + b).toFixed(1);
};

export const getRandomBoolean = () => {
  return Boolean(getRandomInt(0, 1));
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

export const generateUniqueCompilation = (items, limits) => {
  const {MIN, MAX} = limits;
  const count = getRandomInt(MIN, MAX);
  const uniqueValues = new Set();

  for (let i = 0; i < count; i++) {
    uniqueValues.add(getRandomValue(items));
  }

  return Array.from(uniqueValues);
};

export const updateItem = (items, updatedItem) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);

  if (index === -1) {
    return items;
  }

  return [...items.slice(0, index), updatedItem, ...items.slice(index + 1)];
};
