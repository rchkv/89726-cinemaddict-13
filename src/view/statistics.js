import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from "./smart.js";
import {Range, getFilmsInRange, getTotalDuration, getGenresCount, getTopGenre} from "../utils/statistics.js";
import {getRank} from "../utils/profile.js";

dayjs.extend(durationPlugin);

const {ALLTIME} = Range;
const BAR_HEIGHT = 50;

const renderGenresChart = (statisticCtx, films, currentRange) => {

  const filmsInRange = films.length !== 0 ? getFilmsInRange(films, currentRange) : [];

  if (filmsInRange.length === 0) {
    statisticCtx.classList.add(`visually-hidden`);
  }
  const genresCount = getGenresCount(filmsInRange);
  statisticCtx.height = BAR_HEIGHT * Object.keys(genresCount).length;

  const genresTitles = Object.keys(genresCount);
  const genresTitlesCount = Object.values(genresCount);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genresTitles,
      datasets: [{
        data: genresTitlesCount,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticFiltersTempalte = (currentRange) => {
  return Object.values(Range).map((range) =>
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${range.value}" value="${range.value}" ${range.value === currentRange ? `checked` : ``}>
    <label for="statistic-${range.value}" class="statistic__filters-label">${range.label}</label>`).join(``);
};

const createStatisticsMarkup = (data) => {
  const {films, currentRange} = data;

  const statisticFiltersTemplate = createStatisticFiltersTempalte(currentRange);
  const rank = films.length !== 0 ? getRank(films.length) : ``;
  const filmsInRange = films.length !== 0 ? getFilmsInRange(films, currentRange) : [];
  const totalDuration = filmsInRange.length !== 0 ? getTotalDuration(filmsInRange) : 0;
  const totalHours = totalDuration !== 0 ? dayjs.duration(totalDuration, `minutes`).hours() : 0;
  const totalMinutes = totalDuration !== 0 ? dayjs.duration(totalDuration, `minutes`).minutes() : 0;
  const genresCount = filmsInRange.length !== 0 ? getGenresCount(filmsInRange) : 0;
  const topGenre = genresCount !== 0 ? getTopGenre(genresCount) : ``;

  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${statisticFiltersTemplate}
    </form>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${filmsInRange.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalHours} <span class="statistic__item-description">h</span> ${totalMinutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`
  );
};

export default class Statistics extends SmartView {
  constructor(films) {
    super();

    this._data = {
      films,
      currentRange: ALLTIME.value
    };
    this._genresChart = null;

    this._rangeChangeHandler = this._rangeChangeHandler.bind(this);
    this._setRangeChangeHandler();

    this._setGenresChart();
  }

  getTemplate() {
    return createStatisticsMarkup(this._data);
  }

  restoreHandlers() {
    this._setRangeChangeHandler();
    this._setGenresChart();
  }

  _rangeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({currentRange: evt.target.value});
  }

  _setRangeChangeHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._rangeChangeHandler);
  }

  _setGenresChart() {
    if (this._genresChart !== null) {
      this._genresChart = null;
    }

    const {films, currentRange} = this._data;
    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);

    this._genresChart = renderGenresChart(statisticCtx, films, currentRange);
  }

  removeElement() {
    super.removeElement();

    if (this._genresChart !== null) {
      this._genresChart = null;
    }
  }
}
