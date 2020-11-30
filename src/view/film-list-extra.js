import {createElement} from "../utils.js";

const createFilmsListExtraTemplate = (listTitle) => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${listTitle}</h2>

      <div class="films-list__container"></div>
  </section>`;
};

export class FilmsListExtra {
  constructor(listTitle) {
    this._element = null;
    this._listTitle = listTitle;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._listTitle);
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
