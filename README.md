# EduNest — Admin Web Panel

React + MUI admin panel for the **EduNest** school ERP. Used by **teachers and staff** to manage classes, students, teachers, attendance, fees, exams, homework, announcements, events, and a dashboard overview.

Part of a three-app system:

| Project | Role |
|---|---|
| **EduNest-Web** (this repo) | React admin panel — teachers / staff |
| `EduNest-App` | Flutter mobile app — students |
| `EduNest-Api` | Spring Boot REST API (serves both) |

---

## Getting Started

```bash
npm install        # install dependencies
npm start          # launch dev server — HTTPS on https://localhost:3030
npm run build      # production bundle build (vite)
npm run lint       # run ESLint check
npm run lint:fix   # ESLint fix automatically
npm run fm:fix     # run Prettier formatting
npm run fix:all    # run lint:fix + fm:fix
```

- **Node Version**: Node `20.x`, package manager `npm` / `yarn 1.22`.
- **HTTPS Dev Server**: The dev server runs on HTTPS using local certificates configured at `config/certs/localhost.{key,crt}` (see `vite.config.js`).
- **Environment Variables**: Configure the backend API base URL using `VITE_SERVER_URL` in your `.env` file (e.g. `VITE_SERVER_URL=https://localhost:8080`).

---

## Tech Stack

- **Framework**: React 18 + Vite 6 (`@vitejs/plugin-react-swc`), plain JavaScript/JSX
- **UI Library**: MUI v6 (+ `@mui/lab`, `@mui/x-date-pickers`) built on the *Minimals* admin template design system
- **State Management**: Redux Toolkit + react-redux
- **Form System**: `react-hook-form` + `zod` schema validation (`@hookform/resolvers/zod`)
- **HTTP Client**: Axios with global interceptors and envelope unwrapping
- **Charts & Toasts**: ApexCharts (`react-apexcharts`), Sonner (`src/components/snackbar`)
- **Date Handling**: Day.js (`dayjs`)

---

## Mandatory Project Rules & Standards

1. **No Optional Chaining or Nullish Coalescing**:
   - **Do NOT** use optional chaining (`?.`) or nullish coalescing (`??`) operators in Javascript / JSX files.
   - Use standard boolean checks (`&&`) or ternary conditional checks (`condition ? a : b`).

2. **API Call Error Handling**:
   - **Do NOT** wrap frontend `get` API calls (calls to `ApiService.get...` or `ApiService.getAll...`) in local `try-catch` blocks. Let errors bubble up to global error boundaries or interceptors.
   - For mutation endpoints (`save...`, `update...`, `delete...`), callers inspect `{ data, errors }` returned by Axios interceptors.

3. **Table / List Toolbar**:
   - For search and filter UI components on list or table views, use the standard `TableToolbar` component (`src/sections/table-toolbar.jsx`) instead of designing custom text fields and stacks.

4. **Form Dialog Actions Layout**:
   - For dialogs containing save/update forms, set `<DialogActions>` alignment to `sx={{ justifyContent: 'flex-start' }}`.
   - Include a primary action `<LoadingButton>` and an error-outlined `<Button>` for cancel/close.

5. **Form Validation & Inputs**:
   - Use Zod schemas (using `zodResolver` from `@hookform/resolvers/zod`) paired with `react-hook-form` and custom `Field.*` wrappers (`Field.Text`, `Field.Select`, `Field.DatePicker`, `Field.MultiSelect`, `Field.RadioGroup`).

6. **Empty States**:
   - All table and list views **MUST** display a standardized `"No data found"` message when no records are available.

7. **Date Picker Defaulting**:
   - `RHFDatePicker` ([`src/components/hook-form/rhf-date-picker.jsx`](file:///d:/Harshid/Projects/EduNest-Web/src/components/hook-form/rhf-date-picker.jsx)) automatically defaults unpopulated date fields to today's date (`YYYY-MM-DD`). Do not manually re-initialize date defaults in form components.

8. **Shared Utility Reuse**:
   - Use centralized helper functions from [`src/utils/utils.js`](file:///d:/Harshid/Projects/EduNest-Web/src/utils/utils.js) rather than writing duplicate inline functions:
     - `formatClassSection(option, fallback)`: Formats class and section labels into `"Class - Section"`.
     - `getFullName(person, fallback)`: Resolves full names for students or teachers.
     - `getInitials(name)`: Generates uppercase initials for avatars.
     - `formatTimeSlice(timeStr)`: Trims time strings to `"HH:mm"`.

---

## Detailed Project Structure

```
EduNest-Web/
├── .agents/                 # Workspace customization rules (AGENTS.md)
├── config/certs/            # SSL certificates for local HTTPS dev server
├── public/                  # Static assets and favicon
├── src/
│   ├── assets/              # Static images, icons, and illustrations
│   ├── auth/                # Auth guards (AuthGuard, GuestGuard, RoleBasedGuard) & JWT views
│   ├── components/          # Reusable UI component library
│   │   ├── custom-breadcrumbs/ # Custom Breadcrumbs header component
│   │   ├── custom-dialog/      # ConfirmDialog & bottom sheet wrappers
│   │   ├── hook-form/          # RHF wrappers (Field.Text, Field.Select, Field.DatePicker, Form)
│   │   ├── iconify/            # Iconify icon component
│   │   ├── loading-screen/     # SplashScreen & LoadingScreen
│   │   ├── snackbar/           # Toast notifications via Sonner
│   │   └── table/              # TableHeadCustom, TableNoData, TablePaginationCustom, useTable
│   ├── global-config.js     # App-wide global settings & auth method configuration
│   ├── layouts/             # Layout templates (DashboardLayout, NavVertical, AccountDrawer)
│   │   ├── components/      # Common layout header popovers & buttons
│   │   └── nav-config-dashboard.jsx # Dashboard sidebar navigation routes
│   ├── locales/             # i18n LocalizationProvider & translation hooks
│   ├── pages/               # Thin route entrypoints mapped directly to URLs
│   │   ├── analytics/       # Overview / Analytics page
│   │   ├── announcement/    # Announcements page
│   │   ├── attendance/      # Attendance marking & reports page
│   │   ├── exam/            # Exams list, create, edit & marks pages
│   │   ├── fees/            # Fee collection & history page
│   │   ├── holiday/         # Holidays page
│   │   ├── homework/        # Homework management page
│   │   ├── leave/           # Student leave requests review page
│   │   ├── note/            # Class notes management page
│   │   ├── student/         # Student list, new & edit pages
│   │   ├── teacher/         # Teacher list, new & edit pages
│   │   └── timetable/       # Timetable view page
│   ├── routes/              # Routing single source of truth
│   │   ├── paths.js         # URL path definitions (paths.dashboard.<module>)
│   │   └── sections/        # React Router section trees (dashboard, auth, main)
│   ├── sections/            # Real feature UI implementations
│   │   ├── analytics/       # Overview analytics widgets & summary cards
│   │   ├── announcement/    # Announcement table & notice-form-dialog
│   │   ├── attendance/      # AttendanceMark & AttendanceReport components
│   │   ├── exam/            # ExamSaveForm, ExamMarksView & ExamsView
│   │   ├── fees/            # FeeCollectDialog, FeeHistoryDialog & FeesView
│   │   ├── holiday/         # HolidayFormDialog & HolidayTableRow
│   │   ├── homework/        # HomeworkFormDialog & HomeworkView
│   │   ├── leave/           # LeaveView component
│   │   ├── note/            # NoteFormDialog & NotesView
│   │   ├── student/         # StudentSaveForm, StudentTableRow & StudentListView
│   │   ├── teacher/         # TeacherSaveForm, TeacherTableRow & TeacherListView
│   │   ├── table-toolbar.jsx # Standardized toolbar component for search/filters
│   │   └── timetable/       # TimetableEditDialog & TimetableView
│   ├── services/            # API communication layer
│   │   ├── ApiService.js    # Named API endpoint functions (getStudentListAsync, etc.)
│   │   └── AxiosService.js  # Axios instance, token interceptor & envelope unwrapping
│   ├── store/               # Redux Toolkit store, authReducer & appReducer
│   ├── theme/               # MUI Theme overrides, color palette & typography
│   └── utils/               # Constants, enums, dateHelper, and utils.js helpers
├── vite.config.js           # Vite configuration & HTTPS cert server setup
└── README.md                # Project documentation, SOP & rules
```

---

## Standard Operating Procedure (SOP) for Developers

### SOP 1: Creating a New Feature / Module
1. **Define Routes**: Add the URL path to [`src/routes/paths.js`](file:///d:/Harshid/Projects/EduNest-Web/src/routes/paths.js) under `paths.dashboard.<module>`.
2. **Add Sidebar Link**: Register the page route in [`src/layouts/nav-config-dashboard.jsx`](file:///d:/Harshid/Projects/EduNest-Web/src/layouts/nav-config-dashboard.jsx).
3. **Create Route Page**: Create a thin page wrapper under `src/pages/<module>/index.jsx`.
4. **Create Feature View**: Create the UI view component under `src/sections/<module>/view/<module>-view.jsx`.

### SOP 2: Adding an API Endpoint
1. Open [`src/services/ApiService.js`](file:///d:/Harshid/Projects/EduNest-Web/src/services/ApiService.js).
2. Define a new async function ending with `Async` (e.g. `saveStudentAsync`).
3. Call `AxiosService.get`, `AxiosService.post`, `AxiosService.put`, or `AxiosService.delete`.
4. Export the function from the default object in `ApiService.js`.

### SOP 3: Building a List or Table View
1. Use the `useTable()` hook from `src/components/table` to manage pagination and row selection.
2. Use [`TableToolbar`](file:///d:/Harshid/Projects/EduNest-Web/src/sections/table-toolbar.jsx) for the search box and filter dropdowns.
3. Render data inside `<TableBody>`.
4. Render `<TableNoData notFound={notFound} />` when data array is empty or search yields no results. Verify it displays `"No data found"`.

### SOP 4: Creating a Form Dialog or Save Form
1. Define a Zod schema using `zod.object({...})`.
2. Initialize `useForm` with `zodResolver(Schema)`.
3. Wrap form fields inside `<Form methods={methods} onSubmit={handleSubmit}>`.
4. Use `Field.Text`, `Field.Select`, `Field.DatePicker`, etc.
5. In dialogs, set `<DialogActions sx={{ justifyContent: 'flex-start' }}>` with a primary `<LoadingButton type="submit">` and an error-outlined `<Button onClick={onClose}>`.

### SOP 5: Verification & Quality Assurance
Before submitting any code change, execute:
```bash
npm run lint     # Ensure 0 ESLint errors & warnings
npm run build    # Ensure Vite production build succeeds
```
