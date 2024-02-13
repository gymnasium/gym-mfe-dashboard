import React from 'react';

import { reduxHooks } from 'hooks';
import { RequestKeys } from 'data/constants/requests';
import CourseList from 'gym/containers/CourseList';

import LoadedSidebar from 'gym/containers/WidgetContainers/LoadedSidebar';
import NoCoursesSidebar from 'gym/containers/WidgetContainers/NoCoursesSidebar';

import LoadingView from './LoadingView';
import DashboardLayout from './DashboardLayout';
import hooks from './hooks';
import './index.scss';

export const Dashboard = () => {
  hooks.useInitializeDashboard();
  const { pageTitle } = hooks.useDashboardMessages();
  const hasCourses = reduxHooks.useHasCourses();
  const initIsPending = reduxHooks.useRequestIsPending(RequestKeys.initialize);

  return (
    <div id="dashboard-container" className="d-flex flex-column p-2 pt-0">
      <h1 className="sr-only">{pageTitle}</h1>

      <div id="dashboard-content">
        {initIsPending
          ? (<LoadingView />)
          : (
            <DashboardLayout sidebar={hasCourses ? LoadedSidebar : NoCoursesSidebar}>
              <CourseList />
            </DashboardLayout>
          )}
      </div>
    </div>
  );
};

export default Dashboard;
