import { CITIES, DESCRIPTIONS } from '../const.js';
import { getRandomInteger, getRandomValue } from '../util.js';

function generateDestination() {
  const city = getRandomValue(CITIES);
  const description = getRandomValue(DESCRIPTIONS);

  return {
    id: crypto.randomUUID(),
    description: description,
    name: city,
    pictures: Array.from({ length: getRandomInteger(1, 5) }, () => ({
      src: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
      description: `${city} description`
    }))
  };
}

export { generateDestination };

