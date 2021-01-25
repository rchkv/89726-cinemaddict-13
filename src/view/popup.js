import SmartView from "./smart.js";
import {createCommentsTemplate} from "./comments.js";
import {formatDurationFromMinutes} from "../utils/common.js";
import dayjs from "dayjs";

const createGenresTemplate = (genres) => {

  const genresList = genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  });

  const genresTitle = (genresList.length > 1) ? `Genres` : `Genre`;

  return (`<tr class="film-details__row">
    <td class="film-details__term">${genresTitle}</td>
    <td class="film-details__cell">
     ${genresList.join(``)}
    </td>
  </tr>`
  );
};

const createFilmDetailsTemplate = (film) => {
  const {releaseDate, director, writers, actors, duration, country, genres} = film;

  const genresMarkup = createGenresTemplate(genres);

  return (
    `<table class="film-details__table">
  <tr class="film-details__row">
    <td class="film-details__term">Director</td>
    <td class="film-details__cell">${director}</td>
  </tr>
  <tr class="film-details__row">
    <td class="film-details__term">Writers</td>
    <td class="film-details__cell">${writers.join(`, `)}</td>
  </tr>
  <tr class="film-details__row">
    <td class="film-details__term">Actors</td>
    <td class="film-details__cell">${actors.join(`, `)}</td>
  </tr>
  <tr class="film-details__row">
    <td class="film-details__term">Release Date</td>
    <td class="film-details__cell">${dayjs(releaseDate).format(`DD MMMM YYYY`)}</td>
  </tr>
  <tr class="film-details__row">
    <td class="film-details__term">Runtime</td>
    <td class="film-details__cell">${formatDurationFromMinutes(duration)}</td>
  </tr>
  <tr class="film-details__row">
    <td class="film-details__term">Country</td>
    <td class="film-details__cell">${country}</td>
  </tr>
  ${genresMarkup}
</table>`
  );
};

const createPopUpTemplate = (data) => {
  const {poster, title, originalTitle, rating, description, age, comments, isWatchList, isWatched, isFavorites, isEmoji, emojiName, text, isDisabled} = data;

  const filmDetailsMarkup = createFilmDetailsTemplate(data);
  const commentsMarkup = createCommentsTemplate(comments, isEmoji, emojiName, text, isDisabled);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="${title}">
              <p class="film-details__age">${age}+</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>
              ${filmDetailsMarkup}
              <p class="film-details__film-description">${description}.</p>
            </div>
          </div>
          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchList ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorites ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>
        <div class="form-details__bottom-container">
          ${commentsMarkup}
        </div>
      </form>
    </section>`
  );
};

export default class PopUp extends SmartView {
  constructor(film, emoji, newComment, renderComments) {
    super();
    this._emoji = emoji || {isEmoji: false, emojiName: ``};
    this._newComment = newComment || {text: ``};
    this._data = PopUp.parseFilmToData(film, this._emoji, this._newComment);
    this._comment = null;

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._controlsToggleHandler = this._controlsToggleHandler.bind(this);
    this._emojiToggleHandler = this._emojiToggleHandler.bind(this);
    this._shortcutKeysDownHandler = this._shortcutKeysDownHandler.bind(this);
    this._commentsInputHandler = this._commentsInputHandler.bind(this);

    this._renderComments = renderComments;

    this._commentsContainer = this.getElement().querySelector(`.film-details__comments-list`);

    this._setInnerHandlers();
    this._renderComments(this._commentsContainer);
  }

  reset(film) {
    this._emoji = {isEmoji: false, emojiName: ``};
    this._newComment = {text: ``};
    this.updateData(PopUp.parseFilmToData(film, this._emoji, this._newComment));
  }

  getTemplate() {
    return createPopUpTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._restoreComments();
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setControlsToggleHandler(this._callback.controlsToggle);
    this.setSubmitCommentHandler(this._callback.submitComment);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  _controlsToggleHandler(evt) {
    evt.preventDefault();
    switch (evt.target.id) {
      case `watchlist`:
        this._callback.controlsToggle(Object.assign({}, PopUp.parseDataToFilm(this._data), {isWatchList: evt.target.checked}));
        break;
      case `watched`:
        this._callback.controlsToggle(Object.assign({}, PopUp.parseDataToFilm(this._data), {isWatched: evt.target.checked, watchedDate: new Date()}));
        break;
      case `favorite`:
        this._callback.controlsToggle(Object.assign({}, PopUp.parseDataToFilm(this._data), {isFavorites: evt.target.checked}));
        break;
    }
  }

  _emojiToggleHandler(evt) {
    evt.preventDefault();
    this._emoji = {isEmoji: true, emojiName: evt.target.value};
    this.updateData(this._emoji);
  }

  _commentsInputHandler(evt) {
    evt.preventDefault();
    this._newComment = {text: evt.target.value};
    this.updateData(this._newComment, true);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiToggleHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentsInputHandler);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeButtonClickHandler);
  }

  setControlsToggleHandler(callback) {
    this._callback.controlsToggle = callback;
    this.getElement().querySelector(`.film-details__controls`).addEventListener(`change`, this._controlsToggleHandler);
  }

  _restoreComments() {
    const newCommentsContainer = this.getElement().querySelector(`.film-details__comments-list`);
    this._renderComments(newCommentsContainer);
  }

  restoreNewComment() {
    return this._newComment;
  }

  restoreEmoji() {
    return this._emoji;
  }

  _createComment() {
    if (!this._emoji.emojiName || !this._newComment.text) {
      throw new Error(`Can't create comment`);
    }

    this._comment = {
      emoji: this._emoji.emojiName,
      text: this._newComment.text,
      day: new Date()
    };
  }

  _shortcutKeysDownHandler(evt) {
    if (evt.code === `Enter` && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      this._newComment = {text: evt.target.value};
      this.updateData(this._newComment, true);
      this._createComment();
      this._callback.submitComment(this._commentsContainer, this._comment);
    }
  }

  setSubmitCommentHandler(callback) {
    this._callback.submitComment = callback;
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._shortcutKeysDownHandler);
  }

  static parseFilmToData(film, emoji, comment) {
    return Object.assign({}, film, emoji, comment, {isDisabled: false});
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete data.isEmoji;
    delete data.emojiName;
    delete data.text;
    delete data.isDisabled;

    return data;
  }
}
