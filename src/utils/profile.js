const Rank = {
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`,
  NONE: `none`
};

const RankStep = {
  LOW: 1,
  MIDDLE: 10,
  HIGH: 20
};

const {NOVICE, FAN, MOVIE_BUFF, NONE} = Rank;
const {LOW, MIDDLE, HIGH} = RankStep;

export const getRank = (count) => {

  if (count >= LOW && count <= MIDDLE) {
    return NOVICE;
  } else if (count > MIDDLE && count <= HIGH) {
    return FAN;
  } else if (count > HIGH) {
    return MOVIE_BUFF;
  } else {
    return NONE;
  }
};
