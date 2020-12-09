import Abstract from "./abstract.js";

const createFilmsTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class Films extends Abstract {
  getTemplate() {
    return createFilmsTemplate();
  }
}
