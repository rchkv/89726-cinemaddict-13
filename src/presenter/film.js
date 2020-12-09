import FilmCardView from "../view/film-card.js";
import PopUpView from "../view/popup.js";
import {render, replace, remove} from "../utils/render.js";

const body = document.querySelector(`body`);
const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

const {DEFAULT, POPUP} = Mode;

export default class Film {
  constructor(filmContainer, changeFilm, changeMode) {
    this._filmContainer = filmContainer;
    this._popUpContainer = body;
    this._changeFilm = changeFilm;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._popUpComponent = null;
    this._mode = DEFAULT;

    this._handleFilmDetailsClick = this._handleFilmDetailsClick.bind(this);
    this._handleControlsChange = this._handleControlsChange.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevPopUpComponent = this._popUpComponent;
    this._isPopUpReOpened = false;

    this._filmCardComponent = new FilmCardView(film);
    this._popUpComponent = new PopUpView(film);

    this._filmCardComponent.setFilmDetailsClickHandler(this._handleFilmDetailsClick);
    this._filmCardComponent.setControlsClickHandler(this._handleControlsChange);
    this._popUpComponent.setControlsToggleHandler(this._handleControlsChange);
    this._popUpComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);

    if (prevFilmCardComponent === null || prevPopUpComponent === null) {
      render(this._filmContainer, this._filmCardComponent);
      return;
    }

    if (this._mode === DEFAULT || this._mode === POPUP) {
      replace(prevFilmCardComponent, this._filmCardComponent);
    }

    if (this._mode === POPUP) {
      replace(prevPopUpComponent, this._popUpComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevPopUpComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._popUpComponent);
  }

  resetView() {
    if (this._mode !== DEFAULT) {
      this._closePopUp();
    }
  }

  _openPopUp() {
    render(this._popUpContainer, this._popUpComponent);
    if (this._isPopUpReOpened) {
      this._popUpComponent.restoreHandlers();
    }
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = POPUP;
  }

  _closePopUp() {
    this._isPopUpReOpened = true;
    this._popUpComponent.reset(this._film);
    remove(this._popUpComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = DEFAULT;
  }

  _handleControlsChange(film) {
    this._changeFilm(film);
  }

  _handleFilmDetailsClick() {
    this._openPopUp();
  }

  _handleCloseButtonClick() {
    this._closePopUp();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closePopUp();
    }
  }
}
