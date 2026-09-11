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

  dateTimeFormat: 'DD/MM/YYYY HH:mm',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: 'HH:mm',
  defaultErrorMessage: 'Sorry, something went wrong. Please refresh the page or log back in.',
  pageSize: 25,
  sort: {
    direction: {
      asc: 'asc',
      desc: 'desc',
    },
  },

  // Fee & Payment Constants
  PAYMENT_MODES: ['CASH', 'ONLINE', 'CHEQUE', 'CARD'],
  PAYMENT_MODE_OPTIONS: [
    { label: 'Cash', value: 'CASH' },
    { label: 'Online', value: 'ONLINE' },
    { label: 'Cheque', value: 'CHEQUE' },
    { label: 'Card', value: 'CARD' },
  ],
  PAYMENT_FREQUENCY_OPTIONS: [
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Half-Yearly', value: 'HALF_YEARLY' },
    { label: 'Annual', value: 'ANNUAL' },
  ],

  // Attendance Constants
  ATTENDANCE_STATUS_OPTIONS: [
    { value: 'P', color: 'success', label: 'Present' },
    { value: 'A', color: 'error', label: 'Absent' },
    { value: 'L', color: 'warning', label: 'Leave' },
    { value: 'H', color: 'info', label: 'Half Day' },
  ],

  // Announcement & Notice Constants
  ANNOUNCEMENT_AUDIENCE_OPTIONS: ['ALL', 'TEACHERS', 'PARENTS', 'STUDENTS'],
  ANNOUNCEMENT_PUBLISH_MODE_OPTIONS: [
    { value: 'NOW', label: 'Now' },
    { value: 'SCHEDULED', label: 'Publish Date' },
  ],

  // Holiday Constants
  HOLIDAY_TYPE_OPTIONS: [
    { value: 'NATIONAL', label: 'National Holiday' },
    { value: 'FESTIVAL', label: 'Festival' },
    { value: 'SCHOOL_EVENT', label: 'School Event' },
    { value: 'VACATION', label: 'Vacation / Break' },
    { value: 'OTHER', label: 'Other' },
  ],

  // Leave Constants
  LEAVE_STATUS_COLOR: {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'error',
  },
};

export default constants;
