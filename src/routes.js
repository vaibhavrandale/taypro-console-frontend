import React from "react";
import PreventiveMaintanancrDashboard from "./views/master-admin/preventive-maintanance/PreventiveMaintanancrDashboard";
import UpdatePreventivemaintanance from "./views/master-admin/preventive-maintanance/UpdatePreventivemaintanance";
import CreatePreventivemaintanance from "./views/master-admin/preventive-maintanance/CreatePreventivemaintanance";
import ExternalUsersDashboard from "./views/master-admin/users/ExternalUsersDashboard";
import ResolveServiceTicket from "./views/master-admin/service-tickets/ResolveServiceTicket";
import UpdateInternalTicket from "./views/master-admin/internal-tickets/UpdateInternalTicket";
import UpdateDpr from "./views/master-admin/all-site-dpr/UpdateDpr";
import PreventiveMaintananceNotifications from "./views/master-admin/preventive-maintanance/PreventiveMaintananceNotifications";
import ViewPreventivemaintananceQuaterly from "./views/master-admin/preventive-maintanance/ViewPreventivemaintananceQuaterly";
import TayproDashboard from "./views/master-admin/site-management/TayproDashboard";
import SiteManagement from "./views/master-admin/site-management/SiteManagement";
import BlockManagement from "./views/master-admin/site-management/BlockManagement";
import RobotOperating from "./views/master-admin/site-management/RobotOperating";
import DebugLog from "./views/master-admin/site-management/DebugLog";
import CleaningLog from "./views/master-admin/site-management/CleaningLog";
import NewDownlink from "./views/master-admin/site-management/NewDownlink";
import UpdateDownlink from "./views/master-admin/site-management/UpdateDownlink";
import ViewDownlink from "./views/master-admin/site-management/ViewDownlink";
import ClientDashboard from "./views/client-admin/site-management/ClientDashboard";
import ClientSiteManagement from "./views/client-admin/site-management/ClientSiteManagement";
import ClientBlockManagement from "./views/client-admin/site-management/ClientBlockManagement";
import ClientRobotOperating from "./views/client-admin/site-management/ClientRobotOperating";
import ClientTimers from "./views/client-admin/timers/ClientTimers";
import ClientUpdateTimer from "./views/client-admin/timers/ClientUpdateTimer";
import ClientUsersManagement from "./views/client-admin/Users/ClientUsersManagement";
import Sites from "./views/client-admin/cleaninglog/Sites";
import ClientCleaningLog from "./views/client-admin/cleaninglog/ClientCleaningLog";
import ShiftBlockwiseRobots from "./views/master-admin/robots/ShiftBlockwiseRobots";
import SiteTechnicianDashboard from "./views/site-technician/SiteTechnicianDashboard";
import AllSiteData from "./views/site-technician/AllSiteData";
import SiteTechnicianSiteManagement from "./views/site-technician/site-management/SiteTechnicianSiteManagement";
import SiteTechnicianBlockManagement from "./views/site-technician/site-management/SiteTechnicianBlockManagement";
import SiteTechnicianRobotOperating from "./views/site-technician/site-management/SiteTechnicianRobotOperating";
import SiteTechnicianTimers from "./views/site-technician/timers/SiteTechnicianTimers";
import SiteTechnicianUpdateTimer from "./views/site-technician/timers/SiteTechnicianUpdateTimer";
import SiteTechnicianSites from "./views/site-technician/cleaninglog/SiteTechnicianSites";
import SiteTechnicianCleaningLog from "./views/site-technician/cleaninglog/SiteTechnicianCleaningLog";
import SiteTechnicianServiceTicketDashboard from "./views/site-technician/service-tickets/SiteTechnicianServiceTicketDashboard";
import SiteTechnicianCreateServiceTicket from "./views/site-technician/service-tickets/SiteTechnicianCreateServiceTicket";
import SiteTechnicianResolveServiceTicket from "./views/site-technician/service-tickets/SiteTechnicianResolveServiceTicket";
import SiteTechnicianDprDashboard from "./views/site-technician/dpr/SiteTechnicianDprDashboard";
import SiteTechnicianAddDpr from "./views/site-technician/dpr/SiteTechnicianAddDpr";
import InventoryTab from "./views/site-technician/inventories/SiteTechnicianInventories";
import TechnicianAttendanceDashboard from "./views/master-admin/technician-attendance/TechnicianAttendanceDashboard";
import RobotActivity from "./views/master-admin/site-management/RobotActivity";

import {
  ServiceUserRoute,
  ProjectAdminRoute,
  MasterAdminRoute,
  ServiceAdminRoute,
  ClientAdminRoute,
  ClientSiteTechnicianRoute,
  ClientSiteInchargeRoute,
  MasterUserRoute,
  ProjectUserRoute,
  SiteTechnicianRoute,
  OpexClientAdmin,
  OpexSiteTechnicianRoute,
} from "./UserRoutes";
import UserSiteAttendance from "./views/site-technician/user-site-attendance/UserSiteAttendance";
import Statistics from "./views/client-admin/statistics/Statistics";
import ChatDashboard from "./views/master-admin/chat/ChatDashboard";
import ClientTicketsDashboard from "./views/master-admin/client-tickets/ClientTicketsDashboard";
import CreateNewClientTicket from "./views/master-admin/client-tickets/CreateNewClientTicket";
import UpdateClientTicket from "./views/master-admin/client-tickets/UpdateClientTicket";
import ClientTicketsDashboardClient from "./views/client-admin/client-ticket/ClientTicketsDashboardClient";
import CreateNewClientTicketClient from "./views/client-admin/client-ticket/CreateNewClientTicketClient";
import UpdateClientTicketClient from "./views/client-admin/client-ticket/UpdateClientTicketClient";
import PreventiveMaintenanceTechnicianDashboard from "./views/site-technician/preventive-maintanance-dashboard/PreventiveMaintenanceTechnicianDashboard";
import PreventiveMaintananceTechnicianNotifications from "./views/site-technician/preventive-maintanance-dashboard/PreventiveMaintananceTechnicianNotifications";
import CreateTechnicianPreventivemaintanance from "./views/site-technician/preventive-maintanance-dashboard/CreateTechnicianPreventivemaintanance";
import UpdateTechnicianPreventivemaintanance from "./views/site-technician/preventive-maintanance-dashboard/UpdateTechnicianPreventivemaintanance";
import ViewTechnicianPreventivemaintananceQuaterly from "./views/site-technician/preventive-maintanance-dashboard/ViewTechnicianPreventivemaintananceQuaterly";
import BatteryAndTemperature from "./views/master-admin/robots/BatteryAndTemperature";
import PreventiveMaintenanceList from "./views/client-admin/preventive-maintenance-dashboard/PreventiveMaintenanceList";
import KeyMaintenanceMatrix from "./views/master-admin/service-tickets/KeyMaintenanceMatrix";
import UserBasedLinkDashboard from "./views/dashboard/UserBasedLinkDashboard";
import ViewGateway from "./views/master-admin/gateways/ViewGateway";
import ViewRobot from "./views/master-admin/robots/ViewRobot";
import RobotLogDetials from "./views/master-admin/robots/RobotLogDetials";
import CreateNewServiceTicketFault from "./views/master-admin/serviceticket-fault/CreateNewServiceTicketFault";
import UpdateServiceTicketsFault from "./views/master-admin/serviceticket-fault/UpdateServiceTicketsFault";
import WeatherTimerNotifications from "./views/master-admin/weather-notification/WeatherTimerNotifications";
import RobotCommands from "./views/master-admin/robot-commands/RobotCommands";
import UserPerformance from "./views/site-technician/userperformance/UserPerformance";
import UserPerformanceDashboard from "./views/master-admin/user-performance/UserPerformanceDashboard";
import ViewPerformance from "./views/master-admin/user-performance/ViewPerformance";
import RobotPosition from "./views/robot-position/RobotPosition";
import MonthlySiteReport from "./views/master-admin/monthlyreport/MonthlySiteReport";
import TimerExecutionNotificationView from "./views/master-admin/timer-execution/GetTimerExecutionNotifications";
import WeatherDataSitewise from "./views/master-admin/weather-data/WeatherDataSitewise";
import Microfiberdata from "./views/site-technician/micro-fiber-data/Microfiberdata";
import AddMicrofiberdata from "./views/site-technician/micro-fiber-data/AddMicrofiberdata";
import MicrofiberdataAdminWise from "./views/master-admin/micro-fiber-data/MicrofiberdataAdminWise";
import UpdateMicrofiberdata from "./views/site-technician/micro-fiber-data/UpdateMicrofiberdata";
import ThermalImageData from "./views/master-admin/thermal-image/ThermalImage";
import Profile from "./views/master-admin/profile-tab/Profile";
import CheckMicroFiber from "./views/ai-model/CheckMicroFiber";
import Home from "./views/ai-model/Home";
import ViewMicrofiber from "./views/ai-model/ViewMicrofiber";
import ExpenseDashboard from "./views/expense/ExpenseDashboard";
import CreateExpense from "./views/expense/CreateExpense";
import ViewExpense from "./views/expense/ViewExpense";
import UpdateExpense from "./views/expense/UpdateExpense";
import AddFaultAnalysisChecklist from "./views/master-admin/fault-analysis-checklist/AddFaultAnalysisChecklist";
import FaultAnalysisChecklist from "./views/master-admin/fault-analysis-checklist/FaultAnalysisChecklist";
import UpdateFaultAnalysisChecklist from "./views/master-admin/fault-analysis-checklist/UpdateFaultAnalysis";
import ClientFeedback from "./views/master-admin/client-feedback/ClientFeedback";
import FaultyInventory from "./views/master-admin/faulty-inventory/FaultyInventory";
import SubscriptionDashboard from "./views/master-admin/client-subscription/SubscriptionDashboard";
import CreateSubscription from "./views/master-admin/client-subscription/CreateSubscription";
import ViewSubscription from "./views/master-admin/client-subscription/ViewSubscription";
import EmailLogs from "./views/master-admin/email-logs/EmailLogs";
import ViewEmailLog from "./views/master-admin/email-logs/ViewEmailLog";
import RenewSubscription from "./views/master-admin/client-subscription/RenewSubscription";
import Pricing from "./pricing/Pricing";
import PunchInPunchOut from "./views/site-technician/user-site-attendance/PunchInPunchOut";
import SubscriptionViewPage from "./views/client-admin/subscription/SubscriptionViewPage";
import OpexClientAdminDashboard from "./views/opex-client-admin/OpexClientAdminDashboard";
import OpexTemplate from "./views/opex-client-admin/OpexTemplate";
import OpexCycleData from "./views/opex-client-admin/OpexCycleData";
import OpexSiteTechnicianDashboard from "./views/opex-site-technician/OpexSiteTechnicianDashboard";
import UploadImages from "./views/opex-site-technician/UploadImages";
import OpexDashboard from "./views/master-admin/Opex/OpexDashboard";
import OpexTemplateManager from "./views/master-admin/Opex/OpexTemplateManager";
import OpexManageCycle from "./views/master-admin/Opex/OpexManageCycle";
import OpexTemplateCreate from "./views/master-admin/Opex/CreateOpexTemplate";
import VerifyCycleDay from "./views/master-admin/Opex/VerifyCycleDay";
import AddDayInCycle from "./views/master-admin/Opex/AddDayInCycle";
// import AddFirstCycle from "./views/master-admin/Opex/CraeteFirstOpexCycle";
const App = React.lazy(() => import("./views/pages/app/App"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));

//-----------------------master admin----------------------------------

const MasterAdminDashboard = React.lazy(() =>
  import("./views/master-admin/MasterAdminDashboard")
);
const LoraConfiguration = React.lazy(() =>
  import("./views/master-admin/replace-lora/LoraConfiguration")
);

const ReplaceLora = React.lazy(() =>
  import("./views/master-admin/replace-lora/ReplaceLora")
);

const ActiveRobots = React.lazy(() =>
  import("./views/master-admin/replace-lora/ActiveRobots")
);
const InActiveRobots = React.lazy(() =>
  import("./views/master-admin/replace-lora/InActiveRobots")
);

const AddRobotUsingLoraNo = React.lazy(() =>
  import("./views/master-admin/add-robot/AddRobotUsingLoraNo")
);

const ClientsDasboard = React.lazy(() =>
  import("./views/master-admin/clients-and-sites/Clients")
);

const ClientAssignedSites = React.lazy(() =>
  import("./views/master-admin/clients-and-sites/ClientAssignedSites")
);

const EditClient = React.lazy(() =>
  import("./views/master-admin/clients-and-sites/EditClient")
);

const ServiceTicketDashboard = React.lazy(() =>
  import("./views/master-admin/service-tickets/ServiceTicketDashboard")
);

const UpdateServiceTicket = React.lazy(() =>
  import("./views/master-admin/service-tickets/UpdateServiceTicket")
);

const CreateNewServiceTicket = React.lazy(() =>
  import("./views/master-admin/service-tickets/CreateServiceTicket")
);

const InternalTicketsDashboard = React.lazy(() =>
  import("./views/master-admin/internal-tickets/InternalTicketsDashboard")
);

const CreateNewInternalTicket = React.lazy(() =>
  import("./views/master-admin/internal-tickets/CreateNewInternalTicket")
);

const UsersDashboard = React.lazy(() =>
  import("./views/master-admin/users/UsersDashboard")
);

const Notifications = React.lazy(() =>
  import("./views/master-admin/notifications/Notifications")
);

const AllSiteCleaningLog = React.lazy(() =>
  import("./views/master-admin/all-site-cleaninglog/AllSiteCleaningLog")
);

const SitewaiseLog = React.lazy(() =>
  import("./views/master-admin/all-site-cleaninglog/SitewaiseLog")
);

const Gateways = React.lazy(() =>
  import("./views/master-admin/gateways/Gateways")
);

const UpdateGateway = React.lazy(() =>
  import("./views/master-admin/gateways/UpdateGateway")
);

const CreateNewGateways = React.lazy(() =>
  import("./views/master-admin/gateways/CreateNewGateways")
);

const AssignGateway = React.lazy(() =>
  import("./views/master-admin/gateways/AssignGateway")
);

const AllSiteDpr = React.lazy(() =>
  import("./views/master-admin/all-site-dpr/AllSiteDpr")
);

// activate mutiple robots
const ActivateRobots = React.lazy(() =>
  import("./views/master-admin/robots/ActivateRobots")
);

const SiteCoordinates = React.lazy(() =>
  import("./views/master-admin/sites-coordinates/SitesCoordinates")
);

const UpdateSiteCoordinates = React.lazy(() =>
  import("./views/master-admin/sites-coordinates/UpdateSitesCoordinates")
);

const AddSiteCoordinates = React.lazy(() =>
  import("./views/master-admin/sites-coordinates/AddSitesCoordinates")
);

const ServiceTicketsFaultDashboard = React.lazy(() =>
  import(
    "./views/master-admin/serviceticket-fault/ServiceTicketsFaultDashboard"
  )
);

//----------------------------------master admin------------------------------------

// //-----------------------master user----------------------------------

// const ServiceUserDahboard = React.lazy(() =>
//   import("./views/service-user/ServiceUserDashboard")
// );
// const LoraConfiguration = React.lazy(() =>
//   import("./views/master-user/replace-lora/LoraConfiguration")
// );

// const ReplaceLora = React.lazy(() =>
//   import("./views/master-user/replace-lora/ReplaceLora")
// );

// const ActiveRobots = React.lazy(() =>
//   import("./views/master-user/replace-lora/ActiveRobots")
// );
// const InActiveRobots = React.lazy(() =>
//   import("./views/master-user/replace-lora/InActiveRobots")
// );

// const AddRobotUsingLoraNo = React.lazy(() =>
//   import("./views/master-user/add-robot/AddRobotUsingLoraNo")
// );

// const ClientsDasboard = React.lazy(() =>
//   import("./views/master-user/clients-and-sites/Clients")
// );

// const ClientAssignedSites = React.lazy(() =>
//   import("./views/master-user/clients-and-sites/ClientAssignedSites")
// );

// const EditClient = React.lazy(() =>
//   import("./views/master-user/clients-and-sites/EditClient")
// );

// const ServiceTicketDashboard = React.lazy(() =>
//   import("./views/master-user/service-tickets/ServiceTicketDashboard")
// );

// const UpdateServiceTicket = React.lazy(() =>
//   import("./views/master-user/service-tickets/UpdateServiceTicket")
// );

// const CreateNewServiceTicket = React.lazy(() =>
//   import("./views/master-user/service-tickets/CreateServiceTicket")
// );

// const InternalTicketsDashboard = React.lazy(() =>
//   import("./views/master-user/internal-tickets/InternalTicketsDashboard")
// );

// const CreateNewInternalTicket = React.lazy(() =>
//   import("./views/master-user/internal-tickets/CreateNewInternalTicket")
// );

// const UsersDashboard = React.lazy(() =>
//   import("./views/master-user/users/UsersDashboard")
// );

// const Notifications = React.lazy(() =>
//   import("./views/master-user/notifications/Notifications")
// );

// const AllSiteCleaningLog = React.lazy(() =>
//   import("./views/master-user/all-site-cleaninglog/AllSiteCleaningLog")
// );

// const SitewaiseLog = React.lazy(() =>
//   import("./views/master-user/all-site-cleaninglog/SitewaiseLog")
// );

// const Gateways = React.lazy(() =>
//   import("./views/master-user/gateways/Gateways")
// );

// const UpdateGateway = React.lazy(() =>
//   import("./views/master-user/gateways/UpdateGateway")
// );

// const CreateNewGateways = React.lazy(() =>
//   import("./views/master-user/gateways/CreateNewGateways")
// );

// const AssignGateway = React.lazy(() =>
//   import("./views/master-user/gateways/AssignGateway")
// );

// const AllSiteDpr = React.lazy(() =>
//   import("./views/master-user/all-site-dpr/AllSiteDpr")
// );

// // activate mutiple robots
// const ActivateRobots = React.lazy(() =>
//   import("./views/master-user/robots/ActivateRobots")
// );

// const SiteCoordinates = React.lazy(() =>
//   import("./views/master-user/sites-coordinates/SitesCoordinates")
// );

// const UpdateSiteCoordinates = React.lazy(() =>
//   import("./views/master-user/sites-coordinates/UpdateSitesCoordinates")
// );

// const AddSiteCoordinates = React.lazy(() =>
//   import("./views/master-user/sites-coordinates/AddSitesCoordinates")
// );

// const ServiceTicketsFaultDashboard = React.lazy(() =>
//   import(
//     "./views/master-user/serviceticket-fault/ServiceTicketsFaultDashboard"
//   )
// );

//----------------------------------master user------------------------------------

//----------------------------------client admin------------------------------------

const ClientAdminDashboard = React.lazy(() =>
  import("./views/client-admin/ClientAdminDashboard")
);

const MasterUserDashboard = React.lazy(() =>
  import("./views/master-user/MasterUserDashboard")
);

const ServiceUserDashboard = React.lazy(() =>
  import("./views/service-user/ServiceUserDashboard")
);

const ProjectUserDashboard = React.lazy(() =>
  import("./views/project-user/ProjectUserDashboard")
);

//----------------------------------client admin------------------------------------

//-------------------------------------project admin---------------------------
const ProjectAdminDashboard = React.lazy(() =>
  import("./views/project-admin/ProjectAdminDashboard")
);

//--------------------------------------project admin---------------------------------

//-------------------------------------service admin---------------------------
const ServiceAdminDahboard = React.lazy(() =>
  import("./views/service-admin/ServiceAdminDashboard")
);
//--------------------------------------service admin---------------------------------

const Robots = React.lazy(() => import("./views/master-admin/robots/Robots"));

const UpdateRobots = React.lazy(() =>
  import("./views/master-admin/robots/UpdateRobot")
);

const AddServiceItem = React.lazy(() =>
  import("./views/master-admin/inventories/AddServiceItem")
);

const UpdateServiceItem = React.lazy(() =>
  import("./views/master-admin/inventories/UpdateServiceItem")
);

const Inventories = React.lazy(() =>
  import("./views/master-admin/inventories/Inventories")
);

const UpdateInventory = React.lazy(() =>
  import("./views/master-admin/inventories/UpdateInventory")
);

const AddInventory = React.lazy(() =>
  import("./views/master-admin/inventories/AddInventory")
);

const AddDpr = React.lazy(() =>
  import("./views/master-admin/all-site-dpr/AddDpr")
);
// const Timers = React.lazy(() => import('./views/pages/timers/Timers'));
const Timers = React.lazy(() => import("./views/master-admin/timers/Timers"));

const UpdateTimer = React.lazy(() =>
  import("./views/master-admin/timers/UpdateTimer")
);

const ProjectClosureForm = React.lazy(() =>
  import("./views/master-admin/project-closure/ProjectClosureDashboard")
);

const AddProjectClosureForm = React.lazy(() =>
  import("./views/master-admin/project-closure/AddProjectClosureForm")
);

const UpdateProjectClosureForm = React.lazy(() =>
  import("./views/master-admin/project-closure/UpdateProjectClosureForm")
);
const ViewProjectClosureDocument = React.lazy(() =>
  import("./views/master-admin/project-closure/ViewProjectClosureDocument")
);

//common pages

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));

const Colors = React.lazy(() => import("./views/theme/colors/Colors"));
const Typography = React.lazy(() =>
  import("./views/theme/typography/Typography")
);

// Base
const Accordion = React.lazy(() => import("./views/base/accordion/Accordion"));
const Breadcrumbs = React.lazy(() =>
  import("./views/base/breadcrumbs/Breadcrumbs")
);
const Cards = React.lazy(() => import("./views/base/cards/Cards"));
const Carousels = React.lazy(() => import("./views/base/carousels/Carousels"));
const Collapses = React.lazy(() => import("./views/base/collapses/Collapses"));
const ListGroups = React.lazy(() =>
  import("./views/base/list-groups/ListGroups")
);
const Navs = React.lazy(() => import("./views/base/navs/Navs"));
const Paginations = React.lazy(() =>
  import("./views/base/paginations/Paginations")
);
const Placeholders = React.lazy(() =>
  import("./views/base/placeholders/Placeholders")
);
const Popovers = React.lazy(() => import("./views/base/popovers/Popovers"));
const Progress = React.lazy(() => import("./views/base/progress/Progress"));
const Spinners = React.lazy(() => import("./views/base/spinners/Spinners"));
const Tabs = React.lazy(() => import("./views/base/tabs/Tabs"));
const Tables = React.lazy(() => import("./views/base/tables/Tables"));
const Tooltips = React.lazy(() => import("./views/base/tooltips/Tooltips"));

// Buttons
const Buttons = React.lazy(() => import("./views/buttons/buttons/Buttons"));
const ButtonGroups = React.lazy(() =>
  import("./views/buttons/button-groups/ButtonGroups")
);
const Dropdowns = React.lazy(() =>
  import("./views/buttons/dropdowns/Dropdowns")
);

//Forms
const ChecksRadios = React.lazy(() =>
  import("./views/forms/checks-radios/ChecksRadios")
);
const FloatingLabels = React.lazy(() =>
  import("./views/forms/floating-labels/FloatingLabels")
);
const FormControl = React.lazy(() =>
  import("./views/forms/form-control/FormControl")
);
const InputGroup = React.lazy(() =>
  import("./views/forms/input-group/InputGroup")
);
const Layout = React.lazy(() => import("./views/forms/layout/Layout"));
const Range = React.lazy(() => import("./views/forms/range/Range"));
const Select = React.lazy(() => import("./views/forms/select/Select"));
const Validation = React.lazy(() =>
  import("./views/forms/validation/Validation")
);

const Charts = React.lazy(() => import("./views/charts/Charts"));

// Icons
const CoreUIIcons = React.lazy(() =>
  import("./views/icons/coreui-icons/CoreUIIcons")
);
const Flags = React.lazy(() => import("./views/icons/flags/Flags"));
const Brands = React.lazy(() => import("./views/icons/brands/Brands"));

// Notifications
const Alerts = React.lazy(() => import("./views/notifications/alerts/Alerts"));
const Badges = React.lazy(() => import("./views/notifications/badges/Badges"));
const Modals = React.lazy(() => import("./views/notifications/modals/Modals"));
const Toasts = React.lazy(() => import("./views/notifications/toasts/Toasts"));

const Widgets = React.lazy(() => import("./views/widgets/Widgets"));

const routes = [
  {
    path: "/",
    exact: true,
    name: "User Lnks",
    element: <UserBasedLinkDashboard />,
  },

  { path: "/dashboard2", name: "Dashboard", element: Dashboard },

  {
    path: "/user-dashboard",
    name: "User Links",
    element: <UserBasedLinkDashboard />,
  },

  // new features
  { path: "/apps", name: "App", element: App },

  // ------------------------master admin---------------------------------

  {
    path: "/master-admin/dashboard",
    name: "Master Admin Dashboard",
    element: (
      <MasterAdminRoute>
        <MasterAdminDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/robots-position",
    name: "Master Admin Robots Position",
    element: (
      <MasterAdminRoute>
        <RobotPosition />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/ai-model",
    name: "Master Admin AI Model",
    element: (
      <MasterAdminRoute>
        <Home />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/ai-model/check-micro-fiber",
    name: "Master Admin AI Model Check Micro Fiber",
    element: (
      <MasterAdminRoute>
        <CheckMicroFiber />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/ai-model/view/:id",
    name: "Master Admin AI Model View Micro Fiber",
    element: (
      <MasterAdminRoute>
        <ViewMicrofiber />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/site-management/all-site-data",
    name: "Taypro All Site Data",
    element: (
      <MasterAdminRoute>
        <TayproDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/site-management",
    name: "Site Management",
    element: (
      <MasterAdminRoute>
        <SiteManagement />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/site-management/block-management/:site_id",
    name: "Block Management",
    element: (
      <MasterAdminRoute>
        <BlockManagement />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: (
      <MasterAdminRoute>
        <RobotOperating />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/robot-activity",
    name: "Robot Activity",
    element: (
      <MasterAdminRoute>
        <RobotActivity />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/robot-commands",
    name: "Robot Commands",
    element: (
      <MasterAdminRoute>
        <RobotCommands />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/site-management/block-management/:site_id/:block/:robot_no/debug_logs",
    name: "Debug Log",
    element: (
      <MasterAdminRoute>
        <DebugLog />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/site-management/block-management/:site_id/:block/:robot_no/cleaning_logs",
    name: "Cleaning Log",
    element: (
      <MasterAdminRoute>
        <CleaningLog />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/site-management/block-management/:site_id/:block/:robot_no/add-downlink",
    name: "Add Downlink",
    element: (
      <MasterAdminRoute>
        <NewDownlink />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/site-management/block-management/:site_id/:block/:robot_no/update-downlink/:id",
    name: "Update Downlink",
    element: (
      <MasterAdminRoute>
        <UpdateDownlink />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/site-management/block-management/:site_id/:block/:robot_no/view-downlink/:id",
    name: "View Downlink",
    element: (
      <MasterAdminRoute>
        <ViewDownlink />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/lora-configuration",
    name: "Lora Configuration",
    element: (
      <MasterAdminRoute>
        <LoraConfiguration />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/replace-lora",
    name: "Replace Lora",
    element: (
      <MasterAdminRoute>
        <ReplaceLora />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/replace-lora/in-active-robots",
    name: "In Active Robots",
    element: (
      <MasterAdminRoute>
        <InActiveRobots />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/replace-lora/active-robots",
    name: "Active Robots",
    element: (
      <MasterAdminRoute>
        <ActiveRobots />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/add-robot/add-robot-using-lorano",
    name: "Add Robot",
    element: (
      <MasterAdminRoute>
        <AddRobotUsingLoraNo />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/clients-dashboard",
    name: "Clients",
    element: (
      <MasterAdminRoute>
        <ClientsDasboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/clients-data-dashboard/edit-client/:id",
    name: "Edit Client",
    element: (
      <MasterAdminRoute>
        <EditClient />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/clients-dashboard/clients-data/:id",
    name: "Client Assigned Sites",
    element: (
      <MasterAdminRoute>
        <ClientAssignedSites />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/robots",
    name: "All Robots",
    element: (
      <MasterAdminRoute>
        <Robots />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/robots/update/:id",
    name: "Update Robot",
    element: (
      <MasterAdminRoute>
        <UpdateRobots />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/robots/view/:id",
    name: "View Robot",
    element: (
      <MasterAdminRoute>
        <ViewRobot />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/activate-robots",
    name: "All Inactivate Robots",
    element: (
      <MasterAdminRoute>
        <ActivateRobots />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/robots/shift-block-wise",
    name: "Shift Block Wise Robot",
    element: (
      <MasterAdminRoute>
        <ShiftBlockwiseRobots />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/timer-execution-notification-view",
    name: "Timer Execution Notification View",
    element: (
      <MasterAdminRoute>
        <TimerExecutionNotificationView />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/weather-data-sitewise",
    name: "Weather Data (Sitewise)",
    element: (
      <MasterAdminRoute>
        <WeatherDataSitewise />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/inventories",
    name: "Inventories",
    element: (
      <MasterAdminRoute>
        <Inventories />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/inventories/update-inventory/:id",
    name: "Update Inventory",
    element: (
      <MasterAdminRoute>
        <UpdateInventory />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/inventories/add-inventory",
    name: "Add Inventory",
    element: (
      <MasterAdminRoute>
        <AddInventory />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/inventories/add-service-item",
    name: "Add Service Item",
    element: (
      <MasterAdminRoute>
        <AddServiceItem />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/inventories/update-service-item/:id",
    name: "Update Service Item",
    element: (
      <MasterAdminRoute>
        <UpdateServiceItem />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/timers",
    name: "Update Timers",
    element: (
      <MasterAdminRoute>
        <Timers />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/timers/:block/:site_id",
    name: "Update Robot Timer",
    element: (
      <MasterAdminRoute>
        <UpdateTimer />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/project-handover",
    name: "Project Handover",
    element: (
      <MasterAdminRoute>
        <ProjectClosureForm />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/project-handover/add-project-handover",
    name: "Add Project Handover",
    element: (
      <MasterAdminRoute>
        <AddProjectClosureForm />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/project-handover/update/:id",
    name: "Update Project Handover",
    element: (
      <MasterAdminRoute>
        <UpdateProjectClosureForm />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/project-handover/view/:id",
    name: "View Project Handover Document",
    element: (
      <MasterAdminRoute>
        <ViewProjectClosureDocument />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/service-tickets",
    name: "Service Tickets",
    element: (
      <MasterAdminRoute>
        <ServiceTicketDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/service-tickets/update-service-ticket/:id",
    name: "Update Service Ticket",
    element: (
      <MasterAdminRoute>
        <UpdateServiceTicket />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/service-tickets/resolve-service-ticket/:id",
    name: "Resolve Service Ticket",
    element: (
      <MasterAdminRoute>
        <ResolveServiceTicket />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/service-tickets/create-new-ticket",
    name: "Create new Tickets",
    element: (
      <MasterAdminRoute>
        <CreateNewServiceTicket />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/service-tickets/key-preventive-matrix",
    name: "Key Preventive Matrix",
    element: (
      <MasterAdminRoute>
        <KeyMaintenanceMatrix />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/internal-tickets",
    name: "Internal Tickets",
    element: (
      <MasterAdminRoute>
        <InternalTicketsDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/internal-tickets/create-new-internal-ticket",
    name: "Create New Internal Tickets",
    element: (
      <MasterAdminRoute>
        <CreateNewInternalTicket />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/internal-tickets/update-internal-ticket/:id",
    name: "Update Internal Tickets",
    element: (
      <MasterAdminRoute>
        <UpdateInternalTicket />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/client-tickets",
    name: "Client Tickets",
    element: (
      <MasterAdminRoute>
        <ClientTicketsDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/client-tickets/create-new-client-ticket",
    name: "Create New client Tickets",
    element: (
      <MasterAdminRoute>
        <CreateNewClientTicket />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/client-tickets/update-client-ticket/:id",
    name: "Update client Tickets",
    element: (
      <MasterAdminRoute>
        <UpdateClientTicket />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/serviceticket-fault/service-tickets-fault-dashboard",
    name: "service-tickets-fault-dashboard",
    element: (
      <MasterAdminRoute>
        <ServiceTicketsFaultDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/serviceticket-fault/service-tickets-fault-dashboard/update-serviceticket-fault/:id",
    name: "service-tickets-fault-dashboard",
    element: (
      <MasterAdminRoute>
        <UpdateServiceTicketsFault />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/users",
    name: "All Internal Users",
    element: (
      <MasterAdminRoute>
        <UsersDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/external-users",
    name: "All External Users",
    element: (
      <MasterAdminRoute>
        <ExternalUsersDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/notifications",
    name: "Master Admin Notifications",
    element: (
      <MasterAdminRoute>
        <Notifications />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-site-cleaning-log",
    name: "Master Admin All Site Cleaning Log",
    element: (
      <MasterAdminRoute>
        <AllSiteCleaningLog />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-site-cleaning-log/sitewise-cleaning-log/:site_id",
    name: "Master Admin Sitewise Cleaning Log",
    element: (
      <MasterAdminRoute>
        <SitewaiseLog />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-site-gateways",
    name: "Master Admin All Site Gateways",
    element: (
      <MasterAdminRoute>
        <Gateways />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-site-gateways/update-gateway/:id",
    name: "Master Admin Update Gateway",
    element: (
      <MasterAdminRoute>
        <UpdateGateway />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-site-gateways/create-new-gateway",
    name: "Master Admin Create New Gateway",
    element: (
      <MasterAdminRoute>
        <CreateNewGateways />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-site-gateways/view-gateway/:id",
    name: "View Gateway",
    element: (
      <MasterAdminRoute>
        <ViewGateway />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-site-gateways/assign-gateway/:id",
    name: "Assign Gateway",
    element: (
      <MasterAdminRoute>
        <AssignGateway />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-site-dpr",
    name: "Master Admin All Site Dpr",
    element: (
      <MasterAdminRoute>
        <AllSiteDpr />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-site-dpr/add-dpr",
    name: "Add DPR",
    element: (
      <MasterAdminRoute>
        <AddDpr />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/update-dpr/:id",
    name: "Update DPR",
    element: (
      <MasterAdminRoute>
        <UpdateDpr />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/preventive-maintanance-dashboard",
    name: "Master Admin Preventive maintanance Dashboard",
    element: (
      <MasterAdminRoute>
        <PreventiveMaintanancrDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/preventive-maintanance-dashboard/preventive-maintanance-notifications",
    name: "Master Admin Preventive maintanance Notifications",
    element: (
      <MasterAdminRoute>
        <PreventiveMaintananceNotifications />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/preventive-maintanance-dashboard/create-pm",
    name: "Create Preventive maintanance",
    element: (
      <MasterAdminRoute>
        <CreatePreventivemaintanance />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/preventive-maintanance-dashboard/update/:id",
    name: "Update Preventive maintanance",
    element: (
      <MasterAdminRoute>
        <UpdatePreventivemaintanance />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/preventive-maintanance-dashboard/view",
    name: "View Preventive maintanance",
    element: (
      <MasterAdminRoute>
        <ViewPreventivemaintananceQuaterly />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/technician-attendance",
    name: "Technician Attendance",
    element: (
      <MasterAdminRoute>
        <TechnicianAttendanceDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/sites-coordinates",
    name: "Site Coordinates",
    element: (
      <MasterAdminRoute>
        <SiteCoordinates />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/sites-coordinates/update-sitescoordinates/:id",
    name: "Update Site Coordinates",
    element: (
      <MasterAdminRoute>
        <UpdateSiteCoordinates />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/sites-coordinates/add-sitescoordinates",
    name: "Add Site Coordinates",
    element: (
      <MasterAdminRoute>
        <AddSiteCoordinates />
      </MasterAdminRoute>
    ),
  },
  // {
  //   path: "/master-admin/serviceticket-fault/service-tickets-fault-dashboard",
  //   name: "service-tickets-fault-dashboard",
  //   element: (
  //     <MasterAdminRoute>
  //       <ServiceTicketsFaultDashboard />
  //     </MasterAdminRoute>
  //   ),
  // },
  {
    path: "/master-admin/serviceticket-fault/service-tickets-fault-dashboard/create-serviceticket-fault",
    name: "create serviceticketfault",
    element: (
      <MasterAdminRoute>
        <CreateNewServiceTicketFault />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/chat",
    name: "Chat with User",
    element: (
      <MasterAdminRoute>
        <ChatDashboard />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/robot-battery-temperature",
    name: "Robot Battery & Temperature",
    element: (
      <MasterAdminRoute>
        <BatteryAndTemperature />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/robot-log-details",
    name: "Robot Log Details",
    element: (
      <MasterAdminRoute>
        <RobotLogDetials />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/weather-timer-notifications",
    name: "Weather Timer Notifications",
    element: (
      <MasterAdminRoute>
        <WeatherTimerNotifications />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/user-performance-dashboard",
    name: "User Performance",

    element: (
      <MasterAdminRoute>
        <UserPerformanceDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/user-performance-dashboard/user-performance/:id",
    name: "User Performance",
    element: (
      <MasterAdminRoute>
        <ViewPerformance />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/monthlyreport",
    name: "Monthly Site Report",
    element: (
      <MasterAdminRoute>
        <MonthlySiteReport />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/micro-fiber-data",
    name: "Micro Fiber Data",
    element: (
      <MasterAdminRoute>
        <MicrofiberdataAdminWise />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/thermal-image-data",
    name: "Thermal Image Data",
    element: (
      <MasterAdminRoute>
        <ThermalImageData />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/profile-tab",
    name: "Profile Details",
    element: (
      <MasterAdminRoute>
        <Profile />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/fault-analysis-checklist",
    name: "Fault Analysis Checklist",
    element: (
      <MasterAdminRoute>
        <FaultAnalysisChecklist />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/fault-analysis-checklist/add-checklist/:id",
    name: "Add Fault Analysis Checklist",
    element: (
      <MasterAdminRoute>
        <AddFaultAnalysisChecklist />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/fault-analysis-checklist/update-checklist/:id",
    name: "Update Fault Analysis Checklist",
    element: (
      <MasterAdminRoute>
        <UpdateFaultAnalysisChecklist />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/customer-feedback",
    name: "Customer Feedback",
    element: (
      <MasterAdminRoute>
        <ClientFeedback />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/faulty-inventory",
    name: "Faulty Inventory",
    element: (
      <MasterAdminRoute>
        <FaultyInventory />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/expenses",
    name: "Expense Management",
    element: (
      <MasterAdminRoute>
        <ExpenseDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/expenses/create-expense",
    name: "Create Expense",
    element: (
      <MasterAdminRoute>
        <CreateExpense />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/expenses/view/:id",
    name: "View Expense",
    element: (
      <MasterAdminRoute>
        <ViewExpense />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/expenses/update/:id",
    name: "Update Expense",
    element: (
      <MasterAdminRoute>
        <UpdateExpense />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/client-subscriptions",
    name: "Client Subscriptions",
    element: (
      <MasterAdminRoute>
        <SubscriptionDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/client-subscriptions/create",
    name: "Create Subscriptions",
    element: (
      <MasterAdminRoute>
        <CreateSubscription />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/client-subscriptions/view/:id",
    name: "View Subscriptions",
    element: (
      <MasterAdminRoute>
        <ViewSubscription />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/email-logs",
    name: "Email Logs",
    element: (
      <MasterAdminRoute>
        <EmailLogs />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/email-logs/:id",
    name: "Email Log",
    element: (
      <MasterAdminRoute>
        <ViewEmailLog />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/client-subscriptions/renew/:client_id",
    name: "Renew Subscriptions",
    element: (
      <MasterAdminRoute>
        <RenewSubscription />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/pricing",
    name: "Pricing",
    element: (
      <MasterAdminRoute>
        <Pricing />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/opexdata",
    name: "Opex Data Dashboard",
    element: (
      <MasterAdminRoute>
        <OpexDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/opexdata/:site_id",
    name: "Opex Template",
    element: (
      <MasterAdminRoute>
        <OpexTemplateManager />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/opexdata/:site_id/:moduleId/cycle/:cycleId",
    name: "Opex Cycle",
    element: (
      <MasterAdminRoute>
        <OpexManageCycle />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/opexdata/:site_id/:moduleId/cycle/:cycleId/verify-day/:dayId",
    name: "Opex Cycle",
    element: (
      <MasterAdminRoute>
        <VerifyCycleDay />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/create-template/:site_id",
    name: "CreateOpex ",
    element: (
      <MasterAdminRoute>
        <OpexTemplateCreate />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/opexdata/:site_id/:moduleId/cycle/:cycleId/add-day",
    name: "Add Day In Cycle ",
    element: (
      <MasterAdminRoute>
        <AddDayInCycle />
      </MasterAdminRoute>
    ),
  },

  // ------------------------master admin---------------------------------

  // ------------------------master user---------------------------------

  {
    path: "/master-user/dashboard",
    name: "Master User Dashboard",
    element: (
      <MasterUserRoute>
        <MasterUserDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/profile-tab",
    name: "Profile Details",
    element: (
      <MasterUserRoute>
        <Profile />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/robots-position",
    name: "Master User Robots Position",
    element: (
      <MasterUserRoute>
        <RobotPosition />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/site-management/all-site-data",
    name: "Taypro All Site Data",
    element: (
      <MasterUserRoute>
        <TayproDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/site-management",
    name: "Site Management",
    element: (
      <MasterUserRoute>
        <SiteManagement />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/site-management/block-management/:site_id",
    name: "Block Management",
    element: (
      <MasterUserRoute>
        <BlockManagement />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: (
      <MasterUserRoute>
        <RobotOperating />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/robot-activity",
    name: "Robot Activity",
    element: (
      <MasterUserRoute>
        <RobotActivity />
      </MasterUserRoute>
    ),
  },
  // {
  //   path: "/master-user/search-robot",
  //   name: "Search Robot",
  //   element: (
  //     <MasterUserRoute>
  //       <SearchRobot />
  //     </MasterUserRoute>
  //   ),
  // },
  {
    path: "/master-user/robot-commands",
    name: "Robot Commands",
    element: (
      <MasterUserRoute>
        <RobotCommands />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/site-management/block-management/:site_id/:block/:robot_no/debug_logs",
    name: "Debug Log",
    element: (
      <MasterUserRoute>
        <DebugLog />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/site-management/block-management/:site_id/:block/:robot_no/cleaning_logs",
    name: "Cleaning Log",
    element: (
      <MasterUserRoute>
        <CleaningLog />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/site-management/block-management/:site_id/:block/:robot_no/add-downlink",
    name: "Add Downlink",
    element: (
      <MasterUserRoute>
        <NewDownlink />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/site-management/block-management/:site_id/:block/:robot_no/update-downlink/:id",
    name: "Update Downlink",
    element: (
      <MasterUserRoute>
        <UpdateDownlink />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/site-management/block-management/:site_id/:block/:robot_no/view-downlink/:id",
    name: "View Downlink",
    element: (
      <MasterUserRoute>
        <ViewDownlink />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/lora-configuration",
    name: "Lora Configuration",
    element: (
      <MasterUserRoute>
        <LoraConfiguration />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/replace-lora",
    name: "Replace Lora",
    element: (
      <MasterUserRoute>
        <ReplaceLora />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/replace-lora/in-active-robots",
    name: "In Active Robots",
    element: (
      <MasterUserRoute>
        <InActiveRobots />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/replace-lora/active-robots",
    name: "Active Robots",
    element: (
      <MasterUserRoute>
        <ActiveRobots />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/add-robot/add-robot-using-lorano",
    name: "Add Robot",
    element: (
      <MasterUserRoute>
        <AddRobotUsingLoraNo />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/clients-dashboard",
    name: "Clients",
    element: (
      <MasterUserRoute>
        <ClientsDasboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/clients-data-dashboard/edit-client/:id",
    name: "Edit Client",
    element: (
      <MasterUserRoute>
        <EditClient />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/clients-dashboard/clients-data/:id",
    name: "Client Assigned Sites",
    element: (
      <MasterUserRoute>
        <ClientAssignedSites />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/robots",
    name: "All Robots",
    element: (
      <MasterUserRoute>
        <Robots />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/robots/:id",
    name: "View Robot",
    element: (
      <MasterUserRoute>
        <ViewRobot />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/activate-robots",
    name: "All Inactivate Robots",
    element: (
      <MasterUserRoute>
        <ActivateRobots />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/robots/update/:id",
    name: "Update Robot",
    element: (
      <MasterUserRoute>
        <UpdateRobots />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/robots/shift-block-wise",
    name: "Shift Block Wise Robot",
    element: (
      <MasterUserRoute>
        <ShiftBlockwiseRobots />
      </MasterUserRoute>
    ),
  },
  // {
  //   path: "/master-user/replace-lora/in-active-robots",
  //   name: "In Active Robots",
  //   element: (
  //     <MasterUserRoute>
  //       <InActiveRobots />
  //     </MasterUserRoute>
  //   ),
  // },
  {
    path: "/master-user/inventories",
    name: "Inventories",
    element: (
      <MasterUserRoute>
        <Inventories />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/inventories/update-inventory/:id",
    name: "Update Inventory",
    element: (
      <MasterUserRoute>
        <UpdateInventory />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/inventories/add-inventory",
    name: "Add Inventory",
    element: (
      <MasterUserRoute>
        <AddInventory />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/inventories/add-service-item",
    name: "Add Service Item",
    element: (
      <MasterUserRoute>
        <AddServiceItem />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/inventories/update-service-item/:id",
    name: "Update Service Item",
    element: (
      <MasterUserRoute>
        <UpdateServiceItem />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/timers",
    name: "Update Timers",
    element: (
      <MasterUserRoute>
        <Timers />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/timers/:block/:site_id",
    name: "Update Robot Timer",
    element: (
      <MasterUserRoute>
        <UpdateTimer />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/project-handover",
    name: "Project Handover",
    element: (
      <MasterUserRoute>
        <ProjectClosureForm />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/project-handover/add-project-handover",
    name: "Add Project Handover",
    element: (
      <MasterUserRoute>
        <AddProjectClosureForm />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/project-handover/update/:id",
    name: "Update Project Handover",
    element: (
      <MasterUserRoute>
        <UpdateProjectClosureForm />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/project-handover/view/:id",
    name: "View Project Handover Document",
    element: (
      <MasterUserRoute>
        <ViewProjectClosureDocument />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/service-tickets",
    name: "Service Tickets",
    element: (
      <MasterUserRoute>
        <ServiceTicketDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/service-tickets/update-service-ticket/:id",
    name: "Update Service Ticket",
    element: (
      <MasterUserRoute>
        <UpdateServiceTicket />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/service-tickets/resolve-service-ticket/:id",
    name: "Resolve Service Ticket",
    element: (
      <MasterUserRoute>
        <ResolveServiceTicket />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/service-tickets/create-new-ticket",
    name: "Create new Tickets",
    element: (
      <MasterUserRoute>
        <CreateNewServiceTicket />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/service-tickets/key-preventive-matrix",
    name: "Key Preventive Matrix",
    element: (
      <MasterUserRoute>
        <KeyMaintenanceMatrix />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/internal-tickets",
    name: "Internal Tickets",
    element: (
      <MasterUserRoute>
        <InternalTicketsDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/internal-tickets/create-new-internal-ticket",
    name: "Create New Internal Tickets",
    element: (
      <MasterUserRoute>
        <CreateNewInternalTicket />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/internal-tickets/update-internal-ticket/:id",
    name: "Update Internal Tickets",
    element: (
      <MasterUserRoute>
        <UpdateInternalTicket />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/client-tickets",
    name: "Client Tickets",
    element: (
      <MasterUserRoute>
        <ClientTicketsDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/client-tickets/create-new-client-ticket",
    name: "Create New client Tickets",
    element: (
      <MasterUserRoute>
        <CreateNewClientTicket />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/client-tickets/update-client-ticket/:id",
    name: "Update client Tickets",
    element: (
      <MasterUserRoute>
        <UpdateClientTicket />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/serviceticket-fault/service-tickets-fault-dashboard",
    name: "service-tickets-fault-dashboard",
    element: (
      <MasterUserRoute>
        <ServiceTicketsFaultDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/serviceticket-fault/service-tickets-fault-dashboard/update-serviceticket-fault/:id",
    name: "service-tickets-fault-dashboard",
    element: (
      <MasterUserRoute>
        <UpdateServiceTicketsFault />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/users",
    name: "All Internal Users",
    element: (
      <MasterUserRoute>
        <UsersDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/external-users",
    name: "All External Users",
    element: (
      <MasterUserRoute>
        <ExternalUsersDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/notifications",
    name: "Master User Notifications",
    element: (
      <MasterUserRoute>
        <Notifications />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/all-site-cleaning-log",
    name: "Master User All Site Cleaning Log",
    element: (
      <MasterUserRoute>
        <AllSiteCleaningLog />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/all-site-cleaning-log/sitewise-cleaning-log/:site_id",
    name: "Master User Sitewise Cleaning Log",
    element: (
      <MasterUserRoute>
        <SitewaiseLog />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/all-site-gateways",
    name: "Master User All Site Gateways",
    element: (
      <MasterUserRoute>
        <Gateways />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/all-site-gateways/update-gateway/:id",
    name: "Master User Update Gateway",
    element: (
      <MasterUserRoute>
        <UpdateGateway />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/all-site-gateways/create-new-gateway",
    name: "Master User Create New Gateway",
    element: (
      <MasterUserRoute>
        <CreateNewGateways />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/all-site-gateways/view-gateway/:id",
    name: "View Gateway",
    element: (
      <MasterUserRoute>
        <ViewGateway />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/all-site-gateways/assign-gateway/:id",
    name: "Assign Gateway",
    element: (
      <MasterUserRoute>
        <AssignGateway />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/all-site-dpr",
    name: "Master User All Site Dpr",
    element: (
      <MasterUserRoute>
        <AllSiteDpr />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/all-site-dpr/add-dpr",
    name: "Add DPR",
    element: (
      <MasterUserRoute>
        <AddDpr />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/update-dpr/:id",
    name: "Update DPR",
    element: (
      <MasterUserRoute>
        <UpdateDpr />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/preventive-maintanance-dashboard",
    name: "Master User Preventive maintanance Dashboard",
    element: (
      <MasterUserRoute>
        <PreventiveMaintanancrDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/preventive-maintanance-dashboard/preventive-maintanance-notifications",
    name: "Master User Preventive maintanance Notifications",
    element: (
      <MasterUserRoute>
        <PreventiveMaintananceNotifications />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/preventive-maintanance-dashboard/create-pm",
    name: "Create Preventive maintanance",
    element: (
      <MasterUserRoute>
        <CreatePreventivemaintanance />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/preventive-maintanance-dashboard/update/:id",
    name: "Update Preventive maintanance",
    element: (
      <MasterUserRoute>
        <UpdatePreventivemaintanance />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/preventive-maintanance-dashboard/view",
    name: "View Preventive maintanance",
    element: (
      <MasterUserRoute>
        <ViewPreventivemaintananceQuaterly />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/technician-attendance",
    name: "Technician Attendance",
    element: (
      <MasterUserRoute>
        <TechnicianAttendanceDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/sites-coordinates",
    name: "Site Coordinates",
    element: (
      <MasterUserRoute>
        <SiteCoordinates />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/sites-coordinates/update-sitescoordinates/:id",
    name: "Update Site Coordinates",
    element: (
      <MasterUserRoute>
        <UpdateSiteCoordinates />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/sites-coordinates/add-sitescoordinates",
    name: "Add Site Coordinates",
    element: (
      <MasterUserRoute>
        <AddSiteCoordinates />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/serviceticket-fault/service-tickets-fault-dashboard/create-serviceticket-fault",
    name: "create serviceticketfault",
    element: (
      <MasterUserRoute>
        <CreateNewServiceTicketFault />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/chat",
    name: "Chat with User",
    element: (
      <MasterUserRoute>
        <ChatDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/robot-battery-temperature",
    name: "Robot Battery & Temperature",
    element: (
      <MasterUserRoute>
        <BatteryAndTemperature />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/robot-log-details",
    name: "Robot Log Details",
    element: (
      <MasterUserRoute>
        <RobotLogDetials />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/weather-timer-notifications",
    name: "Weather Timer Notifications",
    element: (
      <MasterUserRoute>
        <WeatherTimerNotifications />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/user-performance-dashboard",
    name: "User Performance",
    element: (
      <MasterUserRoute>
        <UserPerformanceDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/user-performance-dashboard/user-performance/:id",
    name: "User Performance",
    element: (
      <MasterUserRoute>
        <ViewPerformance />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/monthlyreport",
    name: "Monthly Site Report",
    element: (
      <MasterUserRoute>
        <MonthlySiteReport />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/notifications",
    name: "Master User Notifications",
    element: (
      <MasterUserRoute>
        <Notifications />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/expenses",
    name: "Expense Management",
    element: (
      <MasterUserRoute>
        <ExpenseDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/expenses/create-expense",
    name: "Create Expense",
    element: (
      <MasterUserRoute>
        <CreateExpense />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/expenses/view/:id",
    name: "View Expense",
    element: (
      <MasterUserRoute>
        <ViewExpense />
      </MasterUserRoute>
    ),
  },

  {
    path: "/master-user/expenses/update/:id",
    name: "Update Expense",
    element: (
      <MasterUserRoute>
        <UpdateExpense />
      </MasterUserRoute>
    ),
  },

  // ------------------------master user---------------------------------
  //------------------------project admin---------------------------------
  {
    path: "/project-admin/robot-activity",
    name: "Robot Activity",
    element: (
      <ProjectAdminRoute>
        <RobotActivity />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/profile-tab",
    name: "Profile Details",
    element: (
      <ProjectAdminRoute>
        <Profile />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/micro-fiber-data",
    name: "Micro Fiber Data",
    element: (
      <ProjectAdminRoute>
        <MicrofiberdataAdminWise />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/robot-commands",
    name: "Robot Commands",
    element: (
      <ProjectAdminRoute>
        <RobotCommands />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/weather-data-sitewise",
    name: "Weather Data (Sitewise)",
    element: (
      <ProjectAdminRoute>
        <WeatherDataSitewise />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/all-site-data",
    name: "Taypro All Site Data",
    element: (
      <ProjectAdminRoute>
        <TayproDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/monthlyreport",
    name: "Monthly Site Report",
    element: (
      <ProjectAdminRoute>
        <MonthlySiteReport />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/dashboard",
    name: "Project Admin Dashboard",
    element: (
      <ProjectAdminRoute>
        <ProjectAdminDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/project-handover",
    name: "Project Handover",
    element: (
      <ProjectAdminRoute>
        <ProjectClosureForm />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/project-handover/add-project-handover",
    name: "Add Project Handover",
    element: (
      <ProjectAdminRoute>
        <AddProjectClosureForm />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/project-handover/update/:id",
    name: "Update Project Handover",
    element: (
      <ProjectAdminRoute>
        <UpdateProjectClosureForm />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/project-handover/view/:id",
    name: "View Project Handover Document",
    element: (
      <ProjectAdminRoute>
        <ViewProjectClosureDocument />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/site-management",
    name: "Site Management",
    element: (
      <ProjectAdminRoute>
        <SiteManagement />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/site-management/block-management/:site_id",
    name: "Block Management",
    element: (
      <ProjectAdminRoute>
        <BlockManagement />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: (
      <ProjectAdminRoute>
        <RobotOperating />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/site-management/block-management/:site_id/:block/:robot_no/debug_logs",
    name: "Debug Log",
    element: (
      <ProjectAdminRoute>
        <DebugLog />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/site-management/block-management/:site_id/:block/:robot_no/cleaning_logs",
    name: "Cleaning Log",
    element: (
      <ProjectAdminRoute>
        <CleaningLog />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/clients-dashboard",
    name: "Clients",
    element: (
      <ProjectAdminRoute>
        <ClientsDasboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/preventive-maintanance-dashboard",
    name: "Project Admin Preventive Maintenance Dashboard",
    element: (
      <ProjectAdminRoute>
        <PreventiveMaintanancrDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/preventive-maintanance-dashboard/preventive-maintanance-notifications",
    name: "Project Admin Preventive Maintenance Notifications",
    element: (
      <ProjectAdminRoute>
        <PreventiveMaintananceNotifications />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/preventive-maintanance-dashboard/create-pm",
    name: "Create Preventive Maintenance",
    element: (
      <ProjectAdminRoute>
        <CreatePreventivemaintanance />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/preventive-maintanance-dashboard/update/:id",
    name: "Update Preventive Maintenance",
    element: (
      <ProjectAdminRoute>
        <UpdatePreventivemaintanance />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/preventive-maintanance-dashboard/view",
    name: "View Preventive Maintenance",
    element: (
      <ProjectAdminRoute>
        <ViewPreventivemaintananceQuaterly />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/clients-dashboard/clients-data/:id",
    name: "Client Assigned Sites",
    element: (
      <ProjectAdminRoute>
        <ClientAssignedSites />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/robots/shift-block-wise",
    name: "Shift Block Wise Robot",
    element: (
      <ProjectAdminRoute>
        <ShiftBlockwiseRobots />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/service-tickets",
    name: "Service Tickets",
    element: (
      <ProjectAdminRoute>
        <ServiceTicketDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/service-tickets/update-service-ticket/:id",
    name: "Update Service Ticket",
    element: (
      <ProjectAdminRoute>
        <UpdateServiceTicket />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/service-tickets/resolve-service-ticket/:id",
    name: "Resolve Service Ticket",
    element: (
      <ProjectAdminRoute>
        <ResolveServiceTicket />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/service-tickets/create-new-ticket",
    name: "Create New Ticket",
    element: (
      <ProjectAdminRoute>
        <CreateNewServiceTicket />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/service-tickets/key-preventive-matrix",
    name: "Key Preventive Matrix",
    element: (
      <ProjectAdminRoute>
        <KeyMaintenanceMatrix />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/internal-tickets",
    name: "Internal Tickets",
    element: (
      <ProjectAdminRoute>
        <InternalTicketsDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/internal-tickets/create-new-internal-ticket",
    name: "Create New Internal Ticket",
    element: (
      <ProjectAdminRoute>
        <CreateNewInternalTicket />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/internal-tickets/update-internal-ticket/:id",
    name: "Update Internal Ticket",
    element: (
      <ProjectAdminRoute>
        <UpdateInternalTicket />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/all-site-cleaning-log",
    name: "Project Admin All Site Cleaning Log",
    element: (
      <ProjectAdminRoute>
        <AllSiteCleaningLog />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/all-site-cleaning-log/sitewise-cleaning-log/:site_id",
    name: "Project Admin Sitewise Cleaning Log",
    element: (
      <ProjectAdminRoute>
        <SitewaiseLog />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-site-cleaning-log/sitewise-cleaning-log/:site_id",
    name: "Master Admin Sitewise Cleaning Log",
    element: (
      <MasterAdminRoute>
        <SitewaiseLog />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/project-admin/timers",
    name: "All Site Timers",
    element: (
      <ProjectAdminRoute>
        <Timers />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/timers/:block/:site_id",
    name: "Update Block Timer",
    element: (
      <ProjectAdminRoute>
        <UpdateTimer />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/all-site-dpr",
    name: "Project Admin All Site DPR",
    element: (
      <ProjectAdminRoute>
        <AllSiteDpr />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/all-site-dpr/add-dpr",
    name: "Add DPR",
    element: (
      <ProjectAdminRoute>
        <AddDpr />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/update-dpr/:id",
    name: "Update DPR",
    element: (
      <ProjectAdminRoute>
        <UpdateDpr />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/all-site-gateways",
    name: "All Site Gateways",
    element: (
      <ProjectAdminRoute>
        <Gateways />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/all-site-gateways/view-gateway/:id",
    name: "View Gateway",
    element: (
      <ProjectAdminRoute>
        <ViewGateway />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/all-site-gateways/create-new-gateway",
    name: "Master Admin Create New Gateway",
    element: (
      <ProjectAdminRoute>
        <CreateNewGateways />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/weather-timer-notifications",
    name: "Weather Timer Notifications",
    element: (
      <ProjectAdminRoute>
        <WeatherTimerNotifications />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/all-site-gateways/update-gateway/:id",
    name: "Update Gateway",
    element: (
      <ProjectAdminRoute>
        <UpdateGateway />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/all-site-gateways/assign-gateway/:id",
    name: "Assign Gateway",
    element: (
      <ProjectAdminRoute>
        <AssignGateway />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/notifications",
    name: "Project Admin Notifications",
    element: (
      <ProjectAdminRoute>
        <Notifications />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/inventories",
    name: "Inventories",
    element: (
      <ProjectAdminRoute>
        <Inventories />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/inventories/update-inventory/:id",
    name: "Update Inventory",
    element: (
      <ProjectAdminRoute>
        <UpdateInventory />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/inventories/add-inventory",
    name: "Add Inventory",
    element: (
      <ProjectAdminRoute>
        <AddInventory />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/inventories/add-service-item",
    name: "Add Service Item",
    element: (
      <ProjectAdminRoute>
        <AddServiceItem />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/inventories/update-service-item/:id",
    name: "Update Service Item",
    element: (
      <ProjectAdminRoute>
        <UpdateServiceItem />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/technician-attendance",
    name: "Technician Attendance",
    element: (
      <ProjectAdminRoute>
        <TechnicianAttendanceDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/serviceticket-fault/service-tickets-fault-dashboard",
    name: "service-tickets-fault-dashboard",
    element: (
      <ProjectAdminRoute>
        <ServiceTicketsFaultDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/serviceticket-fault/service-tickets-fault-dashboard/create-serviceticket-fault",
    name: "create serviceticketfault",
    element: (
      <ProjectAdminRoute>
        <CreateNewServiceTicketFault />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/serviceticket-fault/service-tickets-fault-dashboard/update-serviceticket-fault/:id",
    name: "service-tickets-fault-dashboard",
    element: (
      <ProjectAdminRoute>
        <UpdateServiceTicketsFault />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/chat",
    name: "Chat with User",
    element: (
      <ProjectAdminRoute>
        <ChatDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/robot-battery-temperature",
    name: "Robot Battery & Temperature",
    element: (
      <ProjectAdminRoute>
        <BatteryAndTemperature />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/expenses",
    name: "Expense Management",
    element: (
      <ProjectAdminRoute>
        <ExpenseDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/expenses/create-expense",
    name: "Create Expense",
    element: (
      <ProjectAdminRoute>
        <CreateExpense />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/expenses/view/:id",
    name: "View Expense",
    element: (
      <ProjectAdminRoute>
        <ViewExpense />
      </ProjectAdminRoute>
    ),
  },

  {
    path: "/project-admin/expenses/update/:id",
    name: "Update Expense",
    element: (
      <ProjectAdminRoute>
        <UpdateExpense />
      </ProjectAdminRoute>
    ),
  },
  //------------------------project admin---------------------------------

  //------------------------project user---------------------------------

  {
    path: "/project-user/dashboard",
    name: "Project User Dashboard",
    element: (
      <ProjectUserRoute>
        <ProjectUserDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/profile-tab",
    name: "Profile Details",
    element: (
      <ProjectUserRoute>
        <Profile />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/robot-activity",
    name: "Robot Activity",
    element: (
      <ProjectUserRoute>
        <RobotActivity />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/robot-commands",
    name: "Robot Commands",
    element: (
      <ProjectUserRoute>
        <RobotCommands />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/all-site-data",
    name: "Taypro All Site Data",
    element: (
      <ProjectUserRoute>
        <TayproDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/monthlyreport",
    name: "Monthly Site Report",
    element: (
      <ProjectUserRoute>
        <MonthlySiteReport />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/dashboard",
    name: "Project User Dashboard",
    element: (
      <ProjectUserRoute>
        <ProjectAdminDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/project-handover",
    name: "Project Handover",
    element: (
      <ProjectUserRoute>
        <ProjectClosureForm />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/project-handover/add-project-handover",
    name: "Add Project Handover",
    element: (
      <ProjectUserRoute>
        <AddProjectClosureForm />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/project-handover/update/:id",
    name: "Update Project Handover",
    element: (
      <ProjectUserRoute>
        <UpdateProjectClosureForm />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/project-handover/view/:id",
    name: "View Project Handover Document",
    element: (
      <ProjectUserRoute>
        <ViewProjectClosureDocument />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/site-management",
    name: "Site Management",
    element: (
      <ProjectUserRoute>
        <SiteManagement />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/site-management/block-management/:site_id",
    name: "Block Management",
    element: (
      <ProjectUserRoute>
        <BlockManagement />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: (
      <ProjectUserRoute>
        <RobotOperating />
      </ProjectUserRoute>
    ),
  },
  // {
  //   path: "/project-user/search-robot",
  //   name: "Search Robot",
  //   element: (
  //     <ProjectUserRoute>
  //       <SearchRobot />
  //     </ProjectUserRoute>
  //   ),
  // },
  {
    path: "/project-user/site-management/block-management/:site_id/:block/:robot_no/debug_logs",
    name: "Debug Log",
    element: (
      <ProjectUserRoute>
        <DebugLog />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/site-management/block-management/:site_id/:block/:robot_no/cleaning_logs",
    name: "Cleaning Log",
    element: (
      <ProjectUserRoute>
        <CleaningLog />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/clients-dashboard",
    name: "Clients",
    element: (
      <ProjectUserRoute>
        <ClientsDasboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/preventive-maintanance-dashboard",
    name: "Project User Preventive Maintenance Dashboard",
    element: (
      <ProjectUserRoute>
        <PreventiveMaintanancrDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/preventive-maintanance-dashboard/preventive-maintanance-notifications",
    name: "Project User Preventive Maintenance Notifications",
    element: (
      <ProjectUserRoute>
        <PreventiveMaintananceNotifications />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/preventive-maintanance-dashboard/create-pm",
    name: "Create Preventive Maintenance",
    element: (
      <ProjectUserRoute>
        <CreatePreventivemaintanance />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/preventive-maintanance-dashboard/update/:id",
    name: "Update Preventive Maintenance",
    element: (
      <ProjectUserRoute>
        <UpdatePreventivemaintanance />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/preventive-maintanance-dashboard/view",
    name: "View Preventive Maintenance",
    element: (
      <ProjectUserRoute>
        <ViewPreventivemaintananceQuaterly />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/clients-dashboard/clients-data/:id",
    name: "Client Assigned Sites",
    element: (
      <ProjectUserRoute>
        <ClientAssignedSites />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/robots/shift-block-wise",
    name: "Shift Block Wise Robot",
    element: (
      <ProjectUserRoute>
        <ShiftBlockwiseRobots />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/service-tickets",
    name: "Service Tickets",
    element: (
      <ProjectUserRoute>
        <ServiceTicketDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/service-tickets/update-service-ticket/:id",
    name: "Update Service Ticket",
    element: (
      <ProjectUserRoute>
        <UpdateServiceTicket />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/service-tickets/resolve-service-ticket/:id",
    name: "Resolve Service Ticket",
    element: (
      <ProjectUserRoute>
        <ResolveServiceTicket />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/service-tickets/create-new-ticket",
    name: "Create New Ticket",
    element: (
      <ProjectUserRoute>
        <CreateNewServiceTicket />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/internal-tickets",
    name: "Internal Tickets",
    element: (
      <ProjectUserRoute>
        <InternalTicketsDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/internal-tickets/create-new-internal-ticket",
    name: "Create New Internal Ticket",
    element: (
      <ProjectUserRoute>
        <CreateNewInternalTicket />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/service-tickets/key-preventive-matrix",
    name: "Key Preventive Matrix",
    element: (
      <ProjectUserRoute>
        <KeyMaintenanceMatrix />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/internal-tickets/update-internal-ticket/:id",
    name: "Update Internal Ticket",
    element: (
      <ProjectUserRoute>
        <UpdateInternalTicket />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/all-site-cleaning-log",
    name: "Project User All Site Cleaning Log",
    element: (
      <ProjectUserRoute>
        <AllSiteCleaningLog />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/all-site-cleaning-log/sitewise-cleaning-log/:site_id",
    name: "Project User Sitewise Cleaning Log",
    element: (
      <ProjectUserRoute>
        <SitewaiseLog />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/master-admin/all-site-cleaning-log/sitewise-cleaning-log/:site_id",
    name: "Master Admin Sitewise Cleaning Log",
    element: (
      <ProjectUserRoute>
        <SitewaiseLog />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/timers",
    name: "All Site Timers",
    element: (
      <ProjectUserRoute>
        <Timers />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/timers/:block/:site_id",
    name: "Update Block Timer",
    element: (
      <ProjectUserRoute>
        <UpdateTimer />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/all-site-dpr",
    name: "Project User All Site DPR",
    element: (
      <ProjectUserRoute>
        <AllSiteDpr />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/all-site-dpr/add-dpr",
    name: "Add DPR",
    element: (
      <ProjectUserRoute>
        <AddDpr />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/update-dpr/:id",
    name: "Update DPR",
    element: (
      <ProjectUserRoute>
        <UpdateDpr />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/all-site-gateways",
    name: "All Site Gateways",
    element: (
      <ProjectUserRoute>
        <Gateways />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/all-site-gateways/view-gateway/:id",
    name: "View Gateway",
    element: (
      <ProjectUserRoute>
        <ViewGateway />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/all-site-gateways/create-new-gateway",
    name: "Master Admin Create New Gateway",
    element: (
      <ProjectUserRoute>
        <CreateNewGateways />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/weather-timer-notifications",
    name: "Weather Timer Notifications",
    element: (
      <ProjectUserRoute>
        <WeatherTimerNotifications />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/all-site-gateways/update-gateway/:id",
    name: "Update Gateway",
    element: (
      <ProjectUserRoute>
        <UpdateGateway />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/all-site-gateways/assign-gateway/:id",
    name: "Assign Gateway",
    element: (
      <ProjectUserRoute>
        <AssignGateway />
      </ProjectUserRoute>
    ),
  },

  {
    path: "/project-user/users",
    name: "All Internal Users",
    element: (
      <ProjectUserRoute>
        <UsersDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/external-users",
    name: "All External Users",
    element: (
      <ProjectUserRoute>
        <ExternalUsersDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/notifications",
    name: "Project User Notifications",
    element: (
      <ProjectUserRoute>
        <Notifications />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/inventories",
    name: "Inventories",
    element: (
      <ProjectUserRoute>
        <Inventories />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/inventories/update-inventory/:id",
    name: "Update Inventory",
    element: (
      <ProjectUserRoute>
        <UpdateInventory />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/inventories/add-inventory",
    name: "Add Inventory",
    element: (
      <ProjectUserRoute>
        <AddInventory />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/inventories/add-service-item",
    name: "Add Service Item",
    element: (
      <ProjectUserRoute>
        <AddServiceItem />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/inventories/update-service-item/:id",
    name: "Update Service Item",
    element: (
      <ProjectUserRoute>
        <UpdateServiceItem />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/technician-attendance",
    name: "Technician Attendance",
    element: (
      <ProjectUserRoute>
        <TechnicianAttendanceDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/serviceticket-fault/service-tickets-fault-dashboard",
    name: "service-tickets-fault-dashboard",
    element: (
      <ProjectUserRoute>
        <ServiceTicketsFaultDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/serviceticket-fault/service-tickets-fault-dashboard/create-serviceticket-fault",
    name: "create serviceticketfault",
    element: (
      <ProjectUserRoute>
        <CreateNewServiceTicketFault />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/serviceticket-fault/service-tickets-fault-dashboard/update-serviceticket-fault/:id",
    name: "service-tickets-fault-dashboard",
    element: (
      <ProjectUserRoute>
        <UpdateServiceTicketsFault />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/chat",
    name: "Chat with User",
    element: (
      <ProjectUserRoute>
        <ChatDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/robot-battery-temperature",
    name: "Robot Battery & Temperature",
    element: (
      <ProjectUserRoute>
        <BatteryAndTemperature />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/notifications",
    name: "Project User Notifications",
    element: (
      <ProjectUserRoute>
        <Notifications />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/expenses",
    name: "Expense Management",
    element: (
      <ProjectUserRoute>
        <ExpenseDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/expenses/create-expense",
    name: "Create Expense",
    element: (
      <ProjectUserRoute>
        <CreateExpense />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/expenses/view/:id",
    name: "View Expense",
    element: (
      <ProjectUserRoute>
        <ViewExpense />
      </ProjectUserRoute>
    ),
  },

  {
    path: "/project-user/expenses/update/:id",
    name: "Update Expense",
    element: (
      <ProjectUserRoute>
        <UpdateExpense />
      </ProjectUserRoute>
    ),
  },
  //------------------------project user---------------------------------

  //------------------------service admin---------------------------------
  {
    path: "/service-admin/robot-activity",
    name: "Robot Activity",
    element: (
      <ServiceAdminRoute>
        <RobotActivity />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/profile-tab",
    name: "Profile Details",
    element: (
      <ServiceAdminRoute>
        <Profile />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/micro-fiber-data",
    name: "Micro Fiber Data",
    element: (
      <ServiceAdminRoute>
        <MicrofiberdataAdminWise />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/robot-commands",
    name: "Robot Commands",
    element: (
      <ServiceAdminRoute>
        <RobotCommands />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/monthlyreport",
    name: "Monthly Site Report",
    element: (
      <ServiceAdminRoute>
        <MonthlySiteReport />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/all-site-data",
    name: "Taypro All Site Data",
    element: (
      <ServiceAdminRoute>
        <TayproDashboard /> ,
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/dashboard",
    name: "Service Admin Dashboard",
    element: (
      <ServiceAdminRoute>
        <ServiceAdminDahboard />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/project-handover",
    name: "Project Handover",
    element: (
      <ServiceAdminRoute>
        <ProjectClosureForm />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/project-handover/add-project-handover",
    name: "Add Project Handover",
    element: (
      <ServiceAdminRoute>
        <AddProjectClosureForm />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/project-handover/update/:id",
    name: "Update Project Handover",
    element: (
      <ServiceAdminRoute>
        <UpdateProjectClosureForm />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/project-handover/view/:id",
    name: "View Project Handover Document",
    element: (
      <ServiceAdminRoute>
        <ViewProjectClosureDocument />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/site-management",
    name: "Site Management",
    element: (
      <ServiceAdminRoute>
        <SiteManagement />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/site-management/block-management/:site_id",
    name: "Block Management",
    element: (
      <ServiceUserRoute>
        <BlockManagement />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-admin/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: (
      <ServiceAdminRoute>
        <RobotOperating />
      </ServiceAdminRoute>
    ),
  },

  // {
  //   path: "/service-admin/search-robot",
  //   name: "Search Robot",
  //   element: (
  //     <ServiceAdminRoute>
  //       <SearchRobot />
  //     </ServiceAdminRoute>
  //   ),
  // },

  {
    path: "/service-admin/site-management/block-management/:site_id/:block/:robot_no/debug_logs",
    name: "Debug Log",
    element: (
      <ServiceAdminRoute>
        <DebugLog />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/weather-timer-notifications",
    name: "Weather Timer Notifications",
    element: (
      <ServiceAdminRoute>
        <WeatherTimerNotifications />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/weather-data-sitewise",
    name: "Weather Data (Sitewise)",
    element: (
      <ServiceAdminRoute>
        <WeatherDataSitewise />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/site-management/block-management/:site_id/:block/:robot_no/cleaning_logs",
    name: "Cleaning Log",
    element: (
      <ServiceAdminRoute>
        <CleaningLog />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/clients-dashboard",
    name: "Clients",
    element: (
      <ServiceAdminRoute>
        <ClientsDasboard />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/preventive-maintanance-dashboard",
    name: "Project Admin Preventive Maintenance Dashboard",
    element: (
      <ServiceAdminRoute>
        <PreventiveMaintanancrDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/preventive-maintanance-dashboard/preventive-maintanance-notifications",
    name: "Project Admin Preventive maintanance Notifications",
    element: (
      <ServiceAdminRoute>
        <PreventiveMaintananceNotifications />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/preventive-maintanance-dashboard/create-pm",
    name: "Create Preventive maintanance",
    element: (
      <ServiceAdminRoute>
        <CreatePreventivemaintanance />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/preventive-maintanance-dashboard/update/:id",
    name: "Update Preventive maintanance",
    element: (
      <ServiceAdminRoute>
        <UpdatePreventivemaintanance />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/preventive-maintanance-dashboard/view",
    name: "View Preventive maintanance",
    element: (
      <ServiceAdminRoute>
        <ViewPreventivemaintananceQuaterly />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/clients-data-dashboard/edit-client/:id",
    name: "Edit Client",
    element: (
      <ServiceAdminRoute>
        <EditClient />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/clients-dashboard/clients-data/:id",
    name: "Client Assigned Sites",
    element: (
      <ServiceAdminRoute>
        <ClientAssignedSites />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/robots/shift-block-wise",
    name: "Shift Block Wise Robot",
    element: (
      <ServiceAdminRoute>
        <ShiftBlockwiseRobots />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/service-tickets",
    name: "Service Tickets",
    element: (
      <ServiceAdminRoute>
        <ServiceTicketDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/service-tickets/update-service-ticket/:id",
    name: "Update Service Ticket",
    element: (
      <ServiceAdminRoute>
        <UpdateServiceTicket />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/service-tickets/resolve-service-ticket/:id",
    name: "Resolve Service Ticket",
    element: (
      <ServiceAdminRoute>
        <ResolveServiceTicket />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/service-tickets/create-new-ticket",
    name: "Create new Tickets",
    element: (
      <ServiceAdminRoute>
        <CreateNewServiceTicket />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/service-tickets/key-preventive-matrix",
    name: "Key Preventive Matrix",
    element: (
      <ServiceAdminRoute>
        <KeyMaintenanceMatrix />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/internal-tickets",
    name: "Internal Tickets",
    element: (
      <ServiceAdminRoute>
        <InternalTicketsDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/internal-tickets/create-new-internal-ticket",
    name: "Create New Internal Tickets",
    element: (
      <ServiceAdminRoute>
        <CreateNewInternalTicket />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/internal-tickets/update-internal-ticket/:id",
    name: "Update Internal Tickets",
    element: (
      <ServiceAdminRoute>
        <UpdateInternalTicket />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/all-site-cleaning-log",
    name: "Service Admin All Site Cleaning Log",
    element: (
      <ServiceAdminRoute>
        <AllSiteCleaningLog />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/all-site-cleaning-log/sitewise-cleaning-log/:site_id",
    name: "Service Admin Sitewise Cleaning Log",
    element: (
      <ServiceAdminRoute>
        <SitewaiseLog />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/all-site-cleaning-log/:site_id",
    name: "Service Admin Sitewise Cleaning Log",
    element: (
      <ServiceAdminRoute>
        <SitewaiseLog />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/timers",
    name: "All Site Timers",
    element: (
      <ServiceAdminRoute>
        <Timers />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/timers/:block/:site_id",
    name: "Update Block Timer",
    element: (
      <ServiceAdminRoute>
        <UpdateTimer />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/all-site-dpr",
    name: "Service Admin All Site Dpr",
    element: (
      <ServiceAdminRoute>
        <AllSiteDpr />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/all-site-dpr/add-dpr",
    name: "Add DPR",
    element: (
      <ServiceAdminRoute>
        <AddDpr />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/update-dpr/:id",
    name: "Update DPR",
    element: (
      <ServiceAdminRoute>
        <UpdateDpr />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/all-site-gateways",
    name: "All Site Gateways",
    element: (
      <ServiceAdminRoute>
        <Gateways />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/serivce-admin/all-site-gateways/view-gateway/:id",
    name: "View Gateway",
    element: (
      <ServiceAdminRoute>
        <ViewGateway />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/all-site-gateways/create-new-gateway",
    name: "Service Admin Create New Gateway",
    element: (
      <ServiceAdminRoute>
        <CreateNewGateways />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/all-site-gateways/assign-gateway/:id",
    name: "Assign Gateway",
    element: (
      <ServiceAdminRoute>
        <AssignGateway />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/all-site-gateways/update-gateway/:id",
    name: "Update Gateway",
    element: (
      <ServiceAdminRoute>
        <UpdateGateway />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/users",
    name: "All Internal Users",
    element: (
      <ServiceAdminRoute>
        <UsersDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/external-users",
    name: "All External Users",
    element: (
      <ServiceAdminRoute>
        <ExternalUsersDashboard />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/notifications",
    name: "Master Admin Notifications",
    element: (
      <ServiceAdminRoute>
        <Notifications />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/inventories",
    name: "Inventories",
    element: (
      <ServiceAdminRoute>
        <Inventories />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/inventories/update-inventory/:id",
    name: "Update Inventory",
    element: (
      <ServiceAdminRoute>
        <UpdateInventory />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/inventories/add-inventory",
    name: "Add Inventory",
    element: (
      <ServiceAdminRoute>
        <AddInventory />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/inventories/add-service-item",
    name: "Add Service Item",
    element: (
      <ServiceAdminRoute>
        <AddServiceItem />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/inventories/update-service-item/:id",
    name: "Update Service Item",
    element: (
      <ServiceAdminRoute>
        <UpdateServiceItem />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/technician-attendance",
    name: "Technician Attendance",
    element: (
      <ServiceAdminRoute>
        <TechnicianAttendanceDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/serviceticket-fault/service-tickets-fault-dashboard",
    name: "service-tickets-fault-dashboard",
    element: (
      <ServiceAdminRoute>
        <ServiceTicketsFaultDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/serviceticket-fault/service-tickets-fault-dashboard/create-serviceticket-fault",
    name: "create serviceticketfault",
    element: (
      <ServiceAdminRoute>
        <CreateNewServiceTicketFault />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/serviceticket-fault/service-tickets-fault-dashboard/update-serviceticket-fault/:id",
    name: "update-serviceticket-fault",
    element: (
      <ServiceAdminRoute>
        <UpdateServiceTicketsFault />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/chat",
    name: "Chat with User",
    element: (
      <ServiceAdminRoute>
        <ChatDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/robot-battery-temperature",
    name: "Robot Battery & Temperature",
    element: (
      <ServiceAdminRoute>
        <BatteryAndTemperature />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/user-performance-dashboard",
    name: "User Performance",

    element: (
      <ServiceAdminRoute>
        <UserPerformanceDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/user-performance-dashboard/user-performance/:id",
    name: "User Performance",
    element: (
      <ServiceAdminRoute>
        <ViewPerformance />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/expenses",
    name: "Expense Management",
    element: (
      <ServiceAdminRoute>
        <ExpenseDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/expenses/create-expense",
    name: "Create Expense",
    element: (
      <ServiceAdminRoute>
        <CreateExpense />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/expenses/view/:id",
    name: "View Expense",
    element: (
      <ServiceAdminRoute>
        <ViewExpense />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/expenses/update/:id",
    name: "Update Expense",
    element: (
      <ServiceAdminRoute>
        <UpdateExpense />
      </ServiceAdminRoute>
    ),
  },

  //------------------------service admin---------------------------------
  //------------------------service user---------------------------------
  {
    path: "/service-user/robot-activity",
    name: "Robot Activity",
    element: (
      <ServiceUserRoute>
        <RobotActivity />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/robot-commands",
    name: "Robot Commands",
    element: (
      <ServiceUserRoute>
        <RobotCommands />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/monthlyreport",
    name: "Monthly Site Report",
    element: (
      <ServiceUserRoute>
        <MonthlySiteReport />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/profile-tab",
    name: "Profile Details",
    element: (
      <ServiceUserRoute>
        <Profile />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/all-site-data",
    name: "Taypro All Site Data",
    element: (
      <ServiceUserRoute>
        <TayproDashboard /> ,
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/dashboard",
    name: "Service User Dashboard",
    element: (
      <ServiceUserRoute>
        <ServiceUserDashboard />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/project-handover",
    name: "Project Handover",
    element: (
      <ServiceUserRoute>
        <ProjectClosureForm />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/project-handover/add-project-handover",
    name: "Add Project Handover",
    element: (
      <ServiceUserRoute>
        <AddProjectClosureForm />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/project-handover/update/:id",
    name: "Update Project Handover",
    element: (
      <ServiceUserRoute>
        <UpdateProjectClosureForm />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/project-handover/view/:id",
    name: "View Project Handover Document",
    element: (
      <ServiceUserRoute>
        <ViewProjectClosureDocument />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/site-management",
    name: "Site Management",
    element: (
      <ServiceUserRoute>
        <SiteManagement />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/site-management/block-management/:site_id",
    name: "Block Management",
    element: (
      <ServiceUserRoute>
        <BlockManagement />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: (
      <ServiceUserRoute>
        <RobotOperating />
      </ServiceUserRoute>
    ),
  },

  // {
  //   path: "/service-user/search-robot",
  //   name: "Search Robot",
  //   element: (
  //     <ServiceUserRoute>
  //       <SearchRobot />
  //     </ServiceUserRoute>
  //   ),
  // },

  {
    path: "/service-user/site-management/block-management/:site_id/:block/:robot_no/debug_logs",
    name: "Debug Log",
    element: (
      <ServiceUserRoute>
        <DebugLog />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/weather-timer-notifications",
    name: "Weather Timer Notifications",
    element: (
      <ServiceUserRoute>
        <WeatherTimerNotifications />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/site-management/block-management/:site_id/:block/:robot_no/cleaning_logs",
    name: "Cleaning Log",
    element: (
      <ServiceUserRoute>
        <CleaningLog />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/clients-dashboard",
    name: "Clients",
    element: (
      <ServiceUserRoute>
        <ClientsDasboard />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/preventive-maintanance-dashboard",
    name: "Service User Preventive Maintenance Dashboard",
    element: (
      <ServiceUserRoute>
        <PreventiveMaintanancrDashboard />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/preventive-maintanance-dashboard/preventive-maintanance-notifications",
    name: "Service User Preventive maintanance Notifications",
    element: (
      <ServiceUserRoute>
        <PreventiveMaintananceNotifications />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/preventive-maintanance-dashboard/create-pm",
    name: "Create Preventive maintanance",
    element: (
      <ServiceUserRoute>
        <CreatePreventivemaintanance />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/preventive-maintanance-dashboard/update/:id",
    name: "Update Preventive maintanance",
    element: (
      <ServiceUserRoute>
        <UpdatePreventivemaintanance />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/preventive-maintanance-dashboard/view",
    name: "View Preventive maintanance",
    element: (
      <ServiceUserRoute>
        <ViewPreventivemaintananceQuaterly />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/clients-data-dashboard/edit-client/:id",
    name: "Edit Client",
    element: (
      <ServiceUserRoute>
        <EditClient />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/clients-dashboard/clients-data/:id",
    name: "Client Assigned Sites",
    element: (
      <ServiceUserRoute>
        <ClientAssignedSites />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/robots/shift-block-wise",
    name: "Shift Block Wise Robot",
    element: (
      <ServiceUserRoute>
        <ShiftBlockwiseRobots />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/service-tickets",
    name: "Service Tickets",
    element: (
      <ServiceUserRoute>
        <ServiceTicketDashboard />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/service-tickets/update-service-ticket/:id",
    name: "Update Service Ticket",
    element: (
      <ServiceUserRoute>
        <UpdateServiceTicket />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/service-tickets/resolve-service-ticket/:id",
    name: "Resolve Service Ticket",
    element: (
      <ServiceUserRoute>
        <ResolveServiceTicket />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/service-tickets/create-new-ticket",
    name: "Create new Tickets",
    element: (
      <ServiceUserRoute>
        <CreateNewServiceTicket />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/service-tickets/key-preventive-matrix",
    name: "Key Preventive Matrix",
    element: (
      <ServiceUserRoute>
        <KeyMaintenanceMatrix />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/internal-tickets",
    name: "Internal Tickets",
    element: (
      <ServiceUserRoute>
        <InternalTicketsDashboard />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/internal-tickets/create-new-internal-ticket",
    name: "Create New Internal Tickets",
    element: (
      <ServiceUserRoute>
        <CreateNewInternalTicket />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/internal-tickets/update-internal-ticket/:id",
    name: "Update Internal Tickets",
    element: (
      <ServiceUserRoute>
        <UpdateInternalTicket />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/all-site-cleaning-log",
    name: "Service User All Site Cleaning Log",
    element: (
      <ServiceUserRoute>
        <AllSiteCleaningLog />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/all-site-cleaning-log/sitewise-cleaning-log/:site_id",
    name: "Service User Sitewise Cleaning Log",
    element: (
      <ServiceUserRoute>
        <SitewaiseLog />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/all-site-cleaning-log/:site_id",
    name: "Service User Sitewise Cleaning Log",
    element: (
      <ServiceUserRoute>
        <SitewaiseLog />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/timers",
    name: "All Site Timers",
    element: (
      <ServiceUserRoute>
        <Timers />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/timers/:block/:site_id",
    name: "Update Block Timer",
    element: (
      <ServiceUserRoute>
        <UpdateTimer />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/all-site-dpr",
    name: "Service User All Site Dpr",
    element: (
      <ServiceUserRoute>
        <AllSiteDpr />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/all-site-dpr/add-dpr",
    name: "Add DPR",
    element: (
      <ServiceUserRoute>
        <AddDpr />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/update-dpr/:id",
    name: "Update DPR",
    element: (
      <ServiceUserRoute>
        <UpdateDpr />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/all-site-gateways",
    name: "All Site Gateways",
    element: (
      <ServiceUserRoute>
        <Gateways />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/all-site-gateways/view-gateway/:id",
    name: "View Gateway",
    element: (
      <ServiceUserRoute>
        <ViewGateway />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/all-site-gateways/create-new-gateway",
    name: "Service User Create New Gateway",
    element: (
      <ServiceUserRoute>
        <CreateNewGateways />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/all-site-gateways/assign-gateway/:id",
    name: "Assign Gateway",
    element: (
      <ServiceUserRoute>
        <AssignGateway />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/all-site-gateways/update-gateway/:id",
    name: "Update Gateway",
    element: (
      <ServiceUserRoute>
        <UpdateGateway />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/users",
    name: "All Internal Users",
    element: (
      <ServiceUserRoute>
        <UsersDashboard />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/external-users",
    name: "All External Users",
    element: (
      <ServiceUserRoute>
        <ExternalUsersDashboard />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/notifications",
    name: "Service User Notifications",
    element: (
      <ServiceUserRoute>
        <Notifications />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/inventories",
    name: "Inventories",
    element: (
      <ServiceUserRoute>
        <Inventories />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/inventories/update-inventory/:id",
    name: "Update Inventory",
    element: (
      <ServiceUserRoute>
        <UpdateInventory />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/inventories/add-inventory",
    name: "Add Inventory",
    element: (
      <ServiceUserRoute>
        <AddInventory />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/inventories/add-service-item",
    name: "Add Service Item",
    element: (
      <ServiceUserRoute>
        <AddServiceItem />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/inventories/update-service-item/:id",
    name: "Update Service Item",
    element: (
      <ServiceUserRoute>
        <UpdateServiceItem />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/technician-attendance",
    name: "Technician Attendance",
    element: (
      <ServiceUserRoute>
        <TechnicianAttendanceDashboard />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/serviceticket-fault/service-tickets-fault-dashboard",
    name: "service-tickets-fault-dashboard",
    element: (
      <ServiceUserRoute>
        <ServiceTicketsFaultDashboard />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/serviceticket-fault/service-tickets-fault-dashboard/create-serviceticket-fault",
    name: "create serviceticketfault",
    element: (
      <ServiceUserRoute>
        <CreateNewServiceTicketFault />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/serviceticket-fault/service-tickets-fault-dashboard/update-serviceticket-fault/:id",
    name: "update-serviceticket-fault",
    element: (
      <ServiceUserRoute>
        <UpdateServiceTicketsFault />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/chat",
    name: "Chat with User",
    element: (
      <ServiceUserRoute>
        <ChatDashboard />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/robot-battery-temperature",
    name: "Robot Battery & Temperature",
    element: (
      <ServiceUserRoute>
        <BatteryAndTemperature />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/expenses",
    name: "Expense Management",
    element: (
      <ServiceUserRoute>
        <ExpenseDashboard />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/expenses/create-expense",
    name: "Create Expense",
    element: (
      <ServiceUserRoute>
        <CreateExpense />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/expenses/view/:id",
    name: "View Expense",
    element: (
      <ServiceUserRoute>
        <ViewExpense />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/expenses/update/:id",
    name: "Update Expense",
    element: (
      <ServiceUserRoute>
        <UpdateExpense />
      </ServiceUserRoute>
    ),
  },
  //------------------------service user---------------------------------

  //------------------------service Site Technician---------------------------------

  {
    path: "/site-technician/dashboard",
    name: "Dashboard",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianDashboard />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/punch-in-punch-out",
    name: "Punch In / Punch Out",
    element: (
      <SiteTechnicianRoute>
        <PunchInPunchOut />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/profile-tab",
    name: "Profile Details",
    element: (
      <SiteTechnicianRoute>
        <Profile />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/all-site-data",
    name: "Dashboard",
    element: (
      <SiteTechnicianRoute>
        <AllSiteData />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/site-management",
    name: "Dashboard",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianSiteManagement />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/site-management/block-management/:site_id",
    name: "Block Management",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianBlockManagement />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Operating",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianRobotOperating />
      </SiteTechnicianRoute>
    ),
  },
  // {
  //   path: "/site-technician/search-robot",
  //   name: "Search Robot",
  //   element: (
  //     <SiteTechnicianRoute>
  //       <SiteTechnicianSearchRobot />
  //     </SiteTechnicianRoute>
  //   ),
  // },
  {
    path: "/site-technician/timers",
    name: "Timers",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianTimers />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/robot-commands",
    name: "Robot Commands",
    element: (
      <SiteTechnicianRoute>
        <RobotCommands />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/timers/:block/:site_id",
    name: "Update Block Timer",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianUpdateTimer />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/cleaning-log-sites",
    name: "Your Assigned Sites",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianSites />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/cleaning-log-sites/:site_id",
    name: "Cleaning Log",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianCleaningLog />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/service-tickets",
    name: "Service Tickets",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianServiceTicketDashboard />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/service-tickets/create-new-ticket",
    name: "New Service Tickets",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianCreateServiceTicket />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/service-tickets/resolve-service-ticket/:id",
    name: "Resolve Service Ticket",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianResolveServiceTicket />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/dpr",
    name: "All DPR",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianDprDashboard />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/user-performance",
    name: "User Performance",

    element: (
      <SiteTechnicianRoute>
        <UserPerformance />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/dpr/add-dpr",
    name: "New DPR",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianAddDpr />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/inventory",
    name: "Site Inventory",
    element: (
      <SiteTechnicianRoute>
        <InventoryTab />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/preventive-maintanance-dashboard",
    name: "Preventive Maintenance",
    element: (
      <SiteTechnicianRoute>
        <PreventiveMaintenanceTechnicianDashboard />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/preventive-maintanance-dashboard/preventive-maintanance-notifications",
    name: "Preventive Maintenance Notifications",
    element: (
      <SiteTechnicianRoute>
        <PreventiveMaintananceTechnicianNotifications />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/preventive-maintanance-dashboard/create-pm",
    name: "Create Preventive Maintenance",
    element: (
      <SiteTechnicianRoute>
        <CreateTechnicianPreventivemaintanance />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/preventive-maintanance-dashboard/update/:id",
    name: "Update Preventive Maintenance",
    element: (
      <SiteTechnicianRoute>
        <UpdateTechnicianPreventivemaintanance />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/preventive-maintanance-dashboard/view",
    name: "View Preventive Maintenance",
    element: (
      <SiteTechnicianRoute>
        <ViewTechnicianPreventivemaintananceQuaterly />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/user-site-attendance",
    name: "Technician Site Attendance",
    element: (
      <SiteTechnicianRoute>
        <UserSiteAttendance />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/site-management/block-management/:site_id/:block/:robot_no/debug_logs",
    name: "Debug Log",
    element: (
      <SiteTechnicianRoute>
        <DebugLog />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/micro-fiber-data",
    name: "Micro Fiber Data",
    element: (
      <SiteTechnicianRoute>
        <Microfiberdata />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/micro-fiber-data/update-micro-fiber-data/:id",
    name: "Update Micro Fiber Data",
    element: (
      <SiteTechnicianRoute>
        <UpdateMicrofiberdata />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/micro-fiber-data/add-micro-fiber-data",
    name: "Add Micro Fiber Data",
    element: (
      <SiteTechnicianRoute>
        <AddMicrofiberdata />
      </SiteTechnicianRoute>
    ),
  },

  {
    path: "/site-technician/expenses",
    name: "Expense Management",
    element: (
      <SiteTechnicianRoute>
        <ExpenseDashboard />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/expenses/create-expense",
    name: "Create Expense",
    element: (
      <SiteTechnicianRoute>
        <CreateExpense />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/expenses/view/:id",
    name: "View Expense",
    element: (
      <SiteTechnicianRoute>
        <ViewExpense />
      </SiteTechnicianRoute>
    ),
  },

  {
    path: "/site-technician/expenses/update/:id",
    name: "Update Expense",
    element: (
      <SiteTechnicianRoute>
        <UpdateExpense />
      </SiteTechnicianRoute>
    ),
  },
  //------------------------service Site Technician---------------------------------

  // ------------------------client admin---------------------------------

  {
    path: "/client-admin/dashboard",
    name: "Client Admin Dashboard",
    element: (
      <ClientAdminRoute>
        <ClientAdminDashboard />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/profile-tab",
    name: "Profile Details",
    element: (
      <ClientAdminRoute>
        <Profile />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/monthlyreport",
    name: "Monthly Site Report",
    element: (
      <ClientAdminRoute>
        <MonthlySiteReport />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/robot-commands",
    name: "Robot Commands",
    element: (
      <ClientAdminRoute>
        <RobotCommands />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/site-management/all-site-data",
    name: "Your Sites Data",
    element: (
      <ClientAdminRoute>
        <ClientDashboard />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/site-management",
    name: "Site Management",
    element: (
      <ClientAdminRoute>
        <ClientSiteManagement />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/preventive-maintenance-dashboard",
    name: "Client Admin Preventive Maintenance Dashboard",
    element: (
      <ClientAdminRoute>
        <PreventiveMaintenanceList />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/site-management/block-management/:site_id",
    name: "Block Management",
    element: (
      <ClientAdminRoute>
        <ClientBlockManagement />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: (
      <ClientAdminRoute>
        <ClientRobotOperating />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/timers",
    name: "Timers",
    element: (
      <ClientAdminRoute>
        <ClientTimers />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/timers/:block/:site_id",
    name: "Update Block Timer",
    element: (
      <ClientAdminRoute>
        <ClientUpdateTimer />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/external-users",
    name: "All  External Users",
    element: (
      <ClientAdminRoute>
        <ClientUsersManagement />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/cleaning-log-sites",
    name: "Your Assigned Sites",
    element: (
      <ClientAdminRoute>
        <Sites />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/cleaning-log-sites/:site_id",
    name: "Cleaning Log",
    element: (
      <ClientAdminRoute>
        <ClientCleaningLog />
      </ClientAdminRoute>
    ),
  },

  {
    path: "/client-admin/statistics",
    name: "General Statistics",
    element: (
      <ClientAdminRoute>
        <Statistics />
      </ClientAdminRoute>
    ),
  },

  {
    path: "/client-admin/chat",
    name: "Chat with User",
    element: (
      <ClientAdminRoute>
        <ChatDashboard />
      </ClientAdminRoute>
    ),
  },

  {
    path: "/client-admin/clientadmin-client-ticket",
    name: "Client Tickets",
    element: (
      <ClientAdminRoute>
        <ClientTicketsDashboardClient />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/clientadmin-client-ticket/create-client-ticket",
    name: "Create New client Tickets",
    element: (
      <ClientAdminRoute>
        <CreateNewClientTicketClient />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/clientadmin-client-ticket/update-ticket/:id",
    name: "Update client Tickets",
    element: (
      <ClientAdminRoute>
        <UpdateClientTicketClient />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/subscriptions",
    name: " View Subscription",
    element: (
      <ClientAdminRoute>
        <SubscriptionViewPage />
      </ClientAdminRoute>
    ),
  },

  // ------------------------client admin---------------------------------

  // ---------------------client Site Incharge--------------------------------
  {
    path: "/site-incharge/dashboard",
    name: "site-incharge Dashboard",
    element: (
      <ClientSiteInchargeRoute>
        <ClientAdminDashboard />
      </ClientSiteInchargeRoute>
    ),
  },
  {
    path: "/site-incharge/profile-tab",
    name: "Profile Details",
    element: (
      <ClientSiteInchargeRoute>
        <Profile />
      </ClientSiteInchargeRoute>
    ),
  },
  {
    path: "/site-incharge/robot-commands",
    name: "Robot Commands",
    element: (
      <ClientSiteInchargeRoute>
        <RobotCommands />
      </ClientSiteInchargeRoute>
    ),
  },
  {
    path: "/site-incharge/site-management/all-site-data",
    name: "Your Sites Data",
    // element: ClientDashboard,

    element: (
      <ClientSiteInchargeRoute>
        <ClientDashboard />
      </ClientSiteInchargeRoute>
    ),
  },
  {
    path: "/site-incharge/site-management",
    name: "Site Management",
    // element: ClientSiteManagement,
    element: (
      <ClientSiteInchargeRoute>
        <ClientSiteManagement />
      </ClientSiteInchargeRoute>
    ),
  },
  {
    path: "/site-incharge/site-management/block-management/:site_id",
    name: "Block Management",
    element: (
      <ClientSiteInchargeRoute>
        <ClientBlockManagement />
      </ClientSiteInchargeRoute>
    ),
  },
  {
    path: "/site-incharge/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: (
      <ClientSiteInchargeRoute>
        <ClientRobotOperating />
      </ClientSiteInchargeRoute>
    ),
  },
  // {
  //   path: "/site-incharge/search-robot",
  //   name: "Search Robot",
  //   element: (
  //     <ClientSiteInchargeRoute>
  //       <ClientSearchRobot />
  //     </ClientSiteInchargeRoute>
  //   ),
  // },

  {
    path: "/site-incharge/timers",
    name: "Timers",
    element: (
      <ClientSiteInchargeRoute>
        <ClientTimers />
      </ClientSiteInchargeRoute>
    ),
  },
  {
    path: "/site-incharge/timers/:block/:site_id",
    name: "Update Block Timer",
    element: (
      <ClientSiteInchargeRoute>
        <ClientUpdateTimer />
      </ClientSiteInchargeRoute>
    ),
  },

  {
    path: "/site-incharge/external-users",
    name: "All  External Users",
    element: (
      <ClientSiteInchargeRoute>
        <ClientUsersManagement />
      </ClientSiteInchargeRoute>
    ),
  },

  {
    path: "/site-incharge/cleaning-log-sites",
    name: "Your Assigned Sites",
    element: (
      <ClientSiteInchargeRoute>
        <Sites />
      </ClientSiteInchargeRoute>
    ),
  },
  {
    path: "/site-incharge/cleaning-log-sites/:site_id",
    name: "Cleaning Log",
    element: (
      <ClientSiteInchargeRoute>
        <ClientCleaningLog />
      </ClientSiteInchargeRoute>
    ),
  },
  // ------------------------client Site Incharge---------------------------------

  // ClientSiteTechnicianDashboard
  // ---------------------client Site Technician--------------------------------

  {
    path: "/client-site-technician/dashboard",
    name: "client-site-technician Dashboard",
    element: (
      <ClientSiteTechnicianRoute>
        <ClientAdminDashboard />
      </ClientSiteTechnicianRoute>
    ),
  },
  {
    path: "/client-site-technician/profile-tab",
    name: "Profile Details",
    element: (
      <ClientSiteTechnicianRoute>
        <Profile />
      </ClientSiteTechnicianRoute>
    ),
  },
  {
    path: "/client-site-technician/robot-commands",
    name: "Robot Commands",
    element: (
      <ClientSiteTechnicianRoute>
        <RobotCommands />
      </ClientSiteTechnicianRoute>
    ),
  },
  {
    path: "/client-site-technician/site-management/all-site-data",
    name: "Your Sites Data",
    element: (
      <ClientSiteTechnicianRoute>
        <ClientDashboard />
      </ClientSiteTechnicianRoute>
    ),
  },
  {
    path: "/client-site-technician/site-management",
    name: "Site Management",
    element: (
      <ClientSiteTechnicianRoute>
        <ClientSiteManagement />
      </ClientSiteTechnicianRoute>
    ),
  },
  {
    path: "/client-site-technician/site-management/block-management/:site_id",
    name: "Block Management",
    element: (
      <ClientSiteTechnicianRoute>
        <ClientBlockManagement />
      </ClientSiteTechnicianRoute>
    ),
  },
  {
    path: "/client-site-technician/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: (
      <ClientSiteTechnicianRoute>
        <ClientRobotOperating />
      </ClientSiteTechnicianRoute>
    ),
  },
  {
    path: "/client-site-technician/timers",
    name: "Timers",
    element: (
      <ClientSiteTechnicianRoute>
        <ClientTimers />
      </ClientSiteTechnicianRoute>
    ),
  },
  {
    path: "/client-site-technician/timers/:block/:site_id",
    name: "Update Block Timer",
    element: (
      <ClientSiteTechnicianRoute>
        <ClientUpdateTimer />
      </ClientSiteTechnicianRoute>
    ),
  },
  {
    path: "/client-site-technician/external-users",
    name: "All  External Users",
    element: (
      <ClientSiteTechnicianRoute>
        <ClientUsersManagement />
      </ClientSiteTechnicianRoute>
    ),
  },
  {
    path: "/client-site-technician/cleaning-log-sites",
    name: "Your Assigned Sites",
    element: (
      <ClientSiteTechnicianRoute>
        <Sites />
      </ClientSiteTechnicianRoute>
    ),
  },
  {
    path: "/client-site-technician/cleaning-log-sites/:site_id",
    name: "Cleaning Log",
    element: (
      <ClientSiteTechnicianRoute>
        <ClientCleaningLog />
      </ClientSiteTechnicianRoute>
    ),
  },

  // ------------------------client Site Technician---------------------------------

  // ------------------------opex client admin ----------------------------------

  {
    path: "/opex-client-admin/dashboard",
    name: "Opex Client Admin Dashboard",
    element: (
      <OpexClientAdmin>
        <OpexClientAdminDashboard />
      </OpexClientAdmin>
    ),
  },
  {
    path: "/opex-client-admin/my-opex-data",
    name: "Opex Data",
    element: (
      <OpexClientAdmin>
        <OpexTemplate />
      </OpexClientAdmin>
    ),
  },
  {
    path: "/opex-client-admin/my-opex-data/:site_id/:moduleId/cycle/:cycleId",
    name: "Opex Cycle Data",
    element: (
      <OpexClientAdmin>
        <OpexCycleData />
      </OpexClientAdmin>
    ),
  },
  {
    path: "/opex-client-admin/profile-tab",
    name: "Profile Details",
    element: (
      <OpexClientAdmin>
        <Profile />
      </OpexClientAdmin>
    ),
  },
  // ------------------------opex client admin ----------------------------------

  // ------------------------opex site technician ----------------------------------

  {
    path: "/opex-site-technician/dashboard",
    name: "Opex Site Technician Dashboard",
    element: (
      <OpexSiteTechnicianRoute>
        <OpexSiteTechnicianDashboard />
      </OpexSiteTechnicianRoute>
    ),
  },
  {
    path: "/opex-site-technician/punch-in-punch-out",
    name: "Punch In / Punch Out",
    element: (
      <OpexSiteTechnicianRoute>
        <PunchInPunchOut />
      </OpexSiteTechnicianRoute>
    ),
  },
  {
    path: "/opex-site-technician/user-site-attendance",
    name: "Technician Site Attendance",
    element: (
      <OpexSiteTechnicianRoute>
        <UserSiteAttendance />
      </OpexSiteTechnicianRoute>
    ),
  },
  {
    path: "/opex-site-technician/my-opex-data",
    name: "Opex Data",
    element: (
      <OpexSiteTechnicianRoute>
        <OpexTemplate />
      </OpexSiteTechnicianRoute>
    ),
  },
  {
    path: "/opex-site-technician/my-opex-data/:site_id/:moduleId/cycle/:cycleId",
    name: "Opex Cycle Data",
    element: (
      <OpexSiteTechnicianRoute>
        <OpexCycleData />
      </OpexSiteTechnicianRoute>
    ),
  },
  {
    path: "/opex-site-technician/profile-tab",
    name: "Profile Details",
    element: (
      <OpexSiteTechnicianRoute>
        <Profile />
      </OpexSiteTechnicianRoute>
    ),
  },
  {
    path: "/opex-site-technician/upload-images/:moduleId/:cycleId/:dayId/:site_id",
    name: "Profile Details",
    element: (
      <OpexSiteTechnicianRoute>
        <UploadImages />
      </OpexSiteTechnicianRoute>
    ),
  },

  // ------------------------opex site technician ----------------------------------

  //common pages

  //common pages

  // existing features
  { path: "/theme", name: "Theme", element: Colors, exact: true },
  { path: "/theme/colors", name: "Colors", element: Colors },
  { path: "/theme/typography", name: "Typography", element: Typography },
  { path: "/base", name: "Base", element: Cards, exact: true },
  { path: "/base/accordion", name: "Accordion", element: Accordion },
  { path: "/base/breadcrumbs", name: "Breadcrumbs", element: Breadcrumbs },
  { path: "/base/cards", name: "Cards", element: Cards },
  { path: "/base/carousels", name: "Carousel", element: Carousels },
  { path: "/base/collapses", name: "Collapse", element: Collapses },
  { path: "/base/list-groups", name: "List Groups", element: ListGroups },
  { path: "/base/navs", name: "Navs", element: Navs },
  { path: "/base/paginations", name: "Paginations", element: Paginations },
  { path: "/base/placeholders", name: "Placeholders", element: Placeholders },
  { path: "/base/popovers", name: "Popovers", element: Popovers },
  { path: "/base/progress", name: "Progress", element: Progress },
  { path: "/base/spinners", name: "Spinners", element: Spinners },
  { path: "/base/tabs", name: "Tabs", element: Tabs },
  { path: "/base/tables", name: "Tables", element: Tables },
  { path: "/base/tooltips", name: "Tooltips", element: Tooltips },
  { path: "/buttons", name: "Buttons", element: Buttons, exact: true },
  { path: "/buttons/buttons", name: "Buttons", element: Buttons },
  { path: "/buttons/dropdowns", name: "Dropdowns", element: Dropdowns },
  {
    path: "/buttons/button-groups",
    name: "Button Groups",
    element: ButtonGroups,
  },
  { path: "/charts", name: "Charts", element: Charts },
  { path: "/forms", name: "Forms", element: FormControl, exact: true },
  { path: "/forms/form-control", name: "Form Control", element: FormControl },
  { path: "/forms/select", name: "Select", element: Select },
  {
    path: "/forms/checks-radios",
    name: "Checks & Radios",
    element: ChecksRadios,
  },
  { path: "/forms/range", name: "Range", element: Range },
  { path: "/forms/input-group", name: "Input Group", element: InputGroup },
  {
    path: "/forms/floating-labels",
    name: "Floating Labels",
    element: FloatingLabels,
  },
  { path: "/forms/layout", name: "Layout", element: Layout },
  { path: "/forms/validation", name: "Validation", element: Validation },
  { path: "/icons", exact: true, name: "Icons", element: CoreUIIcons },
  { path: "/icons/coreui-icons", name: "CoreUI Icons", element: CoreUIIcons },
  { path: "/icons/flags", name: "Flags", element: Flags },
  { path: "/icons/brands", name: "Brands", element: Brands },
  {
    path: "/notifications",
    name: "Notifications",
    element: Alerts,
    exact: true,
  },
  {
    path: "*",
    element: <Page404 />,
  },
  { path: "/notifications/alerts", name: "Alerts", element: Alerts },
  { path: "/notifications/badges", name: "Badges", element: Badges },
  { path: "/notifications/modals", name: "Modals", element: Modals },
  { path: "/notifications/toasts", name: "Toasts", element: Toasts },
  { path: "/widgets", name: "Widgets", element: Widgets },
];

export default routes;
