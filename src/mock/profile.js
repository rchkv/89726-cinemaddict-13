export const generateProfile = (watchedFilms) => {
  let profileRating = ``;

  if (watchedFilms >= 1 && watchedFilms < 10) {
    profileRating = `novice`;
  }
  if (watchedFilms >= 11 && watchedFilms < 20) {
    profileRating = `fan`;
  }
  if (watchedFilms >= 21) {
    profileRating = `movie buff`;
  }

  return profileRating;
};
