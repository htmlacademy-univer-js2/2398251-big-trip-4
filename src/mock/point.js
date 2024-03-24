import { OFFER_COUNT, PRICE } from '../const.js';
import { getDate, getRandomInteger } from '../util.js';
import { generateOffer } from './offer.js';
import { generateDestination } from './destination.js';

function generatePoint(type) {
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(PRICE.MIN, PRICE.MAX),
    dateFrom: getDate({ next: false }),
    dateTo: getDate({ next: true }),
    destination: generateDestination,
    isFavorite: !!getRandomInteger(0, 1),
    offers: Array.from({ length: OFFER_COUNT }, () => generateOffer()),
    type: type
  };
}

export { generatePoint };
