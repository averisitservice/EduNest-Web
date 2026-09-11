import constants from './constants.js';

// #region localStorage
const setItemToStorage = (key, value) => {
  localStorage.setItem(key, value);
};

const getItemFromStorage = (key) => {
  const item = localStorage.getItem(key);
  if (item) {
    return item;
  }

  return null;
};

const removeItem = (key) => localStorage.removeItem(key);

const clearLocalStorage = () => localStorage.clear();

const setTokensToStorage = (token) => {
  localStorage.setItem(constants.localStorageKey.tokens, btoa(JSON.stringify(token)));
};

const getTokensFromStorage = () => {
  const item = localStorage.getItem(constants.localStorageKey.tokens);
  if (item) {
    const token = JSON.parse(atob(item));
    return token;
  }

  return null;
};
// #endregion

const handleConfirmDelete = async ({ setLoading, onDeleteRow, confirmDialog }) => {
  setLoading(true);
  await onDeleteRow();
  confirmDialog.onFalse();
  setLoading(false);
};

export default {
  setItemToStorage,
  getItemFromStorage,
  removeItem,
  setTokensToStorage,
  getTokensFromStorage,
  clearLocalStorage,
  handleConfirmDelete,
};
