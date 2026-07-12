# 🎓 EduNest Web Portal

> **EduNest** is a modern, high-performance web dashboard application designed for educational institutions (schools, universities, learning academies). It provides a robust interface for administrators to manage teachers, classes, and view comprehensive institutional analytics.

Built with **React 18**, **Material UI (MUI v6)**, **Redux Toolkit**, and **Vite**.

---

## 🚀 Features

- **📊 Institutional Analytics**: Interactive analytics dashboard containing metrics and visualizations powered by [ApexCharts](https://apexcharts.com/).
- **🧑‍🏫 Teacher Administration**: Comprehensive CRUD capabilities (Create, Read, Update, Delete) for teacher records, profiles, and employment types.
- **👶 Student Management**: Comprehensive CRUD capabilities (Create, Read, Update, Delete) for student profiles, class & section assignments, roll numbers, and parent/guardian details.
- **🏫 Class & Section Management**: Efficient management of classes, class master structures, and section assignments.
- **🔐 Modular Authentication**: Integrated with JWT authorization by default, with built-in hooks/configurations to easily swap/use Firebase, Auth0, or AWS Amplify.
- **🎨 Dynamic Theme & Branding Customizer**:
  - Live light/dark mode switcher.
  - Multi-tenant customization (branding assets, favicons, primary color overrides saved across sessions).
  - Built-in settings drawer for custom layouts, presets, and RTL adjustments.
- **🌐 Internationalization (i18n)**: Fully integrated localization engine supporting multiple languages and dynamic Right-to-Left (RTL) rendering.
- **⚡ Advanced UI/UX Components**: Seamless page transitions and micro-animations via [Framer Motion](https://www.framer.com/motion/), top-bar loading indicators, and custom Material UI Snackbar and Sonner notifications.

---

## 🛠️ Tech Stack & Architecture

| Category | Technology |
| :--- | :--- |
| **Core Framework** | [React 18](https://react.dev/) |
| **Build Tooling** | [Vite 6](https://vite.dev/) |
| **Design System** | [Material UI (MUI v6)](https://mui.com/), [Emotion](https://emotion.sh/) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) |
| **Routing** | [React Router v6 / v7](https://reactrouter.com/) (with Auth Guards) |
| **HTTP client** | [Axios](https://axios-http.com/) (with request/response interceptors) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Charts** | [ApexCharts](https://apexcharts.com/) |
| **Forms & Validation**| [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) |
| **Linting & Quality** | [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Knip](https://github.com/webpro/knip) |

---

## 📁 Project Structure

```text
EduNest-Web/
├── config/               # Prettier, environment, or lint configurations
├── public/               # Static assets (icons, images)
├── src/
│   ├── app.jsx           # App root initialization, providers wrapper
│   ├── main.jsx          # DOM rendering, router setup
│   ├── global-config.js  # Global app settings (firebase/auth/theme configs)
│   ├── global.css        # Global CSS overrides
│   ├── assets/           # Application-specific visual assets
│   ├── auth/             # Authentication guards, contexts, and helper hooks
│   ├── components/       # Reusable shared components (charts, scrollbars, settings, etc.)
│   ├── layouts/          # Page layouts (Dashboard layout, Auth layout, main)
│   ├── locales/          # Language files & i18n localization providers
│   ├── pages/            # View pages/routes (analytics, classes, teachers, auth)
│   ├── routes/           # Central routing configs, paths list, route hooks
│   ├── sections/         # Feature-specific component chunks used in pages
│   ├── services/         # API abstraction layers (AxiosService, ApiService)
│   ├── store/            # Redux store config, actions, and slices
│   ├── theme/            # MUI custom design system configurations, overrides, and providers
│   └── utils/            # Helper utility functions (storage, JWT decoders, formatting)
├── .env                  # Environment variables config
├── index.html            # Main HTML entry point
├── package.json          # Dependency and script manager
└── vite.config.js        # Vite bundler configuration
```

---

## ⚙️ Configuration & Environment Variables

Create or update the `.env` file in the root directory:

```env
# API Server base URL
VITE_SERVER_URL=http://localhost:8081

# Application version
VITE_APP_VERSION=1.0.0

# Assets prefix directory (if any)
VITE_ASSETS_DIR=

# Mapbox API key (optional, for map features)
VITE_MAPBOX_API_KEY=

# Firebase Auth Configuration (if Firebase Auth method is active)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APPID=
VITE_FIREBASE_MEASUREMENT_ID=
```

---

## 🧑‍💻 Getting Started

### Prerequisites

Ensure you have **Node.js (version 20.x recommended)** installed.

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate into the project folder
cd EduNest-Web

# Install dependencies
npm install
```

### Run Locally

To spin up the local development server (uses Vite):

```bash
npm start
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### Build for Production

To generate the optimized static build output in the `dist` folder:

```bash
npm run build
```

---

## 🧹 Code Quality & Formatting

To ensure consistent code style and identify errors, the project uses ESLint and Prettier.

- **Check Code Quality**:
  ```bash
  npm run lint
  ```
- **Automatically Fix Code Quality Issues**:
  ```bash
  npm run lint:fix
  ```
- **Automatically Format Code with Prettier**:
  ```bash
  npm run fm:fix
  ```
- **Run all Fixes (Format + Lint Fix)**:
  ```bash
  npm run fix:all
  ```

---

## 📦 API & Store Integration

- **API Requests**: All requests are centralized in `src/services/ApiService.js` which references standard configurations from `src/services/AxiosService.js`.
- **Redux Store**: Managed in `src/store/index.js`.
  - `AuthReducer` handles session login, session logout, and current tenant details.
  - `AppReducer` handles layout configuration parameters.
  - `snackbar` slice controls the global alerts display mechanism.

---

## 🔒 Authentication Flow

Change the active authentication mechanism in `src/global-config.js`:

```javascript
export const CONFIG = {
  auth: {
    method: 'jwt', // Options: 'jwt', 'amplify', 'firebase', 'auth0'
    skip: false,
    redirectPath: paths.dashboard.teacher.root, // Default land page
  },
};
```
