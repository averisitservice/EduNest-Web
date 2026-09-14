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

export const formatClassSection = (option, fallback = '') => {
  if (!option) return fallback;
  if (typeof option === 'string') return option;
  if (option.className) {
    return option.sectionName
      ? `${option.className} - ${option.sectionName}`
      : option.className;
  }
  return fallback;
};

export const getFullName = (person, fallback = '') => {
  if (!person) return fallback;
  if (typeof person === 'string') return person;
  if (person.studentName) return person.studentName;
  if (person.teacherName) return person.teacherName;
  if (person.fullName) return person.fullName;
  if (person.name) return person.name;
  if (person.firstName || person.lastName) {
    const parts = [];
    if (person.firstName) parts.push(person.firstName);
    if (person.lastName) parts.push(person.lastName);
    return parts.join(' ');
  }
  return fallback;
};

export const getInitials = (name) => {
  if (!name) return '';
  const str = String(name).trim();
  return str ? str.charAt(0).toUpperCase() : '';
};

export const formatTimeSlice = (timeStr) => {
  if (!timeStr) return '';
  return String(timeStr).slice(0, 5);
};

export default {
  setItemToStorage,
  getItemFromStorage,
  removeItem,
  setTokensToStorage,
  getTokensFromStorage,
  clearLocalStorage,
  handleConfirmDelete,
  formatClassSection,
  getFullName,
  getInitials,
  formatTimeSlice,
};

