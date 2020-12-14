import Abstract from "./abstract.js";

const createShowButtonMarkup = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ShowButton extends Abstract {
  constructor() {
    super();
    this._showButtonClickHandler = this._showButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createShowButtonMarkup();
  }

  _showButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.showButtonClick();
  }

  setShowButtonClickHandler(callback) {
    this._callback.showButtonClick = callback;
    this.getElement().addEventListener(`click`, this._showButtonClickHandler);
  }
}
