import AbstractView from '../framework/view/abstract-view.js';
import { getPointCost, getPointTitle, getPointDuration } from '../utils/info.js';

function createInfoTemplate({ title, cost, duration, isEmpty }) {
  return (
    `${isEmpty ? '<div></div>' :
      `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>

        <p class="trip-info__dates">${duration}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>`}
`);
}

export default class TripInfoView extends AbstractView {
  #destinations = null;
  #offers = null;
  #points = 0;

  constructor({destinations, offers, points}) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#points = points;
  }

  get template() {
    return createInfoTemplate({
      title: getPointTitle(this.#points, this.#destinations),
      duration: getPointDuration(this.#points),
      cost: getPointCost(this.#points, this.#offers),
      isEmpty: this.#points.length === 0
    });
  }
}
