import Abstract from "./abstract.js";

const createShowMoreButtonTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreButton extends Abstract {
  getTemplate() {
    return createShowMoreButtonTemplate();
  }
}
