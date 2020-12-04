import {createElement} from "../utils.js";

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract class, only concrete one.`);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(`getTemplate for Abstract is not implemented`);
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