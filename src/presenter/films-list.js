import FilmPresenter from "./film.js";
import FilmsView from "../view/films.js";
import NoFilmsView from "../view/no-films.js";
import AllFilmsView from "../view/all-films.js";
import TopRatedFilmsView from "../view/top-rated-films.js";
import MostCommentedFilmsView from "../view/most-commented-films.js";
import FilmsListView from "../view/films-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import SortView from "../view/sort.js";
import LoadingView from "../view/loading.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {filterRules} from "../utils/filter.js";
import {sortByRating, sortByDate, sortByCommentCount} from "../utils/sort.js";
import {FilmsType, SortType, UserAction, UpdateType} from "../const.js";

const {AFTERBEGIN, BEFORE} = RenderPosition;
const {ALL, RATED, COMMENTED} = FilmsType;
const {DEFAULT, DATE, RATING} = SortType;
const {ADD_COMMENT, DELETE_COMMENT} = UserAction;
const {PATCH, MINOR, MAJOR, INIT} = UpdateType;
const EXTRA_FILM_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

export default class FilmsList {
  constructor(filmListContainer, filmsModel, commentsModel, filterModel, api) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._filmListContainer = filmListContainer;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._allFilmPresenter = {};
    this._ratedFilmPresenter = {};
    this._commentedFilmPresenter = {};
    this._currentSortType = DEFAULT;
    this._isLoading = true;
    this._api = api;

    this._showButtonComponent = null;
    this._sortComponent = null;

    this._filmListComponent = new FilmsView();
    this._sortComponent = new SortView();
    this._noFilmsComponent = new NoFilmsView();
    this._allFilmsComponent = new AllFilmsView();
    this._topRatedComponent = new TopRatedFilmsView();
    this._mostCommentedComponent = new MostCommentedFilmsView();
    this._allFilmsListComponent = new FilmsListView();
    this._topRatedListComponent = new FilmsListView();
    this._mostCommentedListComponent = new FilmsListView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowButtonClick = this._handleShowButtonClick.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
    this._handleCommentsViewAction = this._handleCommentsViewAction.bind(this);
  }

  init() {
    render(this._filmListContainer, this._filmListComponent);
    this._renderFilmsList();

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearAllFilmsList({resetRenderedFilmsCount: true, resetSortType: true});
    remove(this._filmListComponent);
    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    const currentFilter = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = films.filter((film) => filterRules[currentFilter](film));

    switch (this._currentSortType) {
      case DATE:
        return sortByDate(filteredFilms.slice());
      case RATING:
        return sortByRating(filteredFilms.slice());
    }
    return filteredFilms;
  }

  _getTopRatedFilms() {
    return sortByRating(this._filmsModel.getFilms().slice());
  }

  _getMostCommentedFilms() {
    return sortByCommentCount(this._filmsModel.getFilms().slice());
  }

  _handleModeChange() {
    Object.values(this._allFilmPresenter).forEach((presenter) => presenter.resetView());
    Object.values(this._ratedFilmPresenter).forEach((presenter) => presenter.resetView());
    Object.values(this._commentedFilmPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(updateType, updatedData, isPopUp) {
    this._api.updateMovie(updatedData).then((response) => {
      this._filmsModel.updateFilm(updateType, response);
    })
    .catch(() => {
      if (this._allFilmPresenter[updatedData.id]) {
        this._allFilmPresenter[updatedData.id].setUpdateAborting(isPopUp);
      }
      if (this._ratedFilmPresenter[updatedData.id]) {
        this._ratedFilmPresenter[updatedData.id].setUpdateAborting(isPopUp);
      }
      if (this._commentedFilmPresenter[updatedData.id]) {
        this._commentedFilmPresenter[updatedData.id].setUpdateAborting(isPopUp);
      }
    });
  }

  _handleCommentsViewAction(actionType, updatedData, filmID) {
    switch (actionType) {
      case ADD_COMMENT:
        if (this._allFilmPresenter[filmID]) {
          this._allFilmPresenter[filmID].setSaving();
        }
        if (this._ratedFilmPresenter[filmID]) {
          this._ratedFilmPresenter[filmID].setSaving();
        }
        if (this._commentedFilmPresenter[filmID]) {
          this._commentedFilmPresenter[filmID].setSaving();
        }
        this._api.addComment(updatedData, filmID).then((response) => {
          this._commentsModel.addComment(response, filmID);
          this._filmsModel.addComment(PATCH, response, filmID);
        })
      .catch(() => {
        if (this._allFilmPresenter[filmID]) {
          this._allFilmPresenter[filmID].setAborting();
        }
        if (this._ratedFilmPresenter[filmID]) {
          this._ratedFilmPresenter[filmID].setAborting();
        }
        if (this._commentedFilmPresenter[filmID]) {
          this._commentedFilmPresenter[filmID].setAborting();
        }
      });
        break;
      case DELETE_COMMENT:
        if (this._allFilmPresenter[filmID]) {
          this._allFilmPresenter[filmID].setCommentDeleting(updatedData.id);
        }
        if (this._ratedFilmPresenter[filmID]) {
          this._ratedFilmPresenter[filmID].setCommentDeleting(updatedData.id);
        }
        if (this._commentedFilmPresenter[filmID]) {
          this._commentedFilmPresenter[filmID].setCommentDeleting(updatedData.id);
        }
        this._api.deleteComment(updatedData).then(() => {
          this._commentsModel.deleteComment(updatedData, filmID);
          this._filmsModel.deleteComment(PATCH, updatedData, filmID);
        })
      .catch(() => {
        if (this._allFilmPresenter[filmID]) {
          this._allFilmPresenter[filmID].setCommentAborting(updatedData.id);
        }
        if (this._ratedFilmPresenter[filmID]) {
          this._ratedFilmPresenter[filmID].setCommentAborting(updatedData.id);
        }
        if (this._commentedFilmPresenter[filmID]) {
          this._commentedFilmPresenter[filmID].setCommentAborting(updatedData.id);
        }
      });
        break;
    }
  }

  _handleModelEvent(updateType, updatedFilm) {
    switch (updateType) {
      case PATCH:
        if (this._allFilmPresenter[updatedFilm.id]) {
          this._allFilmPresenter[updatedFilm.id].init(updatedFilm);
        }
        if (this._ratedFilmPresenter[updatedFilm.id]) {
          this._ratedFilmPresenter[updatedFilm.id].init(updatedFilm);
        }
        if (this._commentedFilmPresenter[updatedFilm.id]) {
          this._commentedFilmPresenter[updatedFilm.id].init(updatedFilm);
        }
        break;
      case MINOR:
        this._clearAllFilmsList();
        this._renderFilmsList();
        break;
      case MAJOR:
        this._clearAllFilmsList({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderFilmsList();
        break;
      case INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsList();
        break;
    }
  }

  _renderFilmCard(container, film, type) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleCommentsViewAction, this._handleModeChange, this._commentsModel);
    filmPresenter.init(film);
    switch (type) {
      case ALL:
        this._allFilmPresenter[film.id] = filmPresenter;
        break;
      case RATED:
        this._ratedFilmPresenter[film.id] = filmPresenter;
        break;
      case COMMENTED:
        this._commentedFilmPresenter[film.id] = filmPresenter;
        break;
    }
  }

  _renderFilmCards(container, films, type) {
    films.forEach((film) => this._renderFilmCard(container, film, type));
  }

  _renderLoading() {
    render(this._filmListComponent, this._loadingComponent, AFTERBEGIN);
  }

  _renderNoFilms() {
    render(this._filmListComponent, this._noFilmsComponent, AFTERBEGIN);
  }

  _renderAllFilmsList() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, this._renderedFilmsCount));

    this._renderFilmCards(this._allFilmsListComponent, films, ALL);
    render(this._allFilmsComponent, this._allFilmsListComponent);

    if (filmCount > this._renderedFilmsCount) {
      this._renderShowButton();
    }
  }

  _renderTopRatedList() {
    const films = this._getTopRatedFilms().slice(0, EXTRA_FILM_COUNT);

    this._renderFilmCards(this._topRatedListComponent, films, RATED);
    render(this._topRatedComponent, this._topRatedListComponent);
  }

  _renderMostCommentedList() {
    const films = this._getMostCommentedFilms().slice(0, EXTRA_FILM_COUNT);

    this._renderFilmCards(this._mostCommentedListComponent, films, COMMENTED);
    render(this._mostCommentedComponent, this._mostCommentedListComponent);
  }

  _handleShowButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);

    this._renderFilmCards(this._allFilmsListComponent, films, ALL);
    this._renderedFilmsCount = newRenderedFilmCount;

    if (this._renderedFilmsCount >= filmCount) {
      remove(this._showButtonComponent);
    }
  }

  _renderShowButton() {
    if (this._showButtonComponent !== null) {
      this._showButtonComponent = null;
    }

    this._showButtonComponent = new ShowMoreButtonView();
    render(this._allFilmsComponent, this._showButtonComponent);
    this._showButtonComponent.setShowButtonClickHandler(this._handleShowButtonClick);
  }

  _renderAllMovies() {
    this._renderAllFilmsList();
    render(this._filmListComponent, this._allFilmsComponent);
  }

  _renderTopRated() {
    this._renderTopRatedList();
    render(this._filmListComponent, this._topRatedComponent);
  }

  _renderMostCommented() {
    this._renderMostCommentedList();
    render(this._filmListComponent, this._mostCommentedComponent);
  }

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearAllFilmsList({resetAllMoviesOnly: true, resetRenderedFilmsCount: true});
    this._renderSort();
    this._renderAllFilmsList();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortChange);
    render(this._filmListContainer, this._sortComponent, BEFORE, this._filmListComponent);
  }

  _clearAllFilmsList({resetAllMoviesOnly = false, resetRenderedFilmsCount = false, resetSortType = false} = {}) {

    Object.values(this._allFilmPresenter).forEach((presenter) => presenter.destroy());
    this._allFilmPresenter = {};

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    }

    remove(this._sortComponent);
    remove(this._showButtonComponent);

    if (resetAllMoviesOnly) {
      return;
    }

    Object.values(this._ratedFilmPresenter).forEach((presenter) => presenter.destroy());
    Object.values(this._commentedFilmPresenter).forEach((presenter) => presenter.destroy());

    this._ratedFilmPresenter = {};
    this._commentedFilmPresenter = {};

    remove(this._noFilmsComponent);
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = DEFAULT;
    }
  }

  _renderFilmsList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getFilms().length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    this._renderAllMovies();
    this._renderTopRated();
    this._renderMostCommented();
  }
}
