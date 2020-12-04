import Abstract from "./abstract.js";

const createFilmsListExtraTemplate = (listTitle) => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${listTitle}</h2>

      <div class="films-list__container"></div>
  </section>`;
};

export default class FilmsListExtra extends Abstract {
  constructor(listTitle) {
    super();

    this._listTitle = listTitle;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._listTitle);
  }
}
