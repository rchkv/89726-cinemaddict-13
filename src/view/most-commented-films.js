import Abstract from "./abstract.js";

const createMostCommentedTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      </section>`
  );
};

export default class MostCommentedFilms extends Abstract {
  getTemplate() {
    return createMostCommentedTemplate();
  }
}
