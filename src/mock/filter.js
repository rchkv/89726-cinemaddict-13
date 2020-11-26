const filmToFilterMap = {
  Watchlist: (films) => films.filter((film) => film.isWatchList).length,
  History: (films) => films.filter((film) => film.isWatched).length,
  Favorites: (films) => films.filter((film) => film.isFavorites).length,
};

export const generateFilter = (films) => {
  return Object.entries(filmToFilterMap).map(([filterName, countfilms]) => {
    return {
      name: filterName,
      count: countfilms(films),
    };
  });
};
