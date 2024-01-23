import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import {
  getConfig,
} from '@edx/frontend-platform';

import { useIntl } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';
import { initializeHotjar } from '@edx/frontend-enterprise-hotjar';

import { ErrorPage, AppContext } from '@edx/frontend-platform/react';
import { Alert } from '@edx/paragon';

import { RequestKeys } from 'data/constants/requests';
import store from 'data/store';
import {
  selectors,
  actions,
} from 'data/redux';
import { reduxHooks } from 'hooks';
import Dashboard from 'containers/Dashboard';

import track from 'tracking';

import fakeData from 'data/services/lms/fakeData/courses';

import GymSettings from 'gym-frontend-components/data/settings';
import GymHeader from 'gym-frontend-components/gym-header/GymHeader';

var timestamp = Date.now();
const settings = await GymSettings();
console.log(settings);
const root = settings.urls.root; // should be same as marketing URL
const config = getConfig();
const css = `${config.MARKETING_SITE_BASE_URL}${settings.css.mfe}?${timestamp}`;
const title = `Dashboard | ${settings.meta.title}`;

import messages from './messages';

import './App.scss';

export const GymApp = () => {
  const { authenticatedUser } = React.useContext(AppContext);
  const { formatMessage } = useIntl();
  const isFailed = {
    initialize: reduxHooks.useRequestIsFailed(RequestKeys.initialize),
    refreshList: reduxHooks.useRequestIsFailed(RequestKeys.refreshList),
  };
  const hasNetworkFailure = isFailed.initialize || isFailed.refreshList;
  const { supportEmail } = reduxHooks.usePlatformSettingsData();
  const loadData = reduxHooks.useLoadData();

  React.useEffect(() => {
    if (authenticatedUser?.administrator || process.env.NODE_ENV === 'development') {
      window.loadEmptyData = () => {
        loadData({ ...fakeData.globalData, courses: [] });
      };
      window.loadMockData = () => {
        loadData({
          ...fakeData.globalData,
          courses: [
            ...fakeData.courseRunData,
            ...fakeData.entitlementData,
          ],
        });
      };
      window.store = store;
      window.selectors = selectors;
      window.actions = actions;
      window.track = track;
    }
    // if (process.env.HOTJAR_APP_ID) {
    //   try {
    //     initializeHotjar({
    //       hotjarId: process.env.HOTJAR_APP_ID,
    //       hotjarVersion: process.env.HOTJAR_VERSION,
    //       hotjarDebug: !!process.env.HOTJAR_DEBUG,
    //     });
    //   } catch (error) {
    //     logError(error);
    //   }
    // }
  }, [authenticatedUser, loadData]);
  return (
    <Router>
      <Helmet>
        <title>{title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
        <link rel="stylesheet" href={css} />
      </Helmet>
      <GymHeader secondaryNav="account" />
      <main>
        <div className="container">
          {hasNetworkFailure
            ? (
              <Alert variant="danger">
                <ErrorPage message={formatMessage(messages.errorMessage, { supportEmail })} />
              </Alert>
            ) : (<Dashboard />)}
        </div>
      </main>
      {/* <Footer /> */}
    </Router>
  );
};

export default GymApp;
