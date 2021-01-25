import Api from "./api.js";
import {UpdateType} from "./const.js";
import FooterView from "./view/footer-statistics.js";
import FilmListPresenter from "./presenter/films-list.js";
import NavigationPresenter from "./presenter/navigation.js";
import ProfilePresenter from "./presenter/profile.js";
import {render} from "./utils/render.js";
import FilmModel from "./model/movies.js";
import CommentsModel from "./model/comments.js";
import FilterModel from "./model/filter.js";

const {INIT} = UpdateType;
const AUTHORIZATION = `Basic akjshdASjdsdjuSd`;
const SERVER_NAME = `https://13.ecmascript.pages.academy/cinemaddict`;

const api = new Api(SERVER_NAME, AUTHORIZATION);

const filmModel = new FilmModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const profilePresenter = new ProfilePresenter(header, filmModel);
const filmListPresenter = new FilmListPresenter(main, filmModel, commentsModel, filterModel, api);
const navigationPresenter = new NavigationPresenter(main, filterModel, filmModel, filmListPresenter);

filmListPresenter.init();
navigationPresenter.init();

let films = [];

api.getMovies()
  .then((movies) => {
    films = movies;
    return movies;
  })
  .then((movies) => movies.map((film) => api.getComments(film.id)))
  .then((comments) => Promise.all(comments))
  .then((allcomments) => {
    commentsModel.setComments(allcomments);
    filmModel.setFilms(INIT, films);
    profilePresenter.init();
    render(footer.lastElementChild, new FooterView(films.length));
  })
  .catch(() => {
    commentsModel.setComments([]);
    filmModel.setFilms(INIT, []);
    profilePresenter.init();
    render(footer.lastElementChild, new FooterView(films.length));
  });
