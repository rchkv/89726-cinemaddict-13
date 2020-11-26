import dayjs from "dayjs";
import {getRandomInt, getRandomValue, generateRandomDate} from "../utils.js";

const comments = [`Interesting film`, `Very bad`, `Boring`];

const firstNames = [`Michael`, `Stewart`, `Paul`];

const lastNames = [`Ballack`, `Downing`, `Scholes`];

const emotions = [`smile`, `sleeping`, `puke`, `angry`];

const generateRandomName = () => {
  return `${getRandomValue(firstNames)} ${getRandomValue(lastNames)}`;
};

const generateDate = (start, end) => {
  return dayjs(generateRandomDate(start, end))
    .hour(getRandomInt(0, 23))
    .minute(getRandomInt(0, 59))
    .format(`YYYY/M/DD H:mm`);
};

const generateComment = () => {
  return {
    emotion: getRandomValue(emotions),
    text: getRandomValue(comments),
    author: generateRandomName(),
    day: generateDate(new Date(2020, 0, 1), new Date()),
  };
};

export const generateComments = (count) => {
  return new Array(count).fill().map(generateComment);
};