/* eslint-disable import/prefer-default-export */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  Route, Navigate, Routes,
} from 'react-router-dom';

import {
  AppProvider,
  PageWrap,
} from '@edx/frontend-platform/react';
import store from 'data/store';
import {
  APP_READY,
  APP_INIT_ERROR,
  initialize,
  subscribe,
  mergeConfig,
} from '@edx/frontend-platform';

import { configuration } from './config';

import messages from './i18n';

import NoticesWrapper from './components/NoticesWrapper';
import { LearnerDashboard as App, ErrorPage } from '@openedx/gym-frontend';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={store}>
      <NoticesWrapper>
        <Routes>
          <Route path="/" element={<PageWrap><App /></PageWrap>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NoticesWrapper>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(
    <ErrorPage message={error.message} />,
    document.getElementById('root'),
  );
});

export const appName = 'LearnerHomeAppConfig';

initialize({
  handlers: {
    config: () => {
      mergeConfig(configuration, appName);
    },
  },
  messages,
  requireAuthenticatedUser: true,
});
