import FilterView from './view/filter-view.js';
import InfoView from './view/trip-info-view.js';
import BoardPresenter from './presenter/board-presenter.js';

import { render, RenderPosition } from './render.js';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');
const mainElement = bodyElement.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({
  container: eventListElement
});

render(new InfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterElement);

boardPresenter.init();
