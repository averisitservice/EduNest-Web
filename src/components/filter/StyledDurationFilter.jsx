/* eslint-disable react-hooks/exhaustive-deps */
import { Button, FormControlLabel, Menu, MenuItem, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import enums from 'src/utils/enums.js';

import { Iconify } from '../iconify';

import utils from 'src/utils/utils';
import DateRangePicker from './DateRangePicker';

export default function StyledDurationFilter({
  onDurationChange,
  minDate,
  maxDate,
  resetDuration,
  defaultDuration,
  isDashboard = false,
  isAnalytics = false,
  isInventory = false,
  startDate = null,
  endDate = null,
}) {
  const [durationAnchorEl, setDurationAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(defaultDuration);

  useEffect(() => {
    if (resetDuration) {
      setSelectedFilter(defaultDuration);
    } else {
      setSelectedFilter(selectedFilter);
    }
  }, [selectedFilter, resetDuration]);

  const handleDurationChange = (value) => {
    setSelectedFilter(value);
    if (value === enums.Duration.Between) {
      onDurationChange(value, null, null);
    } else {
      setSelectedFilter(value);
      onDurationChange(value);
    }
    setDurationAnchorEl(null);
  };

  const getSelectedList = () => {
    if (isDashboard) return Object.values(enums.dashboardDuration);
    if (isAnalytics) return Object.values(enums.analyticsDuration);
    if (isInventory) return Object.values(enums.inventoryDuration);
    return Object.values(enums.Duration);
  };
  const selectedList = getSelectedList();

  return (
    <>
      <Stack sx={{ flexDirection: { xs: 'column', sm: 'row' } }} spacing={1}>
        <FormControlLabel
          control={
            <Button
              aria-controls="duration-menu"
              color="primary"
              variant="contained"
              aria-haspopup="true"
              sx={{ whiteSpace: 'nowrap' }}
              onClick={(event) => setDurationAnchorEl(event.currentTarget)}
              endIcon={<Iconify icon="mingcute:down-line" />}
            >
              {utils.getDurationName(selectedFilter)}
            </Button>
          }
          sx={{ mr: { xs: 0.1, sm: 0.1 } }}
        />
      </Stack>
      <DateRangePicker
        showDateRangePicker={selectedFilter === enums.Duration.Between}
        minDate={minDate}
        maxDate={maxDate}
        onDateChanges={(start, end) => {
          if (selectedFilter === enums.Duration.Between) {
            onDurationChange(enums.Duration.Between, start, end);
          }
        }}
        resetDuration={resetDuration}
        sDate={startDate}
        eDate={endDate}
      />
      <Menu
        id="duration-menu"
        anchorEl={durationAnchorEl}
        keepMounted
        open={Boolean(durationAnchorEl)}
        onClose={() => setDurationAnchorEl(null)}
      >
        {selectedList.map((duration, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleDurationChange(duration);
              setDurationAnchorEl(null);
            }}
          >
            {utils.getDurationName(duration)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
