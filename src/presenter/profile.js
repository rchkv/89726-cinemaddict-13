import ProfileView from "../view/profile-rating.js";
import {getRank} from "../utils/profile.js";
import {render, replace, remove} from "../utils/render.js";

export default class Profile {
  constructor(profileContainer, filmModel) {
    this._profileContainer = profileContainer;
    this._filmModel = filmModel;
    this._profileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filmModel.addObserver(this._handleModelEvent);
  }

  init() {
    const watchedFilmsCount = this._filmModel.getWatchedMovies().length;
    const rank = getRank(watchedFilmsCount);

    const prevProfileComponent = this._profileComponent;
    this._profileComponent = new ProfileView(rank);

    if (prevProfileComponent === null) {
      render(this._profileContainer, this._profileComponent);
      return;
    }
    replace(prevProfileComponent, this._profileComponent);
    remove(prevProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
