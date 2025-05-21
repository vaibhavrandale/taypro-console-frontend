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
import SearchRobot from "./views/master-admin/site-management/SearchRobot";
import DebugLog from "./views/master-admin/site-management/DebugLog";
import CleaningLog from "./views/master-admin/site-management/CleaningLog";
import NewDownlink from "./views/master-admin/site-management/NewDownlink";
import UpdateDownlink from "./views/master-admin/site-management/UpdateDownlink";
import ViewDownlink from "./views/master-admin/site-management/ViewDownlink";
import ClientDashboard from "./views/client-admin/site-management/ClientDashboard";
import ClientSiteManagement from "./views/client-admin/site-management/ClientSiteManagement";
import ClientBlockManagement from "./views/client-admin/site-management/ClientBlockManagement";
import ClientRobotOperating from "./views/client-admin/site-management/ClientRobotOperating";
import ClientSearchRobot from "./views/client-admin/site-management/ClientSearchRobot";
import ClientTimers from "./views/client-admin/timers/ClientTimers";
import ClientUpdateTimer from "./views/client-admin/timers/ClientUpdateTimer";
import ClientUsersManagement from "./views/client-admin/Users/ClientUsersManagement";
import Sites from "./views/client-admin/cleaninglog/Sites";
import ClientCleaningLog from "./views/client-admin/cleaninglog/ClientCleaningLog";
import ClientSiteInchargeDashboard from "./views/client-site-incharge/ClientSiteInchargeDashboard";
import ClientSiteTechnicianDashboard from "./views/client-technician/ClientSiteTechnicianDashboard";
import ShiftBlockwiseRobots from "./views/master-admin/robots/ShiftBlockwiseRobots";
import SiteTechnicianDashboard from "./views/site-technician/SiteTechnicianDashboard";
import AllSiteData from "./views/site-technician/AllSiteData";
import SiteTechnicianSiteManagement from "./views/site-technician/site-management/SiteTechnicianSiteManagement";
import SiteTechnicianBlockManagement from "./views/site-technician/site-management/SiteTechnicianBlockManagement";
import SiteTechnicianRobotOperating from "./views/site-technician/site-management/SiteTechnicianRobotOperating";
import SiteTechnicianSearchRobot from "./views/site-technician/site-management/SiteTechnicianSearchRobot";
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
  ServiceAdminRoute,
  ProjectAdminRoute,
  MasterAdminRoute,
  SiteTechnicianRoute,
  ClientAdminRoute,
  ClientSiteTechnicianRoute,
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

const App = React.lazy(() => import("./views/pages/app/App"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));

// const UserBasedLinkDashboard = React.lazy(() =>
//   import("")
// );

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

const CreateNewServiceTicketFault = React.lazy(() =>
  import("./views/master-admin/serviceticket-fault/CreateNewServiceTicketFault")
);
//----------------------------------master admin------------------------------------

//----------------------------------client admin------------------------------------

const ClientAdminDashboard = React.lazy(() =>
  import("./views/client-admin/ClientAdminDashboard")
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
    path: "/master-admin/search-robot",
    name: "Search Robot",
    element: (
      <MasterAdminRoute>
        <SearchRobot />
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
    path: "/master-admin/activate-robots",
    name: "All Inactivate Robots",
    element: (
      <MasterAdminRoute>
        <ActivateRobots />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/robots/:id",
    name: "Update Robot",
    element: (
      <MasterAdminRoute>
        <UpdateRobots />
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

  //preveantive maintanance
  // ------------------------master admin---------------------------------

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
    path: "/project-admin/all-site-data",
    name: "Taypro All Site Data",
    element: (
      <ProjectAdminRoute>
        <TayproDashboard />
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
    path: "/project-admin/search-robot",
    name: "Search Robot",
    element: (
      <ProjectAdminRoute>
        <SearchRobot />
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
    path: "/project-admin/all-site-gateways/create-new-gateway",
    name: "Master Admin Create New Gateway",
    element: (
      <ProjectAdminRoute>
        <CreateNewGateways />
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
    path: "/project-admin/users",
    name: "All Internal Users",
    element: (
      <ProjectAdminRoute>
        <UsersDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/external-users",
    name: "All External Users",
    element: (
      <ProjectAdminRoute>
        <ExternalUsersDashboard />
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
  //------------------------project admin---------------------------------

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
      <ServiceAdminRoute>
        <BlockManagement />
      </ServiceAdminRoute>
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

  {
    path: "/service-admin/search-robot",
    name: "Search Robot",
    element: (
      <ServiceAdminRoute>
        <SearchRobot />
      </ServiceAdminRoute>
    ),
  },

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

  //------------------------service admin---------------------------------

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
  {
    path: "/site-technician/search-robot",
    name: "Search Robot",
    element: (
      <SiteTechnicianRoute>
        <SiteTechnicianSearchRobot />
      </SiteTechnicianRoute>
    ),
  },
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
    path: "/client-admin/search-robot",
    name: "Search Robot",
    element: (
      <ClientAdminRoute>
        <ClientSearchRobot />
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

  // ------------------------client admin---------------------------------

  // ---------------------client Site Incharge--------------------------------
  {
    path: "/client-site-incharge/dashboard",
    name: "client-site-incharge Dashboard",
    element: ClientSiteInchargeDashboard,
  },
  {
    path: "/client-site-incharge/site-management/all-site-data",
    name: "Your Sites Data",
    element: ClientDashboard,
  },
  {
    path: "/client-site-incharge/site-management",
    name: "Site Management",
    element: ClientSiteManagement,
  },
  {
    path: "/client-site-incharge/site-management/block-management/:site_id",
    name: "Block Management",
    element: ClientBlockManagement,
  },
  {
    path: "/client-site-incharge/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: ClientRobotOperating,
  },
  {
    path: "/client-site-incharge/search-robot",
    name: "Search Robot",
    element: ClientSearchRobot,
  },

  {
    path: "/client-site-incharge/timers",
    name: "Timers",
    element: ClientTimers,
  },
  {
    path: "/client-site-incharge/timers/:block/:site_id",
    name: "Update Block Timer",
    element: ClientUpdateTimer,
  },

  {
    path: "/client-site-incharge/external-users",
    name: "All  External Users",
    element: ClientUsersManagement,
  },

  {
    path: "/client-site-incharge/cleaning-log-sites",
    name: "Your Assigned Sites",
    element: Sites,
  },
  {
    path: "/client-site-incharge/cleaning-log-sites/:site_id",
    name: "Cleaning Log",
    element: ClientCleaningLog,
  },
  // ------------------------client Site Incharge---------------------------------

  // ClientSiteTechnicianDashboard
  // ---------------------client Site Technician--------------------------------

  {
    path: "/client-site-technician/dashboard",
    name: "client-site-technician Dashboard",
    element: (
      <ClientSiteTechnicianRoute>
        <ClientSiteTechnicianDashboard />
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
    path: "/client-site-technician/search-robot",
    name: "Search Robot",
    element: (
      <ClientSiteTechnicianRoute>
        <ClientSearchRobot />
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
