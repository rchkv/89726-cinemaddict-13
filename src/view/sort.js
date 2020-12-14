import Abstract from "./abstract.js";
import {SortType} from "../const.js";

const {DEFAULT, DATE, RATING} = SortType;

const createSortTemplate = () => {
  return (
    `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort="${DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort="${DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort="${RATING}">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends Abstract {
  constructor() {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (!evt.target.classList.contains(`sort__button`)) {
      return;
    }
    evt.preventDefault();
    this.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);
    this._callback.sortTypeChange(evt.target.dataset.sort);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
