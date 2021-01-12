import Abstract from "./abstract.js";
import {MenuItem} from "../const.js";
const {ALL, WATCHLIST, HISTORY, FAVORITES, STATS} = MenuItem;

const createMenuTemplate = (filters, currentMenuItem) => {
  const {watchlist, history, favorites} = filters;
  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item ${currentMenuItem === ALL ? ` main-navigation__item--active` : ``}" data-filter-type="${ALL}">All movies</a>
      <a href="#watchlist" class="main-navigation__item ${currentMenuItem === WATCHLIST ? ` main-navigation__item--active` : ``}" data-filter-type="${WATCHLIST}"">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
      <a href="#history" class="main-navigation__item ${currentMenuItem === HISTORY ? ` main-navigation__item--active` : ``}" data-filter-type="${HISTORY}">History <span class="main-navigation__item-count">${history}</span></a>
      <a href="#favorites" class="main-navigation__item ${currentMenuItem === FAVORITES ? ` main-navigation__item--active` : ``}" data-filter-type="${FAVORITES}">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional ${currentMenuItem === STATS ? ` main-navigation__item--active` : ``}" data-filter-type="${STATS}">Stats</a>
    </nav>`
  );
};

export default class Menu extends Abstract {
  constructor(filters, currentMenuItem) {
    super();
    this._filters = filters;
    this._currentMenuItem = currentMenuItem;

    this._menuChangeHandler = this._menuChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._currentMenuItem);
  }

  _menuChangeHandler(evt) {
    const target = evt.target;
    const filterButton = (target && target.closest(`a`)) ? target.closest(`a`) : null;
    if (filterButton) {
      evt.preventDefault();
      this._callback.menuChange(filterButton.dataset.filterType);
    }
  }

  setMenuChangeHandler(callback) {
    this._callback.menuChange = callback;
    this.getElement().addEventListener(`click`, this._menuChangeHandler);
  }
}
