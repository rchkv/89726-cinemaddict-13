import dayjs from "dayjs";
import {
  getRandomInt,
  getRandomFloat,
  generateRandomDate,
  getRandomBoolean,
  getRandomValue,
  generateUniqueCompilation,
  generateID} from "../utils/common.js";
import {generateComments} from "./comment.js";

const MAX_COMMENTS = 5;

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

const countries = [`Боствана`, `Тринидад`, `Морокко`];

const actors = [
  `Silvestr Stallone`,
  `Dolf Lundgren`,
  `Jacki Chan`,
  `Mila Yovovivch`,
  `Konstantin Habensky`
];

const directors = [
  `Chris Nolan`,
  `Nikita Mihalkov`,
  `Steven Spielberg`
];


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

const ageRatings = [`0`, `6`, `12`, `16`, `18`];

const FilmWritersCount = {
  MIN: 1,
  MAX: 3
};

const FilmActorsCount = {
  MIN: 3,
  MAX: 5
};

const FilmGenresCount = {
  MIN: 1,
  MAX: 3
};

const generateReleaseDate = (start, end) => {
  return dayjs(generateRandomDate(start, end)).format(`DD MMMM YYYY`);
};

const generateFilm = () => {
  const commentsCount = getRandomInt(0, MAX_COMMENTS);

  return {
    id: generateID(),
    poster: getRandomValue(posters),
    title: getRandomValue(titles),
    originalTitle: getRandomValue(titles),
    rating: getRandomFloat(),
    director: getRandomValue(directors),
    writers: generateUniqueCompilation(writers, FilmWritersCount),
    actors: generateUniqueCompilation(actors, FilmActorsCount),
    releaseDate: generateReleaseDate(new Date(1950, 0, 1), new Date()),
    duration: getRandomInt(1, 180),
    country: getRandomValue(countries),
    genres: generateUniqueCompilation(genres, FilmGenresCount),
    shortDescription: generateFullDescription(false),
    description: generateFullDescription(),
    age: getRandomValue(ageRatings),
    comments: generateComments(commentsCount),
    isWatchList: getRandomBoolean(),
    isWatched: getRandomBoolean(),
    isFavorites: getRandomBoolean()
  };
};

export const generateFilms = (count) => {
  const films = new Array(count).fill().map(generateFilm);

  const filmsWithWatchedDates = films.map((film) =>
    film.isWatched ? Object.assign({}, film, {watchedDate: generateRandomDate(new Date(2020, 0, 1), new Date())}) : film);

  return filmsWithWatchedDates;
};
