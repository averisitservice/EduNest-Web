import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/global-config';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;
const ICONS = {
  teacher: icon('ic-user'),
  lock: icon('ic-lock'),
  banking: icon('ic-banking'),
  device: icon('ic-device'),
  doctor: icon('ic-doctor'),
  patient: icon('ic-patient'),
  clinical: icon('ic-clinical'),
  home: icon('ic-visits'),
  dashboard: icon('ic-dashboard'),
  notifications: icon('ic-notifications'),
  logs: icon('ic-logs'),
  category: icon('ic-category'),
  jobs: icon('ic-jobs'),
  product: icon('ic-products'),
  item: icon('ic-items'),
  rateCard: icon('ic-pricing'),
  stockPurchase: icon('ic-receiveStock'),
  stockTake: icon('ic-stockTake'),
  shipment: icon('ic-shipment'),
  site: icon('ic-site'),
  invoice: icon('ic-invoice'),
  tenant: icon('ic-tenant'),
  stage: icon('ic-calender'),
  analytics: icon('ic-analytics'),
  supplier: icon('ic-supplier'),
  student: icon('ic-course'),
};

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: 'Management',
    items: [
      {
        title: 'Classes',
        path: paths.dashboard.class.root,
        icon: ICONS.site,
      },
      {
        title: 'Teachers',
        path: paths.dashboard.teacher.root,
        icon: ICONS.teacher,
      },
      {
        title: 'Students',
        path: paths.dashboard.student.root,
        icon: ICONS.student,
      },
      {
        title: 'Timetable',
        path: paths.dashboard.timetable.root,
        icon: ICONS.stage,
      },
      {
        title: 'Attendance',
        path: paths.dashboard.attendance.root,
        icon: ICONS.patient,
      },
      {
        title: 'Fees',
        path: paths.dashboard.fees.root,
        icon: ICONS.invoice,
      },
      {
        title: 'Exams',
        path: paths.dashboard.exam.root,
        icon: ICONS.rateCard,
      },
      {
        title: 'Announcements',
        path: paths.dashboard.announcement.root,
        icon: ICONS.notifications,
      },
      {
        title: 'Homework & Notes',
        path: paths.dashboard.homework.root,
        icon: ICONS.logs,
      },
      {
        title: 'Events',
        path: paths.dashboard.event.root,
        icon: ICONS.stage,
      },
    ],
  },
];
