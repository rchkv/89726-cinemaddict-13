import {createProfileRating} from "./view/profile-rating.js";
import {createMenuAndStats} from "./view/menu.js";
import {createFilmcard} from "./view/film-card.js";
import {createFilmsList} from "./view/films-list.js";

const FILM_COUNT = 5;

const render = (container, element, place) => {
  container.insertAdjacentHTML(place, element);
};

const profileHeader = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

render(profileHeader, createProfileRating(), `beforeend`);
render(main, createMenuAndStats(), `afterbegin`);
render(main, createFilmsList(), `beforeend`);

const filmsList = main.querySelector(`.films-list .films-list__container`);

for (let i = 0; i < FILM_COUNT; i++) {
  render(filmsList, createFilmcard(), `beforeend`);
}
