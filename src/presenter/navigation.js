import NavigationView from "../view/navigation.js";
import StatisticsView from "../view/statistics.js";
import {getFiltersCount} from "../utils/filter.js";
import {RenderPosition, render, replace, remove} from "../utils/render.js";
import {UpdateType, NavigationMode, MenuItem} from "../const.js";

const {AFTERBEGIN} = RenderPosition;
const {MAJOR} = UpdateType;
const {MOVIES, STATISTICS} = NavigationMode;
const {ALL, STATS} = MenuItem;

export default class Navigation {
  constructor(navigationContainer, filterModel, filmsModel, filmListPresenter) {
    this._navigationContainer = navigationContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._filmListPresenter = filmListPresenter;

    this._navigationComponent = null;
    this._statisticsComponent = null;
    this._currentMenuItem = ALL;
    this._navigationMode = MOVIES;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleMenuChange = this._handleMenuChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();

    const prevNavigationComponent = this._navigationComponent;
    this._navigationComponent = new NavigationView(filters, this._currentMenuItem);
    this._navigationComponent.setMenuChangeHandler(this._handleMenuChange);

    if (prevNavigationComponent === null) {
      render(this._navigationContainer, this._navigationComponent, AFTERBEGIN);
      return;
    }

    replace(prevNavigationComponent, this._navigationComponent);
    remove(prevNavigationComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleMenuChange(menuItem) {
    if (this._currentMenuItem === menuItem) {
      return;
    }

    this._currentMenuItem = menuItem;

    switch (this._navigationMode) {
      case MOVIES:
        if (menuItem === STATS) {
          this._filmListPresenter.destroy();
          this._statisticsComponent = new StatisticsView(this._filmsModel.getWatchedMovies());
          render(this._navigationContainer, this._statisticsComponent);
          this.init();
          this._navigationMode = STATISTICS;
        } else {
          this._filterModel.setFilter(MAJOR, menuItem);
        }
        break;
      case STATISTICS:
        remove(this._statisticsComponent);
        this._filmListPresenter.init();
        this._filterModel.setFilter(MAJOR, menuItem);
        this._navigationMode = MOVIES;
        break;
    }
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();
    return getFiltersCount(films);
  }
}

