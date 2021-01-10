import Abstract from "./abstract.js";

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData(newData) {
    if (!newData) {
      return;
    }

    this._data = Object.assign({}, this._data, newData);
    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    const elementCoordTop = prevElement.scrollTop;

    this.removeElement();

    const newElement = this.getElement();
    prevElement.replaceWith(newElement);
    prevElement = null;
    newElement.scrollTop = elementCoordTop;

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }
}
