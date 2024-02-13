import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import RecommendationsPanel from 'gym/widgets/RecommendationsPanel';
import hooks from 'gym/widgets/ProductRecommendations/hooks';

export const WidgetSidebar = ({ setSidebarShowing }) => {
  const { inRecommendationsVariant, isExperimentActive } = hooks.useShowRecommendationsFooter();

  useEffect(() => {
    if (!inRecommendationsVariant && isExperimentActive) {
      setSidebarShowing(true);
    }
  }, [setSidebarShowing]);

  if (!inRecommendationsVariant && isExperimentActive) {

    return (
      <div className="widget-sidebar">
        <div className="d-flex flex-column">
          <RecommendationsPanel />
        </div>
      </div>
    );
  }

  return null;
};

WidgetSidebar.propTypes = {
  setSidebarShowing: PropTypes.func.isRequired,
};

export default WidgetSidebar;
