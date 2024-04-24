import React from 'react';
import { Helmet } from 'react-helmet';

import { useIntl } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';

import { ErrorPage, AppContext } from '@edx/frontend-platform/react';
import { Alert } from '@edx/paragon';

import { GymFooter, GymHeader, timestamp } from '@edx/gym-frontend';

import { RequestKeys } from 'data/constants/requests';
import store from 'data/store';
import {
  selectors,
  actions,
} from 'data/redux';
import { reduxHooks } from 'hooks';
import Dashboard from 'containers/Dashboard';
import { ExperimentProvider } from 'ExperimentContext';

import track from 'tracking';

import fakeData from 'data/services/lms/fakeData/courses';

import AppWrapper from 'containers/WidgetContainers/AppWrapper';

import { getConfig } from '@edx/frontend-platform';
import messages from './messages';
import './GymApp.scss';

const getBaseUrl = () => getConfig().MARKETING_SITE_BASE_URL;
const getSiteName = () => getConfig().SITE_NAME;
const getFaviconUrl = () => getConfig().FAVICON_URL;

const getStyles = () => `${getBaseUrl()}/css/mfe-learner-dashboard.css?${timestamp}`;
const title = `Learner Dashboard | ${getSiteName()}`;

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
    if (authenticatedUser?.administrator || getConfig().NODE_ENV === 'development') {
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
  }, [authenticatedUser, loadData]);
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="shortcut icon" href={getFaviconUrl()} type="image/x-icon" />
        <link rel="stylesheet" href={getStyles()} />

      </Helmet>
      <AppWrapper>
        <GymHeader secondaryNav="dashboard" />
        <main>
          <div className="container">
          {hasNetworkFailure
            ? (
              <Alert variant="danger">
                <ErrorPage message={formatMessage(messages.errorMessage, { supportEmail })} />
              </Alert>
            ) : (
              <ExperimentProvider>
                <Dashboard />
              </ExperimentProvider>
            )}
          </div>
        </main>
        <GymFooter />
      </AppWrapper>
    </>
  );
};

export default GymApp;
