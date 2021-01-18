import FilmsModel from "./model/movies.js";
import CommentsModel from "./model/comments.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
};

const SuccessStatusRange = {
  MIN: 200,
  MAX: 299,
};

const {GET, PUT} = Method;
const {MIN, MAX} = SuccessStatusRange;

export default class Api {
  constructor(serverName, authorization) {
    this._serverName = serverName;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `movies`})
      .then(Api.toJSON)
      .then((movies) => movies.map(FilmsModel.adaptToClient));
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then(Api.toJSON)
      .then((comments) => comments.map(CommentsModel.adaptToClient));
  }

  updateMovie(movie) {
    return this._load({
      url: `movies/${movie.id}`,
      method: PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(movie)),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  _load({url, method = GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._serverName}/${url}`, {method, body, headers})
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (response.status < MIN && response.status > MAX) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(error) {
    throw error;
  }
}
