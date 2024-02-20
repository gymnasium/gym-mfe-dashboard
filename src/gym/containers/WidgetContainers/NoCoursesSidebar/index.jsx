import React from 'react';
import PropTypes from 'prop-types';

import RecommendationsPanel from 'gym/widgets/RecommendationsPanel';
import hooks from 'gym/widgets/ProductRecommendations/hooks';

export const WidgetSidebar = ({ setSidebarShowing }) => {
  const { inRecommendationsVariant, isExperimentActive } = hooks.useShowRecommendationsFooter();

  React.useEffect(() => {
    if (!inRecommendationsVariant && isExperimentActive) {
      setSidebarShowing(true);
    }
  }, [setSidebarShowing]);

  if (!inRecommendationsVariant && isExperimentActive) {
    return (
      <div className="widget-sidebar px-2">
        <div className="d-flex">
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
