import * as _ from 'lodash';

export default class DataLoader {
  constructor(options, setState) {
    this._take = options.take || 20;
    this._options = options;
    this._skip = 0;
    this._setState = setState;
    this._defaultState = {
      refreshing: false,
      hasMoreData: true,
      data: [],
      isLoading: false,
      isSyncing: options.isSyncing || false
    };
    this._state = this._defaultState;
    this.setDefaultStates();

    this.onEndReached = this.onEndReached.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  init(data) {
    this._data = data;
  }

  reset() {
    this._skip = 0;
    const state = {...this._defaultState, ...{refreshing: true, data: []}};
    this.setState(state);
  }

  reload() {
    this.reset();
    this.load();
  }

  setState(state) {
    // update local state
    this._state = Object.assign({}, this._state, state);

    // update component state
    this._setState(state);
  }

  setDefaultStates() {
    this.setState(this._state);
  }

  setSync(isSyncing){
    this.setState({isSyncing: isSyncing});
  }

  load() {
    const {isLoading, hasMoreData} = this._state;
    if (isLoading || !hasMoreData) {
      return;
    }

    this.setState({
      isLoading: true
    });

    const data = _.slice(this._data, this._skip, this._skip + this._take);
    const stateData = this._state.data;

    let result = [...stateData];
    if (data.length > 0) {
      result = [...result, ...data];
      this._skip = this._skip + this._take;
    }

    setTimeout(() => {
      this.setState({
        data: result,
        hasMoreData: data.length >= this._take,
        isLoading: false,
        refreshing: false
      });
    }, this._options.delay || 150);
  }

  sync() {
    // if skip === 0, it mean data is not loaded yet
    // so let's load data first.
    if (this._skip === 0) {
      this.load();
      return;
    }

    // get data equals to current length
    const data = _.slice(this._data, 0, this._skip);

    let result = [...data];

    // then update to the list
    this.setState({
      data: result,
      hasMoreData: true
    });
  }

  onRefresh() {
    this.reload();
  }

  onEndReached() {
    const {hasMoreData} = this._state;
    if (hasMoreData) {
      this.load();
    }
  }
}