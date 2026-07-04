import { cloneDeep, first, get, isDate, isEmpty, isNil, isNumber, map, omit, size } from 'lodash';
import qs from 'qs';
import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import constants from 'src/utils/constants';
import dateHelper from 'src/utils/dateHelper';
import enums from 'src/utils/enums';
import utils from 'src/utils/utils';

// default options
const defaultValueState = {
  [enums.queryFilter.pageIndex]: 1,
  [enums.queryFilter.pageSize]: constants.pageSize,
  [enums.queryFilter.sortDirection]: constants.sort.direction.desc,
};

const showErrorCount = 5;

const iQueryParam = {
  string: null,
  params: null,
  parsedObject: {},
};

export default function useQueryFilter({
  requiredParams = {},
  defaultParams = {},
  overrideParams = {},
  isMobileFilter = false,
  holdInitialize = false,
}) {
  // const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParam, setQueryParam] = useState(holdInitialize ? iQueryParam : makeQueryString());
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  function makeQueryString() {
    let string = null;

    // handling or validate search param first
    let parsedJson = validateCommonSearchParams();

    if (Object.keys(parsedJson).length === 0) {
      parsedJson = defaultParams;
    }

    // check override object is there then apply it
    if (Object.keys(overrideParams).length > 0) {
      parsedJson = {
        ...parsedJson,
        ...overrideParams, // override the params
      };
    }

    // this function executes only once for initialize
    // below is for mobile only to handle page
    if (isMobileFilter) {
      // if we don't override page so stored page will apply and create bug like
      // page stored as 10 then page applied with skipping previous records to avoid below is
      parsedJson.pageIndex = 1;
    }
    delete parsedJson.search;
    // convert object to string for query
    string = getString(parsedJson);
    // then finally set those objects
    return { string, params: searchParams, parsedObject: parsedJson };
  }

  function setObjectToQueryParam(jsonObj, isItem) {
    const removeObjects = [];
    let filterState = { ...jsonObj };

    if (filterState.startDate) {
      filterState.startDate = jsonObj.startDate;
    } else {
      removeObjects.push(enums.queryFilter.startDate);
    }

    if (filterState.endDate) {
      filterState.endDate = jsonObj.endDate;
    } else {
      removeObjects.push(enums.queryFilter.endDate);
    }

    if (!filterState.startDate && !filterState.endDate) {
      removeObjects.push(enums.queryFilter.duration);
    }

    if (!isNumber(filterState.status) || isNil(filterState.status)) {
      removeObjects.push(enums.queryFilter.status);
    }

    if (!isNumber(filterState.customerId) || isNil(filterState.customerId)) {
      removeObjects.push(enums.queryFilter.customerId);
    }
    // handle search
    if (isEmpty(filterState.search)) {
      removeObjects.push(enums.queryFilter.search);
    }

    // handle sortBy
    if (isEmpty(filterState.sortBy)) {
      removeObjects.push(enums.queryFilter.sortBy);
    }

    // handle sortDirection
    if (isEmpty(filterState.sortDirection)) {
      removeObjects.push(enums.queryFilter.sortDirection);
    }
    // handle sub item
    if (isItem === 1) {
      setSearchParams(filterState);
    }

    filterState = omit(filterState, removeObjects);

    // check override object is there then apply it
    if (Object.keys(overrideParams).length > 0) {
      filterState = {
        ...filterState,
        ...overrideParams, // override the params
      };
    }
    filterState.reset = filterState && filterState.reset ? null : true;
    return setQueryParam({
      string: getString(filterState),
      params: searchParams,
      parsedObject: filterState,
    });
  }

  function validateCommonSearchParams() {
    const searchObj = getObject(searchParams.toString());

    // validate all params
    // validate number fields
    map([enums.queryFilter.pageIndex, enums.queryFilter.pageSize], (key) => {
      if (searchObj[key]) {
        if (!isValidNumberField(key)) {
          searchObj[key] = defaultValueState[key];
        }
      }
    });

    // sortDirection
    if (searchObj[enums.queryFilter.sortDirection]) {
      if (
        ![constants.sort.direction.asc, constants.sort.direction.asc].includes(
          searchObj[enums.queryFilter.sortDirection]
        )
      ) {
        searchObj[enums.queryFilter.sortDirection] =
          defaultValueState[enums.queryFilter.sortDirection];
      }
    }
    // validate both from date and endDate
    if (searchObj[enums.queryFilter.startDate] && !isDate(searchObj[enums.queryFilter.startDate])) {
      delete searchObj[enums.queryFilter.startDate];
    }

    // validate both from date and endDate
    if (searchObj[enums.queryFilter.endDate] && !isDate(searchObj[enums.queryFilter.endDate])) {
      delete searchObj[enums.queryFilter.endDate];
    }

    // if startDate or endDate not present then remove statsPeriod
    if (!searchObj[enums.queryFilter.endDate] && !searchObj[enums.queryFilter.startDate]) {
      delete searchObj[enums.queryFilter.statsPeriod];
    }

    // check required value present if not then add
    if (Object.keys(searchObj).length > 0) {
      map(Object.keys(requiredParams), (key) => {
        if (!searchObj[key]) {
          searchObj[key] = requiredParams[key];
        }
      });
    }

    return searchObj;
  }

  function getString(jsonObj) {
    return qs.stringify(jsonObj, { arrayFormat: 'brackets' });
  }

  function getObject(string) {
    const obj = qs.parse(string, {
      arrayFormat: 'brackets',
      ignoreQueryPrefix: true,
      decoder: (str, defaultDecoder) => {
        if (str === 'true') return true;
        if (str === 'false') return false;
        return defaultDecoder(str); // Default behavior for other values
      },
    });

    // qs always returns string even date also
    // parse date here
    if (
      obj[enums.queryFilter.startDate] &&
      dateHelper.isValidDate(obj[enums.queryFilter.startDate])
    ) {
      obj[enums.queryFilter.startDate] = new Date(obj[enums.queryFilter.startDate]);
    }

    // for also endDate
    if (obj[enums.queryFilter.endDate] && dateHelper.isValidDate(obj[enums.queryFilter.endDate])) {
      obj[enums.queryFilter.endDate] = new Date(obj[enums.queryFilter.endDate]);
    }

    return obj;
  }

  function isValidNumberField(field) {
    const number = searchParams.get(field);
    return !isNaN(number) && Number(number) > 0;
  }

  function showErrors(errors) {
    if (size(errors) === 1) {
      const [key, value] = first(Object.entries(errors));

      const message = `Parameter (${key}): ${value}`;
      console.error('Message : ', message);
    }

    const messages = [];
    map(Object.keys(errors), (key, index) => {
      if (index < showErrorCount) {
        messages.push(`Parameter (${key}): ${get(errors, key)}`);
      }
    });
  }

  const paginationProps = {
    isSearchLoading,
    setIsSearchLoading,

    onClearSearch: () =>
      setObjectToQueryParam({
        ...cloneDeep(queryParam.parsedObject),
        pageIndex: 1,
        search: '',
      }),

    onSearch: (value) => {
      if (!isEmpty(value)) {
        setIsSearchLoading(true);
      }

      setObjectToQueryParam({
        ...cloneDeep(queryParam.parsedObject),
        pageIndex: 1,
        search: value,
      });
    },

    onSortByChange: (s) =>
      setObjectToQueryParam({
        ...cloneDeep(queryParam.parsedObject),
        ...utils.getSortParams(s),
      }),

    onRowChange: (event) =>
      setObjectToQueryParam({
        ...cloneDeep(queryParam.parsedObject),
        pageIndex: 1,
        pageSize: parseInt(event.target.value),
      }),

    onPageChange: (_, newPage) => {
      setObjectToQueryParam({
        ...cloneDeep(queryParam.parsedObject),
        pageIndex: newPage + 1,
      });
    },
  };

  return {
    queryParam,
    setObjectToQueryParam,
    currentPath: location.pathname,
    currentHash: location.hash,
    getString,
    showErrors,
    paginationProps,
  };
}
