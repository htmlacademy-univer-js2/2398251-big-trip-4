import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import EventListView from '../view/event-list-view.js';
import NewPointPresenter from './new-point-presenter.js';
import MessageView from '../view/message-view.js';
import LoadingView from '../view/loading-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { SortType, UpdateType, EnabledSortType, UserAction, FilterType, TimeLimit } from '../const.js';
import { sort } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class BoardPresenter {
  #container = null;

  #sortComponent = null;
  #eventListComponent = new EventListView();
  #messageComponent = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;

  #pointPresenters = new Map();

  #currentSortType = SortType.DAY;
  #isCreating = false;

  #newPointPresenter = null;
  #newPointButtonPresenter = null;

  #loadingComponent = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #isLoading = true;
  #isLoadingError = false;

  constructor({ container, destinationsModel, offersModel, pointsModel, filterModel, newPointButtonPresenter }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointButtonPresenter = newPointButtonPresenter;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#viewActionHandler,
      onDestroy: this.#newPointDestroyHandler
    });

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get points() {
    const filterType = this.#filterModel.get();
    const filteredPoints = filter[filterType](this.#pointsModel.get());

    return sort[this.#currentSortType](filteredPoints);
  }

  init() {
    this.#renderBoard();
  }

  newPointButtonClickHandler = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointButtonPresenter.disableButton();
    this.#newPointPresenter.init();
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#viewActionHandler,
      onModeChange: this.#modeChangeHandler
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #renderLoading = ({isLoading, isLoadingError}) => {
    this.#loadingComponent = new LoadingView({isLoading, isLoadingError});
    render(this.#loadingComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();
  };

  #renderSort = () => {
    const prevSortComponent = this.#sortComponent;

    const sortTypes = Object.values(SortType)
      .map((type) => ({
        type,
        isChecked: (type === this.#currentSortType),
        isDisabled: !EnabledSortType[type]
      }));

    this.#sortComponent = new SortView({
      items: sortTypes,
      onItemChange: this.#sortTypeChangeHandler
    });

    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {
      render(this.#sortComponent, this.#container);
    }
  };

  #renderMessage() {
    this.#messageComponent = new MessageView({
      filterType: this.#filterModel.get()
    });
    render(this.#messageComponent, this.#container);
  }

  #renderPointContainer = () => {
    render(this.#eventListComponent, this.#container);
  };

  #renderBoard = () => {
    const isLoading = this.#isLoading;
    const isLoadingError = this.#isLoadingError;
    if (this.#isLoading) {
      this.#renderLoading({isLoading, isLoadingError});
      this.#newPointButtonPresenter.disableButton();
      return;
    }
    this.#newPointButtonPresenter.enableButton();

    if (this.#isLoadingError) {
      this.#clearBoard({ resetSortType: true });
      remove(this.#sortComponent);
      this.#sortComponent = null;
      this.#renderLoading({isLoading, isLoadingError});
      return;
    }

    if (this.points.length === 0 && !this.#isCreating) {
      this.#renderMessage();
      return;
    }

    this.#renderSort();
    this.#renderPointContainer();
    this.#renderPoints();
  };

  #clearBoard = ({ resetSortType = false } = {}) => {
    this.#clearPoints();
    remove(this.#messageComponent);
    remove(this.#sortComponent);
    this.#sortComponent = null;
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters?.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        if (data.isError) {
          this.#isLoadingError = true;
          this.#renderBoard();
          break;
        } else {
          this.#isLoading = false;
          remove(this.#loadingComponent);
          this.#renderBoard();
          break;
        }
    }
  };

  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.update(updateType, update);
        } catch {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.delete(updateType, update);
        } catch {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.add(updateType, update);
        } catch {
          this.#newPointPresenter.setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #newPointDestroyHandler = ({ isCanceled }) => {
    this.#isCreating = false;
    this.#newPointButtonPresenter.enableButton();
    if (this.points.length === 0 && isCanceled) {
      this.#clearBoard();
      this.#renderBoard();
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderSort();
    this.#renderPoints();
  };
}
