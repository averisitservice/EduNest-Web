import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { isNil } from 'lodash';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { z as zod } from 'zod';

export const ToolbarSchema = zod.object({
  search: zod.string().optional(),
});

const STATUS_OPTIONS = [
  { value: true, label: 'Active' },
  { value: false, label: 'Deleted' },
];

export function TableToolbar({ placeholder, filters, children, onFilterChange, size = 6, showActiveFilter = false, mb = 0 }) {
  const [search, setSearch] = useState(() => filters?.state?.search ?? '');
  const [isShowActive, setIsShowActive] = useState(() => isNil(filters?.state?.showActive) ? 'true' : filters?.state?.showActive);
  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(ToolbarSchema),
    defaultValues: filters?.search ?? '',
  });
  const { handleSubmit } = methods;

  const onFilterClick = handleSubmit(async () => {
    onFilterChange(search);
  });

  return (
    <Form methods={methods} onSubmit={onFilterClick}>
      <Box sx={{ p: 2.5 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 8, md: 8, lg: size }} mb={mb}>
            <Stack direction="row" spacing={2}>
              {showActiveFilter && <FormControl sx={{ minWidth: '150px' }}>
                <InputLabel shrink id="active">
                  Status
                </InputLabel>
                <Select
                  labelId="active"
                  name="status"
                  size="small"
                  label="Status"
                  placeholder="Status"
                  value={isShowActive}
                  onChange={(e) => { setIsShowActive(e.target.value); onFilterChange(e.target.value, 'showActive') }}
                  displayEmpty
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>}
              <TextField
                fullWidth
                name="search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder ?? 'Search'}
                size="small"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onFilterChange(search, 'search');
                  }
                }}
                slotProps={{
                  htmlInput: { maxLength: 50 },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                // fullWidth
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="eva:search-fill" />}
                onClick={() => onFilterChange(search, 'search')}
                sx={{
                  px: 3, flexShrink: 0,
                }}
              >Search
              </Button>
            </Stack>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 12, md: 12, lg: 6 }}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="nowrap"
              sx={{
                width: '100%',
                justifyContent: 'flex-end',
              }}
            >
              {children}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Form >
  );
}
