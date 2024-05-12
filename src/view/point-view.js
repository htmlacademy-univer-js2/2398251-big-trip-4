import AbstractView from '../framework/view/abstract-view.js';
import { formatStringToDateTime, formatStringToShortDate, getPointDuration } from '../util.js';

function createPointOffersTemplate({ pointOffers }) {
  const selectedOffers = pointOffers.filter((offer) => offer.included);

  if (selectedOffers.length === 0) {
    return '';
  }

  const offerItems = selectedOffers.map((offer) => (
    `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
  )).join('');

  return `<ul class="event__selected-offers">${offerItems}</ul>`;
}

function createPointTemplate({ point, pointDestination, pointOffers }) {
  const { basePrice, dateFrom, dateTo, isFavorite, type } = point;
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  return (`<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${formatStringToDateTime(dateFrom)}">${formatStringToShortDate(dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${pointDestination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${formatStringToDateTime(dateFrom)}">${formatStringToShortDate(dateFrom)}</time>
        &mdash;
        <time class="event__end-time" datetime="${formatStringToDateTime(dateTo)}">${formatStringToShortDate(dateTo)}</time>
      </p>
      <p class="event__duration">${getPointDuration(dateFrom, dateTo)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    ${createPointOffersTemplate({pointOffers})}
    <button class="event__favorite-btn ${favoriteClass}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`);
}

export default class PointView extends AbstractView {
  #point = null;
  #pointOffers = null;
  #pointDestination = null;
  #onRollUpClick = null;
  #onFavoriteClick = null;

  constructor({ point, pointDestination, pointOffers, onRollUpClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#onRollUpClick = onRollUpClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpClickHandler);
    this.element.querySelector('.event__favorite-icon').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate({
      point: this.#point,
      pointDestination: this.#pointDestination,
      pointOffers: this.#pointOffers
    });
  }

  #rollUpClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollUpClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };
}
