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
// import ClientTimers from "./views/client-admin/timers/ClientTimers";
// import ClientUpdateTimer from "./views/client-admin/timers/ClientUpdateTimer";
import ClientUsersManagement from "./views/client-admin/Users/ClientUsersManagement";
import Sites from "./views/client-admin/cleaninglog/Sites";
import ClientCleaningLog from "./views/client-admin/cleaninglog/ClientCleaningLog";
import ShiftBlockwiseRobots from "./views/master-admin/robots/ShiftBlockwiseRobots";
import SiteTechnicianDashboard from "./views/site-technician/SiteTechnicianDashboard";
import AllSiteData from "./views/site-technician/AllSiteData";
import SiteTechnicianSiteManagement from "./views/site-technician/site-management/SiteTechnicianSiteManagement";
import SiteTechnicianBlockManagement from "./views/site-technician/site-management/SiteTechnicianBlockManagement";
import SiteTechnicianRobotOperating from "./views/site-technician/site-management/SiteTechnicianRobotOperating";
// import SiteTechnicianTimers from "./views/site-technician/timers/SiteTechnicianTimers";
// import SiteTechnicianUpdateTimer from "./views/site-technician/timers/SiteTechnicianUpdateTimer";
import SiteTechnicianSites from "./views/site-technician/cleaninglog/SiteTechnicianSites";
import SiteTechnicianCleaningLog from "./views/site-technician/cleaninglog/SiteTechnicianCleaningLog";
import SiteTechnicianServiceTicketDashboard from "./views/site-technician/service-tickets/SiteTechnicianServiceTicketDashboard";
import SiteTechnicianCreateServiceTicket from "./views/site-technician/service-tickets/SiteTechnicianCreateServiceTicket";
import SiteTechnicianDprDashboard from "./views/site-technician/dpr/SiteTechnicianDprDashboard";
import SiteTechnicianAddDpr from "./views/site-technician/dpr/SiteTechnicianAddDpr";
import InventoryTab from "./views/site-technician/inventories/SiteTechnicianInventories";
import TechnicianAttendanceDashboard from "./views/master-admin/technician-attendance/TechnicianAttendanceDashboard";
import TechnicianLocationDashboard from "./views/master-admin/technician-location/TechnicianLocationDashboard";
import RobotActivity from "./views/master-admin/site-management/RobotActivity";
import TechnicianWfhApprovals from "./views/service-admin/TechnicianWfhApprovals";

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
  SalesAdminRoute,
  ProductionAndOperationsAdminRoute,
  AccountAdminRoute,
  QualityAdminRoute,
  SupplyChainAndLogisticsAdminRoute,
  ResearchAndDevelopmentAndProductDevelopmentAdminRoute,
  HRAndAdminRoute,
  FactoryAdminRoute,
  DesignAdminRoute,
} from "./UserRoutes";
import UserSiteAttendance from "./views/site-technician/user-site-attendance/UserSiteAttendance";
import Statistics from "./views/client-admin/statistics/Statistics";
import ChatDashboard from "./views/master-admin/chat/ChatDashboard";
import VoiceCallsPage from "./views/master-admin/voice-calls/VoiceCallsPage";
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
import FaultyReturnDashboard from "./views/master-admin/faulty-inventory/FaultyReturnDashboard";
import CreateFaultyReturn from "./views/master-admin/faulty-inventory/CreateFaultyReturn";
import ViewFaultyReturn from "./views/master-admin/faulty-inventory/ViewFaultyReturn";
import MaterialConsumption from "./views/master-admin/faulty-inventory/MaterialConsumption";
import InventoryHub from "./views/master-admin/inventories/InventoryHub";
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
import ViewTechnicianDetails from "./views/opex-client-admin/ViewTechnicianDetails";
import AddDayInCycle from "./views/master-admin/Opex/AddDayInCycle";
import OpexCertificate from "./views/master-admin/Opex/OpexCertificate";
import OpexSiteTechnicianCertificate from "./views/opex-site-technician/OpexSiteTechnicianCertificate";
import EspFirmwareDataUpload from "./views/master-admin/esp-firmware/EspFirmwareDataUpload";
import MqttDashboard from "./views/master-admin/mqtt/MqttDashboard";
import RobotEventAndFrames from "./views/master-admin/mqtt/RobotEventAndFrames";
import RobotTracker from "./views/robot-position/RobotTracker";

import SiteAnalysisDashboard from "./views/master-admin/site-analysis/SiteAnalysisDashboard";
import AllClientsDashboard from "./views/master-admin/site-analysis/AllClientsDashboard";
import ClientSitesDashboard from "./views/master-admin/site-analysis/ClientSitesDashboard";
import RssiSnrGraph from "./views/master-admin/site-analysis/RssiSnrGraph";
import RobotDataGraphs from "./views/master-admin/site-analysis/RobotDataGraphs";
import RobotTrackingBatteryGraph from "./views/master-admin/site-analysis/RobotTrackingBatteryGraph";
import RobotTrackingLog from "./views/master-admin/site-analysis/RobotTrackingLog";
import RobotTrackingCurrentGraph from "./views/master-admin/site-analysis/RobotTrackingCurrentGraph";
import RobotTrackingCurrentTable from "./views/master-admin/site-analysis/RobotTrackingCurrentTable";
import RobotTrackingBatteryTable from "./views/master-admin/site-analysis/RobotTrackingBatteryTable";
import RssiSnrTable from "./views/master-admin/site-analysis/RssiSnrTable";
import SprintDashboard from "./views/sprints/SprintDashboard";
import ViewSprint from "./views/sprints/ViewSprint";
import CreateSprint from "./views/sprints/CreateSprint";
import GenerateReport from "./views/sprints/GenerateReport";
import MdsDashboard from "./views/mds-tracking/MdsDashboard";
import SitewiseTimer from "./views/master-admin/site-analysis/SitewiseTimer";
import SiteTimerUpdate from "./views/master-admin/site-analysis/SiteTimerUpdate";
import MisDashboard from "./views/mis-report/MisDashboard";
import SalesAdminDashboard from "./views/sales-admin/SalesAdminDashboard";
import ProductionAndOperationsDashboard from "./views/production-and-operations-admin/ProductionAndOperationsDashboard";
import AccountAdminDashboard from "./views/account-admin/AccountAdminDashboard";
import QualityAdminDashboard from "./views/quality-admin/QualityAdminDashboard";
import SupplyChainAndLogisticsDashboard from "./views/supply-chain-and-logistics-admin/SupplyChainAndLogisticsDashboard";
import ResearchAndDevelopmentAndProductDevelopmentAdminDashboard from "./views/research-and-development-and-product-development-admin/ResearchAndDevelopmentAndProductDevelopmentAdminDashboard";
import HrAdminDashboard from "./views/hr-admin/HrAdminDashboard";
import HRUserDashboard from "./views/hr-admin/HRUserDashboard";
import AttendanceDashboard from "./views/hr-admin/AttendanceDashboard";
import MonthlyAttendanceReport from "./views/hr-admin/MonthlyAttendanceReport";
import Summary from "./views/mis-report/Summary";
import Mds from "./views/master-admin/mds/Mds";
import AddMdsUsingLoraNo from "./views/master-admin/mds/AddMdsUsingLoraNo";
// import ShiftBlockwiseMds from "./views/master-admin/mds/ShiftBlockwiseMds";
import ActivateMds from "./views/master-admin/mds/ActivateMds";
import ViewMds from "./views/master-admin/mds/ViewMds";
import UpdateMds from "./views/master-admin/mds/UpdateMds";
import ActiveMds from "./views/master-admin/replace-mds-lora/ActiveMds";
import InActiveMds from "./views/master-admin/replace-mds-lora/InActiveMds";
import ReplaceMdsLora from "./views/master-admin/replace-mds-lora/ReplaceMdsLora";
import MdsOperating from "./views/master-admin/mds/MdsOperating";
import MdsEventAndFrames from "./views/master-admin/mds/MdsEventAndFrames";
import UpdateRobotRowData from "./views/master-admin/robots/UpdateRobotRowData";
import TimerCommandSentLog from "./views/master-admin/timers/TimerCommandSentLog";
import FactoryAdmin from "./views/factory-admin/FactoryAdmin";
import UpdateRobotTracking from "./views/robot-position/UpdateRobotTracking";
import ApiLoggerDashboard from "./views/master-admin/api-logger/ApiLoggerDashboard";
import DBDashboard from "./views/master-admin/db-status/DBDashboard";
import MdsOperatingClient from "./views/client-admin/mds-tracking/MdsOperatingClient";
import CustomNofifications from "./views/master-admin/custom-notifications/CustomNofifications";
import SystemDashboard from "./views/master-admin/syatem-info/SystemDashboard";
import Mdstimer from "./views/master-admin/mds-timer/Mdstimer";
import UpdateMdsTimer from "./views/master-admin/mds-timer/UpdateMdsTimer";
import CleaningSummary from "./views/master-admin/all-site-cleaninglog/cleaning-report/CleaningSummary";
import MqttEvents from "./views/master-admin/mqtt/MqttEvents";
import MdsLog from "./views/mds-tracking/MdsLog";
// import Service from "./views/mis-report/Service";
import ScadaDashboard from "./views/scada/ScadaDashboard";
import OpenAiChat from "./views/openai/OpenAiChat";
import SubScriptionPlan from "./views/master-admin/client-subscription/SubScriptionPlan";
import ViewDoc from "./views/commisioning/ViewDoc";
import CommisioningDashboard from "./views/commisioning/CommisioningDashboard";
import FlushQueue from "./views/master-admin/robot-commands/FlushQueue";
import SiteAnalytics from "./views/client-admin/statistics/SiteAnalytics";
import ViewMaterialRequest from "./views/material-request/ViewMaterialRequest";
import CreateMaterialRequest from "./views/material-request/CreateMaterialRequest";
import MaterialRequestDashboard from "./views/material-request/MaterialRequestDashboard";
import UpdateMaterialRequest from "./views/material-request/UpdateMaterialRequest";
import GenerateNewCertificate from "./views/commisioning/GenerateNewCertificate";
import NonCommisionedRobots from "./views/commisioning/NonCommisionedRobots";
import ViewRobotCommisioningDoc from "./views/commisioning/ViewRobotCommisioningDoc";
import UpdateRobotCommisioningDoc from "./views/commisioning/UpdateRobotCommisioningDoc";
import SemiAutomaticRobot from "./views/master-admin/semi-robots/SemiAutomaticRobot";
import AddSemiAutomaticRobot from "./views/master-admin/semi-robots/AddSemiAutomaticRobot";
import RobotLocation from "./views/master-admin/robot-location/RobotLocation";
import AddRobotLocation from "./views/master-admin/robot-location/AddRobotLocation";
import DesignDashboard from "./views/design-admin/DesignDashboard";
import PocDashboard from "./views/design-admin/poc/PocDashboard";
import NomenClatureDashboard from "./views/nomenclature/NomenClatureDashboard";
import CreateNomenClature from "./views/nomenclature/CreateNomenClature";
import UpdatenomenClature from "./views/nomenclature/UpdatenomenClature";
import ViewNomenClature from "./views/nomenclature/ViewNomenClature";
import MMSDashboard from "./views/mms/MMSDashboard";
import ViewMms from "./views/mms/ViewMms";
import CreateMmsStructure from "./views/mms/CreateMmms";
import UpdateMms from "./views/mms/UpdateMms";
import MasterAdminDashboardtow from "./views/master-admin/MasterAdminDashboardtow";
import GatewaySurveyDashboard from "./views/master-admin/gateway-survey/GatewaySurveyDashboard";
import CreateRobotReading from "./views/master-admin/gateway-survey/createRobotReading";
import ViewGatewaySurvey from "./views/master-admin/gateway-survey/ViewGatewaySurvey";
import RobotStatus from "./views/robots-dashboards/RobotStatus";
import Dummy from "./views/pr/Dummy";

const App = React.lazy(() => import("./views/pages/app/App"));
// const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));

//-----------------------master admin----------------------------------

const MasterAdminDashboard = React.lazy(
  () => import("./views/master-admin/MasterAdminDashboard"),
);
const LoraConfiguration = React.lazy(
  () => import("./views/master-admin/replace-lora/LoraConfiguration"),
);

const ReplaceLora = React.lazy(
  () => import("./views/master-admin/replace-lora/ReplaceLora"),
);

const ActiveRobots = React.lazy(
  () => import("./views/master-admin/replace-lora/ActiveRobots"),
);
const InActiveRobots = React.lazy(
  () => import("./views/master-admin/replace-lora/InActiveRobots"),
);

const AddRobotUsingLoraNo = React.lazy(
  () => import("./views/master-admin/add-robot/AddRobotUsingLoraNo"),
);

const ClientsDasboard = React.lazy(
  () => import("./views/master-admin/clients-and-sites/Clients"),
);

const ClientAssignedSites = React.lazy(
  () => import("./views/master-admin/clients-and-sites/ClientAssignedSites"),
);

const EditClient = React.lazy(
  () => import("./views/master-admin/clients-and-sites/EditClient"),
);

const ServiceTicketDashboard = React.lazy(
  () => import("./views/master-admin/service-tickets/ServiceTicketDashboard"),
);

const UpdateServiceTicket = React.lazy(
  () => import("./views/master-admin/service-tickets/UpdateServiceTicket"),
);

const CreateNewServiceTicket = React.lazy(
  () => import("./views/master-admin/service-tickets/CreateServiceTicket"),
);

const ViewServiceTicket = React.lazy(
  () => import("./views/master-admin/service-tickets/ViewServiceTicket"),
);

const InternalTicketsDashboard = React.lazy(
  () =>
    import("./views/master-admin/internal-tickets/InternalTicketsDashboard"),
);

const CreateNewInternalTicket = React.lazy(
  () => import("./views/master-admin/internal-tickets/CreateNewInternalTicket"),
);

const UsersDashboard = React.lazy(
  () => import("./views/master-admin/users/UsersDashboard"),
);

const Notifications = React.lazy(
  () => import("./views/master-admin/notifications/Notifications"),
);

const AllSiteCleaningLog = React.lazy(
  () => import("./views/master-admin/all-site-cleaninglog/AllSiteCleaningLog"),
);

const SitewaiseLog = React.lazy(
  () => import("./views/master-admin/all-site-cleaninglog/SitewaiseLog"),
);

const Gateways = React.lazy(
  () => import("./views/master-admin/gateways/Gateways"),
);

const UpdateGateway = React.lazy(
  () => import("./views/master-admin/gateways/UpdateGateway"),
);

const CreateNewGateways = React.lazy(
  () => import("./views/master-admin/gateways/CreateNewGateways"),
);

const AssignGateway = React.lazy(
  () => import("./views/master-admin/gateways/AssignGateway"),
);

const AllSiteDpr = React.lazy(
  () => import("./views/master-admin/all-site-dpr/AllSiteDpr"),
);

// activate mutiple robots
const ActivateRobots = React.lazy(
  () => import("./views/master-admin/robots/ActivateRobots"),
);

const SiteCoordinates = React.lazy(
  () => import("./views/master-admin/sites-coordinates/SitesCoordinates"),
);

const UpdateSiteCoordinates = React.lazy(
  () => import("./views/master-admin/sites-coordinates/UpdateSitesCoordinates"),
);

const AddSiteCoordinates = React.lazy(
  () => import("./views/master-admin/sites-coordinates/AddSitesCoordinates"),
);

const ServiceTicketsFaultDashboard = React.lazy(
  () =>
    import("./views/master-admin/serviceticket-fault/ServiceTicketsFaultDashboard"),
);

//----------------------------------master admin------------------------------------

//----------------------------------client admin------------------------------------

const ClientAdminDashboard = React.lazy(
  () => import("./views/client-admin/ClientAdminDashboard"),
);

const MasterUserDashboard = React.lazy(
  () => import("./views/master-user/MasterUserDashboard"),
);

const ServiceUserDashboard = React.lazy(
  () => import("./views/service-user/ServiceUserDashboard"),
);

const ProjectUserDashboard = React.lazy(
  () => import("./views/project-user/ProjectUserDashboard"),
);

//----------------------------------client admin------------------------------------

//-------------------------------------project admin---------------------------
const ProjectAdminDashboard = React.lazy(
  () => import("./views/project-admin/ProjectAdminDashboard"),
);

//--------------------------------------project admin---------------------------------

//-------------------------------------service admin---------------------------
const ServiceAdminDahboard = React.lazy(
  () => import("./views/service-admin/ServiceAdminDashboard"),
);
//--------------------------------------service admin---------------------------------

const Robots = React.lazy(() => import("./views/master-admin/robots/Robots"));

const UpdateRobots = React.lazy(
  () => import("./views/master-admin/robots/UpdateRobot"),
);

const AddServiceItem = React.lazy(
  () => import("./views/master-admin/inventories/AddServiceItem"),
);

const UpdateServiceItem = React.lazy(
  () => import("./views/master-admin/inventories/UpdateServiceItem"),
);

const Inventories = React.lazy(
  () => import("./views/master-admin/inventories/Inventories"),
);

const UpdateInventory = React.lazy(
  () => import("./views/master-admin/inventories/UpdateInventory"),
);

const AddInventory = React.lazy(
  () => import("./views/master-admin/inventories/AddInventory"),
);

const AddDpr = React.lazy(
  () => import("./views/master-admin/all-site-dpr/AddDpr"),
);
const Timers = React.lazy(() => import("./views/master-admin/timers/Timers"));

const UpdateTimer = React.lazy(
  () => import("./views/master-admin/timers/UpdateTimer"),
);

const ProjectClosureForm = React.lazy(
  () => import("./views/master-admin/project-closure/ProjectClosureDashboard"),
);

const AddProjectClosureForm = React.lazy(
  () => import("./views/master-admin/project-closure/AddProjectClosureForm"),
);

const UpdateProjectClosureForm = React.lazy(
  () => import("./views/master-admin/project-closure/UpdateProjectClosureForm"),
);
const ViewProjectClosureDocument = React.lazy(
  () =>
    import("./views/master-admin/project-closure/ViewProjectClosureDocument"),
);

//common pages

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));

// const Colors = React.lazy(() => import("./views/theme/colors/Colors"));
// const Typography = React.lazy(() =>
//   import("./views/theme/typography/Typography")
// );

// // Base
// const Accordion = React.lazy(() => import("./views/base/accordion/Accordion"));
// const Breadcrumbs = React.lazy(() =>
//   import("./views/base/breadcrumbs/Breadcrumbs")
// );
// const Cards = React.lazy(() => import("./views/base/cards/Cards"));
// const Carousels = React.lazy(() => import("./views/base/carousels/Carousels"));
// const Collapses = React.lazy(() => import("./views/base/collapses/Collapses"));
// const ListGroups = React.lazy(() =>
//   import("./views/base/list-groups/ListGroups")
// );
// const Navs = React.lazy(() => import("./views/base/navs/Navs"));
// const Paginations = React.lazy(() =>
//   import("./views/base/paginations/Paginations")
// );
// const Placeholders = React.lazy(() =>
//   import("./views/base/placeholders/Placeholders")
// );
// const Popovers = React.lazy(() => import("./views/base/popovers/Popovers"));
// const Progress = React.lazy(() => import("./views/base/progress/Progress"));
// const Spinners = React.lazy(() => import("./views/base/spinners/Spinners"));
// const Tabs = React.lazy(() => import("./views/base/tabs/Tabs"));
// const Tables = React.lazy(() => import("./views/base/tables/Tables"));
// const Tooltips = React.lazy(() => import("./views/base/tooltips/Tooltips"));

// // Buttons
// const Buttons = React.lazy(() => import("./views/buttons/buttons/Buttons"));
// const ButtonGroups = React.lazy(() =>
//   import("./views/buttons/button-groups/ButtonGroups")
// );
// const Dropdowns = React.lazy(() =>
//   import("./views/buttons/dropdowns/Dropdowns")
// );

// //Forms
// const ChecksRadios = React.lazy(() =>
//   import("./views/forms/checks-radios/ChecksRadios")
// );
// const FloatingLabels = React.lazy(() =>
//   import("./views/forms/floating-labels/FloatingLabels")
// );
// const FormControl = React.lazy(() =>
//   import("./views/forms/form-control/FormControl")
// );
// const InputGroup = React.lazy(() =>
//   import("./views/forms/input-group/InputGroup")
// );
// const Layout = React.lazy(() => import("./views/forms/layout/Layout"));
// const Range = React.lazy(() => import("./views/forms/range/Range"));
// const Select = React.lazy(() => import("./views/forms/select/Select"));
// const Validation = React.lazy(() =>
//   import("./views/forms/validation/Validation")
// );

// const Charts = React.lazy(() => import("./views/charts/Charts"));

// // Icons
// const CoreUIIcons = React.lazy(() =>
//   import("./views/icons/coreui-icons/CoreUIIcons")
// );
// const Flags = React.lazy(() => import("./views/icons/flags/Flags"));
// const Brands = React.lazy(() => import("./views/icons/brands/Brands"));

// // Notifications
// const Alerts = React.lazy(() => import("./views/notifications/alerts/Alerts"));
// const Badges = React.lazy(() => import("./views/notifications/badges/Badges"));
// const Modals = React.lazy(() => import("./views/notifications/modals/Modals"));
// const Toasts = React.lazy(() => import("./views/notifications/toasts/Toasts"));

// const Widgets = React.lazy(() => import("./views/widgets/Widgets"));

const routes = [
  {
    path: "/",
    exact: true,
    name: "User Links",
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

  // -----------------------realtime pages-------------------

  {
    path: "/master-admin/robots-dashboard",
    name: "Master Admin Robots",
    element: (
      <MasterAdminRoute>
        <RobotStatus />
      </MasterAdminRoute>
    ),
  },
  // -----------------------realtime pages-------------------

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
    path: "/master-admin/dashboard-2",
    name: "Master Dashboard Two",
    element: (
      <MasterAdminRoute>
        <MasterAdminDashboardtow />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/robots-position",
    name: "Robots Position",
    element: (
      <MasterAdminRoute>
        <RobotPosition />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/robots-tracker",
    name: "Robots Tracker",
    element: (
      <MasterAdminRoute>
        <RobotTracker />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/pr",
    name: "pr",
    element: (
      <MasterAdminRoute>
        <Dummy />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/robots-tracker/update/:id",
    name: "Update Robots Tracker",
    element: (
      <MasterAdminRoute>
        <UpdateRobotTracking />
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
    path: "/master-admin/flush-queues",
    name: "Flush Queue",
    element: (
      <MasterAdminRoute>
        <FlushQueue />
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
    path: "/master-admin/inventory-hub",
    name: "Inventory Hub",
    element: (
      <MasterAdminRoute>
        <InventoryHub />
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
    path: "/master-admin/timers/:id",
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
    path: "/master-admin/service-tickets/view-service-ticket/:id",
    name: "View Service Ticket",
    element: (
      <MasterAdminRoute>
        <ViewServiceTicket />
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
    path: "/master-admin/all-site-cleaning-log/cleaning-report/:site_id",
    name: "Master Admin Cleaning Report",
    element: (
      <MasterAdminRoute>
        <CleaningSummary />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-site-cleaning-log/sitewise-cleaning-log/:site_id/:date",
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
    path: "/master-admin/technician-location",
    name: "Technician Location",
    element: (
      <MasterAdminRoute>
        <TechnicianLocationDashboard />
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
    path: "/master-admin/voice-calls",
    name: "Voice Calls",
    element: (
      <MasterAdminRoute>
        <VoiceCallsPage />
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
    path: "/master-admin/material-consumption",
    name: "Material Consumption",
    element: (
      <MasterAdminRoute>
        <MaterialConsumption />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/faulty-return-rework",
    name: "Faulty Return Rework",
    element: (
      <MasterAdminRoute>
        <FaultyReturnDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/faulty-return-rework/create",
    name: "Create Faulty Return",
    element: (
      <MasterAdminRoute>
        <CreateFaultyReturn />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/faulty-return-rework/view/:id",
    name: "View Faulty Return",
    element: (
      <MasterAdminRoute>
        <ViewFaultyReturn />
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
    path: "/master-admin/client-subscriptions/view-plans",
    name: "Subscriptions Plans",
    element: (
      <MasterAdminRoute>
        <SubScriptionPlan />
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
    name: "Features & Pricing",
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
    path: "/master-admin/opexdata/:site_id/:moduleId/cycle/:cycleId/day/:dayId/technician-details",
    name: "Opex Cycle-Day Technician Details",
    element: (
      <MasterAdminRoute>
        <ViewTechnicianDetails />
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
  {
    path: "/master-admin/opexdata/:site_id/opex-certificate/:id",
    name: "Opex Certificate ",
    element: (
      <MasterAdminRoute>
        <OpexCertificate />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/esp-firmware",
    name: "ESP Firmware ",
    element: (
      <MasterAdminRoute>
        <EspFirmwareDataUpload />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/mqtt-dashboard",
    name: "MQTT Dashboard",
    element: (
      <MasterAdminRoute>
        <MqttDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/mqtt-events-per-robot",
    name: "MQTT Events",
    element: (
      <MasterAdminRoute>
        <MqttEvents />
      </MasterAdminRoute>
    ),
  },
  {
    // path: "/master-admin/event-and-frames/:deveui",
    path: "/master-admin/site-management/block-management/:site_id/:block/:robot_no/event-and-frames/:deveui",
    name: "Robot Event and Frames",
    element: (
      <MasterAdminRoute>
        <RobotEventAndFrames />
      </MasterAdminRoute>
    ),
  },
  // Site Analysis Routes
  {
    path: "/master-admin/site-analysis-dashboard",
    name: "Site Analysis Dashboard",
    element: (
      <MasterAdminRoute>
        <SiteAnalysisDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-clients-dashboard",
    name: "All Clients Dashboard",
    element: (
      <MasterAdminRoute>
        <AllClientsDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-clients-dashboard/:clientId",
    name: "Client Sites Dashboard",
    element: (
      <MasterAdminRoute>
        <ClientSitesDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-clients-dashboard/:clientId/RobotDataGraphs/:site_id",
    name: "Robot Data Graphs",
    element: (
      <MasterAdminRoute>
        <RobotDataGraphs />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-clients-dashboard/:clientId/RobotDataGraphs/:site_id/rssi-snr",
    name: "Rssi & Snr Graph",
    element: (
      <MasterAdminRoute>
        <RssiSnrGraph />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-clients-dashboard/:clientId/RobotDataGraphs/:site_id/battery",
    name: "Battery Graph",
    element: (
      <MasterAdminRoute>
        <RobotTrackingBatteryGraph />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-clients-dashboard/:clientId/RobotDataGraphs/:site_id/current",
    name: "Current Graph",
    element: (
      <MasterAdminRoute>
        <RobotTrackingCurrentGraph />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-clients-dashboard/:clientId/RobotDataTable/:site_id/rssi-snr",
    name: "Rssi & Snr Table",
    element: (
      <MasterAdminRoute>
        <RssiSnrTable />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-clients-dashboard/:clientId/RobotDataTable/:site_id/battery",
    name: "Battery Table",
    element: (
      <MasterAdminRoute>
        <RobotTrackingBatteryTable />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-clients-dashboard/:clientId/RobotDataTable/:site_id/current",
    name: "Current Table",
    element: (
      <MasterAdminRoute>
        <RobotTrackingCurrentTable />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/all-clients-dashboard/:clientId/RobotTrackingLog/:site_id/",
    name: "Robot Tracking Log",
    element: (
      <MasterAdminRoute>
        <RobotTrackingLog />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-clients-dashboard/:clientId/sitewise-timer/:site_id/",
    name: "Sitewise Timer",
    element: (
      <MasterAdminRoute>
        <SitewiseTimer />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/all-clients-dashboard/sitewise-timer/:block/:site_id",
    name: "Sitewise Timer Update",
    element: (
      <MasterAdminRoute>
        <SiteTimerUpdate />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/sprints-dashboard",
    name: "Sprints",
    element: (
      <MasterAdminRoute>
        <SprintDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/sprints-dashboard/:id",
    name: "View Sprint",
    element: (
      <MasterAdminRoute>
        <ViewSprint />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/sprints-dashboard/create-sprint",
    name: "Create Sprint",
    element: (
      <MasterAdminRoute>
        <CreateSprint />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/sprints-dashboard/generate-report",
    name: "Generate Sprint Report",
    element: (
      <MasterAdminRoute>
        <GenerateReport />
      </MasterAdminRoute>
    ),
  },

  //MDS Devices
  {
    path: "/master-admin/mds-devices",
    name: "MDS Devices",
    element: (
      <MasterAdminRoute>
        <Mds />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/add-mds-device/add-mds-using-lorano",
    name: "Add MDS Device",
    element: (
      <MasterAdminRoute>
        <AddMdsUsingLoraNo />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/mds-devices/activate-mds-devices",
    name: "All Inactivate MDS",
    element: (
      <MasterAdminRoute>
        <ActivateMds />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/mds-devices/view/:id",
    name: "View MDS Device",
    element: (
      <MasterAdminRoute>
        <ViewMds />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/mds-devices/update/:id",
    name: "Update MDS Device",
    element: (
      <MasterAdminRoute>
        <UpdateMds />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/replace-mds-lora/active-mdss",
    name: "Active MDS Devices",
    element: (
      <MasterAdminRoute>
        <ActiveMds />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/replace-mds-lora/in-active-mdss",
    name: "In Active MDS Devices",
    element: (
      <MasterAdminRoute>
        <InActiveMds />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/replace-mds-lora",
    name: "Replace MDS Lora",
    element: (
      <MasterAdminRoute>
        <ReplaceMdsLora />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/mds/site-management/block-management/:site_id/:block/:mds_no",
    name: "MDS Operation",
    element: (
      <MasterAdminRoute>
        <MdsOperating />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/mds/site-management/block-management/:site_id/:block/:mds_no/event-and-frames/:deveui",
    name: "Mds Event and Frames",
    element: (
      <MasterAdminRoute>
        <MdsEventAndFrames />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/update-row-data",
    name: "Update Robot Row Data",
    element: (
      <MasterAdminRoute>
        <UpdateRobotRowData />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/timer-logs",
    name: "Timer Command Sent Log",
    element: (
      <MasterAdminRoute>
        <TimerCommandSentLog />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/api-logger",
    name: "Master Admin api logger",
    element: (
      <MasterAdminRoute>
        <ApiLoggerDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/db-dashboard",
    name: "Master Admin Database Dashboard",
    element: (
      <MasterAdminRoute>
        <DBDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/system-info",
    name: "Master Admin Syatem Information",
    element: (
      <MasterAdminRoute>
        <SystemDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/custom-notifications",
    name: "Custom Notifications",
    element: (
      <MasterAdminRoute>
        <CustomNofifications />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/mds-timer",
    name: "MDS Timer",
    element: (
      <MasterAdminRoute>
        <Mdstimer />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/mds-timer/update/:site_id/:block",
    name: "MDS Timer",
    element: (
      <MasterAdminRoute>
        <UpdateMdsTimer />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/scada-integration",
    name: "Scada Integration",
    element: (
      <MasterAdminRoute>
        <ScadaDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/chat-with-console",
    name: "Chat with Console",
    element: (
      <MasterAdminRoute>
        <OpenAiChat />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/commissioning",
    name: "Comminsioning Dashboard",
    element: (
      <MasterAdminRoute>
        <CommisioningDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/commissioning/view/:id",
    name: "View Doc",
    element: (
      <MasterAdminRoute>
        <ViewDoc />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/commissioning/new-certificate",
    name: "New Comminisioning Certificate",
    element: (
      <MasterAdminRoute>
        <GenerateNewCertificate />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/commissioning/non-commisioned-robots",
    name: "Non Commisioned Robots",
    element: (
      <MasterAdminRoute>
        <NonCommisionedRobots />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/commissioning/view-robot-commisioning-doc/:id",
    name: "View Robot Commisioning Doc",
    element: (
      <MasterAdminRoute>
        <ViewRobotCommisioningDoc />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/commissioning/update-robot-commisioning-doc/:id",
    name: "Update Robot Commisioning Doc",
    element: (
      <MasterAdminRoute>
        <UpdateRobotCommisioningDoc />
      </MasterAdminRoute>
    ),
  },

  // Material Request
  {
    path: "/master-admin/material-requests",
    name: "Material Requests",
    element: (
      <MasterAdminRoute>
        <MaterialRequestDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/material-requests/create-material-request",
    name: "Create Material Request",
    element: (
      <MasterAdminRoute>
        <CreateMaterialRequest />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/material-requests/view/:id",
    name: "View Material Request",
    element: (
      <MasterAdminRoute>
        <ViewMaterialRequest />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/material-requests/update/:id",
    name: "Update Material Request",
    element: (
      <MasterAdminRoute>
        <UpdateMaterialRequest />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/statistics",
    name: "General Statistics",
    element: (
      <MasterAdminRoute>
        <Statistics />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/site-statistics",
    name: "Site Statistics",
    element: (
      <MasterAdminRoute>
        <SiteAnalytics />
      </MasterAdminRoute>
    ),
  },

  //Semi Automatic Robot Routes
  {
    path: "/master-admin/semi-automatic-robots",
    name: "All Robots",
    element: (
      <MasterAdminRoute>
        <SemiAutomaticRobot />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/add-robot/add-semi-automatic-robot",
    name: "Add Robot",
    element: (
      <MasterAdminRoute>
        <AddSemiAutomaticRobot />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/robot-location",
    name: "Robot Location",
    element: (
      <MasterAdminRoute>
        <RobotLocation />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/robot-location/:robot_no/:site_id",
    name: "Create Robot Location",
    element: (
      <MasterAdminRoute>
        <AddRobotLocation />
      </MasterAdminRoute>
    ),
  },
  // ------------------------poc------------------------------
  {
    path: "/master-admin/site-survey-dashboard",
    name: "Site Survey Dashboard",
    element: (
      <MasterAdminRoute>
        <NomenClatureDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/create-nomenclature",
    name: "Create Nomenclature",
    element: (
      <MasterAdminRoute>
        <CreateNomenClature />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/update-nomenclature/:id",
    name: "Update Nomenclature",
    element: (
      <MasterAdminRoute>
        <UpdatenomenClature />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/view-nomenclature/:id",
    name: "View Nomenclature",
    element: (
      <MasterAdminRoute>
        <ViewNomenClature />
      </MasterAdminRoute>
    ),
  },

  // --------------------------poc mms---------------------------
  {
    path: "/master-admin/mms-survey-dashboard",
    name: "MMS Survey Dashboard",
    element: (
      <MasterAdminRoute>
        <MMSDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/mms-survey-dashboard/view-mms-survey/:id",
    name: "View MMS Survey",
    element: (
      <MasterAdminRoute>
        <ViewMms />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/create-mms-structure",
    name: "Create MMS Structure",
    element: (
      <MasterAdminRoute>
        <CreateMmsStructure />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/mms-survey-dashboard/update-mms/:id",
    name: "Update MMS Structure",
    element: (
      <MasterAdminRoute>
        <UpdateMms />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/gateway-survey-dashboard",
    name: "Gateway Survey Dashboard",
    element: (
      <MasterAdminRoute>
        <GatewaySurveyDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/gateway-survey-dashboard/create-robot-survey/:id",
    name: "Create Robot Survey",
    element: (
      <MasterAdminRoute>
        <CreateRobotReading />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/gateway-survey-dashboard/view-gateway-survey/:id",
    name: "View Gateway Survey",
    element: (
      <MasterAdminRoute>
        <ViewGatewaySurvey />
      </MasterAdminRoute>
    ),
  },
  // --------------------------poc mms---------------------------
  // ------------------------poc------------------------------

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
    path: "/master-user/flush-queues",
    name: "Flush Queue",
    element: (
      <MasterUserRoute>
        <FlushQueue />
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
    path: "/master-user/inventory-hub",
    name: "Inventory Hub",
    element: (
      <MasterUserRoute>
        <InventoryHub />
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
    path: "/master-user/timers/:id",
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
    path: "/master-user/service-tickets/view-service-ticket/:id",
    name: "View Service Ticket",
    element: (
      <MasterUserRoute>
        <ViewServiceTicket />
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
    path: "/master-user/all-site-cleaning-log/cleaning-report/:site_id",
    name: "Master User Cleaning Report",
    element: (
      <MasterAdminRoute>
        <CleaningSummary />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-user/all-site-cleaning-log/cleaning-report/:site_id",
    name: "Master User Cleaning Report",
    element: (
      <MasterUserRoute>
        <CleaningSummary />
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
  {
    path: "/master-user/ai-model",
    name: "Master User AI Model",
    element: (
      <MasterUserRoute>
        <Home />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/ai-model/check-micro-fiber",
    name: "Master User AI Model Check Micro Fiber",
    element: (
      <MasterUserRoute>
        <CheckMicroFiber />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/ai-model/view/:id",
    name: "Master User AI Model View Micro Fiber",
    element: (
      <MasterUserRoute>
        <ViewMicrofiber />
      </MasterUserRoute>
    ),
  },

  {
    path: "/master-user/email-logs",
    name: "Email Logs",
    element: (
      <MasterUserRoute>
        <EmailLogs />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/email-logs/:id",
    name: "Email Log",
    element: (
      <MasterUserRoute>
        <ViewEmailLog />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/opexdata",
    name: "Opex Data Dashboard",
    element: (
      <MasterUserRoute>
        <OpexDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/opexdata/:site_id",
    name: "Opex Template",
    element: (
      <MasterUserRoute>
        <OpexTemplateManager />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/opexdata/:site_id/:moduleId/cycle/:cycleId",
    name: "Opex Cycle",
    element: (
      <MasterUserRoute>
        <OpexManageCycle />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/opexdata/:site_id/:moduleId/cycle/:cycleId/verify-day/:dayId",
    name: "Opex Cycle",
    element: (
      <MasterUserRoute>
        <VerifyCycleDay />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/create-template/:site_id",
    name: "CreateOpex ",
    element: (
      <MasterUserRoute>
        <OpexTemplateCreate />
      </MasterUserRoute>
    ),
  },

  {
    path: "/master-user/opexdata/:site_id/:moduleId/cycle/:cycleId/day/:dayId/technician-details",
    name: "Opex Cycle-Day Technician Details",
    element: (
      <MasterUserRoute>
        <ViewTechnicianDetails />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/opexdata/:site_id/:moduleId/cycle/:cycleId/add-day",
    name: "Add Day In Cycle ",
    element: (
      <MasterUserRoute>
        <AddDayInCycle />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/opexdata/:site_id/opex-certificate/:id",
    name: "Opex Certificate ",
    element: (
      <MasterUserRoute>
        <OpexCertificate />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/customer-feedback",
    name: "Customer Feedback",
    element: (
      <MasterUserRoute>
        <ClientFeedback />
      </MasterUserRoute>
    ),
  },

  {
    path: "/master-user/fault-analysis-checklist",
    name: "Fault Analysis Checklist",
    element: (
      <MasterUserRoute>
        <FaultAnalysisChecklist />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/fault-analysis-checklist/add-checklist/:id",
    name: "Add Fault Analysis Checklist",
    element: (
      <MasterUserRoute>
        <AddFaultAnalysisChecklist />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/fault-analysis-checklist/update-checklist/:id",
    name: "Update Fault Analysis Checklist",
    element: (
      <MasterUserRoute>
        <UpdateFaultAnalysisChecklist />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/faulty-inventory",
    name: "Faulty Inventory",
    element: (
      <MasterUserRoute>
        <FaultyInventory />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/material-consumption",
    name: "Material Consumption",
    element: (
      <MasterUserRoute>
        <MaterialConsumption />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/faulty-return-rework",
    name: "Faulty Return Rework",
    element: (
      <MasterUserRoute>
        <FaultyReturnDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/faulty-return-rework/create",
    name: "Create Faulty Return",
    element: (
      <MasterUserRoute>
        <CreateFaultyReturn />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/faulty-return-rework/view/:id",
    name: "View Faulty Return",
    element: (
      <MasterUserRoute>
        <ViewFaultyReturn />
      </MasterUserRoute>
    ),
  },

  {
    path: "/master-user/client-subscriptions",
    name: "Client Subscriptions",
    element: (
      <MasterUserRoute>
        <SubscriptionDashboard />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/client-subscriptions/create",
    name: "Create Subscriptions",
    element: (
      <MasterUserRoute>
        <CreateSubscription />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/client-subscriptions/view/:id",
    name: "View Subscriptions",
    element: (
      <MasterUserRoute>
        <ViewSubscription />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/client-subscriptions/renew/:client_id",
    name: "Renew Subscriptions",
    element: (
      <MasterUserRoute>
        <RenewSubscription />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/pricing",
    name: "Features & Pricing",
    element: (
      <MasterUserRoute>
        <Pricing />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/thermal-image-data",
    name: "Thermal Image Data",
    element: (
      <MasterUserRoute>
        <ThermalImageData />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/micro-fiber-data",
    name: "Micro Fiber Data",
    element: (
      <MasterUserRoute>
        <MicrofiberdataAdminWise />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/weather-data-sitewise",
    name: "Weather Data (Sitewise)",
    element: (
      <MasterUserRoute>
        <WeatherDataSitewise />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/timer-execution-notification-view",
    name: "Timer Execution Notification View",
    element: (
      <MasterUserRoute>
        <TimerExecutionNotificationView />
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
    path: "/master-admin/mds-tracker",
    name: "MDS Tracker",
    element: (
      <MasterAdminRoute>
        <MdsDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/mds-logs/:site_id",
    name: "MDS Tracker",
    element: (
      <MasterAdminRoute>
        <MdsLog />
      </MasterAdminRoute>
    ),
  },

  {
    path: "/master-admin/mis-report",
    name: "MIS Report",
    element: (
      <MasterAdminRoute>
        <MisDashboard />
      </MasterAdminRoute>
    ),
  },
  {
    path: "/master-admin/mis-report/summary",
    name: "MIS Report Summary",
    element: (
      <MasterAdminRoute>
        <Summary />
      </MasterAdminRoute>
    ),
  },
  //MDS Devices
  {
    path: "/master-user/mds-devices",
    name: "MDS Devices",
    element: (
      <MasterUserRoute>
        <Mds />
      </MasterUserRoute>
    ),
  },

  {
    path: "/master-user/mds-logs/:site_id",
    name: "MDS Logs",
    element: (
      <MasterUserRoute>
        <MdsLog />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/add-mds-device/add-mds-using-lorano",
    name: "Add MDS Device",
    element: (
      <MasterUserRoute>
        <AddMdsUsingLoraNo />
      </MasterUserRoute>
    ),
  },

  {
    path: "/master-user/mds-devices/activate-mds-devices",
    name: "All Inactivate MDS",
    element: (
      <MasterUserRoute>
        <ActivateMds />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/mds-devices/view/:id",
    name: "View MDS Device",
    element: (
      <MasterUserRoute>
        <ViewMds />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/mds-devices/update/:id",
    name: "Update MDS Device",
    element: (
      <MasterUserRoute>
        <UpdateMds />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/replace-mds-lora/active-mdss",
    name: "Active MDS Devices",
    element: (
      <MasterUserRoute>
        <ActiveMds />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/replace-mds-lora/in-active-mdss",
    name: "In Active MDS Devices",
    element: (
      <MasterUserRoute>
        <InActiveMds />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/replace-mds-lora",
    name: "Replace MDS Lora",
    element: (
      <MasterUserRoute>
        <ReplaceMdsLora />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/mds/site-management/block-management/:site_id/:block/:mds_no",
    name: "MDS Operation",
    element: (
      <MasterUserRoute>
        <MdsOperating />
      </MasterUserRoute>
    ),
  },

  {
    path: "/master-user/mds/site-management/block-management/:site_id/:block/:mds_no/event-and-frames/:deveui",
    name: "Mds Event and Frames",
    element: (
      <MasterUserRoute>
        <MdsEventAndFrames />
      </MasterUserRoute>
    ),
  },
  {
    path: "/master-user/mds-tracker",
    name: "MDS Tracker",
    element: (
      <MasterUserRoute>
        <MdsDashboard />
      </MasterUserRoute>
    ),
  },
  // ------------------------master user---------------------------------
  //------------------------project admin---------------------------------
  {
    path: "/project-admin/gateway-survey-dashboard",
    name: "Gateway Survey Dashboard",
    element: (
      <ProjectAdminRoute>
        <GatewaySurveyDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/gateway-survey-dashboard/create-robot-survey/:id",
    name: "Create Robot Survey",
    element: (
      <ProjectAdminRoute>
        <CreateRobotReading />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/gateway-survey-dashboard/view-gateway-survey/:id",
    name: "View Gateway Survey",
    element: (
      <ProjectAdminRoute>
        <ViewGatewaySurvey />
      </ProjectAdminRoute>
    ),
  },
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
    path: "/project-admin/robots-tracker",
    name: "Robots Tracker",
    element: (
      <ProjectAdminRoute>
        <RobotTracker />
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
    path: "/project-admin/add-robot/add-semi-automatic-robot",
    name: "Add Semi Robot",
    element: (
      <ProjectAdminRoute>
        <AddSemiAutomaticRobot />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/semi-automatic-robots",
    name: "Add Semi Robot",
    element: (
      <ProjectAdminRoute>
        <SemiAutomaticRobot />
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
    path: "/project-admin/clients-data-dashboard/edit-client/:id",
    name: "Edit Client",
    element: (
      <ProjectAdminRoute>
        <EditClient />
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
    path: "/project-admin/service-tickets/view-service-ticket/:id",
    name: "View Service Ticket",
    element: (
      <ProjectAdminRoute>
        <ViewServiceTicket />
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
    path: "/project-admin/all-site-cleaning-log/sitewise-cleaning-log/:site_id/:date",
    name: "Project Admin Sitewise Cleaning Log",
    element: (
      <ProjectAdminRoute>
        <SitewaiseLog />
      </ProjectAdminRoute>
    ),
  },

  {
    path: "/project-admin/all-site-cleaning-log/cleaning-report/:site_id",
    name: "Project Admin Sitewise Cleaning Log",
    element: (
      <ProjectAdminRoute>
        <CleaningSummary />
      </ProjectAdminRoute>
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
    path: "/project-admin/timers/:id",
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
    path: "/project-admin/inventory-hub",
    name: "Inventory Hub",
    element: (
      <ProjectAdminRoute>
        <InventoryHub />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/faulty-inventory",
    name: "Faulty Inventory",
    element: (
      <ProjectAdminRoute>
        <FaultyInventory />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/material-consumption",
    name: "Material Consumption",
    element: (
      <ProjectAdminRoute>
        <MaterialConsumption />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/faulty-return-rework",
    name: "Faulty Return Rework",
    element: (
      <ProjectAdminRoute>
        <FaultyReturnDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/faulty-return-rework/create",
    name: "Create Faulty Return",
    element: (
      <ProjectAdminRoute>
        <CreateFaultyReturn />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/faulty-return-rework/view/:id",
    name: "View Faulty Return",
    element: (
      <ProjectAdminRoute>
        <ViewFaultyReturn />
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
    path: "/project-admin/technician-location",
    name: "Technician Location",
    element: (
      <ProjectAdminRoute>
        <TechnicianLocationDashboard />
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
  {
    path: "/project-admin/opexdata",
    name: "Opex Data Dashboard",
    element: (
      <ProjectAdminRoute>
        <OpexDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/opexdata/:site_id",
    name: "Opex Template",
    element: (
      <ProjectAdminRoute>
        <OpexTemplateManager />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/opexdata/:site_id/:moduleId/cycle/:cycleId",
    name: "Opex Cycle",
    element: (
      <ProjectAdminRoute>
        <OpexManageCycle />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/opexdata/:site_id/:moduleId/cycle/:cycleId/verify-day/:dayId",
    name: "Opex Cycle",
    element: (
      <ProjectAdminRoute>
        <VerifyCycleDay />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/create-template/:site_id",
    name: "CreateOpex ",
    element: (
      <ProjectAdminRoute>
        <OpexTemplateCreate />
      </ProjectAdminRoute>
    ),
  },

  {
    path: "/project-admin/opexdata/:site_id/:moduleId/cycle/:cycleId/day/:dayId/technician-details",
    name: "Opex Cycle-Day Technician Details",
    element: (
      <ProjectAdminRoute>
        <ViewTechnicianDetails />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/opexdata/:site_id/:moduleId/cycle/:cycleId/add-day",
    name: "Add Day In Cycle ",
    element: (
      <ProjectAdminRoute>
        <AddDayInCycle />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/opexdata/:site_id/opex-certificate/:id",
    name: "Opex Certificate ",
    element: (
      <ProjectAdminRoute>
        <OpexCertificate />
      </ProjectAdminRoute>
    ),
  },

  {
    path: "/project-admin/robots-position",
    name: "Robots Position",
    element: (
      <ProjectAdminRoute>
        <RobotPosition />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/opexdata/:site_id/:moduleId/cycle/:cycleId/day/:dayId/technician-details",
    name: "Opex Cycle-Day Technician Details",
    element: (
      <ProjectAdminRoute>
        <ViewTechnicianDetails />
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
    path: "/project-admin/users",
    name: "All Internal Users",
    element: (
      <ProjectAdminRoute>
        <UsersDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/user-performance-dashboard",
    name: "User Performance",

    element: (
      <ProjectAdminRoute>
        <UserPerformanceDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/user-performance-dashboard/user-performance/:id",
    name: "User Performance",
    element: (
      <ProjectAdminRoute>
        <ViewPerformance />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/mis-report",
    name: "MIS Report",
    element: (
      <ProjectAdminRoute>
        <MisDashboard />
      </ProjectAdminRoute>
    ),
  },
  //MDS Devices
  {
    path: "/project-admin/mds-devices",
    name: "MDS Devices",
    element: (
      <ProjectAdminRoute>
        <Mds />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/mds-logs/:site_id",
    name: "MDS Logs",
    element: (
      <ProjectAdminRoute>
        <MdsLog />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/add-mds-device/add-mds-using-lorano",
    name: "Add MDS Device",
    element: (
      <ProjectAdminRoute>
        <AddMdsUsingLoraNo />
      </ProjectAdminRoute>
    ),
  },

  {
    path: "/project-admin/mds-devices/activate-mds-devices",
    name: "All Inactivate MDS",
    element: (
      <ProjectAdminRoute>
        <ActivateMds />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/mds-devices/view/:id",
    name: "View MDS Device",
    element: (
      <ProjectAdminRoute>
        <ViewMds />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/mds-devices/update/:id",
    name: "Update MDS Device",
    element: (
      <ProjectAdminRoute>
        <UpdateMds />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/replace-mds-lora/active-mdss",
    name: "Active MDS Devices",
    element: (
      <ProjectAdminRoute>
        <ActiveMds />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/replace-mds-lora/in-active-mdss",
    name: "In Active MDS Devices",
    element: (
      <ProjectAdminRoute>
        <InActiveMds />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/replace-mds-lora",
    name: "Replace MDS Lora",
    element: (
      <ProjectAdminRoute>
        <ReplaceMdsLora />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/mds/site-management/block-management/:site_id/:block/:mds_no",
    name: "MDS Operation",
    element: (
      <ProjectAdminRoute>
        <MdsOperating />
      </ProjectAdminRoute>
    ),
  },

  {
    path: "/project-admin/mds/site-management/block-management/:site_id/:block/:mds_no/event-and-frames/:deveui",
    name: "Mds Event and Frames",
    element: (
      <ProjectAdminRoute>
        <MdsEventAndFrames />
      </ProjectAdminRoute>
    ),
  },
  {
    // path: "/master-admin/event-and-frames/:deveui",
    path: "/project-admin/site-management/block-management/:site_id/:block/:robot_no/event-and-frames/:deveui",
    name: "Robot Event and Frames",
    element: (
      <ProjectAdminRoute>
        <RobotEventAndFrames />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/mds-tracker",
    name: "MDS Tracker",
    element: (
      <ProjectAdminRoute>
        <MdsDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/mds-timer",
    name: "MDS Timer",
    element: (
      <ProjectAdminRoute>
        <Mdstimer />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/mds-timer/update/:site_id/:block",
    name: "MDS Timer",
    element: (
      <ProjectAdminRoute>
        <UpdateMdsTimer />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/chat-with-console",
    name: "Chat with Console",
    element: (
      <ProjectAdminRoute>
        <OpenAiChat />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/custom-notifications",
    name: "Custom Notifications",
    element: (
      <ProjectAdminRoute>
        <CustomNofifications />
      </ProjectAdminRoute>
    ),
  },
  // Material Request
  {
    path: "/project-admin/material-requests",
    name: "Material Requests",
    element: (
      <ProjectAdminRoute>
        <MaterialRequestDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/material-requests/create-material-request",
    name: "Create Material Request",
    element: (
      <ProjectAdminRoute>
        <CreateMaterialRequest />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/material-requests/view/:id",
    name: "View Material Request",
    element: (
      <ProjectAdminRoute>
        <ViewMaterialRequest />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/material-requests/update/:id",
    name: "Update Material Request",
    element: (
      <ProjectAdminRoute>
        <UpdateMaterialRequest />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/commissioning",
    name: "Comminsioning Dashboard",
    element: (
      <ProjectAdminRoute>
        <CommisioningDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/commissioning/view/:id",
    name: "View Doc",
    element: (
      <ProjectAdminRoute>
        <ViewDoc />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/commissioning/new-certificate",
    name: "New Comminisioning Certificate",
    element: (
      <ProjectAdminRoute>
        <GenerateNewCertificate />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/commissioning/non-commisioned-robots",
    name: "Non Commisioned Robots",
    element: (
      <ProjectAdminRoute>
        <NonCommisionedRobots />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/commissioning/view-robot-commisioning-doc/:id",
    name: "View Robot Commisioning Doc",
    element: (
      <ProjectAdminRoute>
        <ViewRobotCommisioningDoc />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/commissioning/update-robot-commisioning-doc/:id",
    name: "Update Robot Commisioning Doc",
    element: (
      <ProjectAdminRoute>
        <UpdateRobotCommisioningDoc />
      </ProjectAdminRoute>
    ),
  },

  // ------------------------poc------------------------------
  {
    path: "/project-admin/site-survey-dashboard",
    name: "Site Survey Dashboard",
    element: (
      <ProjectAdminRoute>
        <NomenClatureDashboard />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/create-nomenclature",
    name: "Create Nomenclature",
    element: (
      <ProjectAdminRoute>
        <CreateNomenClature />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/update-nomenclature/:id",
    name: "Update Nomenclature",
    element: (
      <ProjectAdminRoute>
        <UpdatenomenClature />
      </ProjectAdminRoute>
    ),
  },
  {
    path: "/project-admin/view-nomenclature/:id",
    name: "View Nomenclature",
    element: (
      <ProjectAdminRoute>
        <ViewNomenClature />
      </ProjectAdminRoute>
    ),
  },
  // ------------------------poc------------------------------
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
    path: "/project-user/service-tickets/view-service-ticket/:id",
    name: "View Service Ticket",
    element: (
      <ProjectUserRoute>
        <ViewServiceTicket />
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
    path: "/project-user/all-site-cleaning-log/sitewise-cleaning-log/:site_id/:date",
    name: "Project User Sitewise Cleaning Log",
    element: (
      <ProjectUserRoute>
        <SitewaiseLog />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/all-site-cleaning-log/cleaning-report/:site_id",
    name: "Project User Cleaning Report",
    element: (
      <ProjectUserRoute>
        <CleaningSummary />
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
    path: "/project-user/timers/:id",
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
  {
    path: "/project-user/opexdata",
    name: "Opex Data Dashboard",
    element: (
      <ProjectUserRoute>
        <OpexDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/opexdata/:site_id",
    name: "Opex Template",
    element: (
      <ProjectUserRoute>
        <OpexTemplateManager />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/opexdata/:site_id/:moduleId/cycle/:cycleId",
    name: "Opex Cycle",
    element: (
      <ProjectUserRoute>
        <OpexManageCycle />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/opexdata/:site_id/:moduleId/cycle/:cycleId/verify-day/:dayId",
    name: "Opex Cycle",
    element: (
      <ProjectUserRoute>
        <VerifyCycleDay />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/create-template/:site_id",
    name: "CreateOpex ",
    element: (
      <ProjectUserRoute>
        <OpexTemplateCreate />
      </ProjectUserRoute>
    ),
  },

  {
    path: "/project-user/opexdata/:site_id/:moduleId/cycle/:cycleId/day/:dayId/technician-details",
    name: "Opex Cycle-Day Technician Details",
    element: (
      <ProjectUserRoute>
        <ViewTechnicianDetails />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/opexdata/:site_id/:moduleId/cycle/:cycleId/add-day",
    name: "Add Day In Cycle ",
    element: (
      <ProjectUserRoute>
        <AddDayInCycle />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/opexdata/:site_id/opex-certificate/:id",
    name: "Opex Certificate ",
    element: (
      <ProjectUserRoute>
        <OpexCertificate />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/weather-data-sitewise",
    name: "Weather Data (Sitewise)",
    element: (
      <ProjectUserRoute>
        <WeatherDataSitewise />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/micro-fiber-data",
    name: "Micro Fiber Data",
    element: (
      <ProjectUserRoute>
        <MicrofiberdataAdminWise />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/robots-position",
    name: "Robots Position",
    element: (
      <ProjectUserRoute>
        <RobotPosition />
      </ProjectUserRoute>
    ),
  },
  //MDS Devices
  {
    path: "/project-user/mds-devices",
    name: "MDS Devices",
    element: (
      <ProjectUserRoute>
        <Mds />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/mds-logs/:site_id",
    name: "MDS Logs",
    element: (
      <ProjectUserRoute>
        <MdsLog />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/add-mds-device/add-mds-using-lorano",
    name: "Add MDS Device",
    element: (
      <ProjectUserRoute>
        <AddMdsUsingLoraNo />
      </ProjectUserRoute>
    ),
  },

  {
    path: "/project-user/mds-devices/activate-mds-devices",
    name: "All Inactivate MDS",
    element: (
      <ProjectUserRoute>
        <ActivateMds />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/mds-devices/view/:id",
    name: "View MDS Device",
    element: (
      <ProjectUserRoute>
        <ViewMds />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/mds-devices/update/:id",
    name: "Update MDS Device",
    element: (
      <ProjectUserRoute>
        <UpdateMds />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/replace-mds-lora/active-mdss",
    name: "Active MDS Devices",
    element: (
      <ProjectUserRoute>
        <ActiveMds />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/replace-mds-lora/in-active-mdss",
    name: "In Active MDS Devices",
    element: (
      <ProjectUserRoute>
        <InActiveMds />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/replace-mds-lora",
    name: "Replace MDS Lora",
    element: (
      <ProjectUserRoute>
        <ReplaceMdsLora />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/mds/site-management/block-management/:site_id/:block/:mds_no",
    name: "MDS Operation",
    element: (
      <ProjectUserRoute>
        <MdsOperating />
      </ProjectUserRoute>
    ),
  },

  {
    path: "/project-user/mds/site-management/block-management/:site_id/:block/:mds_no/event-and-frames/:deveui",
    name: "Mds Event and Frames",
    element: (
      <ProjectUserRoute>
        <MdsEventAndFrames />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/site-management/block-management/:site_id/:block/:robot_no/event-and-frames/:deveui",
    name: "Robot Event and Frames",
    element: (
      <ProjectUserRoute>
        <RobotEventAndFrames />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/mds-tracker",
    name: "MDS Tracker",
    element: (
      <ProjectUserRoute>
        <MdsDashboard />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/mds-timer",
    name: "MDS Timer",
    element: (
      <ProjectUserRoute>
        <Mdstimer />
      </ProjectUserRoute>
    ),
  },
  {
    path: "/project-user/mds-timer/update/:site_id/:block",
    name: "MDS Timer",
    element: (
      <ProjectUserRoute>
        <UpdateMdsTimer />
      </ProjectUserRoute>
    ),
  },
  //------------------------project user---------------------------------

  //------------------------service admin---------------------------------
  {
    path: "/service-admin/gateway-survey-dashboard",
    name: "Gateway Survey Dashboard",
    element: (
      <ServiceAdminRoute>
        <GatewaySurveyDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/gateway-survey-dashboard/create-robot-survey/:id",
    name: "Create Robot Survey",
    element: (
      <ServiceAdminRoute>
        <CreateRobotReading />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/gateway-survey-dashboard/view-gateway-survey/:id",
    name: "View Gateway Survey",
    element: (
      <ServiceAdminRoute>
        <ViewGatewaySurvey />
      </ServiceAdminRoute>
    ),
  },
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
    path: "/service-admin/client-tickets",
    name: "Client Tickets",
    element: (
      <ServiceAdminRoute>
        <ClientTicketsDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/client-tickets/create-new-client-ticket",
    name: "Create New client Tickets",
    element: (
      <ServiceAdminRoute>
        <CreateNewClientTicket />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/client-tickets/update-client-ticket/:id",
    name: "Update client Tickets",
    element: (
      <ServiceAdminRoute>
        <UpdateClientTicket />
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
    path: "/service-admin/service-tickets/view-service-ticket/:id",
    name: "View Service Ticket",
    element: (
      <ServiceAdminRoute>
        <ViewServiceTicket />
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
    path: "/service-admin/all-site-cleaning-log/sitewise-cleaning-log/:site_id/:date",
    name: "Service Admin Sitewise Cleaning Log",
    element: (
      <ServiceAdminRoute>
        <SitewaiseLog />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/all-site-cleaning-log/cleaning-report/:site_id",
    name: "Service Admin Cleaning Report",
    element: (
      <ServiceAdminRoute>
        <CleaningSummary />
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
    path: "/service-admin/timers/:id",
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
    path: "/service-admin/inventory-hub",
    name: "Inventory Hub",
    element: (
      <ServiceAdminRoute>
        <InventoryHub />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/faulty-inventory",
    name: "Faulty Inventory",
    element: (
      <ServiceAdminRoute>
        <FaultyInventory />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/material-consumption",
    name: "Material Consumption",
    element: (
      <ServiceAdminRoute>
        <MaterialConsumption />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/faulty-return-rework",
    name: "Faulty Return Rework",
    element: (
      <ServiceAdminRoute>
        <FaultyReturnDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/faulty-return-rework/create",
    name: "Create Faulty Return",
    element: (
      <ServiceAdminRoute>
        <CreateFaultyReturn />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/faulty-return-rework/view/:id",
    name: "View Faulty Return",
    element: (
      <ServiceAdminRoute>
        <ViewFaultyReturn />
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
    path: "/service-admin/technician-wfh",
    name: "Technician WFH Approvals",
    element: (
      <ServiceAdminRoute>
        <TechnicianWfhApprovals />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/technician-location",
    name: "Technician Location",
    element: (
      <ServiceAdminRoute>
        <TechnicianLocationDashboard />
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
    path: "/service-admin/voice-calls",
    name: "Voice Calls",
    element: (
      <ServiceAdminRoute>
        <VoiceCallsPage />
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
  {
    path: "/service-admin/opexdata",
    name: "Opex Data Dashboard",
    element: (
      <ServiceAdminRoute>
        <OpexDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/opexdata/:site_id",
    name: "Opex Template",
    element: (
      <ServiceAdminRoute>
        <OpexTemplateManager />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/opexdata/:site_id/:moduleId/cycle/:cycleId",
    name: "Opex Cycle",
    element: (
      <ServiceAdminRoute>
        <OpexManageCycle />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/opexdata/:site_id/:moduleId/cycle/:cycleId/verify-day/:dayId",
    name: "Opex Cycle",
    element: (
      <ServiceAdminRoute>
        <VerifyCycleDay />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/create-template/:site_id",
    name: "CreateOpex ",
    element: (
      <ServiceAdminRoute>
        <OpexTemplateCreate />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/opexdata/:site_id/opex-certificate/:id",
    name: "Opex Certificate ",
    element: (
      <ServiceAdminRoute>
        <OpexCertificate />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/opexdata/:site_id/:moduleId/cycle/:cycleId/day/:dayId/technician-details",
    name: "Opex Cycle-Day Technician Details",
    element: (
      <ServiceAdminRoute>
        <ViewTechnicianDetails />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/robots-position",
    name: "Robots Position",
    element: (
      <ServiceAdminRoute>
        <RobotPosition />
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
    path: "/service-admin/client-tickets",
    name: "Client Tickets",
    element: (
      <ServiceAdminRoute>
        <ClientTicketsDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/client-tickets/create-new-client-ticket",
    name: "Create New client Tickets",
    element: (
      <ServiceAdminRoute>
        <CreateNewClientTicket />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/client-tickets/update-client-ticket/:id",
    name: "Update client Tickets",
    element: (
      <ServiceAdminRoute>
        <UpdateClientTicket />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/mis-report",
    name: "MIS Report",
    element: (
      <ServiceAdminRoute>
        <MisDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/robots-tracker",
    name: "Robots Tracker",
    element: (
      <ServiceAdminRoute>
        <RobotTracker />
      </ServiceAdminRoute>
    ),
  },

  //MDS Devices
  {
    path: "/service-admin/mds-devices",
    name: "MDS Devices",
    element: (
      <ServiceAdminRoute>
        <Mds />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/mds-logs/:site_id",
    name: "MDS Logs",
    element: (
      <ServiceAdminRoute>
        <MdsLog />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/add-mds-device/add-mds-using-lorano",
    name: "Add MDS Device",
    element: (
      <ServiceAdminRoute>
        <AddMdsUsingLoraNo />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/mds-devices/activate-mds-devices",
    name: "All Inactivate MDS",
    element: (
      <ServiceAdminRoute>
        <ActivateMds />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/mds-devices/view/:id",
    name: "View MDS Device",
    element: (
      <ServiceAdminRoute>
        <ViewMds />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/mds-devices/update/:id",
    name: "Update MDS Device",
    element: (
      <ServiceAdminRoute>
        <UpdateMds />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/replace-mds-lora/active-mdss",
    name: "Active MDS Devices",
    element: (
      <ServiceAdminRoute>
        <ActiveMds />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/replace-mds-lora/in-active-mdss",
    name: "In Active MDS Devices",
    element: (
      <ServiceAdminRoute>
        <InActiveMds />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/replace-mds-lora",
    name: "Replace MDS Lora",
    element: (
      <ServiceAdminRoute>
        <ReplaceMdsLora />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/mds/site-management/block-management/:site_id/:block/:mds_no",
    name: "MDS Operation",
    element: (
      <ServiceAdminRoute>
        <MdsOperating />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/mds/site-management/block-management/:site_id/:block/:mds_no/event-and-frames/:deveui",
    name: "Mds Event and Frames",
    element: (
      <ServiceAdminRoute>
        <MdsEventAndFrames />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/mds-tracker",
    name: "MDS Tracker",
    element: (
      <ServiceAdminRoute>
        <MdsDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/mds-timer",
    name: "MDS Timer",
    element: (
      <ServiceAdminRoute>
        <Mdstimer />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/mds-timer/update/:site_id/:block",
    name: "MDS Timer",
    element: (
      <ServiceAdminRoute>
        <UpdateMdsTimer />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/chat-with-console",
    name: "Chat with Console",
    element: (
      <ServiceAdminRoute>
        <OpenAiChat />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/custom-notifications",
    name: "Custom Notifications",
    element: (
      <ServiceAdminRoute>
        <CustomNofifications />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/update-row-data",
    name: "Update Robot Row Data",
    element: (
      <ServiceAdminRoute>
        <UpdateRobotRowData />
      </ServiceAdminRoute>
    ),
  },
  {
    // path: "/master-admin/event-and-frames/:deveui",
    path: "/service-admin/site-management/block-management/:site_id/:block/:robot_no/event-and-frames/:deveui",
    name: "Robot Event and Frames",
    element: (
      <ServiceAdminRoute>
        <RobotEventAndFrames />
      </ServiceAdminRoute>
    ),
  },
  // Material Request
  {
    path: "/service-admin/material-requests",
    name: "Material Requests",
    element: (
      <ServiceAdminRoute>
        <MaterialRequestDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/material-requests/create-material-request",
    name: "Create Material Request",
    element: (
      <ServiceAdminRoute>
        <CreateMaterialRequest />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/material-requests/view/:id",
    name: "View Material Request",
    element: (
      <ServiceAdminRoute>
        <ViewMaterialRequest />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/material-requests/update/:id",
    name: "Update Material Request",
    element: (
      <ServiceAdminRoute>
        <UpdateMaterialRequest />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/statistics",
    name: "General Statistics",
    element: (
      <ServiceAdminRoute>
        <Statistics />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/site-statistics",
    name: "Site Statistics",
    element: (
      <ServiceAdminRoute>
        <SiteAnalytics />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/commissioning",
    name: "Comminsioning Dashboard",
    element: (
      <ServiceAdminRoute>
        <CommisioningDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/commissioning/view/:id",
    name: "View Doc",
    element: (
      <ServiceAdminRoute>
        <ViewDoc />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/commissioning/new-certificate",
    name: "New Comminisioning Certificate",
    element: (
      <ServiceAdminRoute>
        <GenerateNewCertificate />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/commissioning/non-commisioned-robots",
    name: "Non Commisioned Robots",
    element: (
      <ServiceAdminRoute>
        <NonCommisionedRobots />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/commissioning/view-robot-commisioning-doc/:id",
    name: "View Robot Commisioning Doc",
    element: (
      <ServiceAdminRoute>
        <ViewRobotCommisioningDoc />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/commissioning/update-robot-commisioning-doc/:id",
    name: "Update Robot Commisioning Doc",
    element: (
      <ServiceAdminRoute>
        <UpdateRobotCommisioningDoc />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/robot-location",
    name: "Robot Location",
    element: (
      <ServiceAdminRoute>
        <RobotLocation />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/robot-location/:robot_no/:site_id",
    name: "Create Robot Location",
    element: (
      <ServiceAdminRoute>
        <AddRobotLocation />
      </ServiceAdminRoute>
    ),
  },

  // ------------------------poc------------------------------
  {
    path: "/service-admin/site-survey-dashboard",
    name: "Site Survey Dashboard",
    element: (
      <ServiceAdminRoute>
        <NomenClatureDashboard />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/create-nomenclature",
    name: "Create Nomenclature",
    element: (
      <ServiceAdminRoute>
        <CreateNomenClature />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/update-nomenclature/:id",
    name: "Update Nomenclature",
    element: (
      <ServiceAdminRoute>
        <UpdatenomenClature />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/view-nomenclature/:id",
    name: "View Nomenclature",
    element: (
      <ServiceAdminRoute>
        <ViewNomenClature />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/lora-configuration",
    name: "Lora Configuration",
    element: (
      <ServiceAdminRoute>
        <LoraConfiguration />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/replace-lora",
    name: "Replace Lora",
    element: (
      <ServiceAdminRoute>
        <ReplaceLora />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/replace-lora/in-active-robots",
    name: "In Active Robots",
    element: (
      <ServiceAdminRoute>
        <InActiveRobots />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/replace-lora/active-robots",
    name: "Active Robots",
    element: (
      <ServiceAdminRoute>
        <ActiveRobots />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/customer-feedback",
    name: "Customer Feedback",
    element: (
      <ServiceAdminRoute>
        <ClientFeedback />
      </ServiceAdminRoute>
    ),
  },

  {
    path: "/service-admin/fault-analysis-checklist",
    name: "Fault Analysis Checklist",
    element: (
      <ServiceAdminRoute>
        <FaultAnalysisChecklist />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/fault-analysis-checklist/add-checklist/:id",
    name: "Add Fault Analysis Checklist",
    element: (
      <ServiceAdminRoute>
        <AddFaultAnalysisChecklist />
      </ServiceAdminRoute>
    ),
  },
  {
    path: "/service-admin/fault-analysis-checklist/update-checklist/:id",
    name: "Update Fault Analysis Checklist",
    element: (
      <ServiceAdminRoute>
        <UpdateFaultAnalysisChecklist />
      </ServiceAdminRoute>
    ),
  },
  // ------------------------poc------------------------------

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
    path: "/service-user/service-tickets/view-service-ticket/:id",
    name: "View Service Ticket",
    element: (
      <ServiceUserRoute>
        <ViewServiceTicket />
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
    path: "/service-user/all-site-cleaning-log/sitewise-cleaning-log/:site_id/:date",
    name: "Service User Sitewise Cleaning Log",
    element: (
      <ServiceUserRoute>
        <SitewaiseLog />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/all-site-cleaning-log/cleaning-report/:site_id",
    name: "Service User Cleaning Report",
    element: (
      <ServiceUserRoute>
        <CleaningSummary />
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
    path: "/service-user/timers/:id",
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
    path: "/service-user/technician-wfh",
    name: "Technician WFH Approvals",
    element: (
      <ServiceUserRoute>
        <TechnicianWfhApprovals />
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
  {
    path: "/service-user/opexdata",
    name: "Opex Data Dashboard",
    element: (
      <ServiceUserRoute>
        <OpexDashboard />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/opexdata/:site_id",
    name: "Opex Template",
    element: (
      <ServiceUserRoute>
        <OpexTemplateManager />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/opexdata/:site_id/:moduleId/cycle/:cycleId",
    name: "Opex Cycle",
    element: (
      <ServiceUserRoute>
        <OpexManageCycle />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/opexdata/:site_id/:moduleId/cycle/:cycleId/verify-day/:dayId",
    name: "Opex Cycle",
    element: (
      <ServiceUserRoute>
        <VerifyCycleDay />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/create-template/:site_id",
    name: "CreateOpex ",
    element: (
      <ServiceUserRoute>
        <OpexTemplateCreate />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/opexdata/:site_id/:moduleId/cycle/:cycleId/day/:dayId/technician-details",
    name: "Opex Cycle-Day Technician Details",
    element: (
      <ServiceUserRoute>
        <ViewTechnicianDetails />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/opexdata/:site_id/:moduleId/cycle/:cycleId/add-day",
    name: "Add Day In Cycle ",
    element: (
      <ServiceUserRoute>
        <AddDayInCycle />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/opexdata/:site_id/opex-certificate/:id",
    name: "Opex Certificate ",
    element: (
      <ServiceUserRoute>
        <OpexCertificate />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/user-performance-dashboard",
    name: "User Performance",

    element: (
      <ServiceUserRoute>
        <UserPerformanceDashboard />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/user-performance-dashboard/user-performance/:id",
    name: "User Performance",
    element: (
      <ServiceUserRoute>
        <ViewPerformance />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/weather-data-sitewise",
    name: "Weather Data (Sitewise)",
    element: (
      <ServiceUserRoute>
        <WeatherDataSitewise />
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
  //MDS Devices
  {
    path: "/service-user/mds-devices",
    name: "MDS Devices",
    element: (
      <ServiceUserRoute>
        <Mds />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/mds-logs/:site_id",
    name: "MDS Logs",
    element: (
      <ServiceUserRoute>
        <MdsLog />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/add-mds-device/add-mds-using-lorano",
    name: "Add MDS Device",
    element: (
      <ServiceUserRoute>
        <AddMdsUsingLoraNo />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/mds-devices/activate-mds-devices",
    name: "All Inactivate MDS",
    element: (
      <ServiceUserRoute>
        <ActivateMds />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/mds-devices/view/:id",
    name: "View MDS Device",
    element: (
      <ServiceUserRoute>
        <ViewMds />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/mds-devices/update/:id",
    name: "Update MDS Device",
    element: (
      <ServiceUserRoute>
        <UpdateMds />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/replace-mds-lora/active-mdss",
    name: "Active MDS Devices",
    element: (
      <ServiceUserRoute>
        <ActiveMds />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/replace-mds-lora/in-active-mdss",
    name: "In Active MDS Devices",
    element: (
      <ServiceUserRoute>
        <InActiveMds />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/replace-mds-lora",
    name: "Replace MDS Lora",
    element: (
      <ServiceUserRoute>
        <ReplaceMdsLora />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/mds/site-management/block-management/:site_id/:block/:mds_no",
    name: "MDS Operation",
    element: (
      <ServiceUserRoute>
        <MdsOperating />
      </ServiceUserRoute>
    ),
  },

  {
    path: "/service-user/mds/site-management/block-management/:site_id/:block/:mds_no/event-and-frames/:deveui",
    name: "Mds Event and Frames",
    element: (
      <ServiceUserRoute>
        <MdsEventAndFrames />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/mds-tracker",
    name: "MDS Tracker",
    element: (
      <ServiceUserRoute>
        <MdsDashboard />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/mds-timer",
    name: "MDS Timer",
    element: (
      <ServiceUserRoute>
        <Mdstimer />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/mds-timer/update/:site_id/:block",
    name: "MDS Timer",
    element: (
      <ServiceUserRoute>
        <UpdateMdsTimer />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/robots-tracker",
    name: "Robots Tracker",
    element: (
      <ServiceUserRoute>
        <RobotTracker />
      </ServiceUserRoute>
    ),
  },
  // Material Request
  {
    path: "/service-user/material-requests",
    name: "Material Requests",
    element: (
      <ServiceUserRoute>
        <MaterialRequestDashboard />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/material-requests/create-material-request",
    name: "Create Material Request",
    element: (
      <ServiceUserRoute>
        <CreateMaterialRequest />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/material-requests/view/:id",
    name: "View Material Request",
    element: (
      <ServiceUserRoute>
        <ViewMaterialRequest />
      </ServiceUserRoute>
    ),
  },
  {
    path: "/service-user/material-requests/update/:id",
    name: "Update Material Request",
    element: (
      <ServiceUserRoute>
        <UpdateMaterialRequest />
      </ServiceUserRoute>
    ),
  },
  //------------------------service user---------------------------------

  //------------------------service Site Technician---------------------------------

  {
    path: "/site-technician/gateway-survey-dashboard",
    name: "Gateway Survey Dashboard",
    element: (
      <SiteTechnicianRoute>
        <GatewaySurveyDashboard />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/gateway-survey-dashboard/create-robot-survey/:id",
    name: "Create Robot Survey",
    element: (
      <SiteTechnicianRoute>
        <CreateRobotReading />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/gateway-survey-dashboard/view-gateway-survey/:id",
    name: "View Gateway Survey",
    element: (
      <SiteTechnicianRoute>
        <ViewGatewaySurvey />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/robot-activity",
    name: "Robot Activity",
    element: (
      <SiteTechnicianRoute>
        <RobotActivity />
      </SiteTechnicianRoute>
    ),
  },
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
    path: "/site-technician/update-row-data",
    name: "Update Robot Row Data",
    element: (
      <SiteTechnicianRoute>
        <UpdateRobotRowData />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/robots-tracker",
    name: "Robots Tracker",
    element: (
      <SiteTechnicianRoute>
        <RobotTracker />
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
        <Timers />
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
    path: "/site-technician/timers/:id",
    name: "Update Block Timer",
    element: (
      <SiteTechnicianRoute>
        <UpdateTimer />
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
        <ResolveServiceTicket />
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
  {
    // path: "/master-admin/event-and-frames/:deveui",     path: "/site-technician/site-management/block-management/:site_id/:block/:robot_no",
    path: "/site-technician/site-management/block-management/:site_id/:block/:robot_no/event-and-frames/:deveui",
    name: "Robot Event and Frames",
    element: (
      <SiteTechnicianRoute>
        <RobotEventAndFrames />
      </SiteTechnicianRoute>
    ),
  },

  // Material Request
  {
    path: "/site-technician/material-requests",
    name: "Material Requests",
    element: (
      <SiteTechnicianRoute>
        <MaterialRequestDashboard />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/material-requests/create-material-request",
    name: "Create Material Request",
    element: (
      <SiteTechnicianRoute>
        <CreateMaterialRequest />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/material-requests/view/:id",
    name: "View Material Request",
    element: (
      <SiteTechnicianRoute>
        <ViewMaterialRequest />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/material-requests/update/:id",
    name: "Update Material Request",
    element: (
      <SiteTechnicianRoute>
        <UpdateMaterialRequest />
      </SiteTechnicianRoute>
    ),
  },

  {
    path: "/site-technician/robot-location",
    name: "Robot Location",
    element: (
      <SiteTechnicianRoute>
        <RobotLocation />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/robot-location/:robot_no/:site_id",
    name: "Create Robot Location",
    element: (
      <SiteTechnicianRoute>
        <AddRobotLocation />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/chat-with-console",
    name: "Chat with Console  ",
    element: (
      <SiteTechnicianRoute>
        <OpenAiChat />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/voice-calls",
    name: "Voice Calls",
    element: (
      <SiteTechnicianRoute>
        <VoiceCallsPage />
      </SiteTechnicianRoute>
    ),
  },

  {
    path: "/site-technician/site-survey-dashboard",
    name: "Site Survey Dashboard",
    element: (
      <SiteTechnicianRoute>
        <NomenClatureDashboard />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/create-nomenclature",
    name: "Create Nomenclature",
    element: (
      <SiteTechnicianRoute>
        <CreateNomenClature />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/update-nomenclature/:id",
    name: "Update Nomenclature",
    element: (
      <SiteTechnicianRoute>
        <UpdatenomenClature />
      </SiteTechnicianRoute>
    ),
  },
  {
    path: "/site-technician/view-nomenclature/:id",
    name: "View Nomenclature",
    element: (
      <SiteTechnicianRoute>
        <ViewNomenClature />
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
        <Timers />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/timers/:id",
    name: "Update Robot Timer",
    element: (
      <ClientAdminRoute>
        <UpdateTimer />
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
    path: "/client-admin/cleaning-log-sites/cleaning-report/:site_id",
    name: "Cleaning Report",
    element: (
      <ClientAdminRoute>
        <CleaningSummary />
      </ClientAdminRoute>
    ),
  },
  //hre
  {
    path: "/client-admin/cleaning-log-sites/daywise-cleaning/:site_id/:date",
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
    path: "/client-admin/site-statistics",
    name: "Site Statistics",
    element: (
      <ClientAdminRoute>
        <SiteAnalytics />
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

  {
    path: "/client-admin/robots-position",
    name: "Robots Position",
    element: (
      <ClientAdminRoute>
        <RobotPosition />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/robots-tracking",
    name: "Robots Tracking",
    element: (
      <ClientAdminRoute>
        <RobotTracker />
      </ClientAdminRoute>
    ),
  },

  {
    path: "/client-admin/pricing",
    name: "Features & Pricing",
    element: (
      <ClientAdminRoute>
        <Pricing />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/mds-tracker",
    name: "MDS Tracker",
    element: (
      <ClientAdminRoute>
        <MdsDashboard />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/mds/site-management/block-management/:site_id/:block/:mds_no",
    name: "MDS Operation",
    element: (
      <ClientAdminRoute>
        <MdsOperatingClient />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/mds-logs/:site_id",
    name: "MDS Logs",
    element: (
      <ClientAdminRoute>
        <MdsLog />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/commissioning",
    name: "Comminsioning Dashboard",
    element: (
      <ClientAdminRoute>
        <CommisioningDashboard />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/commissioning/view/:id",
    name: "View Doc",
    element: (
      <ClientAdminRoute>
        <ViewDoc />
      </ClientAdminRoute>
    ),
  },

  {
    path: "/client-admin/commissioning/non-commisioned-robots",
    name: "Non Commisioned Robots",
    element: (
      <ClientAdminRoute>
        <NonCommisionedRobots />
      </ClientAdminRoute>
    ),
  },
  {
    path: "/client-admin/commissioning/view-robot-commisioning-doc/:id",
    name: "View Robot Commisioning Doc",
    element: (
      <ClientAdminRoute>
        <ViewRobotCommisioningDoc />
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
    element: (
      <ClientSiteInchargeRoute>
        <ClientDashboard />
      </ClientSiteInchargeRoute>
    ),
  },
  {
    path: "/site-incharge/site-management",
    name: "Site Management",
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
  {
    path: "/site-incharge/timers",
    name: "Timers",
    element: (
      <ClientSiteInchargeRoute>
        <Timers />
      </ClientSiteInchargeRoute>
    ),
  },
  {
    path: "/site-incharge/timers/:id",
    name: "Update Robot Timer",
    element: (
      <ClientSiteInchargeRoute>
        <UpdateTimer />
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
        <Timers />
      </ClientSiteTechnicianRoute>
    ),
  },
  {
    path: "/client-site-technician/timers/:id",
    name: "Update Robot Timer",
    element: (
      <ClientSiteTechnicianRoute>
        <UpdateTimer />
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
    path: "/opex-client-admin/my-opex-data/:site_id/opex-certificate/:id",
    name: "Opex Certificate ",
    element: (
      <OpexClientAdmin>
        <OpexCertificate />
      </OpexClientAdmin>
    ),
  },
  {
    path: "/opex-client-admin/my-opex-data/:site_id/:moduleId/cycle/:cycleId/day/:dayId/technician-details",
    name: "Opex Cycle-Day Technician Details",
    element: (
      <OpexClientAdmin>
        <ViewTechnicianDetails />
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
    path: "/opex-site-technician/my-opex-data/:site_id/opex-certificate/:id",
    name: "Opex Certificate ",
    element: (
      <OpexSiteTechnicianRoute>
        <OpexSiteTechnicianCertificate />
      </OpexSiteTechnicianRoute>
    ),
  },
  {
    path: "/opex-site-technician/my-opex-data/:site_id/:moduleId/cycle/:cycleId/day/:dayId/technician-details",
    name: "Opex Cycle-Day Technician Details",
    element: (
      <OpexSiteTechnicianRoute>
        <ViewTechnicianDetails />
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
    path: "/opex-site-technician/my-opex-data/:site_id/:moduleId/cycle/:cycleId/:dayId/upload-images",
    name: "Upload Day Wise Images",
    element: (
      <OpexSiteTechnicianRoute>
        <UploadImages />
      </OpexSiteTechnicianRoute>
    ),
  },

  // ------------------------opex site technician ----------------------------------

  // ------------------------------sales admin-----------------------------
  {
    path: "/sales-admin/dashboard",
    name: "Sales Admin Dashboard",
    element: (
      <SalesAdminRoute>
        <SalesAdminDashboard />
      </SalesAdminRoute>
    ),
  },

  {
    path: "/sales-admin/mis-report",
    name: "MIS Report",
    element: (
      <SalesAdminRoute>
        <MisDashboard />
      </SalesAdminRoute>
    ),
  },
  // ------------------------------sales admin-----------------------------

  // ------------------------------Production And Operations Admin----------------------------
  {
    path: "/production-and-operations-admin/dashboard",
    name: "Production And Operations Admin Dashboard",
    element: (
      <ProductionAndOperationsAdminRoute>
        <ProductionAndOperationsDashboard />
      </ProductionAndOperationsAdminRoute>
    ),
  },

  {
    path: "/production-and-operations-admin/mis-report",
    name: "MIS Report",
    element: (
      <ProductionAndOperationsAdminRoute>
        <MisDashboard />
      </ProductionAndOperationsAdminRoute>
    ),
  },
  // -----------------------------Production And Operations Admin----------------------------

  // ------------------------------Quality Admin----------------------------
  {
    path: "/quality-admin/dashboard",
    name: "Quality Admin Dashboard",
    element: (
      <QualityAdminRoute>
        <QualityAdminDashboard />
      </QualityAdminRoute>
    ),
  },

  {
    path: "/quality-admin/mis-report",
    name: "MIS Report",
    element: (
      <QualityAdminRoute>
        <MisDashboard />
      </QualityAdminRoute>
    ),
  },
  // -----------------------------Quality Admin----------------------------

  // ------------------------------Supply Chain Admin----------------------------
  {
    path: "/supply-chain-and-logistics-admin/dashboard",
    name: "Supply Chain Admin Dashboard",
    element: (
      <SupplyChainAndLogisticsAdminRoute>
        <SupplyChainAndLogisticsDashboard />
      </SupplyChainAndLogisticsAdminRoute>
    ),
  },

  {
    path: "/supply-chain-and-logistics-admin/mis-report",
    name: "MIS Report",
    element: (
      <SupplyChainAndLogisticsAdminRoute>
        <MisDashboard />
      </SupplyChainAndLogisticsAdminRoute>
    ),
  },
  // -----------------------------Supply Chain Admin----------------------------

  // ------------------------------Accounts Admin----------------------------
  {
    path: "/accounts-admin/dashboard",
    name: "Accounts Admin Dashboard",
    element: (
      <AccountAdminRoute>
        <AccountAdminDashboard />
      </AccountAdminRoute>
    ),
  },

  {
    path: "/accounts-admin/mis-report",
    name: "MIS Report",
    element: (
      <AccountAdminRoute>
        <MisDashboard />
      </AccountAdminRoute>
    ),
  },
  // -----------------------------Accounts Admin----------------------------

  // ------------------------------research-and-development-and-product-development-admin----------------------------
  {
    path: "/research-and-development-and-product-development-admin/dashboard",
    name: "Research And Development Admin Dashboard",
    element: (
      <ResearchAndDevelopmentAndProductDevelopmentAdminRoute>
        <ResearchAndDevelopmentAndProductDevelopmentAdminDashboard />
      </ResearchAndDevelopmentAndProductDevelopmentAdminRoute>
    ),
  },

  {
    path: "/research-and-development-and-product-development-admin/mis-report",
    name: "MIS Report",
    element: (
      <ResearchAndDevelopmentAndProductDevelopmentAdminRoute>
        <MisDashboard />
      </ResearchAndDevelopmentAndProductDevelopmentAdminRoute>
    ),
  },
  // ----------------------------research-and-development-and-product-development-admin------------------------------------

  // ------------------------------HR and admin----------------------------
  {
    path: "/hr-admin/dashboard",
    name: "HR Admin Dashboard",
    element: (
      <HRAndAdminRoute>
        <HrAdminDashboard />
      </HRAndAdminRoute>
    ),
  },

  {
    path: "/hr-admin/hr-users",
    name: "User Registration",
    element: (
      <HRAndAdminRoute>
        <HRUserDashboard />
      </HRAndAdminRoute>
    ),
  },

  {
    path: "/hr-admin/attendance",
    name: "Attendance Dashboard",
    element: (
      <HRAndAdminRoute>
        <AttendanceDashboard />
      </HRAndAdminRoute>
    ),
  },

  {
    path: "/hr-admin/monthly-report",
    name: "Monthly Attendance Report",
    element: (
      <HRAndAdminRoute>
        <MonthlyAttendanceReport />
      </HRAndAdminRoute>
    ),
  },

  {
    path: "/hr-admin/custom-notifications",
    name: "Custom Notifications",
    element: (
      <HRAndAdminRoute>
        <CustomNofifications />
      </HRAndAdminRoute>
    ),
  },

  // {
  //   path: "/hr-admin/mis-report",
  //   name: "MIS Report",
  //   element: (
  //     <HRAndAdminRoute>
  //       <MisDashboard />
  //     </HRAndAdminRoute>
  //   ),
  // },
  // ----------------------------HR and admin------------------------------------

  // ------------------------------Factory Admin----------------------------
  {
    path: "/factory-admin/dashboard",
    name: "Factory Admin Dashboard",
    element: (
      <FactoryAdminRoute>
        <FactoryAdmin />
      </FactoryAdminRoute>
    ),
  },

  {
    path: "/factory-admin/site-management",
    name: "Site Management",
    element: (
      <FactoryAdminRoute>
        <SiteManagement />
      </FactoryAdminRoute>
    ),
  },
  {
    path: "/factory-admin/site-management/block-management/:site_id",
    name: "Block Management",
    element: (
      <FactoryAdminRoute>
        <BlockManagement />
      </FactoryAdminRoute>
    ),
  },
  {
    path: "/factory-admin/site-management/block-management/:site_id/:block/:robot_no",
    name: "Robot Configuration",
    element: (
      <FactoryAdminRoute>
        <RobotOperating />
      </FactoryAdminRoute>
    ),
  },

  {
    path: "/factory-admin/site-management/block-management/:site_id/:block/:robot_no/debug_logs",
    name: "Debug Log",
    element: (
      <FactoryAdminRoute>
        <DebugLog />
      </FactoryAdminRoute>
    ),
  },
  {
    path: "/factory-admin/site-management/block-management/:site_id/:block/:robot_no/cleaning_logs",
    name: "Cleaning Log",
    element: (
      <FactoryAdminRoute>
        <CleaningLog />
      </FactoryAdminRoute>
    ),
  },
  {
    path: "/factory-admin/profile-tab",
    name: "Profile Details",
    element: (
      <FactoryAdminRoute>
        <Profile />
      </FactoryAdminRoute>
    ),
  },

  {
    path: "/factory-admin/mds-devices",
    name: "MDS Devices",
    element: (
      <FactoryAdminRoute>
        <Mds />
      </FactoryAdminRoute>
    ),
  },

  {
    path: "/factory-admin/mds/site-management/block-management/:site_id/:block/:mds_no",
    name: "MDS Operation",
    element: (
      <FactoryAdminRoute>
        <MdsOperating />
      </FactoryAdminRoute>
    ),
  },

  {
    path: "/factory-admin/mds/site-management/block-management/:site_id/:block/:mds_no/event-and-frames/:deveui",
    name: "Mds Event and Frames",
    element: (
      <FactoryAdminRoute>
        <MdsEventAndFrames />
      </FactoryAdminRoute>
    ),
  },
  {
    path: "/factory-admin/mds-devices/view/:id",
    name: "View MDS Device",
    element: (
      <FactoryAdminRoute>
        <ViewMds />
      </FactoryAdminRoute>
    ),
  },
  // --------------------------Factory Admin------------------------------------

  // --------------------------Design Admin------------------------------------
  {
    path: "/design-admin/dashboard",
    name: "Design Admin Dashboard",
    element: (
      <DesignAdminRoute>
        <DesignDashboard />
      </DesignAdminRoute>
    ),
  },

  {
    path: "/design-admin/profile-tab",
    name: "Design Admin Profile",
    element: (
      <DesignAdminRoute>
        <Profile />
      </DesignAdminRoute>
    ),
  },

  // ------------------------poc------------------------------
  {
    path: "/design-admin/site-survey-dashboard",
    name: "Site Survey Dashboard",
    element: (
      <DesignAdminRoute>
        <NomenClatureDashboard />
      </DesignAdminRoute>
    ),
  },
  {
    path: "/design-admin/create-nomenclature",
    name: "Create Nomenclature",
    element: (
      <DesignAdminRoute>
        <CreateNomenClature />
      </DesignAdminRoute>
    ),
  },
  {
    path: "/design-admin/update-nomenclature/:id",
    name: "Update Nomenclature",
    element: (
      <DesignAdminRoute>
        <UpdatenomenClature />
      </DesignAdminRoute>
    ),
  },
  {
    path: "/design-admin/view-nomenclature/:id",
    name: "View Nomenclature",
    element: (
      <DesignAdminRoute>
        <ViewNomenClature />
      </DesignAdminRoute>
    ),
  },
  // ------------------------poc------------------------------

  // --------------------------Design Admin------------------------------------
];

export default routes;
