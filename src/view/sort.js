import Abstract from "./abstract.js";
import {SortType} from "../const.js";

const {DEFAULT, DATE, RATING} = SortType;

const createSortTemplate = (currentSortType) => {
  return (
    `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === DEFAULT ? `sort__button--active` : ``}" data-sort="${DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === DATE ? `sort__button--active` : ``}" data-sort="${DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === RATING ? `sort__button--active` : ``}" data-sort="${RATING}">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends Abstract {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (!evt.target.classList.contains(`sort__button`)) {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sort);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
