# EduNest — Admin Web Panel

React + MUI admin panel for the EduNest school ERP. Used by **teachers and staff** to
manage classes, students, teachers, attendance, fees, exams, homework, announcements,
events, and a dashboard overview.

Part of a three-app system:

| Project | Role |
|---|---|
| **EduNest-Web** (this repo) | React admin panel — teachers / staff |
| `EduNest-App` | Flutter mobile app — students |
| `EduNest-Api` | Spring Boot REST API (serves both) |

## Getting started

```bash
npm install        # or: yarn
npm start          # dev server — HTTPS on https://localhost:3030
npm run build      # production build (vite)
npm run lint:fix   # eslint --fix
npm run fm:fix     # prettier
npm run fix:all    # lint:fix + fm:fix
```

- Node **20.x**, package manager **yarn 1.22**.
- **The dev server runs HTTPS** using local certs at `config/certs/localhost.{key,crt}`
  (see `vite.config.js`). If the server won't boot, those cert files are the usual cause.
- Set the API base URL via the `VITE_SERVER_URL` env var (in a `.env` file).

## Stack

- **React 18** + **Vite 6** (`@vitejs/plugin-react-swc`), plain **JavaScript/JSX** (no TypeScript)
- **MUI v6** (+ `@mui/lab`, `x-data-grid`, `x-date-pickers`) — built on the *Minimals* admin template
- **Redux Toolkit** + react-redux for global state
- **react-hook-form** + **zod** for forms, **axios** for HTTP
- **ApexCharts** for charts, `sonner` for toasts, `i18next` for i18n

Import alias: `src/...` maps to the `src` directory (`vite.config.js` + `jsconfig.json`).

## Architecture

### API layer

Two files own all backend communication:

- **`src/services/ApiService.js`** — every endpoint is a small named async function
  (`getStudentListAsync`, `saveClassAsync`, …) exported from one default object.
  Add new endpoints here, grouped by the existing `//Student`, `//Fee` style comments.
- **`src/services/AxiosService.js`** — axios defaults + interceptors:
  - attaches `Authorization: Bearer <sessionToken>` from the Redux store;
  - **unwraps the envelope** — components receive `{ data }` where `data` is the
    backend's inner `data` field, not the full `{success, errors, data}` body;
  - on 401 attempts a refresh via `renewSessionAsync`, then logs out on failure;
  - validation / bad-request errors resolve (not reject) as `{ data, errors }`, so
    callers check `errors` rather than using try/catch.

Base URL comes from `VITE_SERVER_URL`.

### Routing

- **`src/routes/paths.js`** is the single source of truth for URLs — never hardcode a
  path; add it here and reference `paths.dashboard.<module>`.
- Route trees live in `src/routes/sections/` (`auth`, `dashboard`, `main`, `guest`).
- Nav / menu items: `src/layouts/nav-config-dashboard.jsx`.

### Feature code layout

Each module is split across two directories:

- **`src/pages/<module>/`** — thin route components (`list.jsx`, `new.jsx`, `edit.jsx`)
- **`src/sections/<module>/`** — the real UI: `view/` (page views), plus dialogs,
  forms and table rows (e.g. `student-save-form.jsx`, `event-form-dialog.jsx`)

```
src/
  services/         ApiService.js, AxiosService.js
  routes/           paths.js, sections/ (auth, dashboard, main, guest)
  pages/<module>/   route components
  sections/<module>/ views, dialogs, table rows
  store/            Redux: authReducer, appReducer, snackbar
  auth/             JWT views, guards (auth / guest / role-based), context
  components/       template component library (hook-form, table, iconify, upload, …)
  layouts/          dashboard layout + nav-config
  utils/            enums.js, constants.js, utils.js, format helpers, azureBlob.js
  theme/  locales/  global-config.js
```

## Modules

Dashboard, Classes, Teachers, Students, Timetable, Attendance, Fees, Exams,
Announcements, Homework, Notes, Leave Requests. (Nav order in `nav-config-dashboard.jsx`.)

**Leave Requests** (`src/pages/leave`, `src/sections/leave`) — teacher-side review of
student-submitted leave requests: list by class/section (`getLeaveListAsync`) and
approve/reject (`updateLeaveStatusAsync`). Students submit these from the mobile app;
there's no leave-creation UI here.

The **Dashboard** (`src/sections/analytics`) reads `GET /dashboard/summary` for
student/teacher/class counts, today's attendance, monthly fee collection, upcoming
events, and latest announcements.

## Conventions

- Endpoint functions end in `Async` and live only in `ApiService.js`.
- Paths only from `paths.js`.
- Forms use `react-hook-form` with the `src/components/hook-form` wrappers and `zod` schemas.
- Components are `.jsx`; PropTypes are intentionally not used.

## Notes / gotchas

- This codebase was **adapted from a dental product** ("Dentory"). Some leftovers still
  exist (`src/pages/auth/dentist-*.jsx`, dental role names in `src/utils/enums.js`) —
  don't treat these as EduNest features.
- `src/sections/calendar/` is unused Minimals template code (imports uninstalled
  `@fullcalendar/*`) — there is no "Events" module and no live calendar-style feature
  in this app; don't reference either.
- `enums.roleType` and `enums.displayRole` disagree with each other — verify against the
  backend `role` table before relying on either.
- `firebase` and `@auth0/auth0-react` are dependencies but **unused** — `src/global-config.js`
  supports `auth.method: jwt | amplify | firebase | auth0` as a template feature, and this
  app is configured for `jwt` (the custom backend JWT flow described above). `src/lib/firebase.js`
  only initializes if `auth.method === 'firebase'`, which it never is here.

## Related projects

- `EduNest-Api` — Spring Boot API this app calls
- `EduNest-App` — Flutter mobile app (students)
