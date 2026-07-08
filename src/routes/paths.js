export const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  USER: '/user',
  PAYMENT: '/payment'
};

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  comingSoonLog: '/coming-soon-log',

  // AUTH
  auth: {
    signIn: `${ROOTS.AUTH}/sign-in`,
    signUp: `${ROOTS.AUTH}/sign-up`,
    changePassword: `${ROOTS.AUTH}/change-password`,
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    class: {
      root: `${ROOTS.DASHBOARD}/class`,
      list: `${ROOTS.DASHBOARD}/class/list`,
    },
    teacher: {
      root: `${ROOTS.DASHBOARD}/teacher`,
      list: `${ROOTS.DASHBOARD}/teacher/list`,
      new: `${ROOTS.DASHBOARD}/teacher/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/teacher/edit/${id}`
    },
    profile: {
      edit: (id) => `${ROOTS.DASHBOARD}/profile/edit/${id}`,
    },
  },
};
