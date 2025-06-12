import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSettings,
  cilSpeedometer,
  cilFactory,
  cilStar,
  cilBuilding,
  cilSearch,
  cilCalendarCheck,
  cilTask,
  cilNoteAdd,
  cilStorage,
  cilCheckCircle,
  cilGroup,
  cilListRich,
  cilClock,
  cilCheck,
  cilChatBubble,
  cilBarChart,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

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
        style={{ height: "30px" }}
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
            style={{ height: "30px" }}
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
            style={{ height: "30px" }}
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
            style={{ height: "30px" }}
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
          {
            component: CNavItem,
            name: "ServiceTickets Fault",
            to: "/master-admin/serviceticket-fault/service-tickets-fault-dashboard",
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
            style={{ height: "30px" }}
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
            name: "Robot Log Details",
            to: "/master-admin/robot-log-details",
          },
          {
            component: CNavItem,
            name: "Robot Commands",
            to: "/master-admin/robot-commands",
          },
          {
            component: CNavItem,
            name: "Weather Timer Notifications",
            to: "/master-admin/weather-timer-notifications",
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
            style={{ height: "30px" }}
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
        ],
      },
      {
        component: CNavGroup,
        name: "Operations",
        icon: (
          <CIcon
            icon={cilListRich}
            customClassName="nav-icon"
            style={{ height: "30px" }}
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
            name: "Service Inventory",
            to: "/master-admin/inventories",
          },
          {
            component: CNavItem,
            name: "Project Handover",
            to: "/master-admin/project-handover",
          },
        ],
      },
    ],
  },
  // -----------------------------------master admin----------------------------------------

  //-------------------------------Project admin------------------------------------

  {
    component: CNavGroup,
    name: "Project Admin",
    to: "/base",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px" }}
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
            style={{ height: "30px" }}
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
            style={{ height: "30px" }}
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
            style={{ height: "30px" }}
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
            style={{ height: "30px" }}
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
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Search Robot",
            to: "/project-admin/search-robot",
          },
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
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Users",
            to: "/project-admin/users",
          },
          {
            component: CNavItem,
            name: "Technician Attendance",
            to: "/project-admin/technician-attendance",
          },
        ],
      },
    ],
  },

  //-------------------------------Project admin-----------------------------------------

  //---------------------------------service admin------------------------------------------
  {
    component: CNavGroup,
    name: "Service Admin",
    to: "/base",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px" }}
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
            style={{ height: "30px" }}
          />
        ),
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
            style={{ height: "30px" }}
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
          {
            component: CNavItem,
            name: "Users",
            to: "/service-admin/users",
          },
        ],
      },

      // === Robot Management Group ===
      {
        component: CNavGroup,
        name: "Robot Management",
        to: "/service-admin/search-robot",
        icon: (
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Search Robot",
            to: "/service-admin/search-robot",
          },
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
            style={{ height: "30px" }}
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
            style={{ height: "30px" }}
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
            style={{ height: "30px" }}
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

      // === Attendance Group ===
      {
        component: CNavItem,
        name: "Technician Attendance",
        to: "/service-admin/technician-attendance",
        icon: (
          <CIcon
            icon={cilTask}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
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
        style={{ height: "30px" }}
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
            style={{ height: "30px" }}
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
            style={{ height: "30px" }}
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
            style={{ height: "30px" }}
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
            name: "Search Robot",
            to: "/site-technician/search-robot",
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
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Cleaning Log",
            to: "/site-technician/cleaning-log-sites",
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
            style={{ height: "30px" }}
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
        ],
      },

      // Inventory & Maintenance Module
      {
        component: CNavGroup,
        name: "Inventory & Maintenance",
        icon: (
          <CIcon
            icon={cilStorage}
            customClassName="nav-icon"
            style={{ height: "30px" }}
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
        name: "Attendance",
        icon: (
          <CIcon
            icon={cilCheck}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Site Attendance",
            to: "/site-technician/user-site-attendance",
          },
        ],
      },
    ],
  },

  //---------------------------------Taypro Site Techncian ---------------------------------------------

  //---------------------------------service User---------------------------------------------
  {
    component: CNavGroup,
    name: "Service User",
    to: "/base",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px" }}
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
            style={{ height: "30px" }}
          />
        ),
      },

      {
        component: CNavTitle,
        name: "Theme",
      },
      {
        component: CNavItem,
        name: "Colors",
        to: "/theme/colors",
        icon: (
          <CIcon
            icon={cilDrop}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "Typography",
        to: "/theme/typography",
        icon: (
          <CIcon
            icon={cilPencil}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
      },
      {
        component: CNavTitle,
        name: "Components",
      },
      {
        component: CNavGroup,
        name: "Base",
        to: "/base",
        icon: (
          <CIcon
            icon={cilPuzzle}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Accordion",
            to: "/base/accordion",
          },
          {
            component: CNavItem,
            name: "Breadcrumb",
            to: "/base/breadcrumbs",
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {"Calendar"}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: "https://coreui.io/react/docs/components/calendar/",
            badge: {
              color: "danger",
              text: "PRO",
            },
          },
          {
            component: CNavItem,
            name: "Cards",
            to: "/base/cards",
          },
          {
            component: CNavItem,
            name: "Carousel",
            to: "/base/carousels",
          },
          {
            component: CNavItem,
            name: "Collapse",
            to: "/base/collapses",
          },
          {
            component: CNavItem,
            name: "List group",
            to: "/base/list-groups",
          },
          {
            component: CNavItem,
            name: "Navs & Tabs",
            to: "/base/navs",
          },
          {
            component: CNavItem,
            name: "Pagination",
            to: "/base/paginations",
          },
          {
            component: CNavItem,
            name: "Placeholders",
            to: "/base/placeholders",
          },
          {
            component: CNavItem,
            name: "Popovers",
            to: "/base/popovers",
          },
          {
            component: CNavItem,
            name: "Progress",
            to: "/base/progress",
          },
          {
            component: CNavItem,
            name: "Smart Pagination",
            href: "https://coreui.io/react/docs/components/smart-pagination/",
            badge: {
              color: "danger",
              text: "PRO",
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {"Smart Table"}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: "https://coreui.io/react/docs/components/smart-table/",
            badge: {
              color: "danger",
              text: "PRO",
            },
          },
          {
            component: CNavItem,
            name: "Spinners",
            to: "/base/spinners",
          },
          {
            component: CNavItem,
            name: "Tables",
            to: "/base/tables",
          },
          {
            component: CNavItem,
            name: "Tabs",
            to: "/base/tabs",
          },
          {
            component: CNavItem,
            name: "Tooltips",
            to: "/base/tooltips",
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {"Virtual Scroller"}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: "https://coreui.io/react/docs/components/virtual-scroller/",
            badge: {
              color: "danger",
              text: "PRO",
            },
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Buttons",
        to: "/buttons",
        icon: (
          <CIcon
            icon={cilCursor}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Buttons",
            to: "/buttons/buttons",
          },
          {
            component: CNavItem,
            name: "Buttons groups",
            to: "/buttons/button-groups",
          },
          {
            component: CNavItem,
            name: "Dropdowns",
            to: "/buttons/dropdowns",
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {"Loading Button"}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: "https://coreui.io/react/docs/components/loading-button/",
            badge: {
              color: "danger",
              text: "PRO",
            },
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Forms",
        icon: (
          <CIcon
            icon={cilNotes}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Form Control",
            to: "/forms/form-control",
          },
          {
            component: CNavItem,
            name: "Select",
            to: "/forms/select",
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {"Multi Select"}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: "https://coreui.io/react/docs/forms/multi-select/",
            badge: {
              color: "danger",
              text: "PRO",
            },
          },
          {
            component: CNavItem,
            name: "Checks & Radios",
            to: "/forms/checks-radios",
          },
          {
            component: CNavItem,
            name: "Range",
            to: "/forms/range",
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {"Range Slider"}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: "https://coreui.io/react/docs/forms/range-slider/",
            badge: {
              color: "danger",
              text: "PRO",
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {"Rating"}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: "https://coreui.io/react/docs/forms/rating/",
            badge: {
              color: "danger",
              text: "PRO",
            },
          },
          {
            component: CNavItem,
            name: "Input Group",
            to: "/forms/input-group",
          },
          {
            component: CNavItem,
            name: "Floating Labels",
            to: "/forms/floating-labels",
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {"Date Picker"}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: "https://coreui.io/react/docs/forms/date-picker/",
            badge: {
              color: "danger",
              text: "PRO",
            },
          },
          {
            component: CNavItem,
            name: "Date Range Picker",
            href: "https://coreui.io/react/docs/forms/date-range-picker/",
            badge: {
              color: "danger",
              text: "PRO",
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {"Time Picker"}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: "https://coreui.io/react/docs/forms/time-picker/",
            badge: {
              color: "danger",
              text: "PRO",
            },
          },
          {
            component: CNavItem,
            name: "Layout",
            to: "/forms/layout",
          },
          {
            component: CNavItem,
            name: "Validation",
            to: "/forms/validation",
          },
        ],
      },
      {
        component: CNavItem,
        name: "Charts",
        to: "/charts",
        icon: (
          <CIcon
            icon={cilChartPie}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
      },
      {
        component: CNavGroup,
        name: "Icons",
        icon: (
          <CIcon
            icon={cilStar}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "CoreUI Free",
            to: "/icons/coreui-icons",
          },
          {
            component: CNavItem,
            name: "CoreUI Flags",
            to: "/icons/flags",
          },
          {
            component: CNavItem,
            name: "CoreUI Brands",
            to: "/icons/brands",
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Notifications",
        icon: (
          <CIcon
            icon={cilBell}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Alerts",
            to: "/notifications/alerts",
          },
          {
            component: CNavItem,
            name: "Badges",
            to: "/notifications/badges",
          },
          {
            component: CNavItem,
            name: "Modal",
            to: "/notifications/modals",
          },
          {
            component: CNavItem,
            name: "Toasts",
            to: "/notifications/toasts",
          },
        ],
      },
      {
        component: CNavItem,
        name: "Widgets",
        to: "/widgets",
        icon: (
          <CIcon
            icon={cilCalculator}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
        badge: {
          color: "info",
          text: "DONE",
        },
      },
      {
        component: CNavTitle,
        name: "Extras",
      },
      {
        component: CNavGroup,
        name: "Pages",
        icon: (
          <CIcon
            icon={cilStar}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Login",
            to: "/login",
          },
          {
            component: CNavItem,
            name: "Register",
            to: "/register",
          },
          {
            component: CNavItem,
            name: "Error 404",
            to: "/404",
          },
          {
            component: CNavItem,
            name: "Error 500",
            to: "/500",
          },
        ],
      },
      {
        component: CNavItem,
        name: "Docs",
        href: "https://coreui.io/react/docs/templates/installation/",
        icon: (
          <CIcon
            icon={cilDescription}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
      },
    ],
  },
  //---------------------------------service User---------------------------------------------

  //-------------------------------client admin------------------------------------

  {
    component: CNavGroup,
    name: "Client Admin",
    to: "/base",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Dashboard",
        to: "/client-admin/dashboard",
        icon: (
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "Statistics",
        to: "/client-admin/statistics",
        icon: (
          <CIcon
            icon={cilBarChart}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "Search Robot",
        to: "/client-admin/search-robot",
        icon: (
          <CIcon
            icon={cilSearch}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "Robot Commands",
        to: "/client-admin/robot-commands",
        icon: (
          <CIcon
            icon={cilCursor}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "Client Tickets",
        to: "/client-admin/clientadmin-client-ticket",
        icon: (
          <CIcon
            icon={cilNoteAdd}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
      },
      {
        component: CNavGroup,
        name: "Site Management",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),

        items: [
          {
            component: CNavItem,
            name: "All Site Data",
            to: "/client-admin/site-management/all-site-data",
            icon: (
              <CIcon
                icon={cilFactory}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
          },
          {
            component: CNavItem,
            name: "Site Management",
            to: "/client-admin/site-management",
            icon: (
              <CIcon
                icon={cilBuilding}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
          },
          {
            component: CNavItem,
            name: "All Sites Timers",
            to: "/client-admin/timers",
            icon: (
              <CIcon
                icon={cilClock}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
          },
        ],
      },
      {
        component: CNavGroup,
        name: "Maintenance & Logs",
        icon: (
          <CIcon
            icon={cilCalendarCheck}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Preventive Maintenance",
            to: "/client-admin/preventive-maintenance-dashboard",
            icon: (
              <CIcon
                icon={cilCalendarCheck}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
          },
          {
            component: CNavItem,
            name: "Cleaning Log",
            to: "/client-admin/cleaning-log-sites",
            icon: (
              <CIcon
                icon={cilListRich}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
          },
        ],
      },

      {
        component: CNavGroup,
        name: "Users & Communication",
        icon: (
          <CIcon
            icon={cilGroup}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Users",
            to: "/client-admin/external-users",
            icon: (
              <CIcon
                icon={cilGroup}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
          },
          {
            component: CNavItem,
            name: "Chat with Users",
            to: "/client-admin/chat",
            icon: (
              <CIcon
                icon={cilChatBubble}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
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
        style={{ height: "30px" }}
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
            style={{ height: "30px" }}
          />
        ),
      },
      {
        component: CNavGroup,
        name: "Site Management",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "All Site Data",
            to: "/site-incharge/site-management/all-site-data",
            icon: (
              <CIcon
                icon={cilFactory}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
          },
          {
            component: CNavItem,
            name: "Site Management",
            to: "/site-incharge/site-management",
            icon: (
              <CIcon
                icon={cilBuilding}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
          },
          {
            component: CNavItem,
            name: "All Sites Timers",
            to: "/site-incharge/timers",
            icon: (
              <CIcon
                icon={cilClock}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
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
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Cleaning Log",
            to: "/site-incharge/cleaning-log-sites",
            icon: (
              <CIcon
                icon={cilListRich}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
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
            style={{ height: "30px" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "Search Robot",
        to: "/site-incharge/search-robot",
        icon: (
          <CIcon
            icon={cilSearch}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
      },
      // {
      //   component: CNavItem,
      //   name: "Users",
      //   to: "/site-incharge/external-users",
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

  // ---------------------site Incharge----------------------------------

  // ---------------------Client Technician----------------------------------
  {
    component: CNavGroup,
    name: "Client Site Technician",
    to: "/base",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px" }}
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
            style={{ height: "30px" }}
          />
        ),
      },
      {
        component: CNavGroup,
        name: "Site Management",
        icon: (
          <CIcon
            icon={cilBuilding}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "All Site Data",
            to: "/client-site-technician/site-management/all-site-data",
            icon: (
              <CIcon
                icon={cilFactory}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
          },
          {
            component: CNavItem,
            name: "Site Management",
            to: "/client-site-technician/site-management",
            icon: (
              <CIcon
                icon={cilBuilding}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
          },
          {
            component: CNavItem,
            name: "All Sites Timers",
            to: "/client-site-technician/timers",
            icon: (
              <CIcon
                icon={cilClock}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
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
            style={{ height: "30px" }}
          />
        ),
        items: [
          {
            component: CNavItem,
            name: "Cleaning Log",
            to: "/client-site-technician/cleaning-log-sites",
            icon: (
              <CIcon
                icon={cilListRich}
                customClassName="nav-icon"
                style={{ height: "30px" }}
              />
            ),
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
            style={{ height: "30px" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "Search Robot",
        to: "/client-site-technician/search-robot",
        icon: (
          <CIcon
            icon={cilSearch}
            customClassName="nav-icon"
            style={{ height: "30px" }}
          />
        ),
      },
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

  {
    component: CNavTitle,
    name: "Theme",
  },
  {
    component: CNavItem,
    name: "Colors",
    to: "/theme/colors",
    icon: (
      <CIcon
        icon={cilDrop}
        customClassName="nav-icon"
        style={{ height: "30px" }}
      />
    ),
  },
  {
    component: CNavItem,
    name: "Typography",
    to: "/theme/typography",
    icon: (
      <CIcon
        icon={cilPencil}
        customClassName="nav-icon"
        style={{ height: "30px" }}
      />
    ),
  },
  {
    component: CNavTitle,
    name: "Components",
  },
  {
    component: CNavGroup,
    name: "Base",
    to: "/base",
    icon: (
      <CIcon
        icon={cilPuzzle}
        customClassName="nav-icon"
        style={{ height: "30px" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Accordion",
        to: "/base/accordion",
      },
      {
        component: CNavItem,
        name: "Breadcrumb",
        to: "/base/breadcrumbs",
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {"Calendar"}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: "https://coreui.io/react/docs/components/calendar/",
        badge: {
          color: "danger",
          text: "PRO",
        },
      },
      {
        component: CNavItem,
        name: "Cards",
        to: "/base/cards",
      },
      {
        component: CNavItem,
        name: "Carousel",
        to: "/base/carousels",
      },
      {
        component: CNavItem,
        name: "Collapse",
        to: "/base/collapses",
      },
      {
        component: CNavItem,
        name: "List group",
        to: "/base/list-groups",
      },
      {
        component: CNavItem,
        name: "Navs & Tabs",
        to: "/base/navs",
      },
      {
        component: CNavItem,
        name: "Pagination",
        to: "/base/paginations",
      },
      {
        component: CNavItem,
        name: "Placeholders",
        to: "/base/placeholders",
      },
      {
        component: CNavItem,
        name: "Popovers",
        to: "/base/popovers",
      },
      {
        component: CNavItem,
        name: "Progress",
        to: "/base/progress",
      },
      {
        component: CNavItem,
        name: "Smart Pagination",
        href: "https://coreui.io/react/docs/components/smart-pagination/",
        badge: {
          color: "danger",
          text: "PRO",
        },
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {"Smart Table"}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: "https://coreui.io/react/docs/components/smart-table/",
        badge: {
          color: "danger",
          text: "PRO",
        },
      },
      {
        component: CNavItem,
        name: "Spinners",
        to: "/base/spinners",
      },
      {
        component: CNavItem,
        name: "Tables",
        to: "/base/tables",
      },
      {
        component: CNavItem,
        name: "Tabs",
        to: "/base/tabs",
      },
      {
        component: CNavItem,
        name: "Tooltips",
        to: "/base/tooltips",
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {"Virtual Scroller"}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: "https://coreui.io/react/docs/components/virtual-scroller/",
        badge: {
          color: "danger",
          text: "PRO",
        },
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Buttons",
    to: "/buttons",
    icon: (
      <CIcon
        icon={cilCursor}
        customClassName="nav-icon"
        style={{ height: "30px" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Buttons",
        to: "/buttons/buttons",
      },
      {
        component: CNavItem,
        name: "Buttons groups",
        to: "/buttons/button-groups",
      },
      {
        component: CNavItem,
        name: "Dropdowns",
        to: "/buttons/dropdowns",
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {"Loading Button"}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: "https://coreui.io/react/docs/components/loading-button/",
        badge: {
          color: "danger",
          text: "PRO",
        },
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Forms",
    icon: (
      <CIcon
        icon={cilNotes}
        customClassName="nav-icon"
        style={{ height: "30px" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Form Control",
        to: "/forms/form-control",
      },
      {
        component: CNavItem,
        name: "Select",
        to: "/forms/select",
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {"Multi Select"}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: "https://coreui.io/react/docs/forms/multi-select/",
        badge: {
          color: "danger",
          text: "PRO",
        },
      },
      {
        component: CNavItem,
        name: "Checks & Radios",
        to: "/forms/checks-radios",
      },
      {
        component: CNavItem,
        name: "Range",
        to: "/forms/range",
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {"Range Slider"}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: "https://coreui.io/react/docs/forms/range-slider/",
        badge: {
          color: "danger",
          text: "PRO",
        },
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {"Rating"}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: "https://coreui.io/react/docs/forms/rating/",
        badge: {
          color: "danger",
          text: "PRO",
        },
      },
      {
        component: CNavItem,
        name: "Input Group",
        to: "/forms/input-group",
      },
      {
        component: CNavItem,
        name: "Floating Labels",
        to: "/forms/floating-labels",
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {"Date Picker"}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: "https://coreui.io/react/docs/forms/date-picker/",
        badge: {
          color: "danger",
          text: "PRO",
        },
      },
      {
        component: CNavItem,
        name: "Date Range Picker",
        href: "https://coreui.io/react/docs/forms/date-range-picker/",
        badge: {
          color: "danger",
          text: "PRO",
        },
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {"Time Picker"}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: "https://coreui.io/react/docs/forms/time-picker/",
        badge: {
          color: "danger",
          text: "PRO",
        },
      },
      {
        component: CNavItem,
        name: "Layout",
        to: "/forms/layout",
      },
      {
        component: CNavItem,
        name: "Validation",
        to: "/forms/validation",
      },
    ],
  },
  {
    component: CNavItem,
    name: "Charts",
    to: "/charts",
    icon: (
      <CIcon
        icon={cilChartPie}
        customClassName="nav-icon"
        style={{ height: "30px" }}
      />
    ),
  },
  {
    component: CNavGroup,
    name: "Icons",
    icon: (
      <CIcon
        icon={cilStar}
        customClassName="nav-icon"
        style={{ height: "30px" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "CoreUI Free",
        to: "/icons/coreui-icons",
      },
      {
        component: CNavItem,
        name: "CoreUI Flags",
        to: "/icons/flags",
      },
      {
        component: CNavItem,
        name: "CoreUI Brands",
        to: "/icons/brands",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Notifications",
    icon: (
      <CIcon
        icon={cilBell}
        customClassName="nav-icon"
        style={{ height: "30px" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Alerts",
        to: "/notifications/alerts",
      },
      {
        component: CNavItem,
        name: "Badges",
        to: "/notifications/badges",
      },
      {
        component: CNavItem,
        name: "Modal",
        to: "/notifications/modals",
      },
      {
        component: CNavItem,
        name: "Toasts",
        to: "/notifications/toasts",
      },
    ],
  },
  {
    component: CNavItem,
    name: "Widgets",
    to: "/widgets",
    icon: (
      <CIcon
        icon={cilCalculator}
        customClassName="nav-icon"
        style={{ height: "30px" }}
      />
    ),
    badge: {
      color: "info",
      text: "DONE",
    },
  },
  {
    component: CNavTitle,
    name: "Extras",
  },
  {
    component: CNavGroup,
    name: "Pages",
    icon: (
      <CIcon
        icon={cilStar}
        customClassName="nav-icon"
        style={{ height: "30px" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: "Login",
        to: "/login",
      },
      {
        component: CNavItem,
        name: "Register",
        to: "/register",
      },
      {
        component: CNavItem,
        name: "Error 404",
        to: "/404",
      },
      {
        component: CNavItem,
        name: "Error 500",
        to: "/500",
      },
    ],
  },
  {
    component: CNavItem,
    name: "Docs",
    href: "https://coreui.io/react/docs/templates/installation/",
    icon: (
      <CIcon
        icon={cilDescription}
        customClassName="nav-icon"
        style={{ height: "30px" }}
      />
    ),
  },
];

export default _nav;
