const CITIES = [
  'Chamonix',
  'Geneva',
  'Amsterdam',
  'Helsinki',
  'Oslo',
  'Kopenhagen',
  'Den Haag',
  'Rotterdam',
  'Saint Petersburg',
  'Moscow',
  'Sochi',
  'Tokio',
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.'
];

const OFFERS = [
  'Order Uber',
  'Add luggage',
  'Switch to comfort',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Lunch in city',
  'Upgrade to a business class'
];

const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const DEFAULT_TYPE = 'flight';

const POINT_EMPTY = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};

const PRICE = {
  MIN: 1,
  MAX: 1000
};

const Duration = {
  HOUR: 5,
  DAY: 5,
  MINUTE: 59
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const EnabledSortType = {
  [SortType.DAY]: true,
  [SortType.EVENT]: false,
  [SortType.TIME]: true,
  [SortType.PRICE]: true,
  [SortType.OFFERS]: false
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

const OFFER_COUNT = Math.floor(Math.random() * 4 + 1);
const DESTINATION_COUNT = 5;
const POINT_COUNT = 5;

export {
  CITIES,
  OFFERS,
  DESCRIPTIONS,
  PRICE,
  Duration,
  TYPES,
  DEFAULT_TYPE,
  POINT_EMPTY,
  OFFER_COUNT,
  DESTINATION_COUNT,
  POINT_COUNT,
  FilterType,
  Mode,
  SortType,
  EnabledSortType,
  UpdateType
};
