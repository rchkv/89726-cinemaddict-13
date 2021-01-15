import FooterView from "./view/footer-statistics.js";
import FilmListPresenter from "./presenter/films-list.js";
import NavigationPresenter from "./presenter/navigation.js";
import ProfilePresenter from "./presenter/profile.js";
import {render} from "./utils/render.js";
import {generateFilms} from "./mock/film.js";
import FilmModel from "./model/movies.js";
import CommentsModel from "./model/comments.js";
import FilterModel from "./model/filter.js";

const FILM_COUNT = 19;

const films = generateFilms(FILM_COUNT);
const total = films.length;

const filmModel = new FilmModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();
filmModel.setFilms(films);
commentsModel.setComments(films);

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const profilePresenter = new ProfilePresenter(header, filmModel);
const filmListPresenter = new FilmListPresenter(main, filmModel, commentsModel, filterModel);
const navigationPresenter = new NavigationPresenter(main, filterModel, filmModel, filmListPresenter);

profilePresenter.init();
filmListPresenter.init();
navigationPresenter.init();
render(footer.lastElementChild, new FooterView(total));
