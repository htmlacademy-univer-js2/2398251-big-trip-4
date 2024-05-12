import { SortType } from '../const.js';
import { sortPointsByDay, sortPointsByPrice, sortPointsByTime } from '../util.js';

const sort = {
  [SortType.DAY]: (points) => points.sort(sortPointsByDay),
  [SortType.PRICE]: (points) => points.sort(sortPointsByPrice),
  [SortType.TIME]: (points) => points.sort(sortPointsByTime),
  [SortType.EVENT]: () => {
    throw new Error(`Sort by ${SortType.EVENT} is not implemented`);
  },
  [SortType.OFFERS]: () => {
    throw new Error(`Sort by ${SortType.OFFERS} is not implemented`);
  }
};

export { sort };
