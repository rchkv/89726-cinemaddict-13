import dayjs from "dayjs";

export const Range = {
  ALLTIME: {
    label: `All time`,
    value: `all-time`
  },
  TODAY: {
    label: `Today`,
    value: `day`
  },
  WEEK: {
    label: `Week`,
    value: `week`
  },
  MONTH: {
    label: `Month`,
    value: `month`
  },
  YEAR: {
    label: `Year`,
    value: `year`
  }
};

const {ALLTIME} = Range;

export const getFilmsInRange = (films, range) => {
  if (range === ALLTIME.value) {
    return films;
  }

  const startDate = dayjs().startOf(range);

  return films.filter((film) => dayjs(film.watchedDate).isSame(startDate, `day`) || dayjs(film.watchedDate).isAfter(startDate));
};

export const getTotalDuration = (films) => {
  return films.reduce((total, film) => {
    return (total + film.duration);
  }, 0);
};

export const getGenresCount = (films) => {
  const genres = films.reduce((total, film) => {
    return total.concat(film.genres);
  }, []);

  return genres.reduce((counts, genre) => {
    counts[genre] = (counts[genre] || 0) + 1;
    return counts;
  }, {});
};

export const getTopGenre = (genresCount) => {
  const maximumCount = Object.values(genresCount).reduce((a, b) => a > b ? a : b);

  return Object.keys(genresCount).find((key) => genresCount[key] === maximumCount);
};
