import { render, replace } from '../framework/render.js';

import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import EmptyListView from '../view/empty-list-view.js';

export default class BoardPresenter {
  #sortComponent = new SortView();
  #eventListComponent = new EventListView();
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #points = [];

  constructor({container, destinationsModel, offersModel, pointsModel}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;

    this.#points = [...this.#pointsModel.get()];
  }

  init() {
    if (this.#points.length === 0) {
      render(new EmptyListView(), this.#container);
      return;
    }

    render(this.#sortComponent, this.#container);
    render(this.#eventListComponent, this.#container);

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #renderPoint = (point) => {
    const pointComponent = new PointView({
      point,
      pointDestination: this.#destinationsModel.get()[0],
      pointOffers: this.#offersModel.getByType(point.type),
      onRollUpClick: pointRollUpClickHandler
    });

    const editPointComponent = new PointEditView({
      point,
      pointDestination: this.#destinationsModel.get()[0],
      pointOffers: this.#offersModel.getByType(point.type),
      onSubmitClick: pointSubmitHandler,
      onResetClick: resetButtonClickHandler
    });

    const replacePointToForm = () => {
      replace(editPointComponent, pointComponent);
    };

    const replaceFormToPoint = () => {
      replace(pointComponent, editPointComponent);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    function pointRollUpClickHandler() {
      replacePointToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function resetButtonClickHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function pointSubmitHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(pointComponent, this.#eventListComponent.element);
  };
}
