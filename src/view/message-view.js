import AbstractView from '../framework/view/abstract-view.js';
import { FilterTypes } from '../const.js';

const FilterMessage = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no future events now',
  [FilterTypes.PRESENT]: 'There are no present events now',
  [FilterTypes.PAST]: 'There are no past events now'
};

function createMessageTemplate({ message }) {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
      <p class="trip-events__msg">${message}</p>
    </section>`
  );
}

export default class MessageView extends AbstractView {
  #filterType;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    const message = FilterMessage[this.#filterType];

    return createMessageTemplate({ message });
  }
}
