import Observer from "../utils/observer.js";
import {MenuItem} from "../const.js";

const {ALL} = MenuItem;

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = ALL;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
