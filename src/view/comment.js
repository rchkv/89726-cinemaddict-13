import dayjs from "dayjs";
import Abstract from "./abstract.js";

const createCommentTemplate = (comment) => {
  const {emoji, text, author, day} = comment;

  return (
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
    <p class="film-details__comment-text">${text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${dayjs(day).format(`YYYY/M/DD H:mm`)}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
    </div>
    </li>`
  );
};

export default class Comment extends Abstract {
  constructor(comment) {
    super();
    this._comment = comment;
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._comment);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, this._deleteClickHandler);
  }
}
