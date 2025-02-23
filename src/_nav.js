import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cibProbot,
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
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';

const _nav = [
  //master admin

  {
    component: CNavGroup,
    name: 'Master Admin',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/master-admin/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },

      {
        component: CNavItem,
        name: 'All Site Data',
        to: '/master-admin/site-management/all-site-data',
        icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },
      {
        component: CNavItem,
        name: 'Site Management',
        to: '/master-admin/site-management',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },

      {
        component: CNavItem,
        name: 'Search Robot',
        to: '/master-admin/search-robot',
        icon: <CIcon icon={cibProbot} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },
      {
        component: CNavItem,
        name: 'Replace Lora',
        to: '/master-admin/replace-lora/active-robots',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },
      {
        component: CNavItem,
        name: 'Add Robot',
        to: '/master-admin/add-robot/add-robot-using-lorano',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },

      {
        component: CNavItem,
        name: 'Preventive Maint.',
        to: '/master-admin/preventive-maintanance',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'danger',
          text: 'PENDING',
        },
      },
      {
        component: CNavItem,
        name: 'Client Data',
        to: '/master-admin/clients',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },
      {
        component: CNavItem,
        name: 'Update Robot Data',
        to: '/master-admin/robots',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },
      {
        component: CNavItem,
        name: 'Service Tickets',
        to: '/master-admin/service-tickets',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },
      {
        component: CNavItem,
        name: 'Internal Tickets',
        to: '/master-admin/internal-tickets',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },
      {
        component: CNavItem,
        name: 'Lora Configuration',
        to: '/master-admin/lora-configuration',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },
      {
        component: CNavItem,
        name: 'Users',
        to: '/master-admin/users',
        //internal external
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },
      {
        component: CNavItem,
        name: 'All Sites Cleaning Log',
        to: '/master-admin/all-site-cleaning-log',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },

      {
        component: CNavItem,
        name: 'All Sites Timers',
        to: '/master-admin/timers',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },
      {
        component: CNavItem,
        name: 'All Sites Gateways',
        to: '/master-admin/all-site-gateways',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },
      {
        component: CNavItem,
        name: 'All Site DPR',
        to: '/master-admin/all-site-dpr',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
        badge: {
          color: 'success',
          text: 'DONE',
        },
      },
      {
        component: CNavTitle,
        name: 'Theme',
      },
      {
        component: CNavItem,
        name: 'Colors',
        to: '/theme/colors',
        icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Typography',
        to: '/theme/typography',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavTitle,
        name: 'Components',
      },
      {
        component: CNavGroup,
        name: 'Base',
        to: '/base',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Accordion',
            to: '/base/accordion',
          },
          {
            component: CNavItem,
            name: 'Breadcrumb',
            to: '/base/breadcrumbs',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Calendar'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/calendar/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Cards',
            to: '/base/cards',
          },
          {
            component: CNavItem,
            name: 'Carousel',
            to: '/base/carousels',
          },
          {
            component: CNavItem,
            name: 'Collapse',
            to: '/base/collapses',
          },
          {
            component: CNavItem,
            name: 'List group',
            to: '/base/list-groups',
          },
          {
            component: CNavItem,
            name: 'Navs & Tabs',
            to: '/base/navs',
          },
          {
            component: CNavItem,
            name: 'Pagination',
            to: '/base/paginations',
          },
          {
            component: CNavItem,
            name: 'Placeholders',
            to: '/base/placeholders',
          },
          {
            component: CNavItem,
            name: 'Popovers',
            to: '/base/popovers',
          },
          {
            component: CNavItem,
            name: 'Progress',
            to: '/base/progress',
          },
          {
            component: CNavItem,
            name: 'Smart Pagination',
            href: 'https://coreui.io/react/docs/components/smart-pagination/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Smart Table'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/smart-table/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Spinners',
            to: '/base/spinners',
          },
          {
            component: CNavItem,
            name: 'Tables',
            to: '/base/tables',
          },
          {
            component: CNavItem,
            name: 'Tabs',
            to: '/base/tabs',
          },
          {
            component: CNavItem,
            name: 'Tooltips',
            to: '/base/tooltips',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Virtual Scroller'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/virtual-scroller/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Buttons',
        to: '/buttons',
        icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Buttons',
            to: '/buttons/buttons',
          },
          {
            component: CNavItem,
            name: 'Buttons groups',
            to: '/buttons/button-groups',
          },
          {
            component: CNavItem,
            name: 'Dropdowns',
            to: '/buttons/dropdowns',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Loading Button'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/loading-button/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Forms',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Form Control',
            to: '/forms/form-control',
          },
          {
            component: CNavItem,
            name: 'Select',
            to: '/forms/select',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Multi Select'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/multi-select/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Checks & Radios',
            to: '/forms/checks-radios',
          },
          {
            component: CNavItem,
            name: 'Range',
            to: '/forms/range',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Range Slider'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/range-slider/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Rating'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/rating/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Input Group',
            to: '/forms/input-group',
          },
          {
            component: CNavItem,
            name: 'Floating Labels',
            to: '/forms/floating-labels',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Date Picker'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/date-picker/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Date Range Picker',
            href: 'https://coreui.io/react/docs/forms/date-range-picker/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Time Picker'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/time-picker/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Layout',
            to: '/forms/layout',
          },
          {
            component: CNavItem,
            name: 'Validation',
            to: '/forms/validation',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Charts',
        to: '/charts',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
      },
      {
        component: CNavGroup,
        name: 'Icons',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'CoreUI Free',
            to: '/icons/coreui-icons',
          },
          {
            component: CNavItem,
            name: 'CoreUI Flags',
            to: '/icons/flags',
          },
          {
            component: CNavItem,
            name: 'CoreUI Brands',
            to: '/icons/brands',
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Notifications',
        icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Alerts',
            to: '/notifications/alerts',
          },
          {
            component: CNavItem,
            name: 'Badges',
            to: '/notifications/badges',
          },
          {
            component: CNavItem,
            name: 'Modal',
            to: '/notifications/modals',
          },
          {
            component: CNavItem,
            name: 'Toasts',
            to: '/notifications/toasts',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Widgets',
        to: '/widgets',
        icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: 'DONE',
        },
      },
      {
        component: CNavTitle,
        name: 'Extras',
      },
      {
        component: CNavGroup,
        name: 'Pages',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Login',
            to: '/login',
          },
          {
            component: CNavItem,
            name: 'Register',
            to: '/register',
          },
          {
            component: CNavItem,
            name: 'Error 404',
            to: '/404',
          },
          {
            component: CNavItem,
            name: 'Error 500',
            to: '/500',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Docs',
        href: 'https://coreui.io/react/docs/templates/installation/',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
    ],
  },

  // -----------------------------------master admin----------------------------------------

  //-------------------------------Project admin------------------------------------
  {
    component: CNavGroup,
    name: 'Project Admin',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/project-admin/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },

      // {
      //   component: CNavItem,
      //   name: 'All Site Data',
      //   to: '/master-admin/all-site-data',
      //   icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
      //   badge: {
      //     color: 'info',
      //     text: 'DONE',
      //   },
      // },
      // {
      //   component: CNavItem,
      //   name: 'Site Management',
      //   to: '/master-admin/site-management',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      //   badge: {
      //     color: 'info',
      //     text: 'DONE',
      //   },
      // },

      // {
      //   component: CNavItem,
      //   name: 'Search Robot',
      //   to: '/master-admin/search-robot',
      //   icon: <CIcon icon={cibProbot} customClassName="nav-icon" />,
      //   badge: {
      //     color: 'success',
      //     text: 'DONE',
      //   },
      // },
      // {
      //   component: CNavItem,
      //   name: 'Replace Lora',
      //   to: '/master-admin/replace-lora/active-robots',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Add Robot',
      //   to: '/master-admin/add-robot/add-robot-using-lorano',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },

      // {
      //   component: CNavItem,
      //   name: 'Preventive Maintanence',
      //   to: '/master-admin/preventive-maintanance',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Client Data',
      //   to: '/master-admin/clients',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      //   badge: {
      //     color: 'danger',
      //     text: 'DONE',
      //   },
      // },
      // {
      //   component: CNavItem,
      //   name: 'Update Robot Data',
      //   to: '/master-admin/robots',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Service Tickets',
      //   to: '/master-admin/service-ticket',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Internal Tickets',
      //   to: '/master-admin/internal-ticket',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Lora Configuration',
      //   to: '/master-admin/lora-configuration',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Users',
      //   to: '/master-admin/Users',
      //   //internal external
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'All Sites Cleaning Log',
      //   to: '/master-admin/all-site-cleaning-log',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },

      // {
      //   component: CNavItem,
      //   name: 'All Sites Timers',
      //   to: '/master-admin/all-site-timers',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'All Sites Gateway Status',
      //   to: '/master-admin/all-site-timers',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'All Site DPR',
      //   to: '/master-admin/all-site-dpr',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      {
        component: CNavTitle,
        name: 'Theme',
      },
      {
        component: CNavItem,
        name: 'Colors',
        to: '/theme/colors',
        icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Typography',
        to: '/theme/typography',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavTitle,
        name: 'Components',
      },
      {
        component: CNavGroup,
        name: 'Base',
        to: '/base',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Accordion',
            to: '/base/accordion',
          },
          {
            component: CNavItem,
            name: 'Breadcrumb',
            to: '/base/breadcrumbs',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Calendar'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/calendar/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Cards',
            to: '/base/cards',
          },
          {
            component: CNavItem,
            name: 'Carousel',
            to: '/base/carousels',
          },
          {
            component: CNavItem,
            name: 'Collapse',
            to: '/base/collapses',
          },
          {
            component: CNavItem,
            name: 'List group',
            to: '/base/list-groups',
          },
          {
            component: CNavItem,
            name: 'Navs & Tabs',
            to: '/base/navs',
          },
          {
            component: CNavItem,
            name: 'Pagination',
            to: '/base/paginations',
          },
          {
            component: CNavItem,
            name: 'Placeholders',
            to: '/base/placeholders',
          },
          {
            component: CNavItem,
            name: 'Popovers',
            to: '/base/popovers',
          },
          {
            component: CNavItem,
            name: 'Progress',
            to: '/base/progress',
          },
          {
            component: CNavItem,
            name: 'Smart Pagination',
            href: 'https://coreui.io/react/docs/components/smart-pagination/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Smart Table'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/smart-table/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Spinners',
            to: '/base/spinners',
          },
          {
            component: CNavItem,
            name: 'Tables',
            to: '/base/tables',
          },
          {
            component: CNavItem,
            name: 'Tabs',
            to: '/base/tabs',
          },
          {
            component: CNavItem,
            name: 'Tooltips',
            to: '/base/tooltips',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Virtual Scroller'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/virtual-scroller/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Buttons',
        to: '/buttons',
        icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Buttons',
            to: '/buttons/buttons',
          },
          {
            component: CNavItem,
            name: 'Buttons groups',
            to: '/buttons/button-groups',
          },
          {
            component: CNavItem,
            name: 'Dropdowns',
            to: '/buttons/dropdowns',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Loading Button'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/loading-button/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Forms',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Form Control',
            to: '/forms/form-control',
          },
          {
            component: CNavItem,
            name: 'Select',
            to: '/forms/select',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Multi Select'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/multi-select/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Checks & Radios',
            to: '/forms/checks-radios',
          },
          {
            component: CNavItem,
            name: 'Range',
            to: '/forms/range',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Range Slider'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/range-slider/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Rating'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/rating/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Input Group',
            to: '/forms/input-group',
          },
          {
            component: CNavItem,
            name: 'Floating Labels',
            to: '/forms/floating-labels',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Date Picker'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/date-picker/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Date Range Picker',
            href: 'https://coreui.io/react/docs/forms/date-range-picker/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Time Picker'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/time-picker/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Layout',
            to: '/forms/layout',
          },
          {
            component: CNavItem,
            name: 'Validation',
            to: '/forms/validation',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Charts',
        to: '/charts',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
      },
      {
        component: CNavGroup,
        name: 'Icons',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'CoreUI Free',
            to: '/icons/coreui-icons',
          },
          {
            component: CNavItem,
            name: 'CoreUI Flags',
            to: '/icons/flags',
          },
          {
            component: CNavItem,
            name: 'CoreUI Brands',
            to: '/icons/brands',
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Notifications',
        icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Alerts',
            to: '/notifications/alerts',
          },
          {
            component: CNavItem,
            name: 'Badges',
            to: '/notifications/badges',
          },
          {
            component: CNavItem,
            name: 'Modal',
            to: '/notifications/modals',
          },
          {
            component: CNavItem,
            name: 'Toasts',
            to: '/notifications/toasts',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Widgets',
        to: '/widgets',
        icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: 'DONE',
        },
      },
      {
        component: CNavTitle,
        name: 'Extras',
      },
      {
        component: CNavGroup,
        name: 'Pages',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Login',
            to: '/login',
          },
          {
            component: CNavItem,
            name: 'Register',
            to: '/register',
          },
          {
            component: CNavItem,
            name: 'Error 404',
            to: '/404',
          },
          {
            component: CNavItem,
            name: 'Error 500',
            to: '/500',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Docs',
        href: 'https://coreui.io/react/docs/templates/installation/',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
    ],
  },

  //-------------------------------Project admin-----------------------------------------

  //---------------------------------service admin------------------------------------------
  {
    component: CNavGroup,
    name: 'Service Admin',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/service-admin/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },

      // {
      //   component: CNavItem,
      //   name: 'All Site Data',
      //   to: '/master-admin/all-site-data',
      //   icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
      //   badge: {
      //     color: 'info',
      //     text: 'DONE',
      //   },
      // },
      // {
      //   component: CNavItem,
      //   name: 'Site Management',
      //   to: '/master-admin/site-management',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      //   badge: {
      //     color: 'info',
      //     text: 'DONE',
      //   },
      // },

      // {
      //   component: CNavItem,
      //   name: 'Search Robot',
      //   to: '/master-admin/search-robot',
      //   icon: <CIcon icon={cibProbot} customClassName="nav-icon" />,
      //   badge: {
      //     color: 'success',
      //     text: 'DONE',
      //   },
      // },
      // {
      //   component: CNavItem,
      //   name: 'Replace Lora',
      //   to: '/master-admin/replace-lora/active-robots',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Add Robot',
      //   to: '/master-admin/add-robot/add-robot-using-lorano',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },

      // {
      //   component: CNavItem,
      //   name: 'Preventive Maintanence',
      //   to: '/master-admin/preventive-maintanance',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Client Data',
      //   to: '/master-admin/clients',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      //   badge: {
      //     color: 'danger',
      //     text: 'DONE',
      //   },
      // },
      // {
      //   component: CNavItem,
      //   name: 'Update Robot Data',
      //   to: '/master-admin/robots',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Service Tickets',
      //   to: '/master-admin/service-ticket',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Internal Tickets',
      //   to: '/master-admin/internal-ticket',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Lora Configuration',
      //   to: '/master-admin/lora-configuration',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Users',
      //   to: '/master-admin/Users',
      //   //internal external
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'All Sites Cleaning Log',
      //   to: '/master-admin/all-site-cleaning-log',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },

      // {
      //   component: CNavItem,
      //   name: 'All Sites Timers',
      //   to: '/master-admin/all-site-timers',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'All Sites Gateway Status',
      //   to: '/master-admin/all-site-timers',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'All Site DPR',
      //   to: '/master-admin/all-site-dpr',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      {
        component: CNavTitle,
        name: 'Theme',
      },
      {
        component: CNavItem,
        name: 'Colors',
        to: '/theme/colors',
        icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Typography',
        to: '/theme/typography',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavTitle,
        name: 'Components',
      },
      {
        component: CNavGroup,
        name: 'Base',
        to: '/base',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Accordion',
            to: '/base/accordion',
          },
          {
            component: CNavItem,
            name: 'Breadcrumb',
            to: '/base/breadcrumbs',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Calendar'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/calendar/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Cards',
            to: '/base/cards',
          },
          {
            component: CNavItem,
            name: 'Carousel',
            to: '/base/carousels',
          },
          {
            component: CNavItem,
            name: 'Collapse',
            to: '/base/collapses',
          },
          {
            component: CNavItem,
            name: 'List group',
            to: '/base/list-groups',
          },
          {
            component: CNavItem,
            name: 'Navs & Tabs',
            to: '/base/navs',
          },
          {
            component: CNavItem,
            name: 'Pagination',
            to: '/base/paginations',
          },
          {
            component: CNavItem,
            name: 'Placeholders',
            to: '/base/placeholders',
          },
          {
            component: CNavItem,
            name: 'Popovers',
            to: '/base/popovers',
          },
          {
            component: CNavItem,
            name: 'Progress',
            to: '/base/progress',
          },
          {
            component: CNavItem,
            name: 'Smart Pagination',
            href: 'https://coreui.io/react/docs/components/smart-pagination/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Smart Table'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/smart-table/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Spinners',
            to: '/base/spinners',
          },
          {
            component: CNavItem,
            name: 'Tables',
            to: '/base/tables',
          },
          {
            component: CNavItem,
            name: 'Tabs',
            to: '/base/tabs',
          },
          {
            component: CNavItem,
            name: 'Tooltips',
            to: '/base/tooltips',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Virtual Scroller'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/virtual-scroller/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Buttons',
        to: '/buttons',
        icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Buttons',
            to: '/buttons/buttons',
          },
          {
            component: CNavItem,
            name: 'Buttons groups',
            to: '/buttons/button-groups',
          },
          {
            component: CNavItem,
            name: 'Dropdowns',
            to: '/buttons/dropdowns',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Loading Button'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/loading-button/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Forms',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Form Control',
            to: '/forms/form-control',
          },
          {
            component: CNavItem,
            name: 'Select',
            to: '/forms/select',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Multi Select'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/multi-select/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Checks & Radios',
            to: '/forms/checks-radios',
          },
          {
            component: CNavItem,
            name: 'Range',
            to: '/forms/range',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Range Slider'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/range-slider/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Rating'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/rating/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Input Group',
            to: '/forms/input-group',
          },
          {
            component: CNavItem,
            name: 'Floating Labels',
            to: '/forms/floating-labels',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Date Picker'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/date-picker/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Date Range Picker',
            href: 'https://coreui.io/react/docs/forms/date-range-picker/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Time Picker'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/time-picker/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Layout',
            to: '/forms/layout',
          },
          {
            component: CNavItem,
            name: 'Validation',
            to: '/forms/validation',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Charts',
        to: '/charts',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
      },
      {
        component: CNavGroup,
        name: 'Icons',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'CoreUI Free',
            to: '/icons/coreui-icons',
          },
          {
            component: CNavItem,
            name: 'CoreUI Flags',
            to: '/icons/flags',
          },
          {
            component: CNavItem,
            name: 'CoreUI Brands',
            to: '/icons/brands',
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Notifications',
        icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Alerts',
            to: '/notifications/alerts',
          },
          {
            component: CNavItem,
            name: 'Badges',
            to: '/notifications/badges',
          },
          {
            component: CNavItem,
            name: 'Modal',
            to: '/notifications/modals',
          },
          {
            component: CNavItem,
            name: 'Toasts',
            to: '/notifications/toasts',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Widgets',
        to: '/widgets',
        icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: 'DONE',
        },
      },
      {
        component: CNavTitle,
        name: 'Extras',
      },
      {
        component: CNavGroup,
        name: 'Pages',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Login',
            to: '/login',
          },
          {
            component: CNavItem,
            name: 'Register',
            to: '/register',
          },
          {
            component: CNavItem,
            name: 'Error 404',
            to: '/404',
          },
          {
            component: CNavItem,
            name: 'Error 500',
            to: '/500',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Docs',
        href: 'https://coreui.io/react/docs/templates/installation/',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
    ],
  },

  //---------------------------------service admin---------------------------------------------

  //-------------------------------client admin------------------------------------
  {
    component: CNavGroup,
    name: 'Client Admin',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/client-admin/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },

      // {
      //   component: CNavItem,
      //   name: 'All Site Data',
      //   to: '/master-admin/all-site-data',
      //   icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
      //   badge: {
      //     color: 'info',
      //     text: 'DONE',
      //   },
      // },
      // {
      //   component: CNavItem,
      //   name: 'Site Management',
      //   to: '/master-admin/site-management',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      //   badge: {
      //     color: 'info',
      //     text: 'DONE',
      //   },
      // },

      // {
      //   component: CNavItem,
      //   name: 'Search Robot',
      //   to: '/master-admin/search-robot',
      //   icon: <CIcon icon={cibProbot} customClassName="nav-icon" />,
      //   badge: {
      //     color: 'success',
      //     text: 'DONE',
      //   },
      // },
      // {
      //   component: CNavItem,
      //   name: 'Replace Lora',
      //   to: '/master-admin/replace-lora/active-robots',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Add Robot',
      //   to: '/master-admin/add-robot/add-robot-using-lorano',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },

      // {
      //   component: CNavItem,
      //   name: 'Preventive Maintanence',
      //   to: '/master-admin/preventive-maintanance',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Client Data',
      //   to: '/master-admin/clients',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      //   badge: {
      //     color: 'danger',
      //     text: 'DONE',
      //   },
      // },
      // {
      //   component: CNavItem,
      //   name: 'Update Robot Data',
      //   to: '/master-admin/robots',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Service Tickets',
      //   to: '/master-admin/service-ticket',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Internal Tickets',
      //   to: '/master-admin/internal-ticket',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Lora Configuration',
      //   to: '/master-admin/lora-configuration',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'Users',
      //   to: '/master-admin/Users',
      //   //internal external
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'All Sites Cleaning Log',
      //   to: '/master-admin/all-site-cleaning-log',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },

      // {
      //   component: CNavItem,
      //   name: 'All Sites Timers',
      //   to: '/master-admin/all-site-timers',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'All Sites Gateway Status',
      //   to: '/master-admin/all-site-timers',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      // {
      //   component: CNavItem,
      //   name: 'All Site DPR',
      //   to: '/master-admin/all-site-dpr',
      //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      // },
      {
        component: CNavTitle,
        name: 'Theme',
      },
      {
        component: CNavItem,
        name: 'Colors',
        to: '/theme/colors',
        icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Typography',
        to: '/theme/typography',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavTitle,
        name: 'Components',
      },
      {
        component: CNavGroup,
        name: 'Base',
        to: '/base',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Accordion',
            to: '/base/accordion',
          },
          {
            component: CNavItem,
            name: 'Breadcrumb',
            to: '/base/breadcrumbs',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Calendar'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/calendar/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Cards',
            to: '/base/cards',
          },
          {
            component: CNavItem,
            name: 'Carousel',
            to: '/base/carousels',
          },
          {
            component: CNavItem,
            name: 'Collapse',
            to: '/base/collapses',
          },
          {
            component: CNavItem,
            name: 'List group',
            to: '/base/list-groups',
          },
          {
            component: CNavItem,
            name: 'Navs & Tabs',
            to: '/base/navs',
          },
          {
            component: CNavItem,
            name: 'Pagination',
            to: '/base/paginations',
          },
          {
            component: CNavItem,
            name: 'Placeholders',
            to: '/base/placeholders',
          },
          {
            component: CNavItem,
            name: 'Popovers',
            to: '/base/popovers',
          },
          {
            component: CNavItem,
            name: 'Progress',
            to: '/base/progress',
          },
          {
            component: CNavItem,
            name: 'Smart Pagination',
            href: 'https://coreui.io/react/docs/components/smart-pagination/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Smart Table'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/smart-table/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Spinners',
            to: '/base/spinners',
          },
          {
            component: CNavItem,
            name: 'Tables',
            to: '/base/tables',
          },
          {
            component: CNavItem,
            name: 'Tabs',
            to: '/base/tabs',
          },
          {
            component: CNavItem,
            name: 'Tooltips',
            to: '/base/tooltips',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Virtual Scroller'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/virtual-scroller/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Buttons',
        to: '/buttons',
        icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Buttons',
            to: '/buttons/buttons',
          },
          {
            component: CNavItem,
            name: 'Buttons groups',
            to: '/buttons/button-groups',
          },
          {
            component: CNavItem,
            name: 'Dropdowns',
            to: '/buttons/dropdowns',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Loading Button'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/components/loading-button/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Forms',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Form Control',
            to: '/forms/form-control',
          },
          {
            component: CNavItem,
            name: 'Select',
            to: '/forms/select',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Multi Select'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/multi-select/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Checks & Radios',
            to: '/forms/checks-radios',
          },
          {
            component: CNavItem,
            name: 'Range',
            to: '/forms/range',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Range Slider'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/range-slider/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Rating'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/rating/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Input Group',
            to: '/forms/input-group',
          },
          {
            component: CNavItem,
            name: 'Floating Labels',
            to: '/forms/floating-labels',
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Date Picker'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/date-picker/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Date Range Picker',
            href: 'https://coreui.io/react/docs/forms/date-range-picker/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: (
              <React.Fragment>
                {'Time Picker'}
                <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
              </React.Fragment>
            ),
            href: 'https://coreui.io/react/docs/forms/time-picker/',
            badge: {
              color: 'danger',
              text: 'PRO',
            },
          },
          {
            component: CNavItem,
            name: 'Layout',
            to: '/forms/layout',
          },
          {
            component: CNavItem,
            name: 'Validation',
            to: '/forms/validation',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Charts',
        to: '/charts',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
      },
      {
        component: CNavGroup,
        name: 'Icons',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'CoreUI Free',
            to: '/icons/coreui-icons',
          },
          {
            component: CNavItem,
            name: 'CoreUI Flags',
            to: '/icons/flags',
          },
          {
            component: CNavItem,
            name: 'CoreUI Brands',
            to: '/icons/brands',
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Notifications',
        icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Alerts',
            to: '/notifications/alerts',
          },
          {
            component: CNavItem,
            name: 'Badges',
            to: '/notifications/badges',
          },
          {
            component: CNavItem,
            name: 'Modal',
            to: '/notifications/modals',
          },
          {
            component: CNavItem,
            name: 'Toasts',
            to: '/notifications/toasts',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Widgets',
        to: '/widgets',
        icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: 'DONE',
        },
      },
      {
        component: CNavTitle,
        name: 'Extras',
      },
      {
        component: CNavGroup,
        name: 'Pages',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Login',
            to: '/login',
          },
          {
            component: CNavItem,
            name: 'Register',
            to: '/register',
          },
          {
            component: CNavItem,
            name: 'Error 404',
            to: '/404',
          },
          {
            component: CNavItem,
            name: 'Error 500',
            to: '/500',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Docs',
        href: 'https://coreui.io/react/docs/templates/installation/',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
    ],
  },

  //-------------------------------client admin-----------------------------------------

  {
    component: CNavTitle,
    name: 'Theme',
  },
  {
    component: CNavItem,
    name: 'Colors',
    to: '/theme/colors',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Typography',
    to: '/theme/typography',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavGroup,
    name: 'Base',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Accordion',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Breadcrumb',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Calendar'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/components/calendar/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: 'Cards',
        to: '/base/cards',
      },
      {
        component: CNavItem,
        name: 'Carousel',
        to: '/base/carousels',
      },
      {
        component: CNavItem,
        name: 'Collapse',
        to: '/base/collapses',
      },
      {
        component: CNavItem,
        name: 'List group',
        to: '/base/list-groups',
      },
      {
        component: CNavItem,
        name: 'Navs & Tabs',
        to: '/base/navs',
      },
      {
        component: CNavItem,
        name: 'Pagination',
        to: '/base/paginations',
      },
      {
        component: CNavItem,
        name: 'Placeholders',
        to: '/base/placeholders',
      },
      {
        component: CNavItem,
        name: 'Popovers',
        to: '/base/popovers',
      },
      {
        component: CNavItem,
        name: 'Progress',
        to: '/base/progress',
      },
      {
        component: CNavItem,
        name: 'Smart Pagination',
        href: 'https://coreui.io/react/docs/components/smart-pagination/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Smart Table'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/components/smart-table/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: 'Spinners',
        to: '/base/spinners',
      },
      {
        component: CNavItem,
        name: 'Tables',
        to: '/base/tables',
      },
      {
        component: CNavItem,
        name: 'Tabs',
        to: '/base/tabs',
      },
      {
        component: CNavItem,
        name: 'Tooltips',
        to: '/base/tooltips',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Virtual Scroller'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/components/virtual-scroller/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Buttons',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Buttons',
        to: '/buttons/buttons',
      },
      {
        component: CNavItem,
        name: 'Buttons groups',
        to: '/buttons/button-groups',
      },
      {
        component: CNavItem,
        name: 'Dropdowns',
        to: '/buttons/dropdowns',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Loading Button'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/components/loading-button/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Forms',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Form Control',
        to: '/forms/form-control',
      },
      {
        component: CNavItem,
        name: 'Select',
        to: '/forms/select',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Multi Select'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/forms/multi-select/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: 'Checks & Radios',
        to: '/forms/checks-radios',
      },
      {
        component: CNavItem,
        name: 'Range',
        to: '/forms/range',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Range Slider'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/forms/range-slider/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Rating'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/forms/rating/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: 'Input Group',
        to: '/forms/input-group',
      },
      {
        component: CNavItem,
        name: 'Floating Labels',
        to: '/forms/floating-labels',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Date Picker'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/forms/date-picker/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: 'Date Range Picker',
        href: 'https://coreui.io/react/docs/forms/date-range-picker/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Time Picker'}
            <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
          </React.Fragment>
        ),
        href: 'https://coreui.io/react/docs/forms/time-picker/',
        badge: {
          color: 'danger',
          text: 'PRO',
        },
      },
      {
        component: CNavItem,
        name: 'Layout',
        to: '/forms/layout',
      },
      {
        component: CNavItem,
        name: 'Validation',
        to: '/forms/validation',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Icons',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'CoreUI Free',
        to: '/icons/coreui-icons',
      },
      {
        component: CNavItem,
        name: 'CoreUI Flags',
        to: '/icons/flags',
      },
      {
        component: CNavItem,
        name: 'CoreUI Brands',
        to: '/icons/brands',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        component: CNavItem,
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        component: CNavItem,
        name: 'Modal',
        to: '/notifications/modals',
      },
      {
        component: CNavItem,
        name: 'Toasts',
        to: '/notifications/toasts',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Widgets',
    to: '/widgets',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'DONE',
    },
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Docs',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
];

export default _nav;
