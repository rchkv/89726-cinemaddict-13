import {createProfileRating} from "./view/profile-rating.js";
import { createMenuAndStats } from "./view/menu.js";

const render = (container, element, place) => {
  container.insertAdjacentHTML(place, element);
};

const profileHeader = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

render(profileHeader, createProfileRating(), `beforeend`);
render(main, createMenuAndStats(), `afterbegin`);
