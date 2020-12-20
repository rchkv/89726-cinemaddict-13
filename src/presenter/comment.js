import CommentView from "../view/comments.js";
import {render, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

const {UPDATE_FILM, ADD, DELETE} = UserAction;
const {PATCH, MINOR} = UpdateType;

export default class Comment {
  constructor(commentsContainer, filmID, changeComment) {
    this._commentsContainer = commentsContainer;
    this._filmID = filmID;
    this._changeComment = changeComment;

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(comment) {
    this._comment = comment;
    this._commentComponent = new CommentView(this._comment);
    this._commentComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._commentsContainer, this._commentComponent);
  }

  destroy() {
    remove(this._commentComponent);
  }

  _handleDeleteClick(comment) {
    this._changeComment(DELETE, DELETE, comment, this._filmID);
  }
}
