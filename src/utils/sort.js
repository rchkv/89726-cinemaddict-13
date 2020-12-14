import dayjs from "dayjs";

export const sortByDate = (films) => {
  return films.sort((a, b) => {
    return dayjs(b.releaseDate) - dayjs(a.releaseDate);
  });
};

export const sortByRating = (films) => {
  return films.sort((a, b) => {
    return b.rating - a.rating;
  });
};
