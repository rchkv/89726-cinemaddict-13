import {MenuAndStats} from "./view/menu.js";
import {ProfileRating} from "./view/profile-rating.js";
import {FilmCard} from "./view/film-card.js";
import {FilmsList} from "./view/films-list.js";
import {ShowMoreButton} from "./view/show-more-button.js";
import {FilmsListExtra} from "./view/film-list-extra.js";
import {Sort} from "./view/sort.js";
import {Popup} from "./view/popup.js";
import {FooterStats} from "./view/footer-statistics.js";
import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {renderElement, RenderPosition} from "./utils.js";

const FILM_COUNT = 19;
const EXTRA_FILM_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const profileHeader = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footerStatistics = document.querySelector(`.footer__statistics`);

renderElement(profileHeader, new ProfileRating(films).getElement(), RenderPosition.BEFOREEND);
renderElement(main, new MenuAndStats(filters).getElement(), RenderPosition.AFTERBEGIN);
renderElement(main, new Sort().getElement(), RenderPosition.BEFOREEND);
renderElement(main, new FilmsList().getElement(), RenderPosition.BEFOREEND);
renderElement(footerStatistics, new FooterStats(FILM_COUNT).getElement(), RenderPosition.BEFOREEND);

const filmsSection = main.querySelector(`.films`);
const filmsList = filmsSection.querySelector(`.films-list`);
const filmListContainer = filmsList.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  renderElement(filmListContainer, new FilmCard(films[i]).getElement(), RenderPosition.BEFOREEND);
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;

  renderElement(filmsList, new ShowMoreButton().getElement(), RenderPosition.BEFOREEND);

  const showMoreButton = filmsList.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) =>
        renderElement(filmListContainer, new FilmCard(film).getElement(), RenderPosition.BEFOREEND)
      );

    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

renderElement(filmsSection, new FilmsListExtra(`Top rated`).getElement(), RenderPosition.BEFOREEND);
renderElement(filmsSection, new FilmsListExtra(`Most commented`).getElement(), RenderPosition.BEFOREEND);

const filmsListExtra = filmsSection.querySelectorAll(`.films-list--extra`);

filmsListExtra.forEach((element) => {
  const filmListExtraContainer = element.querySelector(
      `.films-list__container`
  );

  for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
    renderElement(filmListExtraContainer, new FilmCard(films[i]).getElement(), RenderPosition.BEFOREEND);
  }
});

renderElement(main, new Popup(films[0]).getElement(), RenderPosition.BEFOREEND);
