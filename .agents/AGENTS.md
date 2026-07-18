# Custom Agent Rules

- **No Optional Chaining or Nullish Coalescing**: Do not use optional chaining (`?.`) or nullish coalescing (`??`) operators in Javascript / JSX files. Use standard checks like `&&` or ternary conditional checks instead.
- **API Call Error Handling**: Do not wrap frontend `get` API calls (calls to `ApiService.get...` or `ApiService.getAll...`) in local `try-catch` blocks. Let errors bubble up to the global error boundaries or interceptors.
- **Table / List Toolbar**: For search and filter UI components on list or table views, use the standard `TableToolbar` component (`src/sections/table-toolbar.jsx`) instead of designing custom text fields and stacks.
- **Form Dialog Actions Layout**: For dialogs containing save/update forms, set `<DialogActions>` alignment to `sx={{ justifyContent: 'flex-start' }}`. Include a primary action button and an error-outlined cancel/close button.
- **Form Validation**: Use Zod schemas (using `zodResolver` from `@hookform/resolvers/zod`) paired with `react-hook-form` and the workspace custom `Field` wrapper components (`Field.Text`, `Field.Select`, `Field.DatePicker`) for handling forms and dialog inputs.
