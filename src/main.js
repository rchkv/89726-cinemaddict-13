import {createProfileRating} from "./view/profile-rating.js";

const render = (container, element) => {
  container.insertAdjacentHTML(`beforeend`, element);
};

const profileHeader = document.querySelector(`.header`);

render(profileHeader, createProfileRating());
