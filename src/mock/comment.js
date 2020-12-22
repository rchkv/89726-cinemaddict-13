import {
  getRandomValue,
  generateCommentDate,
  generateID,
  generateRandomName} from "../utils/common.js";
import {EMOJIS} from "../const.js";

const comments = [`Interesting film`, `Very bad`, `Boring`];

const generateComment = () => {
  return {
    id: generateID(),
    emoji: getRandomValue(EMOJIS),
    text: getRandomValue(comments),
    author: generateRandomName(),
    day: generateCommentDate(new Date(2020, 0, 1), new Date())
  };
};

export const generateComments = (count) => {
  return new Array(count).fill().map(generateComment);
};
