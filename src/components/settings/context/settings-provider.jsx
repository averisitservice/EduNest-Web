import { isEqual } from 'es-toolkit';
import { useLocalStorage } from 'minimal-shared/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { SETTINGS_STORAGE_KEY } from '../settings-config';

import { useSelector } from 'react-redux';
import { SettingsContext } from './settings-context';

// ----------------------------------------------------------------------

export function SettingsProvider({ children, defaultSettings: baseSettings, storageKey = SETTINGS_STORAGE_KEY }) {
  const { tenantDetail } = useSelector((state) => state.AuthReducer);
  const mergedDefaultSettings = useMemo(() => {
    const tenantPrimary = tenantDetail?.primaryColor;
    const configPrimary = baseSettings?.primaryColor || 'preset3';

    return {
      ...(baseSettings || {}),
      primaryColor: tenantPrimary || configPrimary,
    };
  }, [baseSettings, tenantDetail?.primaryColor]);

  const { state, setState, resetState, setField } = useLocalStorage(storageKey, mergedDefaultSettings);

  useEffect(() => {
    if (tenantDetail?.primaryColor) {
      setField('primaryColor', tenantDetail.primaryColor);
    }
  }, [tenantDetail?.primaryColor]);

  const [openDrawer, setOpenDrawer] = useState(false);

  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const canReset = !isEqual(state, mergedDefaultSettings);

  const onReset = useCallback(() => {
    resetState(mergedDefaultSettings);
  }, [mergedDefaultSettings, resetState]);

  const memoizedValue = useMemo(
    () => ({
      canReset,
      onReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
      state,
      setState,
      setField,
    }),
    [canReset, onReset, openDrawer, onCloseDrawer, onToggleDrawer, state, setField, setState]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}
