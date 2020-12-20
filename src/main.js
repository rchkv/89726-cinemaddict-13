import ProfileView from "./view/profile-rating.js";
import NavigationMenuView from "./view/menu.js";
import FooterView from "./view/footer-statistics.js";
import FilmListPresenter from "./presenter/films-list.js";
import {RenderPosition, render} from "./utils/render.js";
import {generateFilms} from "./mock/film.js";
import {generateFilters} from "./mock/filter.js";
import FilmModel from "./model/movies.js";

const FILM_COUNT = 19;

const films = generateFilms(FILM_COUNT);
const filters = generateFilters(films);
const total = films.length;

const filmModel = new FilmModel();
filmModel.setFilms(films);

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const filmListPresenter = new FilmListPresenter(main, filmModel);
const footer = document.querySelector(`.footer`);

render(header, new ProfileView(films));
render(main, new NavigationMenuView(filters), RenderPosition.AFTERBEGIN);
filmListPresenter.init();
render(footer.lastElementChild, new FooterView(total));
