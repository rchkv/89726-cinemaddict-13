import {MenuItem} from "../const.js";
const {ALL, WATCHLIST, HISTORY, FAVORITES} = MenuItem;

export const filterRules = {
  [ALL]: (film) => film,
  [WATCHLIST]: (film) => film.isWatchList,
  [HISTORY]: (film) => film.isWatched,
  [FAVORITES]: (film) => film.isFavorites
};

const addFilteredFilmsCount = (filter, rule) => {
  return (rule) ? (filter || 0) + 1 : filter || 0;
};

export const getFiltersCount = (films) => {
  if (films.length === 0) {
    return {
      watchlist: 0,
      history: 0,
      favorites: 0
    };
  }

  return films.reduce((filter, film) => {
    filter.watchlist = addFilteredFilmsCount(filter.watchlist, filterRules[WATCHLIST](film));
    filter.history = addFilteredFilmsCount(filter.history, filterRules[HISTORY](film));
    filter.favorites = addFilteredFilmsCount(filter.favorites, filterRules[FAVORITES](film));

    return filter;
  }, {});
};
