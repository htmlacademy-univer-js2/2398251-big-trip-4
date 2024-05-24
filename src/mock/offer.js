import { OFFERS, PRICE } from '../const.js';
import { getRandomInteger, getRandomValue } from '../util.js';

function generateOffer() {
  const offer = getRandomValue(OFFERS);

  return {
    id: crypto.randomUUID(),
    title: offer,
    price: getRandomInteger(PRICE.MIN, (PRICE.MAX / 10))
  };
}

export { generateOffer };

