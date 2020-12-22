import he from "he";
import {EMOJIS} from "../const.js";

const createEmojiListTemplate = (emojiName) => {

  return EMOJIS.map((emoji) =>
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji"
    type="radio" id="emoji-${emoji}" value="${emoji}" ${emoji === emojiName ? `checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`).join(``);
};

export const createCommentsTemplate = (comments, isEmoji, emojiName, text) => {
  const emojiListMarkup = createEmojiListTemplate(emojiName);

  return (
    `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
    <ul class="film-details__comments-list">
  </ul>
  <div class="film-details__new-comment">
    <div for="add-emoji" class="film-details__add-emoji-label">
    ${isEmoji ? `<img src="images/emoji/${emojiName}.png" width="55" height="55" alt="emoji-${emojiName}">` : ``}

    </div>
    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(text)}</textarea>
    </label>
    <div class="film-details__emoji-list">
    ${emojiListMarkup}
    </div>
  </div>
  </section>`
  );
};
