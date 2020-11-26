export const createProfileRating = (profileRating) => {
  return `<section class="header__profile profile">
    ${profileRating !== undefined ? `<p class="profile__rating">${profileRating}</p>` : ``}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
