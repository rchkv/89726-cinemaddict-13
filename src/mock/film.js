import path from "path";
import dayjs from "dayjs";

const getRandomInt = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateTitle = () => {
  const titles = [
    `The Dance of Life`,
    `Sagebrush Trail`,
    `The Man with the Golden Arm`,
    `Santa Claus Conquers the Martians`,
    `Popeye the Sailor Meets Sindbad the Sailor`,
  ];

  const randomIndex = getRandomInt(0, titles.length - 1);

  return titles[randomIndex];
};

const generateGenre = () => {
  const genres = [`Musical`, `Western`, `Drama`, `Comedy`, `Cartoon`];

  const randomIndex = getRandomInt(0, genres.length - 1);

  return genres[randomIndex];
};

const generateDescription = () => {
  const originalText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
  const textSuggestions = originalText
    .split(`.`)
    .sort(() => Math.random() - 0.5) // перемешиваем массив
    .slice(0, getRandomInt(1, 5));

  return textSuggestions.join(`.`);
};

const generatePosterPath = () => {
  const posters = [
    `made-for-each-other.png`,
    `popeye-meets-sinbad.png`,
    `sagebrush-trail.jpg`,
    `santa-claus-conquers-the-martians.jpg`,
    `the-great-flamarion.jpg`,
    `the-man-with-the-golden-arm.jpg`,
  ];

  const randomIndex = getRandomInt(0, posters.length - 1);

  return path.resolve(`./images/posters`, posters[randomIndex]);
};

const generateDuration = () => {
  return dayjs()
    .hour(getRandomInt(0, 5))
    .minute(getRandomInt(0, 59))
    .format(`H[h] mm[m]`);
};

const generateReleaseDate = (start, end) => {
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return dayjs(randomDate).format(`DD MMMM YYYY`);
};

const generateActors = () => {
  const actors = [`Сильвестр Сталлоне`, `Дольф Лундгрен`, `Джеки Чан`];

  const randomIndex = getRandomInt(0, actors.length - 1);
  return actors[randomIndex];
};

export const generateFilm = () => {
  return {
    title: generateTitle(),
    originalTitle: generateTitle(),
    poster: generatePosterPath(),
    fullSizePoster: generatePosterPath(),
    description: generateDescription(),
    rating: 9.3,
    year: getRandomInt(1950, 2020),
    releaseDate: generateReleaseDate(new Date(1950, 0, 1), new Date()),
    genre: generateGenre(),
    duration: generateDuration(),
    producer: `Chris Nolan`,
    actors: generateActors(),
  };
};
