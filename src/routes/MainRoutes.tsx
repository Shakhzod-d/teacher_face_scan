import { lazy } from 'react';

import Loadable from '../components/Loadable';
import Dashboard from '../layout/Dashboard';

const DashboardDefault = Loadable(lazy(() => import('../pages/dashboard/DashboardDefault')));

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    }
  ]
};

export default MainRoutes;
