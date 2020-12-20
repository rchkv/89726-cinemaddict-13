import dayjs from "dayjs";
import {getRandomInt,
  getRandomValue,
  generateRandomDate,
  generateID,
  generateRandomName} from "../utils/common.js";
import {EMOJIS} from "../const.js";

const comments = [`Interesting film`, `Very bad`, `Boring`];

const generateDate = (start, end) => {
  return dayjs(generateRandomDate(start, end))
    .hour(getRandomInt(0, 23))
    .minute(getRandomInt(0, 59))
    .format(`YYYY/M/DD H:mm`);
};

const generateComment = () => {
  return {
    id: generateID(),
    emoji: getRandomValue(EMOJIS),
    text: getRandomValue(comments),
    author: generateRandomName(),
    day: generateDate(new Date(2020, 0, 1), new Date())
  };
};

export const generateComments = (count) => {
  return new Array(count).fill().map(generateComment);
};
