import FilmCardView from "../view/film-card.js";
import PopUpView from "../view/popup.js";
import {render, replace, remove} from "../utils/render.js";
import {Mode, UserAction, UpdateType} from "../const.js";
import CommentPresenter from "../presenter/comment.js";

const body = document.querySelector(`body`);

const {DEFAULT, POPUP} = Mode;
const {ADD_COMMENT} = UserAction;
const {PATCH, MINOR} = UpdateType;

export default class Film {
  constructor(filmContainer, changeFilm, changeComment, changeMode, commentsModel) {
    this._filmContainer = filmContainer;
    this._popUpContainer = body;
    this._changeFilm = changeFilm;
    this._changeMode = changeMode;
    this._changeComment = changeComment;
    this._commentsModel = commentsModel;
    this._commentPresenter = {};

    this._filmCardComponent = null;
    this._popUpComponent = null;
    this._mode = DEFAULT;

    this._handlePopUpCommentsRender = this._handlePopUpCommentsRender.bind(this);
    this._handleShortcutKeysDown = this._handleShortcutKeysDown.bind(this);
    this._handleFilmDetailsClick = this._handleFilmDetailsClick.bind(this);
    this._handleControlsChange = this._handleControlsChange.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleToggleChange = this._handleToggleChange.bind(this);

  }

  init(film) {
    this._film = film;
    this._emoji = null;
    this._newComment = null;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevPopUpComponent = this._popUpComponent;

    this._isPopUpReOpened = false;

    if (prevPopUpComponent) {
      this._emoji = prevPopUpComponent.restoreEmoji();
      this._newComment = prevPopUpComponent.restoreNewComment();
    }

    this._filmCardComponent = new FilmCardView(film);
    this._popUpComponent = new PopUpView(film, this._emoji, this._newComment, this._handlePopUpCommentsRender);

    this._filmCardComponent.setFilmDetailsClickHandler(this._handleFilmDetailsClick);
    this._filmCardComponent.setControlsClickHandler(this._handleControlsChange);
    this._popUpComponent.setControlsToggleHandler(this._handleToggleChange);
    this._popUpComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);
    this._popUpComponent.setSubmitCommentHandler(this._handleShortcutKeysDown);

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

  setSaving() {
    this._popUpComponent.updateData({
      isDisabled: true
    });
  }

  setCommentDeleting(commentID) {
    this._commentPresenter[commentID].setDeleting();
  }

  setAborting() {
    const resetState = () => {
      this._popUpComponent.updateData({
        isDisabled: false
      });
    };
    const newCommentForm = this._popUpComponent.getElement().querySelector(`.film-details__new-comment`);
    this._popUpComponent.shake(newCommentForm, resetState);
  }

  setCommentAborting(commentID) {
    this._commentPresenter[commentID].setAborting();
  }

  setUpdateAborting(isPopUp) {
    const resetState = () => {
      if (isPopUp) {
        this._popUpComponent.reset(this._film);
      }
      return;
    };
    if (isPopUp) {
      this._popUpComponent.shake(this._popUpComponent.getElement(), resetState);
    }
    this._filmCardComponent.shake(this._filmCardComponent.getElement(), resetState);
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
    this._changeFilm(MINOR, this._film);
    Object.values(this._commentPresenter).forEach((presenter) => presenter.destroy());
    this._commentPresenter = {};
  }

  _handleControlsChange(film) {
    this._changeFilm(MINOR, film);
  }

  _handleToggleChange(film, popUpUpdate) {
    this._changeFilm(PATCH, film, popUpUpdate);
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

  _handlePopUpCommentsRender(container) {
    const comments = this._commentsModel.getComments()[this._film.id];
    comments.forEach((comment) => {
      let commentPresenter = new CommentPresenter(container, this._film.id, this._changeComment);
      commentPresenter.init(comment);
      this._commentPresenter[comment.id] = commentPresenter;
    });
  }

  _handleShortcutKeysDown(container, newComment) {
    const newCommentPresenter = new CommentPresenter(container, this._film.id, this._changeComment);
    newCommentPresenter.init(newComment);
    this._changeComment(ADD_COMMENT, newComment, this._film.id);
    this._popUpComponent.reset(this._film);
  }
}
