import Abstract from "./abstract.js";

const createFooterStatsTemplate = (filmsCount) => {
  return `<p>${filmsCount} movies inside</p>`;
};

export default class FooterStats extends Abstract {
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._filmsCount);
  }
}
