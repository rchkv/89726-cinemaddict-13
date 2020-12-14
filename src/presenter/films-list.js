import FilmPresenter from "./film.js";
import FilmsView from "../view/films.js";
import NoFilmsView from "../view/no-films.js";
import AllFilmsView from "../view/all-films.js";
import TopRatedFilmsView from "../view/top-rated-films.js";
import MostCommentedFilmsView from "../view/most-commented-films.js";
import FilmsListView from "../view/films-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import SortView from "../view/sort.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import {sortByRating, sortByDate} from "../utils/sort.js";
import {getMostCommentedFilms, getTopRatedFilms} from "../mock/film.js";
import {FilmsType, SortType} from "../const.js";

const {AFTERBEGIN} = RenderPosition;
const {ALL, RATED, COMMENTED} = FilmsType;
const {DEFAULT, DATE, RATING} = SortType;
const EXTRA_FILM_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

export default class MovieList {
  constructor(filmListContainer) {
    this._filmListContainer = filmListContainer;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._allFilmPresenter = {};
    this._ratedFilmPresenter = {};
    this._commentedFilmPresenter = {};
    this._currentSortType = DEFAULT;

    this._filmListComponent = new FilmsView();
    this._noFilmsComponent = new NoFilmsView();
    this._allFilmsComponent = new AllFilmsView();
    this._topRatedComponent = new TopRatedFilmsView();
    this._mostCommentedComponent = new MostCommentedFilmsView();
    this._allFilmsListComponent = new FilmsListView();
    this._topRatedListComponent = new FilmsListView();
    this._mostCommentedListComponent = new FilmsListView();
    this._showButtonComponent = new ShowMoreButtonView();
    this._sortComponent = new SortView();

    this._handleFilmCardChange = this._handleFilmCardChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowButtonClick = this._handleShowButtonClick.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._defaultFilms = films.slice();
    this._topRatedFilms = getTopRatedFilms(films);
    this._mostCommentedFilms = getMostCommentedFilms(films);
    this._renderSort();
    render(this._filmListContainer, this._filmListComponent);
    this._renderMovieList();
  }

  _handleModeChange() {
    Object.values(this._allFilmPresenter).forEach((presenter) => presenter.resetView());
    Object.values(this._ratedFilmPresenter).forEach((presenter) => presenter.resetView());
    Object.values(this._commentedFilmPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleFilmCardChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._defaultFilms = updateItem(this._defaultFilms, updatedFilm);
    if (this._allFilmPresenter[updatedFilm.id]) {
      this._allFilmPresenter[updatedFilm.id].init(updatedFilm);
    }
    if (this._ratedFilmPresenter[updatedFilm.id]) {
      this._ratedFilmPresenter[updatedFilm.id].init(updatedFilm);
    }
    if (this._commentedFilmPresenter[updatedFilm.id]) {
      this._commentedFilmPresenter[updatedFilm.id].init(updatedFilm);
    }
  }

  _renderFilmCard(container, film, type) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmCardChange, this._handleModeChange);
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

  _renderFilmCards(container, films, min, max, type) {
    films.slice(min, max)
    .forEach((film) => this._renderFilmCard(container, film, type));
  }

  _renderNoMovies() {
    render(this._filmListComponent, this._noFilmsComponent, AFTERBEGIN);
  }

  _clearAllMoviesList() {
    Object.values(this._allFilmPresenter).forEach((presenter) => presenter.destroy());
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
  }

  _renderAllMoviesList() {
    this._renderFilmCards(this._allFilmsListComponent, this._films, 0, Math.min(this._films.length, FILMS_COUNT_PER_STEP), ALL);
    render(this._allFilmsComponent, this._allFilmsListComponent);

    if (this._films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowButton();
    }
  }

  _renderTopRatedList() {
    this._renderFilmCards(this._topRatedListComponent, this._topRatedFilms, 0, EXTRA_FILM_COUNT, RATED);
    render(this._topRatedComponent, this._topRatedListComponent);
  }

  _renderMostCommentedList() {
    this._renderFilmCards(this._mostCommentedListComponent, this._mostCommentedFilms, 0, EXTRA_FILM_COUNT, COMMENTED);
    render(this._mostCommentedComponent, this._mostCommentedListComponent);
  }

  _handleShowButtonClick() {
    this._renderFilmCards(this._allFilmsListComponent, this._films, this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP, ALL);
    this._renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showButtonComponent);
    }
  }

  _renderShowButton() {
    render(this._allFilmsComponent, this._showButtonComponent);
    this._showButtonComponent.setShowButtonClickHandler(this._handleShowButtonClick);
  }

  _renderAllMovies() {
    this._renderAllMoviesList();
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

  _sortFilms(sortType) {
    switch (sortType) {
      case DATE:
        sortByDate(this._films);
        break;
      case RATING:
        sortByRating(this._films);
        break;
      default:
        this._films = this._defaultFilms.slice();
    }
    this._currentSortType = sortType;
  }

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortFilms(sortType);
    this._clearAllMoviesList();
    this._renderAllMoviesList();
  }

  _renderSort() {
    render(this._filmListContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortChange);
  }

  _renderMovieList() {
    if (this._films.length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderAllMovies();
    this._renderTopRated();
    this._renderMostCommented();
  }
}
