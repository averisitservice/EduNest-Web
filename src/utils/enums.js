
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
};

export default enums;
