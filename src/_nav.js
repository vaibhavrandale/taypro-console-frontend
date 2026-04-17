import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilCursor,
  cilPuzzle,
  cilSettings,
  cilSpeedometer,
  cilFactory,
  cilBuilding,
  cilTask,
  cilStorage,
  cilCheckCircle,
  cilGroup,
  cilListRich,
  cilCheck,
  cilLan,
  cilEnvelopeOpen,
  cilMoney,
  cilLocationPin,
  cilGraph,
} from "@coreui/icons";
import { CNavGroup, CNavItem } from "@coreui/react";
import {
  // Crown,
  LayoutDashboard,
  BarChart3,
  Terminal,
  Ticket,
  Building2,
  Database,
  Settings2,
  Clock,
  ShieldCheck,
  ClipboardList,
  Map,
  Navigation,
  Radar,
  Users,
  UserCog,
  MessageSquare,
  Settings,
  Gem,
  Proportions,
  Wrench,
} from "lucide-react";
import { MdCircleNotifications } from "react-icons/md";

const _nav = [
  // -----------------------------------master admin----------------------------------------
  {
    component: CNavGroup,
    name: "Master Admin",
    to: "/base",
    icon: (
      <CIcon
        icon={cilSpeedometer}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/master-admin/dashboard",
        icon: (
          <CIcon
            icon={cilFactory}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },

      // ✅ GROUP 1: Site Data
      {
        component: CNavGroup,
        name: "Site Data",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "All Clients",
            to: "/master-admin/clients-dashboard",
          },
          {
            component: CNavItem,
            name: "All Site Data",
            to: "/master-admin/site-management/all-site-data",
          },
          {
            component: CNavItem,
            name: "Site Management",
            to: "/master-admin/site-management",
          },
          {
            component: CNavItem,
            name: "Sites Coordinates",
            to: "/master-admin/sites-coordinates",
          },
          {
            component: CNavItem,
            name: "All Site Cleaning Log",
            to: "/master-admin/all-site-cleaning-log",
          },

          {
            component: CNavItem,
            name: "All Sites Timers",
            to: "/master-admin/timers",
          },
          {
            component: CNavItem,
            name: "Timer Logs",
            to: "/master-admin/timer-logs",
          },
          {
            component: CNavItem,
            name: "All Sites Gateways",
            to: "/master-admin/all-site-gateways",
          },
          {
            component: CNavItem,
            name: "All Site DPR",
            to: "/master-admin/all-site-dpr",
          },
        ],
      },

      // ✅ GROUP 2: Tickets
      {
        component: CNavGroup,
        name: "Tickets",
        icon: (
          <CIcon
            icon={cilTask}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Service Tickets",
            to: "/master-admin/service-tickets",
          },
          {
            component: CNavItem,
            name: "Internal Tickets",
            to: "/master-admin/internal-tickets",
          },
          {
            component: CNavItem,
            name: "Client Tickets",
            to: "/master-admin/client-tickets",
          },
        ],
      },

      // ✅ GROUP 3: Configuration & Users
      {
        component: CNavGroup,
        name: "Robots Management",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Robots",
            to: "/master-admin/robots",
          },
          {
            component: CNavItem,
            name: "Semi-Robots",
            to: "/master-admin/semi-automatic-robots",
          },
          {
            component: CNavItem,
            name: "Lora Configuration",
            to: "/master-admin/lora-configuration",
          },
          {
            component: CNavItem,
            name: "Replace Lora",
            to: "/master-admin/replace-lora/active-robots",
          },
          {
            component: CNavItem,
            name: "Robot Battery Temperature",
            to: "/master-admin/robot-battery-temperature",
          },
          {
            component: CNavItem,
            name: "Robot Commands",
            to: "/master-admin/robot-commands",
          },
          {
            component: CNavItem,
            name: "Flush Queue",
            to: "/master-admin/flush-queues",
          },
          {
            component: CNavItem,
            name: "Robot Log Details",
            to: "/master-admin/robot-log-details",
          },
          {
            component: CNavItem,
            name: "Weather Timer Notifications",
            to: "/master-admin/weather-timer-notifications",
          },
          {
            component: CNavItem,
            name: "Timer Execution Notification View",
            to: "/master-admin/timer-execution-notification-view",
          },
          {
            component: CNavItem,
            name: "Weather Data ",
            to: "/master-admin/weather-data-sitewise",
          },
        ],
      },

      {
        component: CNavGroup,
        name: "Users Management",
        icon: (
          <CIcon
            icon={cilGroup}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Users",
            to: "/master-admin/users",
          },
          {
            component: CNavItem,
            name: "Technician Attendance",
            to: "/master-admin/technician-attendance",
          },
          {
            component: CNavItem,
            name: "User Performance",
            to: "/master-admin/user-performance-dashboard",
          },
          {
            component: CNavItem,
            name: "Chat",
            to: "/master-admin/chat",
          },
        ],
      },
      // /master-admin/customer-feedback
      {
        component: CNavGroup,
        name: "Operations",
        icon: (
          <CIcon
            icon={cilListRich}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Preventive Maintenance",
            to: "/master-admin/preventive-maintanance-dashboard",
          },
          {
            component: CNavItem,
            name: "Project Handover",
            to: "/master-admin/project-handover",
          },
          {
            component: CNavItem,
            name: "Micro Fiber Data",
            to: "/master-admin/micro-fiber-data",
          },
          {
            component: CNavItem,
            name: "Thermal Image Data",
            to: "/master-admin/thermal-image-data",
          },
          {
            component: CNavItem,
            name: "ESP Firmware Data",
            to: "/master-admin/esp-firmware",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Inventory Data",
        icon: (
          <CIcon
            icon={cilTask}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Service Inventory",
            to: "/master-admin/inventories",
          },
          {
            component: CNavItem,
            name: "Faulty Inventory",
            to: "/master-admin/faulty-inventory",
          },
          {
            component: CNavItem,
            name: "ServiceTickets Fault",
            to: "/master-admin/serviceticket-fault/service-tickets-fault-dashboard",
          },
          {
            component: CNavItem,
            name: "Fault Analysis Checklist",
            to: "/master-admin/fault-analysis-checklist",
          },
        ],
      },
      // {
      //   component: CNavItem,
      //   name: "Monthly Sites Report",
      //   to: "/master-admin/monthlyreport",
      //   icon: (
      //     <CIcon
      //       icon={cilFactory}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      // },

      {
        component: CNavGroup,
        name: "AI Model",
        icon: (
          <CIcon
            icon={cilLan}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Micro-Fiber cloth model",
            to: "/master-admin/ai-model",
          },
        ],
      },
      //robots-positioning
      {
        component: CNavGroup,
        name: "Live Tracking",
        icon: (
          <CIcon
            icon={cilLocationPin}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          // {
          //   component: CNavItem,
          //   name: "Robots Position Tracking",
          //   to: "/master-admin/robots-position",
          // },
          {
            component: CNavItem,
            name: "Robot Tracking",
            to: "/master-admin/robots-tracker",
          },
          {
            component: CNavItem,
            name: "MDS Tracking",
            to: "/master-admin/mds-tracker",
          },
        ],
      },

      // {
      //   component: CNavGroup,
      //   name: "MDS Tracking",
      //   icon: (
      //     <CIcon
      //       icon={cilLocationPin}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      //   items: [
      //     {
      //       component: CNavItem,
      //       name: "MDS Tracking",
      //       to: "/master-admin/mds-tracker",
      //     },
      //   ],
      // },

      {
        component: CNavGroup,
        name: "Customer Feedback",
        icon: (
          <CIcon
            icon={cilFactory}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "All Feedbacks",
            to: "/master-admin/customer-feedback",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Subscriptions",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Manage Subscriptions",
            to: "/master-admin/client-subscriptions",
          },
          {
            component: CNavItem,
            name: "Pricing",
            to: "/master-admin/pricing",
          },
        ],
      },

      {
        component: CNavGroup,
        name: "Expense Management",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "View Expenses",
            to: "/master-admin/expenses",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Material Management",
        icon: (
          <CIcon
            icon={cilStorage}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Material Requests",
            to: "/master-admin/material-requests",
          },
        ],
      },

      {
        component: CNavGroup,
        name: "System Logs",
        icon: (
          <CIcon
            icon={cilEnvelopeOpen}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Email Activity Logs",
            to: "/master-admin/email-logs",
          },
          {
            component: CNavItem,
            name: "API Logs",
            to: "/master-admin/api-logger",
          },
          {
            component: CNavItem,
            name: "Database Status",
            to: "/master-admin/db-dashboard",
          },
          {
            component: CNavItem,
            name: "System Info",
            to: "/master-admin/system-info",
          },
        ],
      },
      // {
      //   component: CNavGroup,
      //   name: "Pricing",
      //   icon: (
      //     <CIcon
      //       icon={cilMoney}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      //   items: [
      //     {
      //       component: CNavItem,
      //       name: "Pricing",
      //       to: "/master-admin/pricing",
      //     },
      //   ],
      // },

      {
        component: CNavGroup,
        name: "Opex Data",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Opex Dashboard",
            to: "/master-admin/opexdata",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Scada",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Scada Dashboard",
            to: "/master-admin/scada-integration",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "MQTT",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "MQTT Dashboard",
            to: "/master-admin/mqtt-dashboard",
          },
          {
            component: CNavItem,
            name: "MQTT Events",
            to: "/master-admin/mqtt-events-per-robot",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Site Analysis",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Site Analysis Dashboard",
            to: "/master-admin/site-analysis-dashboard",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Sprints",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Sprints Dashboard",
            to: "/master-admin/sprints-dashboard",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "MIS Report",
        icon: (
          // <CIcon
          //   icon={cilMoney}
          // customClassName="nav-icon"
          // style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          // />
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "20px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "MIS Report",
            to: "/master-admin/mis-report",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "MDS Management",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "MDS Devices",
            to: "/master-admin/mds-devices",
          },

          {
            component: CNavItem,
            name: "Replace MDS Lora",
            to: "/master-admin/replace-mds-lora/active-mdss",
          },
          {
            component: CNavItem,
            name: "MDS Timer",
            to: "/master-admin/mds-timer",
          },

          // {
          //   component: CNavItem,
          //   name: "Robot Battery Temperature",
          //   to: "/master-admin/robot-battery-temperature",
          // },
          // {
          //   component: CNavItem,
          //   name: "Robot Commands",
          //   to: "/master-admin/robot-commands",
          // },
          // {
          //   component: CNavItem,
          //   name: "Robot Log Details",
          //   to: "/master-admin/robot-log-details",
          // },
          // {
          //   component: CNavItem,
          //   name: "Weather Timer Notifications",
          //   to: "/master-admin/weather-timer-notifications",
          // },
          // {
          //   component: CNavItem,
          //   name: "Timer Execution Notification View",
          //   to: "/master-admin/timer-execution-notification-view",
          // },
          // {
          //   component: CNavItem,
          //   name: "Weather Data ",
          //   to: "/master-admin/weather-data-sitewise",
          // },
        ],
      },

      {
        component: CNavGroup,
        name: "Robot Row Data",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "View Row Data",
            to: "/master-admin/update-row-data",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Custom Notifications",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Custom Notifications",
            to: "/master-admin/custom-notifications",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Chat with Console",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Chat with Console",
            to: "/master-admin/chat-with-console",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Commissioning",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Dashboard",
            to: "/master-admin/commissioning",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Statistics",
        icon: (
          <CIcon
            icon={cilGraph}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Statistics",
            to: "/master-admin/statistics",
          },
        ],
      },
    ],
  },
  // -----------------------------------master admin----------------------------------------

  // ------------------------------------master user----------------------------------------
  {
    component: CNavGroup,
    name: "Master User",
    to: "/base",
    icon: (
      <CIcon
        icon={cilSpeedometer}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/master-user/dashboard",
        icon: (
          <CIcon
            icon={cilFactory}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgba(63, 208, 10, 1)" }}
          />
        ),
      },
      //auto-email logs
      {
        component: CNavGroup,
        name: "Auto Email Logs",
        icon: (
          <CIcon
            icon={cilEnvelopeOpen}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Email Logs",
            to: "/master-user/email-logs",
          },
        ],
      },

      //Opex Data
      {
        component: CNavGroup,
        name: "Opex Data",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Opex Dashboard",
            to: "/master-user/opexdata",
          },
        ],
      },
      //Feedback
      {
        component: CNavGroup,
        name: "Feedback",
        icon: (
          <CIcon
            icon={cilFactory}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Customer Feedback",
            to: "/master-user/customer-feedback",
          },
        ],
      },

      //Inventory Data

      {
        component: CNavGroup,
        name: "Inventory Data",
        icon: (
          <CIcon
            icon={cilTask}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Service Inventory",
            to: "/master-user/inventories",
          },
          {
            component: CNavItem,
            name: "Faulty Inventory",
            to: "/master-user/faulty-inventory",
          },
          {
            component: CNavItem,
            name: "ServiceTickets Fault",
            to: "/master-user/serviceticket-fault/service-tickets-fault-dashboard",
          },
          {
            component: CNavItem,
            name: "Fault Analysis Checklist",
            to: "/master-user/fault-analysis-checklist",
          },
        ],
      },

      //Subscriptions
      {
        component: CNavGroup,
        name: "Subscriptions",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Manage Subscriptions",
            to: "/master-user/client-subscriptions",
          },
          {
            component: CNavItem,
            name: "Pricing",
            to: "/master-user/pricing",
          },
        ],
      },
      // ✅ GROUP 1: Site Data
      {
        component: CNavGroup,
        name: "Site Data",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "All Clients",
            to: "/master-user/clients-dashboard",
          },
          {
            component: CNavItem,
            name: "All Site Data",
            to: "/master-user/site-management/all-site-data",
          },
          {
            component: CNavItem,
            name: "Site Management",
            to: "/master-user/site-management",
          },
          {
            component: CNavItem,
            name: "Sites Coordinates",
            to: "/master-user/sites-coordinates",
          },
          {
            component: CNavItem,
            name: "All Site Cleaning Log",
            to: "/master-user/all-site-cleaning-log",
          },
          {
            component: CNavItem,
            name: "All Sites Timers",
            to: "/master-user/timers",
          },
          {
            component: CNavItem,
            name: "All Sites Gateways",
            to: "/master-user/all-site-gateways",
          },
          {
            component: CNavItem,
            name: "All Site DPR",
            to: "/master-user/all-site-dpr",
          },
        ],
      },
      // AI -Model

      {
        component: CNavGroup,
        name: "AI Model",
        icon: (
          <CIcon
            icon={cilLan}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Micro-Fiber cloth model",
            to: "/master-user/ai-model",
          },
        ],
      },

      // ✅ GROUP 2: Tickets
      {
        component: CNavGroup,
        name: "Tickets",
        icon: (
          <CIcon
            icon={cilTask}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Service Tickets",
            to: "/master-user/service-tickets",
          },
          {
            component: CNavItem,
            name: "Internal Tickets",
            to: "/master-user/internal-tickets",
          },
          {
            component: CNavItem,
            name: "Client Tickets",
            to: "/master-user/client-tickets",
          },
        ],
      },

      // ✅ GROUP 3: Configuration & Users
      {
        component: CNavGroup,
        name: "Robots Management",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Robots",
            to: "/master-user/robots",
          },
          {
            component: CNavItem,
            name: "Lora Configuration",
            to: "/master-user/lora-configuration",
          },
          {
            component: CNavItem,
            name: "Replace Lora",
            to: "/master-user/replace-lora/active-robots",
          },
          {
            component: CNavItem,
            name: "Robot Battery Temperature",
            to: "/master-user/robot-battery-temperature",
          },
          {
            component: CNavItem,
            name: "Robot Commands",
            to: "/master-user/robot-commands",
          },
          {
            component: CNavItem,
            name: "Flush Queue",
            to: "/master-user/flush-commands",
          },
          {
            component: CNavItem,
            name: "Robot Log Details",
            to: "/master-user/robot-log-details",
          },
          {
            component: CNavItem,
            name: "Weather Timer Notifications",
            to: "/master-user/weather-timer-notifications",
          },
          {
            component: CNavItem,
            name: "Timer Execution Notification View",
            to: "/master-user/timer-execution-notification-view",
          },
          {
            component: CNavItem,
            name: "Weather Data ",
            to: "/master-user/weather-data-sitewise",
          },
        ],
      },

      {
        component: CNavGroup,
        name: "Users Management",
        icon: (
          <CIcon
            icon={cilGroup}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Chat",
            to: "/master-user/chat",
          },
          {
            component: CNavItem,
            name: "Users",
            to: "/master-user/users",
          },
          {
            component: CNavItem,
            name: "Technician Attendance",
            to: "/master-user/technician-attendance",
          },
          {
            component: CNavItem,
            name: "User Performance",
            to: "/master-user/user-performance-dashboard",
          },
        ],
      },

      //Operations
      {
        component: CNavGroup,
        name: "Operations",
        icon: (
          <CIcon
            icon={cilListRich}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Preventive Maintenance",
            to: "/master-user/preventive-maintanance-dashboard",
          },
          {
            component: CNavItem,
            name: "Project Handover",
            to: "/master-user/project-handover",
          },
          {
            component: CNavItem,
            name: "Micro Fiber Data",
            to: "/master-user/micro-fiber-data",
          },
          {
            component: CNavItem,
            name: "Thermal Image Data",
            to: "/master-user/thermal-image-data",
          },
        ],
      },
      // {
      //   component: CNavItem,
      //   name: "Monthly Sites Report",
      //   to: "/master-user/monthlyreport",
      //   icon: (
      //     <CIcon
      //       icon={cilFactory}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      // },
      //
      {
        component: CNavGroup,
        name: "Expense Management",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "View Expenses",
            to: "/master-user/expenses",
          },
        ],
      },

      {
        component: CNavGroup,
        name: "MDS Management",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "MDS Devices",
            to: "/master-user/mds-devices",
          },

          {
            component: CNavItem,
            name: "Replace MDS Lora",
            to: "/master-user/replace-mds-lora/active-mdss",
          },
          {
            component: CNavItem,
            name: "MDS Tracking",
            to: "/master-user/mds-tracker",
          },
          {
            component: CNavItem,
            name: "MDS Timer",
            to: "/master-user/mds-timer",
          },
        ],
      },
    ],
  },
  //------------------------------------master-user--------------------------------------------

  //-------------------------------Project admin------------------------------------

  {
    component: CNavGroup,
    name: "Project Admin",
    to: "/base",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/project-admin/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavGroup,
        name: "Robots Tracking",
        icon: (
          <CIcon
            icon={cilLocationPin}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Robots Tracking",
            to: "/project-admin/robots-tracker",
          },
        ],
      },
      // ✅ GROUP 1: Site Data
      {
        component: CNavGroup,
        name: "Site Data",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "All Clients",
            to: "/project-admin/clients-dashboard",
          },
          {
            component: CNavItem,
            name: "All Site Data",
            to: "/project-admin/all-site-data",
          },
          {
            component: CNavItem,
            name: "Site Management",
            to: "/project-admin/site-management",
          },
          {
            component: CNavItem,
            name: "Cleaning Log",
            to: "/project-admin/all-site-cleaning-log",
          },
          {
            component: CNavItem,
            name: "Timers",
            to: "/project-admin/timers",
          },
          {
            component: CNavItem,
            name: "Gateways",
            to: "/project-admin/all-site-gateways",
          },
          {
            component: CNavItem,
            name: "DPR",
            to: "/project-admin/all-site-dpr",
          },
          {
            component: CNavItem,
            name: "Robot Battery Temperature",
            to: "/project-admin/robot-battery-temperature",
          },
        ],
      },

      // ✅ GROUP 2: Tickets
      {
        component: CNavGroup,
        name: "Tickets",
        icon: (
          <CIcon
            icon={cilTask}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Service Tickets",
            to: "/project-admin/service-tickets",
          },
          {
            component: CNavItem,
            name: "Internal Tickets",
            to: "/project-admin/internal-tickets",
          },
          {
            component: CNavItem,
            name: "ServiceTickets Fault",
            to: "/project-admin/serviceticket-fault/service-tickets-fault-dashboard",
          },
        ],
      },

      // ✅ GROUP 3: Operations
      {
        component: CNavGroup,
        name: "Operations",
        icon: (
          <CIcon
            icon={cilListRich}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Preventive Maintenance",
            to: "/project-admin/preventive-maintanance-dashboard",
          },
          {
            component: CNavItem,
            name: "Project Handover",
            to: "/project-admin/project-handover",
          },
          {
            component: CNavItem,
            name: "Micro Fiber Data",
            to: "/project-admin/micro-fiber-data",
          },
        ],
      },

      //robots-positioning
      // {
      //   component: CNavGroup,
      //   name: "Robots Tracking",
      //   icon: (
      //     <CIcon
      //       icon={cilWrapText}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      //   items: [
      //     {
      //       component: CNavItem,
      //       name: "Robots Position Tracking",
      //       to: "/project-admin/robots-position",
      //     },
      //   ],
      // },

      // ✅ GROUP 4: Robots
      {
        component: CNavGroup,
        name: "Robots Management",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Shift Robots",
            to: "/project-admin/robots/shift-block-wise",
          },
          {
            component: CNavItem,
            name: "Robot Commands",
            to: "/project-admin/robot-commands",
          },
          {
            component: CNavItem,
            name: "Weather Timer Notifications",
            to: "/project-admin/weather-timer-notifications",
          },
          {
            component: CNavItem,
            name: "Weather Data ",
            to: "/project-admin/weather-data-sitewise",
          },
        ],
      },

      {
        component: CNavGroup,
        name: "Opex Data",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Opex Dashboard",
            to: "/project-admin/opexdata",
          },
        ],
      },

      // ✅ GROUP 5: Users
      {
        component: CNavGroup,
        name: "Users Management",
        icon: (
          <CIcon
            icon={cilGroup}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Technician Attendance",
            to: "/project-admin/technician-attendance",
          },
          {
            component: CNavItem,
            name: "Users",
            to: "/project-admin/users",
          },
          {
            component: CNavItem,
            name: "User Performance",
            to: "/project-admin/user-performance-dashboard",
          },
        ],
      },

      // {
      //   component: CNavItem,
      //   name: "Monthly Sites Report",
      //   to: "/project-admin/monthlyreport",
      //   icon: (
      //     <CIcon
      //       icon={cilFactory}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      // },
      {
        component: CNavGroup,
        name: "Expense Management",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "View Expenses",
            to: "/project-admin/expenses",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "MIS Report",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "MIS Report",
            to: "/project-admin/mis-report",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "MDS Management",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "MDS Devices",
            to: "/project-admin/mds-devices",
          },

          {
            component: CNavItem,
            name: "Replace MDS Lora",
            to: "/project-admin/replace-mds-lora/active-mdss",
          },

          {
            component: CNavItem,
            name: "MDS Tracking",
            to: "/project-admin/mds-tracker",
          },
          {
            component: CNavItem,
            name: "MDS Timer",
            to: "/project-admin/mds-timer",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Chat with Console",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Chat with Console",
            to: "/project-admin/chat-with-console",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Material Management",
        icon: (
          <CIcon
            icon={cilStorage}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Material Requests",
            to: "/project-admin/material-requests",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Commissioning",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Dashboard",
            to: "/project-admin/commissioning",
          },
        ],
      },
    ],
  },

  //-------------------------------Project admin-----------------------------------------

  //-------------------------------Project User------------------------------------
  {
    component: CNavGroup,
    name: "Project User",
    to: "/base",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/project-user/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },

      // ✅ GROUP 1: Site Data
      {
        component: CNavGroup,
        name: "Site Data",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "All Clients",
            to: "/project-user/clients-dashboard",
          },
          {
            component: CNavItem,
            name: "All Site Data",
            to: "/project-user/all-site-data",
          },
          {
            component: CNavItem,
            name: "Site Management",
            to: "/project-user/site-management",
          },
          {
            component: CNavItem,
            name: "Cleaning Log",
            to: "/project-user/all-site-cleaning-log",
          },
          {
            component: CNavItem,
            name: "Timers",
            to: "/project-user/timers",
          },
          {
            component: CNavItem,
            name: "Gateways",
            to: "/project-user/all-site-gateways",
          },
          {
            component: CNavItem,
            name: "DPR",
            to: "/project-user/all-site-dpr",
          },
          {
            component: CNavItem,
            name: "Robot Battery Temperature",
            to: "/project-user/robot-battery-temperature",
          },
        ],
      },

      // ✅ GROUP 2: Tickets
      {
        component: CNavGroup,
        name: "Tickets",
        icon: (
          <CIcon
            icon={cilTask}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Service Tickets",
            to: "/project-user/service-tickets",
          },
          {
            component: CNavItem,
            name: "Internal Tickets",
            to: "/project-user/internal-tickets",
          },
          {
            component: CNavItem,
            name: "ServiceTickets Fault",
            to: "/project-user/serviceticket-fault/service-tickets-fault-dashboard",
          },
        ],
      },

      // ✅ GROUP 3: Operations
      {
        component: CNavGroup,
        name: "Operations",
        icon: (
          <CIcon
            icon={cilListRich}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Preventive Maintenance",
            to: "/project-user/preventive-maintanance-dashboard",
          },
          {
            component: CNavItem,
            name: "Project Handover",
            to: "/project-user/project-handover",
          },
          {
            component: CNavItem,
            name: "Micro Fiber Data",
            to: "/project-user/micro-fiber-data",
          },
        ],
      },

      // ✅ GROUP 4: Robots
      {
        component: CNavGroup,
        name: "Robots Management",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Shift Robots",
            to: "/project-user/robots/shift-block-wise",
          },
          {
            component: CNavItem,
            name: "Robot Commands",
            to: "/project-user/robot-commands",
          },
          {
            component: CNavItem,
            name: "Weather Timer Notifications",
            to: "/project-user/weather-timer-notifications",
          },
          {
            component: CNavItem,
            name: "Weather Data ",
            to: "/project-user/weather-data-sitewise",
          },
        ],
      },

      // ✅ GROUP 5: Users
      {
        component: CNavGroup,
        name: "Users Management",
        icon: (
          <CIcon
            icon={cilGroup}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Users",
            to: "/project-user/users",
          },
          {
            component: CNavItem,
            name: "Technician Attendance",
            to: "/project-user/technician-attendance",
          },
        ],
      },
      // {
      //   component: CNavItem,
      //   name: "Monthly Sites Report",
      //   to: "/project-user/monthlyreport",
      //   icon: (
      //     <CIcon
      //       icon={cilFactory}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      // },
      {
        component: CNavGroup,
        name: "Expense Management",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "View Expenses",
            to: "/project-user/expenses",
          },
        ],
      },
      // {
      //   component: CNavGroup,
      //   name: "Robots Tracking",
      //   icon: (
      //     <CIcon
      //       icon={cilWrapText}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      //   items: [
      //     {
      //       component: CNavItem,
      //       name: "Robots Position Tracking",
      //       to: "/project-user/robots-position",
      //     },
      //   ],
      // },
      //Opex Data
      {
        component: CNavGroup,
        name: "Opex Data",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Opex Dashboard",
            to: "/project-user/opexdata",
          },
        ],
      },

      {
        component: CNavGroup,
        name: "MDS Management",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "MDS Devices",
            to: "/project-user/mds-devices",
          },

          {
            component: CNavItem,
            name: "Replace MDS Lora",
            to: "/project-user/replace-mds-lora/active-mdss",
          },
          {
            component: CNavItem,
            name: "MDS Tracking",
            to: "/project-user/mds-tracker",
          },
          {
            component: CNavItem,
            name: "MDS Timer",
            to: "/project-user/mds-timer",
          },
        ],
      },
    ],
  },
  //-------------------------------Project User-----------------------------------------

  //---------------------------------service admin------------------------------------------
  {
    component: CNavGroup,
    name: "Service Admin",
    to: "/base",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/service-admin/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      //robots-positioning
      // {
      //   component: CNavGroup,
      //   name: "Robots Tracking",
      //   icon: (
      //     <CIcon
      //       icon={cilLocationPin}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      //   items: [
      //     {
      //       component: CNavItem,
      //       name: "Robots Tracking",
      //       to: "/service-admin/robots-tracker",
      //     },
      //   ],
      // },
      {
        component: CNavGroup,
        name: "Live Tracking",
        icon: (
          <CIcon
            icon={cilLocationPin}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          // {
          //   component: CNavItem,
          //   name: "Robots Position Tracking",
          //   to: "/master-admin/robots-position",
          // },
          {
            component: CNavItem,
            name: "Robot Tracking",
            to: "/service-admin/robots-tracker",
          },
          {
            component: CNavItem,
            name: "MDS Tracking",
            to: "/service-admin/mds-tracker",
          },
        ],
      },

      // === Site Management Group ===
      {
        component: CNavGroup,
        name: "Site Management",
        to: "/service-admin/site-management",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "All Site Data",
            to: "/service-admin/all-site-data",
          },
          {
            component: CNavItem,
            name: "Site Management",
            to: "/service-admin/site-management",
          },
          {
            component: CNavItem,
            name: "All Clients",
            to: "/service-admin/clients-dashboard",
          },
          {
            component: CNavItem,
            name: "Gateways",
            to: "/service-admin/all-site-gateways",
          },
        ],
      },

      //robots-positioning
      // {
      //   component: CNavGroup,
      //   name: "Robots Tracking",
      //   icon: (
      //     <CIcon
      //       icon={cilWrapText}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      //   items: [
      //     {
      //       component: CNavItem,
      //       name: "Robots Position Tracking",
      //       to: "/service-admin/robots-position",
      //     },
      //   ],
      // },

      // === Robot Management Group ===
      {
        component: CNavGroup,
        name: "Robot Management",
        to: "/service-admin/search-robot",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Shift Robots",
            to: "/service-admin/robots/shift-block-wise",
          },
          {
            component: CNavItem,
            name: "Cleaning Log",
            to: "/service-admin/all-site-cleaning-log",
          },
          {
            component: CNavItem,
            name: "Timers",
            to: "/service-admin/timers",
          },
          {
            component: CNavItem,
            name: "DPR",
            to: "/service-admin/all-site-dpr",
          },
          {
            component: CNavItem,
            name: "Robot Battery Temperature",
            to: "/service-admin/robot-battery-temperature",
          },
          {
            component: CNavItem,
            name: "Robot Commands",
            to: "/service-admin/robot-commands",
          },
          {
            component: CNavItem,
            name: "Weather Timer Notifications",
            to: "/service-admin/weather-timer-notifications",
          },
          {
            component: CNavItem,
            name: "Weather Data ",
            to: "/service-admin/weather-data-sitewise",
          },
        ],
      },

      //Expense Management
      {
        component: CNavGroup,
        name: "Expense Management",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "View Expenses",
            to: "/service-admin/expenses",
          },
        ],
      },
      // === Project & Maintenance Group ===
      {
        component: CNavGroup,
        name: "Project & Maintenance",
        to: "/service-admin/project-handover",
        icon: (
          <CIcon
            icon={cilCheckCircle}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Project Handover",
            to: "/service-admin/project-handover",
          },
          {
            component: CNavItem,
            name: "Preventive Maintenance",
            to: "/service-admin/preventive-maintanance-dashboard",
          },
          {
            component: CNavItem,
            name: "Micro Fiber Data",
            to: "/service-admin/micro-fiber-data",
          },
        ],
      },

      {
        component: CNavGroup,
        name: "Opex Data",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Opex Dashboard",
            to: "/service-admin/opexdata",
          },
        ],
      },

      // === Inventory Group ===
      {
        component: CNavItem,
        name: "Service Inventory",
        to: "/service-admin/inventories",
        icon: (
          <CIcon
            icon={cilStorage}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },

      // === Tickets Group ===
      {
        component: CNavGroup,
        name: "Tickets",
        to: "/service-admin/service-tickets",
        icon: (
          <CIcon
            icon={cilTask}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Service Tickets",
            to: "/service-admin/service-tickets",
          },
          {
            component: CNavItem,
            name: "Client Tickets",
            to: "/service-admin/client-tickets",
          },
          {
            component: CNavItem,
            name: "Internal Tickets",
            to: "/service-admin/internal-tickets",
          },
          {
            component: CNavItem,
            name: "ServiceTickets Fault",
            to: "/service-admin/serviceticket-fault/service-tickets-fault-dashboard",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Users Management",
        icon: (
          <CIcon
            icon={cilGroup}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Technician Attendance",
            to: "/service-admin/technician-attendance",
          },
          {
            component: CNavItem,
            name: "User Performance",
            to: "/service-admin/user-performance-dashboard",
          },
          {
            component: CNavItem,
            name: "Users",
            to: "/service-admin/users",
          },
          {
            component: CNavItem,
            name: "Chat",
            to: "/service-admin/chat",
          },
        ],
      },
      // {
      //   component: CNavItem,
      //   name: "Monthly Sites Report",
      //   to: "/service-admin/monthlyreport",
      //   icon: (
      //     <CIcon
      //       icon={cilFactory}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      // },
      {
        component: CNavItem,
        name: "MIS Report",
        to: "/service-admin/mis-report",
        icon: (
          <CIcon
            icon={cilFactory}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavGroup,
        name: "MDS Management",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "MDS Devices",
            to: "/service-admin/mds-devices",
          },

          {
            component: CNavItem,
            name: "Replace MDS Lora",
            to: "/service-admin/replace-mds-lora/active-mdss",
          },
          // {
          //   component: CNavItem,
          //   name: "MDS Tracking",
          //   to: "/service-admin/mds-tracker",
          // },
          {
            component: CNavItem,
            name: "MDS Timer",
            to: "/service-admin/mds-timer",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Chat with Console",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Chat with Console",
            to: "/service-admin/chat-with-console",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Material Management",
        icon: (
          <CIcon
            icon={cilStorage}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Material Requests",
            to: "/service-admin/material-requests",
          },
        ],
      },
      // /service-admin/statistics
      {
        component: CNavGroup,
        name: "Statistics",
        icon: (
          <CIcon
            icon={cilGraph}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Statistics",
            to: "/service-admin/statistics",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Commissioning",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Dashboard",
            to: "/service-admin/commissioning",
          },
        ],
      },
    ],
  },

  //---------------------------------service admin---------------------------------------------

  //---------------------------------Taypro Site Techncian ---------------------------------------------
  {
    component: CNavGroup,
    name: "Site Technician",
    to: "/base",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/site-technician/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },

      {
        component: CNavItem,
        name: "Robot Commands",
        to: "/site-technician/robot-commands",
        icon: (
          <CIcon
            icon={cilCursor}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },

      // Site Management Module
      {
        component: CNavGroup,
        name: "Site Management",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "All Site Data",
            to: "/site-technician/all-site-data",
          },
          {
            component: CNavItem,
            name: "Site Management",
            to: "/site-technician/site-management",
          },
          {
            component: CNavItem,
            name: "All Sites Timers",
            to: "/site-technician/timers",
          },
        ],
      },

      // Operation Module
      {
        component: CNavGroup,
        name: "Operations",
        icon: (
          <CIcon
            icon={cilListRich}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Cleaning Log",
            to: "/site-technician/cleaning-log-sites",
          },
          {
            component: CNavItem,
            name: "Micro Fiber Data",
            to: "/site-technician/micro-fiber-data",
          },
        ],
      },

      // Ticket & Report Module
      {
        component: CNavGroup,
        name: "Tickets & Reports",
        icon: (
          <CIcon
            icon={cilTask}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Service Tickets",
            to: "/site-technician/service-tickets",
          },
          {
            component: CNavItem,
            name: "DPR",
            to: "/site-technician/dpr",
          },
          {
            component: CNavItem,
            name: "User Performance",
            to: "/site-technician/user-performance",
          },
        ],
      },

      // Inventory & Maintenance Module
      {
        component: CNavGroup,
        name: "Inventory + Maintenance",
        icon: (
          <CIcon
            icon={cilStorage}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Inventory",
            to: "/site-technician/inventory",
          },
          {
            component: CNavItem,
            name: "Preventive Maintenance",
            to: "/site-technician/preventive-maintanance-dashboard",
          },
        ],
      },

      // Attendance Module
      {
        component: CNavGroup,
        name: "T. Attendance",
        icon: (
          <CIcon
            icon={cilCheck}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Punch In/Out",
            to: "/site-technician/punch-in-punch-out",
          },
          {
            component: CNavItem,
            name: " Attendance",
            to: "/site-technician/user-site-attendance",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Expense Management",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "View Expenses",
            to: "/site-technician/expenses",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Robots Tracking",
        icon: (
          <CIcon
            icon={cilLocationPin}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Tracking",
            to: "/site-technician/robots-tracker",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Row Data",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "View Row Data",
            to: "/site-technician/update-row-data",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Material Management",
        icon: (
          <CIcon
            icon={cilStorage}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Material Requests",
            to: "/site-technician/material-requests",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Chat with Console",
        icon: (
          <CIcon
            icon={cilCheck}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Chat",
            to: "/site-technician/chat-with-console",
          },
        ],
      },
    ],
  },

  //---------------------------------Taypro Site Techncian ---------------------------------------------

  //---------------------------------service User---------------------------------------------
  // {
  //   component: CNavGroup,
  //   name: "Service User",
  //   to: "/base",
  //   icon: (
  //     <CIcon
  //       icon={cilPuzzle}
  //       customClassName="nav-icon"
  //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //     />
  //   ),
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Dashboard",
  //       to: "/service-admin/dashboard",
  //       icon: (
  //         <CIcon
  //           icon={cilSpeedometer}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //     },

  //     {
  //       component: CNavTitle,
  //       name: "Theme",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Colors",
  //       to: "/theme/colors",
  //       icon: (
  //         <CIcon
  //           icon={cilDrop}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Typography",
  //       to: "/theme/typography",
  //       icon: (
  //         <CIcon
  //           icon={cilPencil}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //     },
  //     {
  //       component: CNavTitle,
  //       name: "Components",
  //     },
  //     {
  //       component: CNavGroup,
  //       name: "Base",
  //       to: "/base",
  //       icon: (
  //         <CIcon
  //           icon={cilPuzzle}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //       items: [
  //         {
  //           component: CNavItem,
  //           name: "Accordion",
  //           to: "/base/accordion",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Breadcrumb",
  //           to: "/base/breadcrumbs",
  //         },
  //         {
  //           component: CNavItem,
  //           name: (
  //             <React.Fragment>
  //               {"Calendar"}
  //               <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //             </React.Fragment>
  //           ),
  //           to: "https://coreui.io/react/docs/components/calendar/",
  //           badge: {
  //             color: "danger",
  //             text: "PRO",
  //           },
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Cards",
  //           to: "/base/cards",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Carousel",
  //           to: "/base/carousels",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Collapse",
  //           to: "/base/collapses",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "List group",
  //           to: "/base/list-groups",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Navs & Tabs",
  //           to: "/base/navs",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Pagination",
  //           to: "/base/paginations",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Placeholders",
  //           to: "/base/placeholders",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Popovers",
  //           to: "/base/popovers",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Progress",
  //           to: "/base/progress",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Smart Pagination",
  //           to: "https://coreui.io/react/docs/components/smart-pagination/",
  //           badge: {
  //             color: "danger",
  //             text: "PRO",
  //           },
  //         },
  //         {
  //           component: CNavItem,
  //           name: (
  //             <React.Fragment>
  //               {"Smart Table"}
  //               <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //             </React.Fragment>
  //           ),
  //           to: "https://coreui.io/react/docs/components/smart-table/",
  //           badge: {
  //             color: "danger",
  //             text: "PRO",
  //           },
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Spinners",
  //           to: "/base/spinners",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Tables",
  //           to: "/base/tables",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Tabs",
  //           to: "/base/tabs",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Tooltips",
  //           to: "/base/tooltips",
  //         },
  //         {
  //           component: CNavItem,
  //           name: (
  //             <React.Fragment>
  //               {"Virtual Scroller"}
  //               <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //             </React.Fragment>
  //           ),
  //           to: "https://coreui.io/react/docs/components/virtual-scroller/",
  //           badge: {
  //             color: "danger",
  //             text: "PRO",
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       component: CNavGroup,
  //       name: "Buttons",
  //       to: "/buttons",
  //       icon: (
  //         <CIcon
  //           icon={cilCursor}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //       items: [
  //         {
  //           component: CNavItem,
  //           name: "Buttons",
  //           to: "/buttons/buttons",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Buttons groups",
  //           to: "/buttons/button-groups",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Dropdowns",
  //           to: "/buttons/dropdowns",
  //         },
  //         {
  //           component: CNavItem,
  //           name: (
  //             <React.Fragment>
  //               {"Loading Button"}
  //               <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //             </React.Fragment>
  //           ),
  //           to: "https://coreui.io/react/docs/components/loading-button/",
  //           badge: {
  //             color: "danger",
  //             text: "PRO",
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       component: CNavGroup,
  //       name: "Forms",
  //       icon: (
  //         <CIcon
  //           icon={cilNotes}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //       items: [
  //         {
  //           component: CNavItem,
  //           name: "Form Control",
  //           to: "/forms/form-control",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Select",
  //           to: "/forms/select",
  //         },
  //         {
  //           component: CNavItem,
  //           name: (
  //             <React.Fragment>
  //               {"Multi Select"}
  //               <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //             </React.Fragment>
  //           ),
  //           to: "https://coreui.io/react/docs/forms/multi-select/",
  //           badge: {
  //             color: "danger",
  //             text: "PRO",
  //           },
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Checks & Radios",
  //           to: "/forms/checks-radios",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Range",
  //           to: "/forms/range",
  //         },
  //         {
  //           component: CNavItem,
  //           name: (
  //             <React.Fragment>
  //               {"Range Slider"}
  //               <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //             </React.Fragment>
  //           ),
  //           to: "https://coreui.io/react/docs/forms/range-slider/",
  //           badge: {
  //             color: "danger",
  //             text: "PRO",
  //           },
  //         },
  //         {
  //           component: CNavItem,
  //           name: (
  //             <React.Fragment>
  //               {"Rating"}
  //               <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //             </React.Fragment>
  //           ),
  //           to: "https://coreui.io/react/docs/forms/rating/",
  //           badge: {
  //             color: "danger",
  //             text: "PRO",
  //           },
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Input Group",
  //           to: "/forms/input-group",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Floating Labels",
  //           to: "/forms/floating-labels",
  //         },
  //         {
  //           component: CNavItem,
  //           name: (
  //             <React.Fragment>
  //               {"Date Picker"}
  //               <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //             </React.Fragment>
  //           ),
  //           to: "https://coreui.io/react/docs/forms/date-picker/",
  //           badge: {
  //             color: "danger",
  //             text: "PRO",
  //           },
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Date Range Picker",
  //           to: "https://coreui.io/react/docs/forms/date-range-picker/",
  //           badge: {
  //             color: "danger",
  //             text: "PRO",
  //           },
  //         },
  //         {
  //           component: CNavItem,
  //           name: (
  //             <React.Fragment>
  //               {"Time Picker"}
  //               <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //             </React.Fragment>
  //           ),
  //           to: "https://coreui.io/react/docs/forms/time-picker/",
  //           badge: {
  //             color: "danger",
  //             text: "PRO",
  //           },
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Layout",
  //           to: "/forms/layout",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Validation",
  //           to: "/forms/validation",
  //         },
  //       ],
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Charts",
  //       to: "/charts",
  //       icon: (
  //         <CIcon
  //           icon={cilChartPie}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //     },
  //     {
  //       component: CNavGroup,
  //       name: "Icons",
  //       icon: (
  //         <CIcon
  //           icon={cilStar}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //       items: [
  //         {
  //           component: CNavItem,
  //           name: "CoreUI Free",
  //           to: "/icons/coreui-icons",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "CoreUI Flags",
  //           to: "/icons/flags",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "CoreUI Brands",
  //           to: "/icons/brands",
  //         },
  //       ],
  //     },
  //     {
  //       component: CNavGroup,
  //       name: "Notifications",
  //       icon: (
  //         <CIcon
  //           icon={cilBell}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //       items: [
  //         {
  //           component: CNavItem,
  //           name: "Alerts",
  //           to: "/notifications/alerts",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Badges",
  //           to: "/notifications/badges",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Modal",
  //           to: "/notifications/modals",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Toasts",
  //           to: "/notifications/toasts",
  //         },
  //       ],
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Widgets",
  //       to: "/widgets",
  //       icon: (
  //         <CIcon
  //           icon={cilCalculator}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //       badge: {
  //         color: "info",
  //         text: "DONE",
  //       },
  //     },
  //     {
  //       component: CNavTitle,
  //       name: "Extras",
  //     },
  //     {
  //       component: CNavGroup,
  //       name: "Pages",
  //       icon: (
  //         <CIcon
  //           icon={cilStar}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //       items: [
  //         {
  //           component: CNavItem,
  //           name: "Login",
  //           to: "/login",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Register",
  //           to: "/register",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Error 404",
  //           to: "/404",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Error 500",
  //           to: "/500",
  //         },
  //       ],
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Docs",
  //       to: "https://coreui.io/react/docs/templates/installation/",
  //       icon: (
  //         <CIcon
  //           icon={cilDescription}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //     },
  //   ],
  // },
  {
    component: CNavGroup,
    name: "Service User",
    to: "/base",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/service-user/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },

      // === Site Management Group ===
      {
        component: CNavGroup,
        name: "Site Management",
        to: "/service-user/site-management",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "All Site Data",
            to: "/service-user/all-site-data",
          },
          {
            component: CNavItem,
            name: "Site Management",
            to: "/service-user/site-management",
          },
          {
            component: CNavItem,
            name: "All Clients",
            to: "/service-user/clients-dashboard",
          },
          {
            component: CNavItem,
            name: "Gateways",
            to: "/service-user/all-site-gateways",
          },
          // {
          //   component: CNavItem,
          //   name: "Users",
          //   to: "/service-user/users",
          // },
        ],
      },
      {
        component: CNavGroup,
        name: "Users Management",
        icon: (
          <CIcon
            icon={cilGroup}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Technician Attendance",
            to: "/service-user/technician-attendance",
          },
          {
            component: CNavItem,
            name: "User Performance",
            to: "/service-user/user-performance-dashboard",
          },
          {
            component: CNavItem,
            name: "Users",
            to: "/service-user/users",
          },
          {
            component: CNavItem,
            name: "Chat",
            to: "/service-user/chat",
          },
        ],
      },

      // === Robot Management Group ===
      {
        component: CNavGroup,
        name: "Robot Management",
        to: "/service-user/search-robot",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          // {
          //   component: CNavItem,
          //   name: "Search Robot",
          //   to: "/service-user/search-robot",
          // },
          // Exclude "Shift Robots"
          {
            component: CNavItem,
            name: "Cleaning Log",
            to: "/service-user/all-site-cleaning-log",
          },
          {
            component: CNavItem,
            name: "Timers",
            to: "/service-user/timers",
          },
          {
            component: CNavItem,
            name: "DPR",
            to: "/service-user/all-site-dpr",
          },
          {
            component: CNavItem,
            name: "Robot Battery Temperature",
            to: "/service-user/robot-battery-temperature",
          },
          {
            component: CNavItem,
            name: "Robot Commands",
            to: "/service-user/robot-commands",
          },
          {
            component: CNavItem,
            name: "Weather Timer Notifications",
            to: "/service-user/weather-timer-notifications",
          },
          {
            component: CNavItem,
            name: "Weather Data ",
            to: "/service-user/weather-data-sitewise",
          },
        ],
      },
      //Expense Management
      {
        component: CNavGroup,
        name: "Expense Management",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "View Expenses",
            to: "/service-user/expenses",
          },
        ],
      },
      // === Project & Maintenance Group ===
      {
        component: CNavGroup,
        name: "Project & Maintenance",
        to: "/service-user/project-handover",
        icon: (
          <CIcon
            icon={cilCheckCircle}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Project Handover",
            to: "/service-user/project-handover",
          },
          {
            component: CNavItem,
            name: "Preventive Maintenance",
            to: "/service-user/preventive-maintanance-dashboard",
          },
        ],
      },

      // === Inventory ===
      {
        component: CNavItem,
        name: "Service Inventory",
        to: "/service-user/inventories",
        icon: (
          <CIcon
            icon={cilStorage}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      //opex Data
      {
        component: CNavGroup,
        name: "Opex Data",
        icon: (
          <CIcon
            icon={cilMoney}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Opex Dashboard",
            to: "/service-user/opexdata",
          },
        ],
      },
      // === Tickets ===
      {
        component: CNavGroup,
        name: "Tickets",
        to: "/service-user/service-tickets",
        icon: (
          <CIcon
            icon={cilTask}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Service Tickets",
            to: "/service-user/service-tickets",
          },
          {
            component: CNavItem,
            name: "Internal Tickets",
            to: "/service-user/internal-tickets",
          },
          {
            component: CNavItem,
            name: "ServiceTickets Fault",
            to: "/service-user/serviceticket-fault/service-tickets-fault-dashboard",
          },
        ],
      },

      // === Attendance ===
      // {
      //   component: CNavItem,
      //   name: "Technician Attendance",
      //   to: "/service-user/technician-attendance",
      //   icon: (
      //     <CIcon
      //       icon={cilTask}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      // },

      // {
      //   component: CNavItem,
      //   name: "Monthly Sites Report",
      //   to: "/service-user/monthlyreport",
      //   icon: (
      //     <CIcon
      //       icon={cilFactory}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      // },
      {
        component: CNavGroup,
        name: "MDS Management",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "MDS Devices",
            to: "/service-user/mds-devices",
          },

          {
            component: CNavItem,
            name: "Replace MDS Lora",
            to: "/service-user/replace-mds-lora/active-mdss",
          },
          // {
          //   component: CNavItem,
          //   name: "MDS Tracking",
          //   to: "/service-user/mds-tracker",
          // },
          {
            component: CNavItem,
            name: "MDS Timer",
            to: "/service-user/mds-timer",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Live Tracking",
        icon: (
          <CIcon
            icon={cilLocationPin}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          // {
          //   component: CNavItem,
          //   name: "Robots Position Tracking",
          //   to: "/master-admin/robots-position",
          // },
          {
            component: CNavItem,
            name: "Robot Tracking",
            to: "/service-user/robots-tracker",
          },
          {
            component: CNavItem,
            name: "MDS Tracking",
            to: "/service-user/mds-tracker",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Material Management",
        icon: (
          <CIcon
            icon={cilStorage}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Material Requests",
            to: "/service-user/material-requests",
          },
        ],
      },
      // {
      //   component: CNavItem,
      //   name: "Expense Management",
      //   to: "/service-user/expenses",
      //   icon: (
      //     <CIcon
      //       icon={cilDollar}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      // },
    ],
  },

  //---------------------------------service User---------------------------------------------

  //-------------------------------client admin------------------------------------

  // {
  //   component: CNavGroup,
  //   name: "Client Admin",
  //   to: "/base",
  //   icon: (
  //     <CIcon
  //       icon={cilPuzzle}
  //       customClassName="nav-icon"
  //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //     />
  //   ),
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Dashboard",
  //       to: "/client-admin/dashboard",
  //       icon: (
  //         // <CIcon
  //         //   icon={<Gauge />}
  //         // customClassName="nav-icon"
  //         // style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         // />
  //         <CircleGauge
  //           customClassName="nav-icon"
  //           style={{ height: "20px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Statistics",
  //       to: "/client-admin/statistics",
  //       icon: (
  //         // <CIcon
  //         //   icon={cilBarChart}
  //         // customClassName="nav-icon"
  //         // style={{ height: "20px", color: "rgb(57, 214, 0)" }}
  //         // />
  //         <ChartNoAxesCombined
  //           customClassName="nav-icon"
  //           style={{ height: "20px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //       subscriptionIcon: (
  //         // <CIcon
  //         //   icon={cilDiamond}
  //         //   style={{
  //         //     height: "18px",
  //         //     width: "18px",
  //         //     color: "yellow",
  //         //   }}
  //         // />
  //         <Crown
  //           style={{
  //             height: "18px",
  //             width: "18px",
  //             color: "yellow",
  //           }}
  //         />
  //       ),
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Robot Commands",
  //       to: "/client-admin/robot-commands",
  //       icon: (
  //         // <CIcon
  //         //   icon={cilCursor}
  //         // customClassName="nav-icon"
  //         // style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         // />
  //         <SquareTerminal
  //           customClassName="nav-icon"
  //           style={{ height: "20px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Tickets",
  //       to: "/client-admin/clientadmin-client-ticket",
  //       icon: (
  //         // <CIcon
  //         //   icon={cilNoteAdd}
  //         // customClassName="nav-icon"
  //         // style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         // />
  //         <Tags
  //           customClassName="nav-icon"
  //           style={{ height: "20px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //     },

  //     // Group: Site Management
  //     {
  //       component: CNavGroup,
  //       name: "Sites",
  //       icon: (
  //         <CIcon
  //           icon={cilBuilding}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //       items: [
  //         {
  //           component: CNavItem,
  //           name: "All Site Data",
  //           to: "/client-admin/site-management/all-site-data",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Site Management",
  //           to: "/client-admin/site-management",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "All Sites Timers",
  //           to: "/client-admin/timers",
  //         },
  //       ],
  //     },

  //     // Group: Maintenance & Logs
  //     {
  //       component: CNavGroup,
  //       name: "Maintenance & Logs",
  //       icon: (
  //         // <CIcon
  //         // icon={cilCalendarCheck}
  //         // customClassName="nav-icon"
  //         // style={{ height: "30px", color: "rgb(57, 214, 0)" }}

  //         // />
  //         <Wrench
  //           customClassName="nav-icon"
  //           style={{ height: "20px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //       items: [
  //         {
  //           component: CNavItem,
  //           name: "Prev. Maintenance",
  //           to: "/client-admin/preventive-maintenance-dashboard",
  //           subscriptionIcon: (
  //             // <CIcon
  //             //   icon={cilDiamond}
  //             //   style={{
  //             //     height: "18px",
  //             //     width: "18px",
  //             //     color: "yellow",
  //             //   }}
  //             // />
  //             <Crown
  //               style={{
  //                 height: "18px",
  //                 width: "18px",
  //                 color: "yellow",
  //               }}
  //             />
  //           ),
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Cleaning Log",
  //           to: "/client-admin/cleaning-log-sites",
  //         },
  //       ],
  //     },

  //     //robots-positioning
  //     {
  //       component: CNavGroup,
  //       name: "Live Tracking",
  //       icon: (
  //         <CIcon
  //           icon={cilLocationPin}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //       items: [
  //         {
  //           component: CNavItem,
  //           name: "Robots Tracking",
  //           to: "/client-admin/robots-tracking",
  //           subscriptionIcon: (
  //             // <CIcon
  //             //   icon={cilDiamond}
  //             //   style={{
  //             //     height: "18px",
  //             //     width: "18px",
  //             //     color: "yellow",
  //             //   }}
  //             // />
  //             <Crown
  //               style={{
  //                 height: "18px",
  //                 width: "18px",
  //                 color: "yellow",
  //               }}
  //             />
  //           ),
  //         },
  //         {
  //           component: CNavItem,
  //           name: "MDS Tracking",
  //           to: "/client-admin/mds-tracker",
  //         },
  //       ],
  //     },

  //     // Group: Users & Communication
  //     {
  //       component: CNavGroup,
  //       name: "Users & Communication",
  //       icon: (
  //         <CIcon
  //           icon={cilGroup}
  //           // customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //       items: [
  //         {
  //           component: CNavItem,
  //           name: "User Management",
  //           to: "/client-admin/external-users",
  //         },
  //         {
  //           component: CNavItem,
  //           name: "Live Chat",
  //           to: "/client-admin/chat",
  //           subscriptionIcon: (
  //             // <CIcon
  //             //   icon={cilDiamond}
  //             //   style={{
  //             //     height: "18px",
  //             //     width: "18px",
  //             //     color: "yellow",
  //             //   }}
  //             // />
  //             <Crown
  //               style={{
  //                 height: "18px",
  //                 width: "18px",
  //                 color: "yellow",
  //               }}
  //             />
  //           ),
  //         },
  //       ],
  //     },
  //     {
  //       component: CNavGroup,
  //       name: " Robot Commissioning",
  //       icon: (
  //         <CIcon
  //           icon={cilSettings}
  //           customClassName="nav-icon"
  //           style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //         />
  //       ),
  //       items: [
  //         {
  //           component: CNavItem,
  //           name: "Dashboard",
  //           to: "/client-admin/commissioning", // ✅ FIXED
  //         },
  //       ],
  //     },

  //     // {
  //     //   component: CNavGroup,
  //     //   name: "MDS Tracking",
  //     //   icon: (
  //     //     <CIcon
  //     //       icon={cilLocationPin}
  //     //       customClassName="nav-icon"
  //     //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //     //     />
  //     //   ),
  //     //   items: [
  //     //     {
  //     //       component: CNavItem,
  //     //       name: "MDS Tracking",
  //     //       to: "/client-admin/mds-tracker",
  //     //     },
  //     //   ],
  //     // },

  //     // {
  //     //   component: CNavGroup,
  //     //   name: "Subscription",
  //     //   icon: (
  //     //     <CIcon
  //     //       icon={cilMoney}
  //     //       customClassName="nav-icon"
  //     //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //     //     />
  //     //   ),
  //     //   items: [
  //     //     {
  //     //       component: CNavItem,
  //     //       name: "My Subscriptions",
  //     //       to: "/client-admin/subscriptions",
  //     //     },
  //     //   ],
  //     // },

  //     // {
  //     //   component: CNavItem,
  //     //   name: "Monthly Sites Report",
  //     //   to: "/client-admin/monthlyreport",
  //     //   icon: (
  //     //     <CIcon
  //     //       icon={cilFactory}
  //     //       customClassName="nav-icon"
  //     //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
  //     //     />
  //     //   ),
  //     //   subscriptionIcon: (
  //     //     <CIcon
  //     //       icon={cilDiamond}
  //     //       style={{
  //     //         height: "18px",
  //     //         width: "18px",
  //     //         color: "yellow",
  //     //       }}
  //     //     />
  //     //   ),
  //     // },
  //   ],
  // },

  {
    component: CNavGroup,
    name: "Client Admin",
    to: "/base",
    icon: (
      <LayoutDashboard
        size={22}
        customClassName="nav-icon"
        style={{ color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Overview",
        to: "/client-admin/dashboard",
        icon: (
          <LayoutDashboard
            customClassName="nav-icon"
            size={18}
            style={{ height: "20px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "Analytics",
        to: "/client-admin/statistics",
        icon: <BarChart3 size={18} style={{ color: "rgb(57, 214, 0)" }} />,
        subscriptionIcon: <Gem size={16} style={{ color: "yellow" }} />,
      },
      {
        component: CNavItem,
        name: "Command Center",
        to: "/client-admin/robot-commands",
        icon: <Terminal size={18} style={{ color: "rgb(57, 214, 0)" }} />,
      },
      {
        component: CNavItem,
        name: "Support Tickets",
        to: "/client-admin/clientadmin-client-ticket",
        icon: <Ticket size={18} style={{ color: "rgb(57, 214, 0)" }} />,
      },

      // 🏢 Site Operations
      {
        component: CNavGroup,
        name: "Site Operations",
        icon: <Building2 size={20} style={{ color: "rgb(57, 214, 0)" }} />,
        items: [
          {
            component: CNavItem,
            name: "Site Insights",
            to: "/client-admin/site-management/all-site-data",
            icon: <Database style={{ color: "rgb(57, 214, 0)" }} size={16} />,
          },
          {
            component: CNavItem,
            name: "Manage Sites",
            to: "/client-admin/site-management",
            icon: <Settings2 style={{ color: "rgb(57, 214, 0)" }} size={16} />,
          },
          {
            component: CNavItem,
            name: "Schedules",
            to: "/client-admin/timers",
            icon: <Clock style={{ color: "rgb(57, 214, 0)" }} size={16} />,
          },
        ],
      },

      // 🛠 Maintenance
      {
        component: CNavGroup,
        name: "Maintenance",
        icon: <Wrench size={20} style={{ color: "rgb(57, 214, 0)" }} />,
        items: [
          {
            component: CNavItem,
            name: "Prev. Maintenance",
            to: "/client-admin/preventive-maintenance-dashboard",
            icon: (
              <ShieldCheck style={{ color: "rgb(57, 214, 0)" }} size={16} />
            ),
            subscriptionIcon: <Gem size={16} style={{ color: "yellow" }} />,
          },
          {
            component: CNavItem,
            name: "Cleaning History",
            to: "/client-admin/cleaning-log-sites",
            icon: (
              <ClipboardList style={{ color: "rgb(57, 214, 0)" }} size={16} />
            ),
          },
        ],
      },

      // 📍 Tracking
      {
        component: CNavGroup,
        name: "Tracking",
        icon: <Map size={20} style={{ color: "rgb(57, 214, 0)" }} />,
        items: [
          {
            component: CNavItem,
            name: "Robot Tracking",
            to: "/client-admin/robots-tracking",
            icon: <Navigation size={16} style={{ color: "rgb(57, 214, 0)" }} />,
            subscriptionIcon: <Gem size={16} style={{ color: "yellow" }} />,
          },
          {
            component: CNavItem,
            name: "MDS Monitor",
            to: "/client-admin/mds-tracker",
            icon: <Radar size={16} style={{ color: "rgb(57, 214, 0)" }} />,
          },
        ],
      },

      // 👥 Users
      {
        component: CNavGroup,
        name: "Users & Messaging",
        icon: <Users size={20} style={{ color: "rgb(57, 214, 0)" }} />,
        items: [
          {
            component: CNavItem,
            name: "Manage Users",
            to: "/client-admin/external-users",
            icon: <UserCog size={16} style={{ color: "rgb(57, 214, 0)" }} />,
          },
          {
            component: CNavItem,
            name: "Chat",
            to: "/client-admin/chat",
            icon: (
              <MessageSquare size={16} style={{ color: "rgb(57, 214, 0)" }} />
            ),
            subscriptionIcon: <Gem size={16} style={{ color: "yellow" }} />,
          },
        ],
      },

      // ⚙️ Deployment
      {
        component: CNavGroup,
        name: "Deployment",
        icon: <Settings size={20} style={{ color: "rgb(57, 214, 0)" }} />,
        items: [
          {
            component: CNavItem,
            name: "Overview",
            to: "/client-admin/commissioning",
            icon: (
              <LayoutDashboard style={{ color: "rgb(57, 214, 0)" }} size={16} />
            ),
          },
        ],
      },
    ],
  },

  //-------------------------------client admin-----------------------------------------

  // ---------------------site Incharge----------------------------------
  {
    component: CNavGroup,
    name: "Site Incharge",
    to: "/base",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/site-incharge/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavGroup,
        name: "Sites",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "All Site Data",
            to: "/site-incharge/site-management/all-site-data",
            // icon: (
            //   <CIcon
            //     icon={cilFactory}
            //     customClassName="nav-icon"
            //     style={{ height: "30px", color: "rgb(57, 214, 0)" }}
            //   />
            // ),
          },
          {
            component: CNavItem,
            name: "Site Management",
            to: "/site-incharge/site-management",
            // icon: (
            //   <CIcon
            //     icon={cilBuilding}
            //     customClassName="nav-icon"
            //     style={{ height: "30px", color: "rgb(57, 214, 0)" }}
            //   />
            // ),
          },
          {
            component: CNavItem,
            name: "All Sites Timers",
            to: "/site-incharge/timers",
            // icon: (
            //   <CIcon
            //     icon={cilClock}
            //     customClassName="nav-icon"
            //     style={{ height: "30px", color: "rgb(57, 214, 0)" }}
            //   />
            // ),
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Maintenance & Logs",
        icon: (
          <CIcon
            icon={cilListRich}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Cleaning Log",
            to: "/site-incharge/cleaning-log-sites",
            // icon: (
            //   <CIcon
            //     icon={cilListRich}
            //     customClassName="nav-icon"
            //     style={{ height: "30px", color: "rgb(57, 214, 0)" }}
            //   />
            // ),
          },
        ],
      },
      {
        component: CNavItem,
        name: "Robot Commands",
        to: "/site-incharge/robot-commands",
        icon: (
          <CIcon
            icon={cilCursor}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      // {
      //   component: CNavItem,
      //   name: "Search Robot",
      //   to: "/site-incharge/search-robot",
      //   icon: (
      //     <CIcon
      //       icon={cilSearch}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      // },
    ],
  },

  // ---------------------site Incharge----------------------------------

  // ---------------------Client Site Technician----------------------------------
  {
    component: CNavGroup,
    name: "Client Site Technician",
    to: "/base",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/client-site-technician/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavGroup,
        name: "Sites",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "All Site Data",
            to: "/client-site-technician/site-management/all-site-data",
          },
          {
            component: CNavItem,
            name: "Site Management",
            to: "/client-site-technician/site-management",
          },
          {
            component: CNavItem,
            name: "All Sites Timers",
            to: "/client-site-technician/timers",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Maintenance & Logs",
        icon: (
          <CIcon
            icon={cilListRich}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Cleaning Log",
            to: "/client-site-technician/cleaning-log-sites",
            // icon: (
            //   <CIcon
            //     icon={cilListRich}
            //     customClassName="nav-icon"
            //     style={{ height: "30px", color: "rgb(57, 214, 0)" }}
            //   />
            // ),
          },
        ],
      },
      {
        component: CNavItem,
        name: "Robot Commands",
        to: "/client-site-technician/robot-commands",
        icon: (
          <CIcon
            icon={cilCursor}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      // {
      //   component: CNavItem,
      //   name: "Search Robot",
      //   to: "/client-site-technician/search-robot",
      //   icon: (
      //     <CIcon
      //       icon={cilSearch}
      //       customClassName="nav-icon"
      //       style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      //     />
      //   ),
      // },
      // {
      //   component: CNavItem,
      //   name: "Users",
      //   to: "/client-site-technician/external-users",
      //   icon: (
      //     <CIcon icon={cilSettings} customClassName="nav-icon" style={{ height: "30px" }} />
      //   ),
      //   badge: {
      //     color: "success",
      //     text: "DONE",
      //   },
      // },
    ],
  },

  // ---------------------Client technician----------------------------------

  // -------------------------opex client admin------------------------------
  // /opex-client-admin/my-opex-data

  {
    component: CNavGroup,
    name: "Opex Client Admin",
    to: "/opex-client-admin/dashboard",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavGroup,
        name: "Site Management",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Dashboard",
            to: "/opex-client-admin/dashboard",
          },
          {
            component: CNavItem,
            name: "Site data",
            to: "/opex-client-admin/my-opex-data",
          },
        ],
      },
    ],
  },
  // -------------------------opex client admin------------------------------

  // -----------------------------Opex Site Technician----------------------------
  {
    component: CNavGroup,
    name: "Opex Site Technician",
    to: "/opex-site-technician/dashboard",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/opex-site-technician/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "Site Data",
        to: "/opex-site-technician/my-opex-data",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavGroup,
        name: "Opex T. Attendance",
        icon: (
          <CIcon
            icon={cilCheck}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Punch In/Out",
            to: "/opex-site-technician/punch-in-punch-out",
          },
          {
            component: CNavItem,
            name: " Attendance",
            to: "/opex-site-technician/user-site-attendance",
          },
        ],
      },
    ],
  },

  // -----------------------------Opex Site Technician----------------------------

  // -----------------------sales admin--------------------------------------------------
  //

  {
    component: CNavGroup,
    name: "Sales Admin",
    to: "/sales-admin/dashboard",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/sales-admin/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "MIS Report",
        to: "/sales-admin/mis-report",
        icon: (
          <Proportions
            customClassName="nav-icon"
            style={{ height: "20px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
    ],
  },

  // -----------------------sales admin--------------------------------------------------

  // -----------------------Account Admin--------------------------------------------------
  {
    component: CNavGroup,
    name: "Accounts Admin",
    to: "/accounts-admin/dashboard",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/accounts-admin/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "MIS Report",
        to: "/accounts-admin/mis-report",
        icon: (
          <Proportions
            customClassName="nav-icon"
            style={{ height: "20px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
    ],
  },
  // -----------------------Account Admin--------------------------------------------------

  // -----------------------Supply Chain Admin--------------------------------------------------
  {
    component: CNavGroup,
    name: "Supply Chain And Logistics Admin",
    to: "/supply-chain-and-logistics-admin/dashboard",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/supply-chain-and-logistics-admin/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "MIS Report",
        to: "/supply-chain-and-logistics-admin/mis-report",
        icon: (
          <Proportions
            customClassName="nav-icon"
            style={{ height: "20px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
    ],
  },
  // ---------------------Supply Chain Admin--------------------------------------------------

  // -----------------------Research And Development And Product Development Admin-------------------------------------------------
  {
    component: CNavGroup,
    name: "Research And Development And Product Development Admin",
    to: "/research-and-development-and-product-development-admin/dashboard",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/research-and-development-and-product-development-admin/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "MIS Report",
        to: "/research-and-development-and-product-development-admin/mis-report",
        icon: (
          <Proportions
            customClassName="nav-icon"
            style={{ height: "20px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
    ],
  },
  // ------------------Research And Development And Product Development Admin-------------------------------------------

  // -----------------------HR and Admin-------------------------------------------------
  {
    component: CNavGroup,
    name: "Hr Admin",
    to: "/hr-admin/dashboard",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/hr-admin/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "MIS Report",
        to: "/hr-admin/mis-report",
        icon: (
          <Proportions
            customClassName="nav-icon"
            style={{ height: "20px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
    ],
  },
  // ------------------hr Admin-------------------------------------------

  // ---------------------Quality admin-------------------------------------------
  {
    component: CNavGroup,
    name: "Quality Admin",
    to: "/quality-admin/dashboard",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/quality-admin/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "MIS Report",
        to: "/quality-admin/mis-report",
        icon: (
          <Proportions
            customClassName="nav-icon"
            style={{ height: "20px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
    ],
  },
  // -----------------Quality Admin-------------------------------------------

  // --------------------production-and-operations admin-------------------------------------------
  {
    component: CNavGroup,
    name: "Production And Operations Admin",
    to: "/production-and-operations-admin/dashboard",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/production-and-operations-admin/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "MIS Report",
        to: "/production-and-operations-admin/mis-report",
        icon: (
          <Proportions
            customClassName="nav-icon"
            style={{ height: "20px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
    ],
  },
  // ----------------production-and-operations-admin Admin-------------------------------------------

  // --------------------factory admin-------------------------------------------
  {
    component: CNavGroup,
    name: "Factory Admin",
    to: "factory-admin/dashboard",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px", color: "rgb(57, 214, 0)" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/factory-admin/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
      },
      {
        component: CNavGroup,
        name: "MDS Management",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px", color: "rgb(57, 214, 0)" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "MDS Devices",
            to: "/factory-admin/mds-devices",
          },
        ],
      },
    ],
  },

  // ------------------factory admin--------------------------------------------
];

export default _nav;
