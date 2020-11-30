import {MenuAndStats} from "./view/menu.js";
import {ProfileRating} from "./view/profile-rating.js";
import {FilmCard} from "./view/film-card.js";
import {FilmsList} from "./view/films-list.js";
import {ShowMoreButton} from "./view/show-more-button.js";
import {FilmsListExtra} from "./view/film-list-extra.js";
import {Sort} from "./view/sort.js";
import {Popup} from "./view/popup.js";
import {FooterStats} from "./view/footer-statistics.js";
import {NoFilmList} from "./view/no-film.js";
import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {render, RenderPosition} from "./utils.js";

const FILM_COUNT = 19;
const EXTRA_FILM_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

const films = new Array(FILM_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const body = document.querySelector(`body`);
const profileHeader = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footerStatistics = document.querySelector(`.footer__statistics`);

render(profileHeader, new ProfileRating(films).getElement(), RenderPosition.BEFOREEND);
render(main, new MenuAndStats(filters).getElement(), RenderPosition.AFTERBEGIN);
render(main, new FilmsList().getElement(), RenderPosition.BEFOREEND);
render(footerStatistics, new FooterStats(FILM_COUNT).getElement(), RenderPosition.BEFOREEND);

const filmsSection = main.querySelector(`.films`);
const filmsList = filmsSection.querySelector(`.films-list`);

if (films.length === 0) {
  render(filmsList, new NoFilmList().getElement(), RenderPosition.BEFOREEND);
} else {
  const filmListContainer = filmsList.querySelector(`.films-list__container`);
  render(main, new Sort().getElement(), RenderPosition.BEFOREEND);

  const renderFilmCard = (filmListElement, film) => {
    const filmComponent = new FilmCard(film);
    const filmPopup = new Popup(film);

    const closePopup = () => {
      main.removeChild(filmPopup.getElement());
      filmPopup.removeElement();
      body.classList.remove(`hide-overflow`);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape`) {
        closePopup();
        body.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onCloseButtonClick = () => {
      closePopup();
      body.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onFilmCardClick = () => {
      main.appendChild(filmPopup.getElement());
      body.classList.add(`hide-overflow`);
      filmPopup.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, onCloseButtonClick);
      body.addEventListener(`keydown`, onEscKeyDown);
    };

    filmComponent.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, onFilmCardClick);
    filmComponent.getElement().querySelector(`.film-card__title`).addEventListener(`click`, onFilmCardClick);
    filmComponent.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, onFilmCardClick);

    render(filmListElement, filmComponent.getElement(), RenderPosition.BEFOREEND);
  };

  for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
    renderFilmCard(filmListContainer, films[i]);
  }

  if (films.length > FILMS_COUNT_PER_STEP) {
    let renderedFilmsCount = FILMS_COUNT_PER_STEP;

    render(filmsList, new ShowMoreButton().getElement(), RenderPosition.BEFOREEND);

    const showMoreButton = filmsList.querySelector(`.films-list__show-more`);

    showMoreButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      films
        .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => renderFilmCard(filmListContainer, film)
        );

      renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmsCount >= films.length) {
        showMoreButton.remove();
      }
    });
  }

  render(filmsSection, new FilmsListExtra(`Top rated`).getElement(), RenderPosition.BEFOREEND);
  render(filmsSection, new FilmsListExtra(`Most commented`).getElement(), RenderPosition.BEFOREEND);

  const filmsListExtra = filmsSection.querySelectorAll(`.films-list--extra`);

  filmsListExtra.forEach((element) => {
    const filmListExtraContainer = element.querySelector(
        `.films-list__container`
    );

    for (let i = 0; i < EXTRA_FILM_COUNT; i++) {
      renderFilmCard(filmListExtraContainer, films[i]);
    }
  });
}
