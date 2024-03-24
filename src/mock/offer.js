import { OFFERS, PRICE, TYPES } from '../const.js';
import { getRandomInteger, getRandomValue } from '../util.js';

function generateOffer() {
  const offer = getRandomValue(OFFERS);
  const type = getRandomValue(TYPES);

  return {
    type: type,
    offers: Array.from({length: getRandomInteger(0, 5)}, () => ({
      id: crypto.randomUUID(),
      title: offer,
      price: getRandomInteger(PRICE.MIN, (PRICE.MAX / 10))
    }))
  };
}

export { generateOffer };

