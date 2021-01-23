import CommentView from "../view/comment.js";
import {render, remove} from "../utils/render.js";
import {UserAction} from "../const.js";

const {DELETE_COMMENT} = UserAction;

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

  setDeleting() {
    this._commentComponent.updateData({
      isDeleting: true
    });
  }

  setAborting() {
    const resetState = () => {
      this._commentComponent.updateData({
        isDeleting: false
      });
    };

    this._commentComponent.shake(this._commentComponent.getElement(), resetState);
  }

  _handleDeleteClick(comment) {
    this._changeComment(DELETE_COMMENT, comment, this._filmID);
  }
}
