import { getRandomValue } from '../util.js';

export default class DestinationsModel {
  constructor(service) {
    this.service = service;
    this.destinations = this.service.getDestinations();
  }

  get() {
    return this.destinations;
  }

  getById(id) {
    return this.destinations
      .find((destination) => destination.id === id);
  }

  getRandomDestination() {
    return getRandomValue(this.destinations);
  }
}
