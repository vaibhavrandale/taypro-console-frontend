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
// import ProjectHandoverDashboard from "./views/project-admin/project-closure/ProjectHandoverDashboard";
// import ViewProjectHandoverDocument from "./views/project-admin/project-closure/ViewProjectHandoverDocument";
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
// import AddProjectHandover from "./views/project-admin/project-closure/AddProjectHandover";

const App = React.lazy(() => import("./views/pages/app/App"));
const UserBasedLinkDashboard = React.lazy(() =>
  import("./views/dashboard/UserBasedLinkDashboard")
);

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

const Inventories = React.lazy(() =>
  import("./views/master-admin/inventories/Inventories")
);

const UpdateInventory = React.lazy(() =>
  import("./views/master-admin/inventories/UpdateInventory")
);

const AddInventory = React.lazy(() =>
  import("./views/master-admin/inventories/AddInventory")
);

const AddServiceItem = React.lazy(() =>
  import("./views/master-admin/inventories/AddServiceItem")
);

const UpdateServiceItem = React.lazy(() =>
  import("./views/master-admin/inventories/UpdateServiceItem")
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
    element: UserBasedLinkDashboard,
  },

  { path: "/dashboard2", name: "Dashboard", element: Dashboard },

  {
    path: "/user-dashboard",
    name: "User Links",
    element: UserBasedLinkDashboard,
  },

  // new features
  { path: "/apps", name: "App", element: App },

  // ------------------------master admin---------------------------------
  {
    path: "/master-admin/dashboard",
    name: "Master Admin Dashboard",
    element: MasterAdminDashboard,
  },
  {
    path: "/master-admin/site-management/all-site-data",
    name: "Taypro All Site Data",
    element: TayproDashboard,
  },
  {
    path: "/master-admin/site-management",
    name: "Site Management",
    element: SiteManagement,
  },
  {
    path: "/master-admin/site-management/block-management/:site_id",
    name: "Block Management",
    element: BlockManagement,
  },
  {
    path: "/master-admin/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: RobotOperating,
  },
  {
    path: "/master-admin/site-management/robot-activity",
    name: "Robot Activity",
    element: RobotActivity,
  },

  {
    path: "/master-admin/search-robot",
    name: "Search Robot",
    element: SearchRobot,
  },

  {
    path: "/master-admin/site-management/block-management/:site_id/:block/:robot_no/debug_logs",
    name: "Debug Log",
    element: DebugLog,
  },

  {
    path: "/master-admin/site-management/block-management/:site_id/:block/:robot_no/cleaning_logs",
    name: "Cleaning Log",
    element: CleaningLog,
  },
  {
    path: "/master-admin/site-management/block-management/:site_id/:block/:robot_no/add-downlink",
    name: "Add Downlink",
    element: NewDownlink,
  },
  {
    path: "/master-admin/site-management/block-management/:site_id/:block/:robot_no/update-downlink/:id",
    name: "Update Downlink",
    element: UpdateDownlink,
  },
  {
    path: "/master-admin/site-management/block-management/:site_id/:block/:robot_no/view-downlink/:id",
    name: "View Downlink",
    element: ViewDownlink,
  },
  {
    path: "/master-admin/lora-configuration",
    name: "Lora Configuration",
    element: LoraConfiguration,
  },
  {
    path: "/master-admin/replace-lora",
    name: "Replace Lora",
    element: ReplaceLora,
  },
  {
    path: "/master-admin/replace-lora/in-active-robots",
    name: "In Active Robots",
    element: InActiveRobots,
  },
  {
    path: "/master-admin/replace-lora/active-robots",
    name: "Active Robots",
    element: ActiveRobots,
  },

  {
    path: "/master-admin/add-robot/add-robot-using-lorano",
    name: "Add Robot",
    element: AddRobotUsingLoraNo,
  },

  {
    path: "/master-admin/clients-dashboard",
    name: "Clients",
    element: ClientsDasboard,
  },

  {
    path: "/master-admin/clients-data-dashboard/edit-client/:id",
    name: "Edit Client",
    element: EditClient,
  },
  {
    path: "/master-admin/clients-dashboard/clients-data/:id",
    name: "Client Assigned Sites",
    element: ClientAssignedSites,
  },

  // {
  //   path: "/master-admin/clients",
  //   name: "Clients data",
  //   element: Clients,
  // },

  // {
  //   path: "/master-admin/clients/clients-data/:client_id",
  //   name: "Client data",
  //   element: ClientsData,
  // },
  {
    path: "/master-admin/robots",
    name: "All Robots",
    element: Robots,
  },
  {
    path: "/master-admin/activate-robots",
    name: "All Inactivate Robots",
    element: ActivateRobots,
  },
  {
    path: "/master-admin/robots/:id",
    name: "Update Robot",
    element: UpdateRobots,
  },
  {
    path: "/master-admin/robots/shift-block-wise",
    name: "Shift Block Wise Robot",
    element: ShiftBlockwiseRobots,
  },
  {
    path: "/master-admin/inventories",
    name: "Inventories",
    element: Inventories,
  },
  {
    path: "/master-admin/inventories/update-inventory/:id",
    name: "Update Inventory",
    element: UpdateInventory,
  },
  {
    path: "/master-admin/inventories/add-inventory",
    name: "Add Inventory",
    element: AddInventory,
  },
  {
    path: "/master-admin/inventories/add-service-item",
    name: "Add Service Item",
    element: AddServiceItem,
  },
  {
    path: "/master-admin/inventories/update-service-item/:id",
    name: "Update Service Item",
    element: UpdateServiceItem,
  },
  {
    path: "/master-admin/timers",
    name: "Update Timers",
    element: Timers,
  },
  {
    path: "/master-admin/timers/:block/:site_id",
    name: "Update Robot Timer",
    element: UpdateTimer,
  },
  {
    path: "/master-admin/project-handover",
    name: "Project Handover",
    element: ProjectClosureForm,
  },
  {
    path: "/master-admin/project-handover/add-project-handover",
    name: "Add Project Handover",
    element: AddProjectClosureForm,
  },
  {
    path: "/master-admin/project-handover/update/:id",
    name: "Update Project Handover",
    element: UpdateProjectClosureForm,
  },
  {
    path: "/master-admin/project-handover/view/:id",
    name: "View Project Handover Document",
    element: ViewProjectClosureDocument,
  },
  {
    path: "/master-admin/service-tickets",
    name: "Service Tickets",
    element: ServiceTicketDashboard,
  },
  {
    path: "/master-admin/service-tickets/update-service-ticket/:id",
    name: "Update Service Ticket",
    element: UpdateServiceTicket,
  },
  {
    path: "/master-admin/service-tickets/resolve-service-ticket/:id",
    name: "Resolve Service Ticket",
    element: ResolveServiceTicket,
  },
  {
    path: "/master-admin/service-tickets/create-new-ticket",
    name: "Create new Tickets",
    element: CreateNewServiceTicket,
  },
  {
    path: "/master-admin/internal-tickets",
    name: "Internal Tickets",
    element: InternalTicketsDashboard,
  },
  {
    path: "/master-admin/internal-tickets/create-new-internal-ticket",
    name: "Create New Internal Tickets",
    element: CreateNewInternalTicket,
  },
  {
    path: "/master-admin/internal-tickets/update-internal-ticket/:id",
    name: "Update Internal Tickets",
    element: UpdateInternalTicket,
  },
  {
    path: "/master-admin/users",
    name: "All  Internal Users",
    element: UsersDashboard,
  },
  {
    path: "/master-admin/external-users",
    name: "All  External Users",
    element: ExternalUsersDashboard,
  },

  {
    path: "/master-admin/notifications",
    name: "Master Admin Notifications",
    element: Notifications,
  },

  {
    path: "/master-admin/all-site-cleaning-log",
    name: "Master Admin All Site Cleaning Log",
    element: AllSiteCleaningLog,
  },

  {
    path: "/master-admin/all-site-cleaning-log/sitewise-cleaning-log/:site_id",
    name: "Master Admin  Sitewise Cleaning Log",
    element: SitewaiseLog,
  },
  {
    path: "/master-admin/all-site-gateways",
    name: "Master Admin  All Site Gateways",
    element: Gateways,
  },
  {
    path: "/master-admin/all-site-gateways/update-gateway/:id",
    name: "Master Admin  Update Gateway",
    element: UpdateGateway,
  },
  {
    path: "/master-admin/all-site-gateways/create-new-gateway",
    name: " Master Admin Create New Gateway",
    element: CreateNewGateways,
  },
  {
    path: "/master-admin/all-site-gateways/assign-gateway/:id",
    name: "Assign Gateway",
    element: AssignGateway,
  },
  {
    path: "/master-admin/all-site-dpr",
    name: "Master Admin  All Site Dpr",
    element: AllSiteDpr,
  },

  {
    path: "/master-admin/all-site-dpr/add-dpr",
    name: "Add DPR",
    element: AddDpr,
  },
  {
    path: "/master-admin/update-dpr/:id",
    name: "Update DPR",
    element: UpdateDpr,
  },

  //preveantive maintanance
  {
    path: "/master-admin/preventive-maintanance-dashboard",
    name: "Master Admin Preventive maintanance Dashboard",
    element: PreventiveMaintanancrDashboard,
  },
  {
    path: "/master-admin/preventive-maintanance-dashboard/preventive-maintanance-notifications",
    name: "Master Admin Preventive maintanance Notifications",
    element: PreventiveMaintananceNotifications,
  },
  {
    path: "/master-admin/preventive-maintanance-dashboard/create-pm",
    name: "Create Preventive maintanance",
    element: CreatePreventivemaintanance,
  },
  {
    path: "/master-admin/preventive-maintanance-dashboard/update/:id",
    name: "Update Preventive maintanance",
    element: UpdatePreventivemaintanance,
  },
  {
    path: "/master-admin/preventive-maintanance-dashboard/view",
    name: "View Preventive maintanance",
    element: ViewPreventivemaintananceQuaterly,
  },

  {
    path: "/master-admin/technician-attendance",
    name: "Technician Attendance",
    element: TechnicianAttendanceDashboard,
  },

  //preveantive maintanance
  // ------------------------master admin---------------------------------

  //------------------------project admin---------------------------------

  {
    path: "/project-admin/all-site-data",
    name: "Taypro All Site Data",
    element: TayproDashboard,
  },
  {
    path: "/project-admin/dashboard",
    name: "Project Admin Dashboard",
    element: ProjectAdminDashboard,
  },

  // {
  //   path: "/project-admin/project-handover",
  //   name: "Project Handover",
  //   element: ProjectHandoverDashboard,
  // },

  // {
  //   path: "/project-admin/project-handover/add-project-handover",
  //   name: "Add Project Handover",
  //   element: AddProjectHandover,
  // },

  // {
  //   path: "/project-admin/project-handover/view/:id",
  //   name: "Project Handover",
  //   element: ViewProjectHandoverDocument,
  // },
  // {
  //   path: "/project-admin/project-handover/update/:id",
  //   name: "Update Project Handover",
  //   element: UpdateProjectClosureForm,
  // },

  {
    path: "/project-admin/project-handover",
    name: "Project Handover",
    element: ProjectClosureForm,
  },
  {
    path: "/project-admin/project-handover/add-project-handover",
    name: "Add Project Handover",
    element: AddProjectClosureForm,
  },
  {
    path: "/project-admin/project-handover/update/:id",
    name: "Update Project Handover",
    element: UpdateProjectClosureForm,
  },
  {
    path: "/project-admin/project-handover/view/:id",
    name: "View Project Handover Document",
    element: ViewProjectClosureDocument,
  },

  {
    path: "/project-admin/site-management",
    name: "Site Management",
    element: SiteManagement,
  },
  {
    path: "/project-admin/site-management/block-management/:site_id",
    name: "Block Management",
    element: BlockManagement,
  },
  {
    path: "/project-admin/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: RobotOperating,
  },

  {
    path: "/project-admin/search-robot",
    name: "Search Robot",
    element: SearchRobot,
  },

  {
    path: "/project-admin/site-management/block-management/:site_id/:block/:robot_no/debug_logs",
    name: "Debug Log",
    element: DebugLog,
  },

  {
    path: "/project-admin/site-management/block-management/:site_id/:block/:robot_no/cleaning_logs",
    name: "Cleaning Log",
    element: CleaningLog,
  },

  {
    path: "/project-admin/clients-dashboard",
    name: "Clients",
    element: ClientsDasboard,
  },

  //preveantive maintanance
  {
    path: "/project-admin/preventive-maintanance-dashboard",
    name: "Project Admin Preventive maintanance Dashboard",
    element: PreventiveMaintanancrDashboard,
  },
  {
    path: "/project-admin/preventive-maintanance-dashboard/preventive-maintanance-notifications",
    name: "Project Admin Preventive maintanance Notifications",
    element: PreventiveMaintananceNotifications,
  },
  {
    path: "/project-admin/preventive-maintanance-dashboard/create-pm",
    name: "Create Preventive maintanance",
    element: CreatePreventivemaintanance,
  },
  {
    path: "/project-admin/preventive-maintanance-dashboard/update/:id",
    name: "Update Preventive maintanance",
    element: UpdatePreventivemaintanance,
  },
  {
    path: "/project-admin/preventive-maintanance-dashboard/view",
    name: "View Preventive maintanance",
    element: ViewPreventivemaintananceQuaterly,
  },

  {
    path: "/project-admin/clients-dashboard/clients-data/:id",
    name: "Client Assigned Sites",
    element: ClientAssignedSites,
  },

  {
    path: "/project-admin/robots/shift-block-wise",
    name: "Shift Block Wise Robot",
    element: ShiftBlockwiseRobots,
  },

  //preveantive maintanance

  {
    path: "/project-admin/service-tickets",
    name: "Service Tickets",
    element: ServiceTicketDashboard,
  },
  {
    path: "/project-admin/service-tickets/update-service-ticket/:id",
    name: "Update Service Ticket",
    element: UpdateServiceTicket,
  },
  {
    path: "/project-admin/service-tickets/resolve-service-ticket/:id",
    name: "Resolve Service Ticket",
    element: ResolveServiceTicket,
  },
  {
    path: "/project-admin/service-tickets/create-new-ticket",
    name: "Create new Tickets",
    element: CreateNewServiceTicket,
  },
  {
    path: "/project-admin/internal-tickets",
    name: "Internal Tickets",
    element: InternalTicketsDashboard,
  },
  {
    path: "/project-admin/internal-tickets/create-new-internal-ticket",
    name: "Create New Internal Tickets",
    element: CreateNewInternalTicket,
  },
  {
    path: "/project-admin/internal-tickets/update-internal-ticket/:id",
    name: "Update Internal Tickets",
    element: UpdateInternalTicket,
  },

  {
    path: "/project-admin/all-site-cleaning-log",
    name: "Project Admin All Site Cleaning Log",
    element: AllSiteCleaningLog,
  },

  {
    path: "/project-admin/all-site-cleaning-log/:site_id",
    name: "Project Admin Sitewise Cleaning Log",
    element: SitewaiseLog,
  },

  {
    path: "/project-admin/timers",
    name: "All Site Timers",
    element: Timers,
  },
  {
    path: "/project-admin/timers/:block/:site_id",
    name: "Update Block Timer",
    element: UpdateTimer,
  },
  {
    path: "/project-admin/all-site-dpr",
    name: "Project Admin All Site Dpr",
    element: AllSiteDpr,
  },

  {
    path: "/project-admin/all-site-dpr/add-dpr",
    name: "Add DPR",
    element: AddDpr,
  },
  {
    path: "/project-admin/update-dpr/:id",
    name: "Update DPR",
    element: UpdateDpr,
  },

  {
    path: "/project-admin/all-site-gateways",
    name: "All Site Gateways",
    element: Gateways,
  },
  {
    path: "/project-admin/all-site-gateways/update-gateway/:id",
    name: "Update Gateway",
    element: UpdateGateway,
  },

  {
    path: "/project-admin/users",
    name: "All Internal Users",
    element: UsersDashboard,
  },
  {
    path: "/project-admin/external-users",
    name: "All  External Users",
    element: ExternalUsersDashboard,
  },

  {
    path: "/project-admin/notifications",
    name: "Master Admin Notifications",
    element: Notifications,
  },

  {
    path: "/project-admin/inventories",
    name: "Inventories",
    element: Inventories,
  },

  {
    path: "/project-admin/inventories/update-inventory/:id",
    name: "Update Inventory",
    element: UpdateInventory,
  },
  {
    path: "/project-admin/inventories/add-inventory",
    name: "Add Inventory",
    element: AddInventory,
  },
  {
    path: "/project-admin/inventories/add-service-item",
    name: "Add Service Item",
    element: AddServiceItem,
  },
  {
    path: "/project-admin/inventories/update-service-item/:id",
    name: "Update Service Item",
    element: UpdateServiceItem,
  },
  {
    path: "/project-admin/technician-attendance",
    name: "Technician Attendance",
    element: TechnicianAttendanceDashboard,
  },
  //------------------------project admin---------------------------------

  //------------------------service admin---------------------------------

  {
    path: "/service-admin/all-site-data",
    name: "Taypro All Site Data",
    element: TayproDashboard,
  },

  {
    path: "/service-admin/dashboard",
    name: "Service Admin Dashboard",
    element: ServiceAdminDahboard,
  },

  // {
  //   path: "/project-admin/dashboard",
  //   name: "Project Admin Dashboard",
  //   element: ProjectAdminDashboard,
  // },

  // {
  //   path: "/service-admin/project-handover",
  //   name: "Project Handover",
  //   element: ProjectHandoverDashboard,
  // },

  // {
  //   path: "/service-admin/project-handover/view/:id",
  //   name: "Project Handover",
  //   element: ViewProjectHandoverDocument,
  // },

  {
    path: "/service-admin/project-handover",
    name: "Project Handover",
    element: ProjectClosureForm,
  },
  {
    path: "/service-admin/project-handover/add-project-handover",
    name: "Add Project Handover",
    element: AddProjectClosureForm,
  },
  {
    path: "/service-admin/project-handover/update/:id",
    name: "Update Project Handover",
    element: UpdateProjectClosureForm,
  },
  {
    path: "/service-admin/project-handover/view/:id",
    name: "View Project Handover Document",
    element: ViewProjectClosureDocument,
  },

  {
    path: "/service-admin/site-management",
    name: "Site Management",
    element: SiteManagement,
  },
  {
    path: "/service-admin/site-management/block-management/:site_id",
    name: "Block Management",
    element: BlockManagement,
  },
  {
    path: "/service-admin/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: RobotOperating,
  },

  {
    path: "/service-admin/search-robot",
    name: "Search Robot",
    element: SearchRobot,
  },

  {
    path: "/service-admin/site-management/block-management/:site_id/:block/:robot_no/debug_logs",
    name: "Debug Log",
    element: DebugLog,
  },

  {
    path: "/service-admin/site-management/block-management/:site_id/:block/:robot_no/cleaning_logs",
    name: "Cleaning Log",
    element: CleaningLog,
  },

  {
    path: "/service-admin/clients-dashboard",
    name: "Clients",
    element: ClientsDasboard,
  },

  //preveantive maintanance
  {
    path: "/service-admin/preventive-maintanance-dashboard",
    name: "Project Admin Preventive maintanance Dashboard",
    element: PreventiveMaintanancrDashboard,
  },
  {
    path: "/service-admin/preventive-maintanance-dashboard/preventive-maintanance-notifications",
    name: "Project Admin Preventive maintanance Notifications",
    element: PreventiveMaintananceNotifications,
  },
  {
    path: "/service-admin/preventive-maintanance-dashboard/create-pm",
    name: "Create Preventive maintanance",
    element: CreatePreventivemaintanance,
  },
  {
    path: "/service-admin/preventive-maintanance-dashboard/update/:id",
    name: "Update Preventive maintanance",
    element: UpdatePreventivemaintanance,
  },
  {
    path: "/service-admin/preventive-maintanance-dashboard/view",
    name: "View Preventive maintanance",
    element: ViewPreventivemaintananceQuaterly,
  },

  {
    path: "/service-admin/clients-data-dashboard/edit-client/:id",
    name: "Edit Client",
    element: EditClient,
  },
  {
    path: "/service-admin/clients-dashboard/clients-data/:id",
    name: "Client Assigned Sites",
    element: ClientAssignedSites,
  },

  {
    path: "/service-admin/robots/shift-block-wise",
    name: "Shift Block Wise Robot",
    element: ShiftBlockwiseRobots,
  },

  //preveantive maintanance

  {
    path: "/service-admin/service-tickets",
    name: "Service Tickets",
    element: ServiceTicketDashboard,
  },
  {
    path: "/service-admin/service-tickets/update-service-ticket/:id",
    name: "Update Service Ticket",
    element: UpdateServiceTicket,
  },
  {
    path: "/service-admin/service-tickets/resolve-service-ticket/:id",
    name: "Resolve Service Ticket",
    element: ResolveServiceTicket,
  },
  {
    path: "/service-admin/service-tickets/create-new-ticket",
    name: "Create new Tickets",
    element: CreateNewServiceTicket,
  },
  {
    path: "/service-admin/internal-tickets",
    name: "Internal Tickets",
    element: InternalTicketsDashboard,
  },
  {
    path: "/service-admin/internal-tickets/create-new-internal-ticket",
    name: "Create New Internal Tickets",
    element: CreateNewInternalTicket,
  },
  {
    path: "/service-admin/internal-tickets/update-internal-ticket/:id",
    name: "Update Internal Tickets",
    element: UpdateInternalTicket,
  },

  {
    path: "/service-admin/all-site-cleaning-log",
    name: "Project Admin All Site Cleaning Log",
    element: AllSiteCleaningLog,
  },

  {
    path: "/service-admin/all-site-cleaning-log/:site_id",
    name: "Project Admin Sitewise Cleaning Log",
    element: SitewaiseLog,
  },

  {
    path: "/service-admin/timers",
    name: "All Site Timers",
    element: Timers,
  },
  {
    path: "/service-admin/timers/:block/:site_id",
    name: "Update Block Timer",
    element: UpdateTimer,
  },
  {
    path: "/service-admin/all-site-dpr",
    name: "Project Admin All Site Dpr",
    element: AllSiteDpr,
  },

  {
    path: "/service-admin/all-site-dpr/add-dpr",
    name: "Add DPR",
    element: AddDpr,
  },
  {
    path: "/service-admin/update-dpr/:id",
    name: "Update DPR",
    element: UpdateDpr,
  },

  {
    path: "/service-admin/all-site-gateways",
    name: "All Site Gateways",
    element: Gateways,
  },
  {
    path: "/service-admin/all-site-gateways/update-gateway/:id",
    name: "Update Gateway",
    element: UpdateGateway,
  },

  {
    path: "/service-admin/users",
    name: "All Internal Users",
    element: UsersDashboard,
  },
  {
    path: "/service-admin/external-users",
    name: "All  External Users",
    element: ExternalUsersDashboard,
  },

  {
    path: "/service-admin/notifications",
    name: "Master Admin Notifications",
    element: Notifications,
  },

  {
    path: "/service-admin/inventories",
    name: "Inventories",
    element: Inventories,
  },

  {
    path: "/service-admin/inventories/update-inventory/:id",
    name: "Update Inventory",
    element: UpdateInventory,
  },
  {
    path: "/service-admin/inventories/add-inventory",
    name: "Add Inventory",
    element: AddInventory,
  },
  {
    path: "/service-admin/inventories/add-service-item",
    name: "Add Service Item",
    element: AddServiceItem,
  },
  {
    path: "/service-admin/inventories/update-service-item/:id",
    name: "Update Service Item",
    element: UpdateServiceItem,
  },
  {
    path: "/service-admin/technician-attendance",
    name: "Technician Attendance",
    element: TechnicianAttendanceDashboard,
  },
  //------------------------service admin---------------------------------

  //------------------------service Site Technician---------------------------------
  {
    path: "/site-technician/dashboard",
    name: "Dashboard",
    element: SiteTechnicianDashboard,
  },
  {
    path: "/site-technician/all-site-data",
    name: "Dashboard",
    element: AllSiteData,
  },
  {
    path: "/site-technician/site-management",
    name: "Dashboard",
    element: SiteTechnicianSiteManagement,
  },
  {
    path: "/site-technician/site-management/block-management/:site_id",
    name: "Block Management",
    element: SiteTechnicianBlockManagement,
  },
  {
    path: "/site-technician/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Operating",
    element: SiteTechnicianRobotOperating,
  },
  {
    path: "/site-technician/search-robot",
    name: "Search Robot",
    element: SiteTechnicianSearchRobot,
  },
  {
    path: "/site-technician/timers",
    name: "Timers",
    element: SiteTechnicianTimers,
  },
  {
    path: "/site-technician/timers/:block/:site_id",
    name: "Update Block Timer",

    element: SiteTechnicianUpdateTimer,
  },
  {
    path: "/site-technician/cleaning-log-sites",
    name: "Your Assigned Sites",
    element: SiteTechnicianSites,
  },
  {
    path: "/site-technician/cleaning-log-sites/:site_id",
    name: "Cleaning Log",
    element: SiteTechnicianCleaningLog,
  },
  {
    path: "/site-technician/service-tickets",
    name: "Service Tickets",
    element: SiteTechnicianServiceTicketDashboard,
  },
  {
    path: "/site-technician/service-tickets/create-new-ticket",
    name: "New Service Tickets",
    element: SiteTechnicianCreateServiceTicket,
  },
  {
    path: "/site-technician/service-tickets/resolve-service-ticket/:id",
    name: "Resolve Service Ticket",
    element: SiteTechnicianResolveServiceTicket,
  },
  {
    path: "/site-technician/dpr",
    name: "All DPR",
    element: SiteTechnicianDprDashboard,
  },
  {
    path: "/site-technician/dpr/add-dpr",
    name: "New DPR",
    element: SiteTechnicianAddDpr,
  },
  {
    path: "/site-technician/inventory",
    name: "Site Inventory",
    element: InventoryTab,
  },
  //------------------------service Site Technician---------------------------------

  // ------------------------client admin---------------------------------
  {
    path: "/client-admin/dashboard",
    name: "Client Admin Dashboard",
    element: ClientAdminDashboard,
  },
  {
    path: "/client-admin/site-management/all-site-data",
    name: "Your Sites Data",
    element: ClientDashboard,
  },
  {
    path: "/client-admin/site-management",
    name: "Site Management",
    element: ClientSiteManagement,
  },
  {
    path: "/client-admin/site-management/block-management/:site_id",
    name: "Block Management",
    element: ClientBlockManagement,
  },
  {
    path: "/client-admin/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: ClientRobotOperating,
  },
  {
    path: "/client-admin/search-robot",
    name: "Search Robot",
    element: ClientSearchRobot,
  },

  {
    path: "/client-admin/timers",
    name: "Timers",
    element: ClientTimers,
  },
  {
    path: "/client-admin/timers/:block/:site_id",
    name: "Update Block Timer",
    element: ClientUpdateTimer,
  },

  {
    path: "/client-admin/external-users",
    name: "All  External Users",
    element: ClientUsersManagement,
  },

  {
    path: "/client-admin/cleaning-log-sites",
    name: "Your Assigned Sites",
    element: Sites,
  },
  {
    path: "/client-admin/cleaning-log-sites/:site_id",
    name: "Cleaning Log",
    element: ClientCleaningLog,
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
    element: ClientSiteTechnicianDashboard,
  },
  {
    path: "/client-site-technician/site-management/all-site-data",
    name: "Your Sites Data",
    element: ClientDashboard,
  },
  {
    path: "/client-site-technician/site-management",
    name: "Site Management",
    element: ClientSiteManagement,
  },
  {
    path: "/client-site-technician/site-management/block-management/:site_id",
    name: "Block Management",
    element: ClientBlockManagement,
  },
  {
    path: "/client-site-technician/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: ClientRobotOperating,
  },
  {
    path: "/client-site-technician/search-robot",
    name: "Search Robot",
    element: ClientSearchRobot,
  },

  {
    path: "/client-site-technician/timers",
    name: "Timers",
    element: ClientTimers,
  },
  {
    path: "/client-site-technician/timers/:block/:site_id",
    name: "Update Block Timer",
    element: ClientUpdateTimer,
  },

  {
    path: "/client-site-technician/external-users",
    name: "All  External Users",
    element: ClientUsersManagement,
  },

  {
    path: "/client-site-technician/cleaning-log-sites",
    name: "Your Assigned Sites",
    element: Sites,
  },
  {
    path: "/client-site-technician/cleaning-log-sites/:site_id",
    name: "Cleaning Log",
    element: ClientCleaningLog,
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
  { path: "/notifications/alerts", name: "Alerts", element: Alerts },
  { path: "/notifications/badges", name: "Badges", element: Badges },
  { path: "/notifications/modals", name: "Modals", element: Modals },
  { path: "/notifications/toasts", name: "Toasts", element: Toasts },
  { path: "/widgets", name: "Widgets", element: Widgets },
];

export default routes;
