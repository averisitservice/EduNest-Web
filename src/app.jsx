/* eslint-disable react-hooks/exhaustive-deps */
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { ProgressBar } from 'src/components/progress-bar';
import { defaultSettings, SettingsDrawer, SettingsProvider } from 'src/components/settings';
import { Snackbar } from 'src/components/snackbar';
import 'src/global.css';
import { LocalizationProvider } from 'src/locales';
import { I18nProvider } from 'src/locales/i18n-provider';
import { themeConfig, ThemeProvider } from 'src/theme';
import utils from 'src/utils/utils';
import { useNavigate } from 'react-router';

import apiService from './services/ApiService';
import './services/AxiosService';
import { login, logout, setTenantDetail } from './store/reducers/authReducer';

export default function App({ children }) {
  const dispatch = useDispatch();
  const tenantDetail = utils.getItemFromStorage('tenantDetail');
  const navigate = useNavigate();
  defaultSettings.primaryColor = tenantDetail && tenantDetail.primaryColor;
  useEffect(() => {
    bindInitData();
    updateFavicon();
  }, []);

  const bindInitData = async () => {
    const token = utils.getTokensFromStorage();
    dispatch(setTenantDetail(JSON.parse(tenantDetail)));
    let currentTokenUser = token && jwtDecode(token.session);
    if (currentTokenUser) {
      dispatch(login({ teacher: currentTokenUser, token }));
      // const { data } = await apiService.getUserInitializeAsync();
      // if (data && data.user && data.user.isTenantActive) {
      //   const user = { ...currentTokenUser, ...data.user };
      //   dispatch(login({ user, token }));
      // }
    } else {
      dispatch(logout());
    }
  };

  const updateFavicon = () => {
    if (tenantDetail) {
      const tenant = JSON.parse(tenantDetail);
      const faviconUrl = tenant && tenant.faviconUrl;
      if (faviconUrl) {
        const link = document.getElementById('favicon');
        if (link) {
          link.href = faviconUrl;
        } else {
          const newLink = document.createElement('link');
          newLink.id = 'favicon';
          newLink.rel = 'icon';
          newLink.type = 'image/x-icon';
          newLink.href = faviconUrl;
          document.head.appendChild(newLink);
        }
      }
    }
  };

  return (
    <BrowserRouter>
      <I18nProvider>
        <SettingsProvider defaultSettings={defaultSettings}>
          <LocalizationProvider>
            <ThemeProvider
              noSsr
              defaultMode={themeConfig.defaultMode}
              modeStorageKey={themeConfig.modeStorageKey}
            >
              <MotionLazy>
                <Snackbar />
                <ProgressBar />
                <SettingsDrawer defaultSettings={defaultSettings} />
                {children}
              </MotionLazy>
            </ThemeProvider>
          </LocalizationProvider>
        </SettingsProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}
