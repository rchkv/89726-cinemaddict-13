import Abstract from "./abstract.js";

const createEmplyListTemplate = () => {
  return `<h2 class="films-list__title">There are no movies in our database</h2>`;
};

export default class NoFilmList extends Abstract {
  getTemplate() {
    return createEmplyListTemplate();
  }
}

