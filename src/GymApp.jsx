import React from 'react';
import { Helmet } from 'react-helmet';

import { useIntl } from '@edx/frontend-platform/i18n';

import { ErrorPage, AppContext } from '@edx/frontend-platform/react';

import { Alert } from '@edx/paragon';

import { RequestKeys } from 'data/constants/requests';
import store from 'data/store';
import {
  selectors,
  actions,
} from 'data/redux';
import { reduxHooks } from 'hooks';
import Dashboard from './gym/containers/Dashboard';

import { ExperimentProvider } from 'ExperimentContext';

import track from 'tracking';

import fakeData from 'data/services/lms/fakeData/courses';

import AppWrapper from 'containers/WidgetContainers/AppWrapper';

import { getConfig } from '@edx/frontend-platform';

import GymSettings, { GymFooter, GymHeader } from '@edx/gym-frontend';

import messages from './messages';
import './GymApp.scss';

const config = getConfig();
const timestamp = Date.now();
const settings = await GymSettings;
const root = settings.urls.root; // should be same as marketing URL
const css = `${root}${settings.css.mfe}?${timestamp}`;
const title = `Learner Dashboard | ${getConfig().SITE_NAME}`;

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
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href={config.FAVICON_URL} type="image/x-icon" />
        <link rel="stylesheet" href={css} />
      </Helmet>
      <GymHeader secondaryNav="dashboard" />
        <main>
          <div className="container">
            <AppWrapper>

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

            </AppWrapper>

          </div>
        </main>
      <GymFooter />
    </>
  );
};

export default GymApp;
