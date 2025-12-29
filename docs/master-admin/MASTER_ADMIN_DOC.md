# Master Admin — Full Page Reference

This single document lists every Master Admin UI page (from `src/_nav.js`) with deep, page-level details you can use to create documentation pages with screenshots. For each page: Route, Component, Purpose, UI elements, Inputs/Outputs, Common actions, Permissions, Related API endpoints (where obvious), Screenshot placeholder, Notes & checklist.

---

## How to use this file
- Add screenshots where indicated. Use filenames like `master-admin--dashboard.png` and place them in `docs/master-admin/screenshots/`.
- Each section has a checklist at the end to guide a screenshot-based QA and publishing flow.

---

<!-- MASTER ADMIN PAGES -->

### Dashboard
- Route: `/master-admin/dashboard`
- Component: `MasterAdminDashboard` (see `src/routes.js`)
- Purpose: Executive view of platform health and high-level KPIs (clients, active sites, active robots, open tickets, alerts).

UI Elements
- KPI tiles: Total clients, Active robots, Online robots, Open service tickets, Pending subscriptions.
- Live alerts panel: critical errors and warnings with severity badges.
- Charts section: trends for uptime, tickets over time, cleaning compliance.
- Quick actions: buttons/links for "Create Client", "Create Ticket", "Open System Logs".

Inputs / Outputs
- Inputs: date range filter, client/site filter, search box.
- Outputs: charts, downloadable CSV/PDF exports for reports.

Common actions
- Drill into a client/site by clicking KPI or chart segments.
- Open quick-create dialog (client/ticket).
- Export current view as PDF/CSV.

Permissions
- Full Master Admin read/write. Read-only for lower roles.

Related APIs (likely)
- GET `/api/admin/overview` — aggregate metrics
- GET `/api/reports/export` — export CSV/PDF

Screenshot placeholder

![master-admin-dashboard](screenshots/master-admin--dashboard.png)

Notes & checklist
- [ ] Capture KPI tiles and drilldown example
- [ ] Capture quick-create modal
- [ ] Verify export produces expected CSV

---

### All Clients (Clients Dashboard)
- Route: `/master-admin/clients-dashboard`
- Component: `ClientsDasboard`
- Purpose: Master list of all clients with management actions.

UI Elements
- Clients table: Name, Subscription, Status, Sites count, Actions.
- Search and filters: by region, subscription tier, active/inactive.
- Bulk actions: Export, Activate/Deactivate, Assign Project Admin.
- Detail drawer/modal: client metadata and assigned sites.

Inputs / Outputs
- Inputs: filters, bulk action selection.
- Outputs: client detail JSON export, CSV.

Common actions
- Create/edit client, assign client to project admin, view assigned sites.
- Deactivate/reactivate client.

Permissions
- Master Admin: full CRUD.

Related APIs
- GET `/api/clients` — list clients
- POST `/api/clients` — create client
- PATCH `/api/clients/:id` — update client

Screenshot placeholder

![master-admin-clients-dashboard](screenshots/master-admin--clients-dashboard.png)

Notes & checklist
- [ ] Capture new client modal and edit flow
- [ ] Show client details with assigned sites
- [ ] Demonstrate bulk activate/deactivate

---

### All Site Data
- Route: `/master-admin/site-management/all-site-data`
- Component(s): `TayproDashboard` / `SiteManagement`
- Purpose: Centralized list of all sites (cross-client), with metadata and health.

UI Elements
- Site list/table: Site name, client, coordinates, gateway, robots assigned, last cleaning, last DPR, status.
- Map integration: clickable site pins (open site detail).
- Filters: client, region, status, last-active date.

Inputs / Outputs
- Inputs: CSV bulk upload for site creation, search.
- Outputs: export of site list.

Common actions
- Edit site metadata, add/remove blocks, assign robots/gateways.
- Bulk site import/export.

Permissions
- Master Admin: full control.

Related APIs
- GET `/api/sites` — list
- POST `/api/sites/bulk` — bulk import

Screenshot placeholder

![master-admin-all-site-data](screenshots/master-admin--all-site-data.png)

Notes & checklist
- [ ] Capture map view and edit site modal
- [ ] Show bulk import flow and validation errors

---

### Site Management (per-site)
- Route: `/master-admin/site-management`
- Component: `SiteManagement`
- Purpose: Manage site blocks, assign robots, downlinks and debug logs.

UI Elements
- Blocks list with assigned robots
- Robot control per block (add downlink, view robot telemetry)
- Downlink management: add/view/update downlinks
- Debug log viewer per robot/block

Inputs / Outputs
- Inputs: block parameters, downlink payloads, robot assignment selectors.
- Outputs: downlink history, log exports.

Common actions
- Assign robot to a block, add downlink, view robot logs, create debug ticket from logs.

Permissions
- Full for Master Admin.

Related APIs
- POST `/api/sites/:siteId/blocks` — add block
- POST `/api/sites/:siteId/blocks/:blockId/downlink` — send downlink

Screenshot placeholder

![master-admin-site-management](screenshots/master-admin--site-management.png)

Notes & checklist
- [ ] Demonstrate add downlink flow
- [ ] Capture robot assignment view

---

### Sites Coordinates
- Route: `/master-admin/sites-coordinates`
- Component: `SiteCoordinates`
- Purpose: Manage GPS coords, correct errors, bulk update.

UI Elements
- Table of sites + coordinates, map pin editor, CSV import.

Common actions
- Update coordinates, open map to refine pin, bulk geolocation update.

Permissions
- Master Admin only.

Screenshot placeholder

![master-admin-sites-coordinates](screenshots/master-admin--sites-coordinates.png)

---

### All Site Cleaning Log
- Route: `/master-admin/all-site-cleaning-log`
- Component: `AllSiteCleaningLog`
- Purpose: Aggregate cleaning logs from all sites for auditing.

UI Elements
- List of cleaning entries with images, cleaner name, site, block, timestamp, verification status.

Common actions
- Verify entries, request clarification, export logs for a date-range.

Screenshot placeholder

![master-admin-all-site-cleaning-log](screenshots/master-admin--all-site-cleaning-log.png)

---

### Timers & Timer Logs
- Route: `/master-admin/timers` and `/master-admin/timer-logs`
- Components: `Timers`, `TimerCommandSentLog` (logs)
- Purpose: Create schedule automation and view execution history.

UI Elements
- Timer editor: name, schedule, recurrence, target site/block/robot, payload
- Log viewer: execution time, status (success/failure), returned ack

Common actions
- Create timer, edit timer, run now, stop timer, view log details and payloads.

Screenshot placeholder

![master-admin-timers](screenshots/master-admin--timers.png)

---

### All Sites Gateways
- Route: `/master-admin/all-site-gateways`
- Component: `Gateways`
- Purpose: Gateway inventory and assignment.

UI Elements
- Gateway table (serial, firmware, assigned site, last seen)
- Actions: assign gateway, push firmware update, mark faulty

Screenshot placeholder

![master-admin-all-site-gateways](screenshots/master-admin--all-site-gateways.png)

---

### All Site DPR
- Route: `/master-admin/all-site-dpr`
- Component: `AllSiteDpr`
- Purpose: Consolidated DPR viewer and export.

UI Elements
- DPR list with attachments, author and sign-off status

Common actions
- Approve/reject DPR, export monthly package.

Screenshot placeholder

![master-admin-all-site-dpr](screenshots/master-admin--all-site-dpr.png)

---

### Robots (inventory) & Lora Configuration
- Routes: `/master-admin/robots`, `/master-admin/lora-configuration`, `/master-admin/replace-lora/active-robots`
- Components: `Robots`, `LoraConfiguration`, `ReplaceLora`/`ActiveRobots`
- Purpose: Manage robots and LoRa hardware lifecycle.

UI Elements
- Robot list, robot detail page, LoRa profile templates, replacement wizard.

Common actions
- Add robot, activate/deactivate, assign LoRa, replace LoRa and log serial changes.

Permissions
- Firmware and LoRa operations should be restricted and audited.

Screenshot placeholder

![master-admin-robots](screenshots/master-admin--robots.png)

---

### Robot Battery & Logs & Commands
- Routes: `/master-admin/robot-battery-temperature`, `/master-admin/robot-log-details`, `/master-admin/robot-commands`
- Components: `BatteryAndTemperature`, `RobotLogDetials`, `RobotCommands`
- Purpose: Monitor battery/temperature, view low-level logs, send commands.

UI Elements
- Time-series charts for battery/temperature, raw log viewer, command send form.

Common actions
- Identify failing batteries, send maintenance ticket, issue commands with confirmation.

Security note
- All commands must be logged with user, timestamp, and command payload.

Screenshot placeholder

![master-admin-robot-battery-temp](screenshots/master-admin--robot-battery-temperature.png)

---

### Weather & Timer Notifications
- Routes: `/master-admin/weather-timer-notifications`, `/master-admin/timer-execution-notification-view`, `/master-admin/weather-data-sitewise`
- Purpose: Configure weather-triggered automations and view related notifications and site-weather data.

UI Elements
- Weather trigger editor, notification log, per-site weather chart.

Common actions
- Create weather trigger, map to timer, acknowledge notifications.

Screenshot placeholder

![master-admin-weather-timer-notifications](screenshots/master-admin--weather-timer-notifications.png)

---

### Users, Attendance & Performance
- Routes: `/master-admin/users`, `/master-admin/technician-attendance`, `/master-admin/user-performance-dashboard`, `/master-admin/chat`
- Purpose: Manage users, attendance, and performance analytics.

UI Elements
- User CRUD forms, attendance table with punch corrections, performance charts and leaderboards, chat UI.

Common actions
- Add user, assign role, correct attendance, generate performance reports.

Screenshot placeholder

![master-admin-users](screenshots/master-admin--users.png)

---

### Operations: Preventive Maintenance, Project Handover, Microfiber, Thermal, ESP Firmware
- Routes: `/master-admin/preventive-maintanance-dashboard`, `/master-admin/project-handover`, `/master-admin/micro-fiber-data`, `/master-admin/thermal-image-data`, `/master-admin/esp-firmware`
- Purpose: Manage operational datasets and workflows for maintenance and handovers.

UI Elements & Actions
- PM schedule matrix, handover document upload/signoff, dataset labeling UIs, firmware uploader with staged rollout.

Screenshot placeholder

![master-admin-preventive-maintenance](screenshots/master-admin--preventive-maintenance.png)

---

### Inventory & Fault Management
- Routes: `/master-admin/inventories`, `/master-admin/faulty-inventory`, `/master-admin/serviceticket-fault/service-tickets-fault-dashboard`, `/master-admin/fault-analysis-checklist`
- Purpose: Track inventories and manage faults.

UI Elements
- Inventory tables, allocation modal for tickets, faulty item lifecycle, checklist editor.

Common actions
- Issue spare to ticket, mark faulty item disposition, attach checklists to tickets.

Screenshot placeholder

![master-admin-inventories](screenshots/master-admin--inventories.png)

---

### Reports, AI & Tracking
- Routes: `/master-admin/monthlyreport`, `/master-admin/ai-model`, `/master-admin/robots-position`, `/master-admin/robots-tracker`, `/master-admin/mds-tracker`
- Purpose: Reporting, AI model management, and tracking tools.

UI Elements
- Report generator, AI model test runner, maps and track playback.

Screenshot placeholder

![master-admin-reports](screenshots/master-admin--reports.png)

---

### Customer Feedback, Subscriptions, Pricing, Expenses
- Routes: `/master-admin/customer-feedback`, `/master-admin/client-subscriptions`, `/master-admin/pricing`, `/master-admin/expenses`
- Purpose: Manage client feedback and commercial operations.

UI Elements
- Feedback queue, subscription list with renewals, pricing editor, expense claim lists.

Common actions
- Respond to feedback, create subscription, change pricing tiers, approve expenses.

Screenshot placeholder

![master-admin-customer-feedback](screenshots/master-admin--customer-feedback.png)

---

### System Logs, Opex, MQTT, Site Analysis, Sprints, MIS
- Routes: `/master-admin/email-logs`, `/master-admin/api-logger`, `/master-admin/db-dashboard`, `/master-admin/system-info`, `/master-admin/opexdata`, `/master-admin/mqtt-dashboard`, `/master-admin/site-analysis-dashboard`, `/master-admin/sprints-dashboard`, `/master-admin/mis-report`
- Purpose: Observability and advanced analytics.

UI Elements
- Logs viewer filters, DB health charts, MQTT metrics, OPEX cycle manager, site-analysis graphs, sprint trackers.

Screenshot placeholder

![master-admin-system-logs](screenshots/master-admin--system-logs.png)

---

### MDS Management, Row Data & Custom Notifications
- Routes: `/master-admin/mds-devices`, `/master-admin/replace-mds-lora/active-mdss`, `/master-admin/update-row-data`, `/master-admin/custom-notifications`
- Purpose: MDS device lifecycle and raw-data access.

UI Elements
- MDS list, replace LoRa wizard, raw row data explorer, notification templates manager.

Security note
- Raw row data access should be strictly logged and limited.

Screenshot placeholder

![master-admin-mds](screenshots/master-admin--mds.png)

---

## Appendix: Per-page Screenshot & Publication Checklist
For each page do:
1. Open the page in the console.
2. Capture full-page screenshot and at least 2-3 action flows (e.g., create/edit/delete). Name files consistently: `master-admin--<page-slug>--1.png`.
3. Paste screenshot into the corresponding section above and upload images to `docs/master-admin/screenshots/`.
4. Verify API flows (if you have backend access) by reproducing a create/edit call and include request/response snippets.
5. Mark the checklist item for the page as done.

## Next steps I can take for you
- Add these screenshots into `c:/WebDevelopment/taypro-console-frontend/docs/master-admin/screenshots/` and update the markdown sections to embed them.
- Split this single document into per-page markdown files under `c:/WebDevelopment/taypro-console-frontend/docs/role-docs/` (one file per page) if you prefer.
- Generate a printable PDF of this doc.

If you want me to insert real screenshots, attach them here or tell me where they are in the workspace and I will embed them.
