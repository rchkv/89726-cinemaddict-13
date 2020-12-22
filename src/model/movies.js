import Observer from "../utils/observer.js";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
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

    this._notify(updatedFilm, updateType);
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
}
