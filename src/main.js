import {createMenuAndStats} from "./view/menu.js";
import {createProfileRating} from "./view/profile-rating.js";
import {createFilmСard} from "./view/film-card.js";
import {FilmsList} from "./view/films-list.js";
import {createShowMoreButton} from "./view/show-more-button.js";
import {createFilmsListExtra} from "./view/film-list-extra.js";
import {createSort} from "./view/sort.js";
import {createFilmsDetailsPopup} from "./view/popup.js";
import {createFooterStats} from "./view/footer-statistics.js";
import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {renderTemplate, renderElement, RenderPosition} from "./utils.js";

const FILM_COUNT = 19;
const EXTRA_FILM_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const profileHeader = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footerStatistics = document.querySelector(`.footer__statistics`);

renderTemplate(profileHeader, createProfileRating(films), `beforeend`);
renderTemplate(main, createMenuAndStats(filters), `afterbegin`);
renderTemplate(main, createSort(), `beforeend`);
renderElement(main, new FilmsList().getElement(), RenderPosition.BEFOREEND);
renderTemplate(footerStatistics, createFooterStats(FILM_COUNT), `beforeend`);

const filmsSection = main.querySelector(`.films`);
const filmsList = filmsSection.querySelector(`.films-list`);
const filmListContainer = filmsList.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  renderTemplate(filmListContainer, createFilmСard(films[i]), `beforeend`);
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;

  renderTemplate(filmsList, createShowMoreButton(), `beforeend`);

  const showMoreButton = filmsList.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) =>
        renderTemplate(filmListContainer, createFilmСard(film), `beforeend`)
      );

    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

renderTemplate(filmsSection, createFilmsListExtra(`Top rated`), `beforeend`);
renderTemplate(filmsSection, createFilmsListExtra(`Most commented`), `beforeend`);

const filmsListExtra = filmsSection.querySelectorAll(`.films-list--extra`);

filmsListExtra.forEach((element) => {
  const filmListExtraContainer = element.querySelector(
      `.films-list__container`
  );

  for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
    renderTemplate(filmListExtraContainer, createFilmСard(films[i]), `beforeend`);
  }
});

renderTemplate(main, createFilmsDetailsPopup(films[0]), `beforeend`);
