import {createProfileRating} from "./view/profile-rating.js";
import {createMenuAndStats} from "./view/menu.js";
import {createFilmcard as createFilmСard} from "./view/film-card.js";
import {createFilmsList} from "./view/films-list.js";
import {createShowMoreButton} from "./view/show-more-button.js";
import {createFilmsListExtra} from "./view/film-list-extra.js";
import {createSort} from "./view/sort.js";
import {generateFilm} from "./mock/film.js";
import {createFilmsDetailsPopup} from "./view/popup.js";

const FILM_COUNT = 5;
const EXTRA_FILM_COUNT = 2;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const render = (container, element, place) => {
  container.insertAdjacentHTML(place, element);
};

const profileHeader = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

render(profileHeader, createProfileRating(), `beforeend`);
render(main, createMenuAndStats(), `afterbegin`);
render(main, createSort(), `beforeend`);
render(main, createFilmsList(), `beforeend`);

const filmsSection = main.querySelector(`.films`);
const filmsList = filmsSection.querySelector(`.films-list`);
const filmListContainer = filmsList.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_COUNT; i++) {
  render(filmListContainer, createFilmСard(films[i]), `beforeend`);
}

render(filmsList, createShowMoreButton(), `beforeend`);
render(filmsSection, createFilmsListExtra(`Top rated`), `beforeend`);
render(filmsSection, createFilmsListExtra(`Most commented`), `beforeend`);

const filmsListExtra = filmsSection.querySelectorAll(`.films-list--extra`);

filmsListExtra.forEach((element) => {
  const filmListExtraContainer = element.querySelector(`.films-list__container`);

  for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
    render(filmListExtraContainer, createFilmСard(films[i]), `beforeend`);
  }
});

// чтобы попап не закрывал экран
//render(main, createFilmsDetailsPopup(films[0]), `beforeend`);
