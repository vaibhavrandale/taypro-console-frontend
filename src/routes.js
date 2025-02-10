import React from 'react';

const App = React.lazy(() => import('./views/pages/app/App'));
const UserBasedLinkDashboard = React.lazy(() =>
  import('./views/dashboard/UserBasedLinkDashboard')
);

//master admin

const MasterAdminDashboard = React.lazy(() =>
  import('./views/master-admin/MasterAdminDashboard')
);
const LoraConfiguration = React.lazy(() =>
  import('./views/master-admin/replace-lora/LoraConfiguration')
);

const ReplaceLora = React.lazy(() =>
  import('./views/master-admin/replace-lora/ReplaceLora')
);

const ActiveRobots = React.lazy(() =>
  import('./views/master-admin/replace-lora/ActiveRobots')
);
const InActiveRobots = React.lazy(() =>
  import('./views/master-admin/replace-lora/InActiveRobots')
);

const AddRobotUsingLoraNo = React.lazy(() =>
  import('./views/master-admin/add-robot/AddRobotUsingLoraNo')
);

const Clients = React.lazy(() => import('./views/pages/clients/Clients'));
const ClientsData = React.lazy(() =>
  import('./views/pages/clients/ClientData')
);

const ServiceTicketDashboard = React.lazy(() =>
  import('./views/master-admin/service-tickets/ServiceTicketDashboard')
);

const CreateNewServiceTicket = React.lazy(() =>
  import('./views/master-admin/service-tickets/CreateServiceTicket')
);

const InternalTicketsDashboard = React.lazy(() =>
  import('./views/master-admin/internal-tickets/InternalTicketsDashboard')
);

const CreateNewInternalTicket = React.lazy(() =>
  import('./views/master-admin/internal-tickets/CreateNewInternalTicket')
);

const UsersDashboard = React.lazy(() =>
  import('./views/master-admin/users/UsersDashboard')
);

const Notifications = React.lazy(() =>
  import('./views/master-admin/notifications/Notifications')
);

const AllSiteCleaningLog = React.lazy(() =>
  import('./views/master-admin/all-site-cleaninglog/AllSiteCleaningLog')
);

const SitewaiseLog = React.lazy(() =>
  import('./views/master-admin/all-site-cleaninglog/SitewaiseLog')
);

const Gateways = React.lazy(() =>
  import('./views/master-admin/gateways/Gateways')
);

const UpdateGateway = React.lazy(() =>
  import('./views/master-admin/gateways/UpdateGateway')
);

//master admin

//service admin
const ServiceAdminDahboard = React.lazy(() =>
  import('./views/service-admin/ServiceAdminDashboard')
);
//service admin

//common pages

const SiteManagement = React.lazy(() =>
  import('./views/pages/site-management/SiteManagement')
);

const BlockManagement = React.lazy(() =>
  import('./views/pages/site-management/BlockManagement')
);

const RobotOperating = React.lazy(() =>
  import('./views/pages/site-management/RobotOperating')
);

const DebugLog = React.lazy(() =>
  import('./views/pages/site-management/DebugLog')
);

const CleaningLog = React.lazy(() =>
  import('./views/pages/site-management/CleaningLog')
);

const SearchRobot = React.lazy(() =>
  import('./views/pages/site-management/SearchRobot')
);

const TayproDashboard = React.lazy(() =>
  import('./views/pages/site-management/TayproDashboard')
);
const Robots = React.lazy(() => import('./views/master-admin/robots/Robots'));

const UpdateRobots = React.lazy(() =>
  import('./views/master-admin/robots/UpdateRobot')
);

// const Timers = React.lazy(() => import('./views/pages/timers/Timers'));
const Timers = React.lazy(() => import('./views/master-admin/timers/Timers'));
//common pages

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));

const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
const Typography = React.lazy(() =>
  import('./views/theme/typography/Typography')
);

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'));
const Breadcrumbs = React.lazy(() =>
  import('./views/base/breadcrumbs/Breadcrumbs')
);
const Cards = React.lazy(() => import('./views/base/cards/Cards'));
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
const ListGroups = React.lazy(() =>
  import('./views/base/list-groups/ListGroups')
);
const Navs = React.lazy(() => import('./views/base/navs/Navs'));
const Paginations = React.lazy(() =>
  import('./views/base/paginations/Paginations')
);
const Placeholders = React.lazy(() =>
  import('./views/base/placeholders/Placeholders')
);
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
const Progress = React.lazy(() => import('./views/base/progress/Progress'));
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'));
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
const Tables = React.lazy(() => import('./views/base/tables/Tables'));
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
const ButtonGroups = React.lazy(() =>
  import('./views/buttons/button-groups/ButtonGroups')
);
const Dropdowns = React.lazy(() =>
  import('./views/buttons/dropdowns/Dropdowns')
);

//Forms
const ChecksRadios = React.lazy(() =>
  import('./views/forms/checks-radios/ChecksRadios')
);
const FloatingLabels = React.lazy(() =>
  import('./views/forms/floating-labels/FloatingLabels')
);
const FormControl = React.lazy(() =>
  import('./views/forms/form-control/FormControl')
);
const InputGroup = React.lazy(() =>
  import('./views/forms/input-group/InputGroup')
);
const Layout = React.lazy(() => import('./views/forms/layout/Layout'));
const Range = React.lazy(() => import('./views/forms/range/Range'));
const Select = React.lazy(() => import('./views/forms/select/Select'));
const Validation = React.lazy(() =>
  import('./views/forms/validation/Validation')
);

const Charts = React.lazy(() => import('./views/charts/Charts'));

// Icons
const CoreUIIcons = React.lazy(() =>
  import('./views/icons/coreui-icons/CoreUIIcons')
);
const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
const Brands = React.lazy(() => import('./views/icons/brands/Brands'));

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'));

const Widgets = React.lazy(() => import('./views/widgets/Widgets'));

const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/dashboard2', name: 'Dashboard', element: Dashboard },

  {
    path: '/user-dashboard',
    name: 'User Links',
    element: UserBasedLinkDashboard,
  },

  // new features
  { path: '/apps', name: 'App', element: App },

  // master admin
  {
    path: '/master-admin/dashboard',
    name: 'Master Admin Dashboard',
    element: MasterAdminDashboard,
  },
  {
    path: '/master-admin/site-management/all-site-data',
    name: 'Taypro All Site Data',
    element: TayproDashboard,
  },
  {
    path: '/master-admin/site-management',
    name: 'Site Management',
    element: SiteManagement,
  },
  {
    path: '/master-admin/site-management/block-management/:site_id',
    name: 'Block Management',
    element: BlockManagement,
  },
  {
    path: '/master-admin/site-management/block-management/:site_id/:block/:robot_no',
    name: 'Robot Configuration',
    element: RobotOperating,
  },

  {
    path: '/master-admin/search-robot',
    name: 'Search Robot',
    element: SearchRobot,
  },

  {
    path: '/master-admin/site-management/block-management/:site_id/:block/:robot_no/debug_logs',
    name: 'Debug Log',
    element: DebugLog,
  },

  {
    path: '/master-admin/site-management/block-management/:site_id/:block/:robot_no/cleaning_logs',
    name: 'Cleaning Log',
    element: CleaningLog,
  },
  {
    path: '/master-admin/lora-configuration',
    name: 'Lora Configuration',
    element: LoraConfiguration,
  },
  {
    path: '/master-admin/replace-lora',
    name: 'Replace Lora',
    element: ReplaceLora,
  },
  {
    path: '/master-admin/replace-lora/in-active-robots',
    name: 'In Active Robots',
    element: InActiveRobots,
  },
  {
    path: '/master-admin/replace-lora/active-robots',
    name: 'Active Robots',
    element: ActiveRobots,
  },

  {
    path: '/master-admin/add-robot/add-robot-using-lorano',
    name: 'Add Robot',
    element: AddRobotUsingLoraNo,
  },

  {
    path: '/master-admin/clients',
    name: 'Clients data',
    element: Clients,
  },

  {
    path: '/master-admin/clients/clients-data/:client_id',
    name: 'Client data',
    element: ClientsData,
  },
  {
    path: '/master-admin/robots',
    name: 'All Robots',
    element: Robots,
  },
  {
    path: '/master-admin/robots/:client_id',
    name: 'Update Robot',
    element: UpdateRobots,
  },
  {
    path: '/master-admin/timers',
    name: 'Update Timers',
    element: Timers,
  },

  {
    path: '/master-admin/service-tickets',
    name: 'Service Tickets',
    element: ServiceTicketDashboard,
  },
  {
    path: '/master-admin/service-tickets/create-new-ticket',
    name: 'Create new Tickets',
    element: CreateNewServiceTicket,
  },
  {
    path: '/master-admin/internal-tickets',
    name: 'Internal Tickets',
    element: InternalTicketsDashboard,
  },
  {
    path: '/master-admin/internal-tickets/create-new-internal-ticket',
    name: 'Create New Internal Tickets',
    element: CreateNewInternalTicket,
  },

  {
    path: '/master-admin/users',
    name: 'All Users',
    element: UsersDashboard,
  },

  {
    path: '/master-admin/notifications',
    name: 'Master Admin Notifications',
    element: Notifications,
  },

  {
    path: '/master-admin/all-site-cleaning-log',
    name: 'Master Admin All Site Cleaning Log',
    element: AllSiteCleaningLog,
  },

  {
    path: '/master-admin/all-site-cleaning-log/sitewise-cleaning-log/:site_id',
    name: 'Master Admin  Sitewise Cleaning Log',
    element: SitewaiseLog,
  },
  {
    path: '/master-admin/all-site-gateways',
    name: 'Master Admin  All Site Gateway/Router Status',
    element: Gateways,
  },
  {
    path: '/master-admin/update-gateway/:gatewayid',
    name: 'Master Admin  Update Gateway',
    element: UpdateGateway,
  },

  //master admin

  //service admin
  {
    path: '/service-admin',
    name: 'Service Admin Dashboard',
    element: ServiceAdminDahboard,
  },

  //service admin

  //common pages

  //common pages

  // existing features
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  {
    path: '/buttons/button-groups',
    name: 'Button Groups',
    element: ButtonGroups,
  },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  {
    path: '/forms/checks-radios',
    name: 'Checks & Radios',
    element: ChecksRadios,
  },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  {
    path: '/forms/floating-labels',
    name: 'Floating Labels',
    element: FloatingLabels,
  },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  {
    path: '/notifications',
    name: 'Notifications',
    element: Alerts,
    exact: true,
  },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
];

export default routes;
