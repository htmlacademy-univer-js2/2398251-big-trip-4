import { render } from '../render.js';

import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  eventListComponent = new EventListView();

  constructor({container, destinationsModel, offersModel, pointsModel}) {
    this.container = container;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.pointsModel = pointsModel;
    this.points = [...pointsModel.get()];
  }

  init() {

    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);

    render(
      new PointEditView({
        point: this.points[0],
        pointDestination: this.destinationsModel.getRandomDestination(),
        pointOffers: this.offersModel.getRandomOffer(),
      }),
      this.eventListView.getElement()
    );

    for (let i = 1; i < this.points.length; i++) {
      render(
        new PointView({
          point: this.points[i],
          pointDestination: this.destinationsModel.getById(this.points[i].destinationID),
          pointOffers: this.offersModel.getByType(this.points[i].type)
        }),
        this.eventListComponent.getElement());
    }
  }
}
