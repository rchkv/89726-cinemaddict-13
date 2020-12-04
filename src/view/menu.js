import {createElement} from "../utils.js";

const createFilterTemplate = (filter) => {
  const {name, count} = filter;

  return (
    `<a href="#${name}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>
  `);
};

const createMenuAndStatsTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
  .map((filter, index) => createFilterTemplate(filter, index === 0))
  .join(``);

  return (`<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item">All movies</a>
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
  );
};

export default class MenuAndStats {
  constructor(filterItems) {
    this._element = null;
    this._filterItems = filterItems;
  }

  getTemplate() {
    return createMenuAndStatsTemplate(this._filterItems);
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
