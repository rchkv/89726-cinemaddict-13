import path from "path";
import dayjs from "dayjs";
import {getRandomInt, getRandomValue, generateRandomDate} from "../utils.js";
import {generateComments} from "./comment.js";

const titles = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
];

const writers = [
  `Steven King`,
  `Martin Scorsese`
];

const genres = [`Musical`, `Western`, `Drama`, `Comedy`, `Cartoon`];

const actors = [`Сильвестр Сталлоне`, `Дольф Лундгрен`, `Джеки Чан`];

const countries = [`Боствана`, `Тринидад`, `Морокко`];

const posters = [
  `./images/posters/made-for-each-other.png`,
  `./images/posters/popeye-meets-sinbad.png`,
  `./images/posters/sagebrush-trail.jpg`,
  `./images/posters/santa-claus-conquers-the-martians.jpg`,
  `./images/posters/the-great-flamarion.jpg`,
  `./images/posters/the-man-with-the-golden-arm.jpg`
];

const generateFullDescription = (full = true) => {
  const maxTextLength = 140;
  const originalText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
  let textSuggestions = originalText
    .split(`.`)
    .sort(() => Math.random() - 0.5) // перемешиваем массив
    .slice(0, getRandomInt(1, 5))
    .join(`.`);

  if (full) {
    return textSuggestions;
  }

  if (textSuggestions.length > maxTextLength) {
    textSuggestions = textSuggestions.slice(0, maxTextLength - 3).concat(`...`);
  }

  return textSuggestions;
};

const generateDuration = () => {
  return dayjs()
    .hour(getRandomInt(0, 5))
    .minute(getRandomInt(0, 59))
    .format(`H[h] mm[m]`);
};

const generateReleaseDate = (start, end) => {
  return dayjs(generateRandomDate(start, end)).format(`DD MMMM YYYY`);
};

const generateUniqueCompilation = (source, maxCount) => {
  const count = getRandomInt(1, maxCount);
  const uniqueValues = new Set();

  for (let i = 0; i < count; i++) {
    uniqueValues.add(getRandomValue(source));
  }

  return Array.from(uniqueValues);
};

export const generateFilm = () => {
  return {
    title: getRandomValue(titles),
    originalTitle: getRandomValue(titles),
    poster: getRandomValue(posters),
    fullSizePoster: getRandomValue(posters),
    description: generateFullDescription(false),
    fullDescription: generateFullDescription(),
    rating: 9.3,
    year: getRandomInt(1950, 2020),
    releaseDate: generateReleaseDate(new Date(1950, 0, 1), new Date()),
    genres: generateUniqueCompilation(genres, 2),
    duration: generateDuration(),
    director: `Chris Nolan`,
    writers: getRandomValue(writers),
    actors: getRandomValue(actors),
    country: getRandomValue(countries),
    age: getRandomInt(0, 18),
    comments: generateComments(getRandomInt(0, 5)),
    isWatchList: Boolean(getRandomInt(0, 1)),
    isWatched: Boolean(getRandomInt(0, 1)),
    isFavorites: Boolean(getRandomInt(0, 1))
  };
};
