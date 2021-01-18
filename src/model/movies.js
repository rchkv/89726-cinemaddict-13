import Observer from "../utils/observer.js";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  getWatchedMovies() {
    return this._films.filter((film) => film.isWatched);
  }

  updateFilm(updateType, updatedFilm) {
    const index = this._films.findIndex((film) => film.id === updatedFilm.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      updatedFilm,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, updatedFilm);
  }

  addComment(updateType, newComment, filmID) {
    const index = this._films.findIndex((film) => film.id === filmID);

    if (index === -1) {
      throw new Error(`Can't add comment to unexisting film`);
    }

    this._films[index].comments = [...this._films[index].comments, `${newComment.id}`];
    this.updateFilm(updateType, this._films[index]);
  }

  deleteComment(updateType, deletedComment, filmID) {
    const index = this._films.findIndex((film) => film.id === filmID);

    if (index === -1) {
      throw new Error(`Can't delete comment to unexisting film`);
    }

    this._films[index].comments = this._films[index].comments.filter((comment) => comment !== deletedComment.id);
    this.updateFilm(updateType, this._films[index]);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          poster: film.film_info.poster,
          title: film.film_info.title,
          originalTitle: film.film_info.alternative_title,
          rating: film.film_info.total_rating,
          director: film.film_info.director,
          writers: film.film_info.writers,
          actors: film.film_info.actors,
          releaseDate: new Date(film.film_info.release.date),
          duration: film.film_info.runtime,
          country: film.film_info.release.release_country,
          genres: film.film_info.genre,
          description: film.film_info.description,
          age: film.film_info.age_rating,
          isWatchList: film.user_details.watchlist,
          isWatched: film.user_details.already_watched,
          isFavorites: film.user_details.favorite,
          watchedDate: film.user_details.watching_date !== null ? new Date(film.user_details.watching_date) : film.user_details.watching_date,
        }
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          "film_info": {
            "title": film.title,
            "alternative_title": film.originalTitle,
            "total_rating": film.rating,
            "poster": film.poster,
            "age_rating": film.age,
            "director": film.director,
            "writers": film.writers,
            "actors": film.actors,
            "release": {
              "date": film.releaseDate instanceof Date ? film.releaseDate.toISOString() : null,
              "release_country": film.country
            },
            "runtime": film.duration,
            "genre": film.genres,
            "description": film.description
          },
          "user_details": {
            "watchlist": film.isWatchList,
            "already_watched": film.isWatched,
            "watching_date": film.watchedDate !== null ? film.watchedDate.toISOString() : null,
            "favorite": film.isFavorites
          }
        }
    );

    delete adaptedFilm.title;
    delete adaptedFilm.originalTitle;
    delete adaptedFilm.rating;
    delete adaptedFilm.poster;
    delete adaptedFilm.age;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.date;
    delete adaptedFilm.country;
    delete adaptedFilm.duration;
    delete adaptedFilm.genres;
    delete adaptedFilm.description;
    delete adaptedFilm.isWatchList;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.watchedDate;
    delete adaptedFilm.isFavorites;

    return adaptedFilm;
  }
}
