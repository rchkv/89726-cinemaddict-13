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

    this._films[index].comments = [...this._films[index].comments, newComment];
    this.updateFilm(updateType, this._films[index]);
  }

  deleteComment(updateType, deletedComment, filmID) {
    const index = this._films.findIndex((film) => film.id === filmID);

    if (index === -1) {
      throw new Error(`Can't delete comment to unexisting film`);
    }

    this._films[index].comments = this._films[index].comments.filter((comment) => comment.id !== deletedComment.id);
    this.updateFilm(updateType, this._films[index]);
  }

  static adaptToClient(film) {
    const {film_info, user_details} = film;
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          poster: film_info.poster,
          title: film_info.title,
          originalTitle: film_info.alternative_title,
          rating: film_info.total_rating,
          director: film_info.director,
          writers: film_info.writers,
          actors: film_info.actors,
          releaseDate: new Date(film_info.release.date),
          duration: film_info.runtime,
          country: film_info.release.release_country,
          genres: film_info.genre,
          description: film_info.description,
          age: film_info.age_rating,
          isWatchList: user_details.watchlist,
          isWatched: user_details.already_watched,
          isFavorites: user_details.favorite,
          watchedDate: user_details.watching_date !== null ? new Date(user_details.watching_date) : user_details.watching_date,
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
