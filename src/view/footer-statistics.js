import {createElement} from "../utils.js";

const createFooterStatsTemplate = (filmsCount) => {
  return `<p>${filmsCount} movies inside</p>`;
};

export class FooterStats {
  constructor(filmsCount) {
    this._element = null;
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._filmsCount);
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
