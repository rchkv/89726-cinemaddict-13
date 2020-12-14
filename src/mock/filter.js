const addFilteredFilmsCount = (filter, check) => {
  return (check) ? (filter || 0) + 1 : filter || 0;
};

export const generateFilters = (films) => {
  if (films.length === 0) {
    return {
      watchlist: 0,
      history: 0,
      favorites: 0
    };
  }

  return films.reduce((filter, film) => {
    filter.watchlist = addFilteredFilmsCount(filter.watchlist, film.isWatchList);
    filter.history = addFilteredFilmsCount(filter.history, film.isWatched);
    filter.favorites = addFilteredFilmsCount(filter.favorites, film.isFavorites);

    return filter;
  }, {});
};
