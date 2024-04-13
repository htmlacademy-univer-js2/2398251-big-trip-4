import AbstractView from '../framework/view/abstract-view.js';
import { firstLetterToUpperCase } from '../util.js';

function createFilterItemsTemplate({filters}) {
  const filterItems = filters.map((filter) => (
    `<div class="trip-filters__filter">
      <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}"
      ${(filter.hasPoints) ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="filter-${filter.type}">${firstLetterToUpperCase(filter.type)}</label>
    </div>`
  )).join('');

  return filterItems;
}


function createFilterTemplate ({filters}) {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${createFilterItemsTemplate({filters})}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView {
  #filters = [];

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate({
      filters: this.#filters
    });
  }
}
