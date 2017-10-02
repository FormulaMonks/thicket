import { loadState, saveState } from './localStorage';

const SAVE_SUCCESS = 'DatabaseSaveSuccessEvent';
const SAVE_FAIL = 'DatabaseSaveFailEvent';

let id = 0;

class Database {

  constructor(initialState) {
    this.id = id;
    id += 1;
    this.initialState = initialState;
  }

  fetchData() {
    return loadState(this.id)
      .then(res => res || this.initialState)
  }

  setData(newData)  {
    saveState(this.id, newData)
      .then(() => window.dispatchEvent(new CustomEvent(SAVE_SUCCESS)))
      .catch(err => window.dispatchEvent(new CustomEvent(SAVE_FAIL, { detail: err })))
  }

  addSaveSuccessListener(func) {
    window.addEventListener(SAVE_SUCCESS, func, false);
  }

  removeSaveSuccessListener(func) {
    window.removeEventListener(SAVE_SUCCESS, func, false);
  }

  addSaveFailListener(func) {
    window.addEventListener(SAVE_FAIL, func, false);
  }

  removeSaveFailListener(func) {
    window.removeEventListener(SAVE_FAIL, func, false);
  }
}

export default ({initialState}) => new Database(initialState);
