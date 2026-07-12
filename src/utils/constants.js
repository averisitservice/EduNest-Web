const constants = {
  unicode: {
    bull: '\u2022',
    dash: '\u2014',
    space: '\u00A0',
  },
  localStorageKey: {
    tokens: 'Tokens',
  },
  defaultCountryCode: 'IN',

  maxPaymentMethods: 3,
  defaultTimeZone: 'Australia/Melbourne',
  defaultTimeFormat: '24-Hour-Format',
  dateTimeFormat: 'DD/MM/YYYY HH:mm',
  dateFormat: 'DD/MM/YYYY',
  defaultDateTimeFormat: 'DD/MM/YYYY hh:mm A',
  timeFormat: 'HH:mm',
  Official: 'Official',
  Billing: 'Billing',
  defaultLang: 'en',
  DEFAULT_START_TIME: '08:00',
  DEFAULT_END_TIME: '17:00',
  defaultErrorMessage: 'Sorry, something went wrong. Please refresh the page or log back in.',
  units: {
    h: 'hours',
    m: 'min',
    s: 'sec',
  },
  displayUnits: {
    minutes: 'min',
  },
  pageSize: 25,
  sort: {
    direction: {
      asc: 'asc',
      desc: 'desc',
    },
  },

  displayJobStatus: {
    10: 'New',
    11: 'Cancelled',
    20: 'Job Printed',
    30: 'In Progress',
    40: 'Completed',
    50: 'Shipment Created',
    60: 'Dispatched',
    70: 'Invoiced',
    71: 'Refunded',
    80: 'Closed',
  },

  jobStatus: {
    New: 10,
  },

  displayInvoiceStatus: {
    1: 'Draft',
    2: 'Sent',
    3: 'OverDue',
    4: 'Paid',
  },

  transactionType: {
    IN: 'IN',
    OUT: 'OUT',
    ADJUSTMENT: 'ADJUSTMENT',
  },

  TaxPercent: {
    AUS: 10,
  },

  statsPeriods: [
    'Today',
    'Yesterday',
    'CurrentWeek',
    'Last7Days',
    'CurrentMonth',
    'LastMonth',
    'ThreeMonths',
    'SixMonths',
    'TwelveMonths',
    'CurrentYear',
    'PriorYear',
    'Between',
  ],
  googleMapApiKey: 'AIzaSyCraIAyAyknSxFkMmOZgAJdbDJ_Ji4kprc',

  ARCH_OPTIONS: [
    { label: 'Upper', value: 1, type: 'U' },
    { label: 'Lower', value: 2, type: 'L' },
  ],

  INVOICE_STATUS_OPTIONS: [
    { label: 'Draft', value: 1 },
    { label: 'Sent', value: 2 },
    { label: 'Overdue', value: 3 },
    { label: 'Paid', value: 4 },
  ],

  PRIORITY_OPTIONS: [
    { label: 'Low', value: 1 },
    { label: 'Medium', value: 2 },
    { label: 'High', value: 3 },
    { label: 'Critical', value: 4 },
  ],
  JOB_ACCESS_PERMISSION_OPTIONS: [
    { label: 'Allow All', value: 10 },
    { label: 'Manager Only', value: 20 },
    { label: 'No', value: 30 },
  ],
  AccountTypes: [
    // { label: 'Australia Post', value: 1 },
    // { label: 'Same Day Delivery', value: 2 },
    { label: 'StarTrack', value: 3 },
    { label: 'Uber', value: 4 },
    { label: 'Manual ', value: 5 },
    // { label: 'Doordash', value: 5 },
  ],
  PackagingTypes: [
    { label: 'Bag (BAG)', value: 'BAG' },
    { label: 'Carton (CTN)', value: 'CTN' },
    { label: 'Envelope (ENV)', value: 'ENV' },
    { label: 'Item (ITM)', value: 'ITM' },
    { label: 'Jiffy (JIF)', value: 'JIF' },
    { label: 'Pallet (PAL)', value: 'PAL' },
    { label: 'Satchel (SAT)', value: 'SAT' },
    { label: 'Skid (SKI)', value: 'SKI' },
  ],
  teethNotations: {
    UR: [11, 12, 13, 14, 15, 16, 17, 18],
    UL: [21, 22, 23, 24, 25, 26, 27, 28],
    LR: [41, 42, 43, 44, 45, 46, 47, 48],
    LL: [31, 32, 33, 34, 35, 36, 37, 38],
  },
  TAX_CODES: [
    { label: 'Output', value: 'OUTPUT' },
    { label: 'Exempt Output', value: 'EXEMPTOUTPUT' },
  ],
};

export default constants;
