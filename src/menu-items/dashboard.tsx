import { DashboardOutlined, UserOutlined } from '@ant-design/icons';

const icons = {
  DashboardOutlined,
  UserOutlined
};

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'teacher-details',
      title: 'Teacher Details',
      type: 'item',
      url: '/check-teacher/:id',
      icon: icons.UserOutlined,
      breadcrumbs: true
    }
  ]
};

export default dashboard;
