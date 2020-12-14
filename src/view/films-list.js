import Abstract from "./abstract.js";

const createFilmsListTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class FilmsList extends Abstract {
  getTemplate() {
    return createFilmsListTemplate();
  }
}
