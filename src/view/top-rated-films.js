import Abstract from "./abstract.js";

const createTopRatedTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      </section>`
  );
};

export default class TopRatedFilms extends Abstract {
  getTemplate() {
    return createTopRatedTemplate();
  }
}
