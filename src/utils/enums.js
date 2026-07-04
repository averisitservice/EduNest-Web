
const enums = {
  snackbar: {
    type: {
      error: 'error',
      info: 'info',
      success: 'success',
      warning: 'warning',
    },
  },

  roleType: {
    Administrator: 1,
    Accounts: 2,
    Coordinator: 3,
    Manager: 4,
    Staff: 5,
    Dentist: 6,
    SuperAdmin: 99,
  },

  displayRole: {
    1: 'Super Admin',
    2: 'School Admin',
    3: 'Principal',
    4: 'Vice Principal',
    5: 'Teacher',
  },

  displayTenant: {
    1: 'ABANO',
  },
  ApiResult: {
    Ok: 200,
    Unauthorized: 201,
    BadRequest: 400,
    AccessDenied: 401,
    Forbidden: 403,
    NotFound: 404,
    Timeout: 408,
    ValidationError: 422,
    InternalServerError: 500,
    InsufficientStorage: 507,
  },
  Duration: {
    Today: 0,
    Yesterday: 1,
    CurrentWeek: 2,
    Last7Days: 3,
    CurrentMonth: 4,
    LastMonth: 5,
    ThreeMonths: 6,
    SixMonths: 7,
    TwelveMonths: 8,
    CurrentYear: 9,
    PriorYear: 10,
    Between: 11,
    ThisWeek: 12,
    ThisMonth: 13
  },
  encounterType: {
    'Clinical Study': 'Clinical Study',
    'Home Study': 'Home Study',
  },
  deviceType: {
    puck: 'Puck',
    kiosk: 'Kiosk',
    implant: 'Implant',
    mobile: 'Mobile',
  },
  noteType: {
    homeStudy: 'Home Study',
  },
  typeFilter: {
    daily: 'daily',
    weekly: 'weekly',
    monthly: 'monthly',
    yearly: 'yearly',
  },
  dashboardDuration: {
    Today: 0,
    NextWeek: 12,
    NextMonth: 13,
    Between: 11,
  },
  analyticsDuration: {
    Yesterday: 1,
    CurrentWeek: 2,
    Last7Days: 3,
    CurrentMonth: 4,
    LastMonth: 5,
    Between: 11,
  },
  inventoryDuration: {
    Today: 0,
    Yesterday: 1,
    CurrentWeek: 2,
    Last7Days: 3,
    CurrentMonth: 4,
    LastMonth: 5,
    Between: 11,
  },
  queryFilter: {
    pageIndex: 'pageIndex',
    pageSize: 'pageSize',
    search: 'search',
    sortBy: 'sortBy',
    showActive: 'showActive',
    sortDirection: 'sortDirection',
    startDate: 'startDate',
    endDate: 'endDate',
    type: 'type',
    status: 'status',
    shipmentStatus: 'shipmentStatus',
    customerId: 'customerId',
    ignorePagination: 'ignorePagination',
    owner: 'owner',
    organization: 'organization',
    role: 'role',
    duration: 'duration',
    active: 'active',
    timezone: 'timezone',
    accountType: 'accountType',
    isSubItem: 'isSubItem',
    isMyJobsOnly: 'isMyJobsOnly'
  },

  statsPeriod: {
    customDate: 'customDate',
  },

  displayAccountType: {
    1: 'Australia Post',
    2: 'Same Day Delivery',
    3: 'Star Track',
    4: 'Uber',
    5: 'Manual'
  },

  invoiceStatus: {
    Draft: 1,
    Sent: 2,
    Overdue: 3,
    Paid: 4,
  },

  jobStatus: {
    New: 10,
    Cancelled: 11,
    JobPrinted: 20,
    InProgress: 30,
    Completed: 40,
    ShipmentCreated: 50,
    ReadyToDispatch: 60,
    Invoiced: 70,
    Refunded: 71,
    Closed: 80,
    Skipped: 101
  },

  accountType: {
    'Australia Post': 1,
    'Same Day Delivery': 2,
    'Star Track': 3,
    'Uber': 4,
    'Manual': 5
  },
  toothCoverage: {
    0: 'No Tooth',
    1: 'Single Tooth',
    2: 'Tooth Range',
    3: 'Tooth Between',
  },
  itemType: {
    'Item': 0,
    'SubItem': 1,
  },
  workingHours: [
    { dayOfWeek: 0, name: 'Sunday', workingHours: 1, isActive: false },
    { dayOfWeek: 1, name: 'Monday', workingHours: 1, isActive: false },
    { dayOfWeek: 2, name: 'Tuesday', workingHours: 1, isActive: false },
    { dayOfWeek: 3, name: 'Wednesday', workingHours: 1, isActive: false },
    { dayOfWeek: 4, name: 'Thursday', workingHours: 1, isActive: false },
    { dayOfWeek: 5, name: 'Friday', workingHours: 1, isActive: false },
    { dayOfWeek: 6, name: 'Saturday', workingHours: 1, isActive: false }
  ],
  TaxType: {
    output: 'OUTPUT',
    exemptOutput: 'EXEMPTOUTPUT'
  }
};

export default enums;
