import _, { isNil, last, replace, trim } from 'lodash';
import { timezones } from 'src/assets/data/timezones.js';
import { z as zod } from 'zod';
import constants from './constants.js';
import enums from './enums.js';

const formatAddress = (a) => {
  return [
    a.addressLine1,
    a.addressLine2,
    a.city,
    `${a.state} - ${a.postcode}`
  ].filter(Boolean).join(", ");
};

const removeItemsFromArray = (array, valuesToRemove) => {
  if (!Array.isArray(valuesToRemove)) {
    // if valuesToRemove is not an array, convert it to an array with one element
    valuesToRemove = [valuesToRemove];
  }

  // use set to quickly remove all occurrences of the values to remove
  const valuesSet = new Set(valuesToRemove);
  return array.filter((item) => !valuesSet.has(item));
};

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

const formatPath = (value) => {
  return replace(trim(value.replace(/,/g, ' ')), ' ', '-');
};

const generateBlobName = (file, imageId) => {
  const fileName = file.name.split('.');
  const fileExtension = last(fileName);
  const fileNameWithoutExtension = fileName.slice(0, -1).join('.');
  return `${fileNameWithoutExtension}-${imageId}.${fileExtension}`;
};

const handleNumericKey = (event) => {
  if (
    event.ctrlKey ||
    event.metaKey ||
    event.key === 'Tab' ||
    event.key === 'Backspace' ||
    event.key === 'x' ||
    event.key === ' ' ||
    event.key === 'ArrowRight' ||
    event.key === 'ArrowLeft'
  ) {
    return;
  }

  const numericRegex = /^[0-9.,]*$/;
  if (!numericRegex.test(event.key)) {
    event.preventDefault();
  }
};

const extractVersionNumber = (fileName) => {
  // Regular expression to match the version number
  const versionPattern = /-v(\d+)/;
  const match = fileName.match(versionPattern);

  if (match) {
    // Return the version number
    return match[1];
  } else {
    // If no match is found, return null or an appropriate message
    return null;
  }
};

const getFileName = (fileName, existingFileName) => {
  if (existingFileName) {
    if (existingFileName.indexOf(fileName + '.png') >= 0) {
      return fileName + '-v1';
    }
    let versionNumber = extractVersionNumber(existingFileName);
    if (versionNumber > 0) {
      versionNumber++;
      return `${fileName}-v${versionNumber}`;
    }
  }
  return fileName;
};

function isIosStandalone() {
  if (!window.navigator) return false;

  return window.navigator.standalone === true;
}

function isStandalone() {
  if (!window.navigator) return false;

  return isIosStandalone() || window.matchMedia('(display-mode: standalone)').matches;
}

async function cameraPermission() {
  let permission = { state: 'prompt' };
  const storedPermission = localStorage.getItem('cameraPermission');
  if (storedPermission) {
    permission.state = storedPermission;
    return permission;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (stream) {
      permission.state = 'granted';
    }
  } catch {
    permission.state = 'denied';
  }
  if (permission.state === 'granted' || permission.state === 'denied') {
    localStorage.setItem('cameraPermission', permission.state);
  }
  return permission;
}

async function isNotificationAllowed() {
  const permission = await navigator.permissions.query({ name: 'notifications' });
  return !['denied', 'prompt'].includes(permission.state);
}

async function getDeviceInformation() {
  // const deviceInfo = {};
  // if (navigator.userAgentData) {
  //     const userAgent = await navigator.userAgentData.getHighEntropyValues(['platformVersion', 'model']);
  //     deviceInfo.userAgent = JSON.stringify(userAgent);
  //     deviceInfo.brands = userAgent.brands;
  //     deviceInfo.os = {
  //         name: userAgent.platform,
  //         version: userAgent.platformVersion
  //     };
  //     deviceInfo.device = {
  //         vendor: '-',
  //         model: userAgent.model
  //     };
  // } else {
  //     // useragent: it works on iphone-safari, old browser etc.
  //     const userAgent = new UAParser(navigator.userAgent);
  //     deviceInfo.userAgent = navigator.userAgent;
  //     deviceInfo.brands = [
  //         {
  //             brand: userAgent.browser.name,
  //             version: userAgent.browser.version
  //         }
  //     ];
  //     deviceInfo.os = {
  //         name: userAgent.os.name,
  //         version: userAgent.os.version
  //     };
  //     deviceInfo.device = {
  //         vendor: userAgent.device.vendor || '-',
  //         model: userAgent.device.model
  //     };
  // }
  // return deviceInfo;
}

async function userAgentString() {
  // let ua = UAParser(navigator.userAgent);
  // if (navigator.userAgentData) {
  //     ua = await navigator.userAgentData.getHighEntropyValues(['platformVersion', 'model']);
  // }
  // return JSON.stringify(ua);
}

function getDeviceType() {
  // let type = null;
  // const parseUserAgent = UAParser(navigator.userAgent);
  // if (parseUserAgent && parseUserAgent.device.type) {
  //     // provides either mobile or tablet
  //     type = parseUserAgent.device.type;
  // } else {
  //     // default for web and desktop
  //     type = 'Mobile';
  // }
  // return type;
}

async function uploadPictureToS3(preSignedUrl, file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', preSignedUrl);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve({ success: true });
        } else {
          reject({ success: false });
        }
      }
    };
    xhr.send(file);
  });
}

const getTimezoneLabel = (value) => {
  const allZones = Object.values(timezones).flat();
  const foundZone = allZones.find((zone) => zone.value === value);
  return foundZone ? foundZone.label : value;
};

function formatNumber(number) {
  let formattedNumber = 0.00;
  if (number) {
    formattedNumber = new Intl.NumberFormat('en-AU').format(number);
  }
  return formattedNumber;
}

function getSortParams(sortingState) {
  return {
    sortBy: sortingState[0]?.id || '',
    sortDirection: isNil(sortingState[0]?.desc)
      ? ''
      : sortingState[0].desc === true
        ? constants.sort.direction.desc
        : constants.sort.direction.asc,
  };
}

const getDurationName = (durationValue) => {
  switch (durationValue) {
    case enums.Duration.Yesterday:
      return 'Yesterday';
    case enums.Duration.Today:
      return 'Today';
    case enums.Duration.Last7Days:
      return 'Last 7 Days';
    case enums.Duration.ThisWeek:
      return 'This Week';
    case enums.Duration.ThisMonth:
      return 'This Month';
    case enums.Duration.CurrentWeek:
      return 'Current Week';
    case enums.Duration.CurrentMonth:
      return 'Current Month';
    case enums.Duration.LastMonth:
      return 'Last Month';
    case enums.Duration.ThreeMonths:
      return 'Last 3 Months';
    case enums.Duration.SixMonths:
      return 'Last 6 Months';
    case enums.Duration.TwelveMonths:
      return 'Last 12 Months';
    case enums.Duration.CurrentYear:
      return 'Current Year';
    case enums.Duration.PriorYear:
      return 'Prior Year';
    case enums.Duration.Between:
      return 'Custom Dates';
    default:
      return '';
  }
};

const getApiModeConfig = () => {
  const apiUrl = import.meta.env.VITE_SERVER_URL;
  if (typeof apiUrl === 'undefined' || apiUrl === '') {
    console.error(
      'VITE_SERVER_URL is not defined. Using default configuration.'
    );
    return {
      apiMode: 'Unknown',
      liveMode: false,
    };
  }
  if (apiUrl.includes('uat')) {
    return {
      apiMode: 'Uat',
      liveMode: false,
    };
  } else if (apiUrl.includes(':8080')) {
    return {
      apiMode: 'Local',
      liveMode: false,
    };
  } else {
    return {
      apiMode: 'Uat', // When live change to Live
      liveMode: false, // true
    };
  }
};

const createPdfUrlFromBase64 = (base64Data) => {
  // Decode the Base64 string into binary character string
  const byteCharacters = atob(base64Data);

  // Convert the character string into an array of byte numbers
  const byteNumbers = Array.from(byteCharacters).map((c) => c.charCodeAt(0));

  // Convert the array of byte numbers into a Uint8Array
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob object with the specified PDF MIME type
  const pdfBlob = new Blob([byteArray], { type: "application/pdf" });

  // Generate an object URL for the Blob
  const url = URL.createObjectURL(pdfBlob);

  return url;
}

const calculatePercentageValue = (price = 0, percent = 0) => {
  const total = (price * percent / 100);
  return Number(total.toFixed(2));
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
};

function getFileExtension(filename) {
  return filename.split('.').pop()
};

const handleConfirmDelete = async ({ setLoading, onDeleteRow, confirmDialog }) => {
  setLoading(true);
  await onDeleteRow();
  confirmDialog.onFalse();
  setLoading(false);
};

const numericSchema = (requiredMessage) =>
  zod.preprocess(
    (val) => (_.isNil(val) || val === '' ? undefined : Number(val)),
    zod.number({ required_error: requiredMessage })
      .min(1, { message: requiredMessage })
  );


export default {
  removeItemsFromArray,
  setItemToStorage,
  getItemFromStorage,
  removeItem,
  setTokensToStorage,
  getTokensFromStorage,
  clearLocalStorage,
  formatPath,
  generateBlobName,
  handleNumericKey,
  getFileName,
  isStandalone,
  cameraPermission,
  isNotificationAllowed,
  getDeviceInformation,
  userAgentString,
  getDeviceType,
  uploadPictureToS3,
  getTimezoneLabel,
  getSortParams,
  getDurationName,
  formatAddress,
  getApiModeConfig,
  createPdfUrlFromBase64,
  formatNumber,
  formatCurrency,
  getFileExtension,
  calculatePercentageValue,
  handleConfirmDelete,
  numericSchema,
};
