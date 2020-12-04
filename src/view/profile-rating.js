import {createElement} from "../utils.js";

const calculateRating = (films) => {
  const isWatchedFilmsCount = films.filter((film) => film.isWatched).length;
  let profileRating = ``;

  if (isWatchedFilmsCount >= 1 && isWatchedFilmsCount < 10) {
    profileRating = `novice`;
  }
  if (isWatchedFilmsCount >= 11 && isWatchedFilmsCount < 20) {
    profileRating = `fan`;
  }
  if (isWatchedFilmsCount >= 21) {
    profileRating = `movie buff`;
  }

  return profileRating;
};

const createProfileRatingTemplate = (films) => {
  const rating = calculateRating(films);

  return `<section class="header__profile profile">
    ${rating !== undefined
    ? `<p class="profile__rating">${rating}</p>`
    : ``
}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class ProfileRating {
  constructor(films) {
    this._element = null;
    this._films = films;
  }

  getTemplate() {
    return createProfileRatingTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
