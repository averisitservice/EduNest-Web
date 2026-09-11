const enums = {
  snackbar: {
    type: {
      error: 'error',
      info: 'info',
      success: 'success',
      warning: 'warning',
    },
  },

  displayRole: {
    1: 'Super Admin',
    2: 'School Admin',
    3: 'Principal',
    4: 'Vice Principal',
    5: 'Teacher',
  },

  ApiResult: {
    ValidationError: 422,
    BadRequest: 400,
    NotFound: 404,
    Forbidden: 403,
    AccessDenied: 401,
  },
};

export default enums;
