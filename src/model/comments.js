import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments;
  }

  getComments() {
    return this._comments;
  }

  addComment(comments, filmID) {
    this._comments[filmID] = comments;
  }

  deleteComment(deletedComment, filmID) {
    const index = this._comments[filmID].findIndex((comment) => comment.id === deletedComment.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments[filmID] = [...this._comments[filmID].slice(0, index), ...this._comments[filmID].slice(index + 1)];
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          emoji: comment.emotion,
          text: comment.comment,
          day: new Date(comment.date)
        }
    );

    delete adaptedComment.emotion;
    delete adaptedComment.comment;
    delete adaptedComment.date;

    return adaptedComment;
  }

  static adaptToServer(comment) {

    const adaptedComment = Object.assign(
        {},
        comment,
        {
          "emotion": comment.emoji,
          "comment": comment.text,
          "date": comment.day.toISOString()
        }
    );

    delete adaptedComment.emoji;
    delete adaptedComment.text;
    delete adaptedComment.day;

    return adaptedComment;
  }
}
