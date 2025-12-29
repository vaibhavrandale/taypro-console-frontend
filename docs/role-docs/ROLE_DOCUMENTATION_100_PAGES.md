# Taypro Console — Role Documentation (100 Descriptive Pages)

This document is a human-friendly, presentation-ready manual for the Taypro Console. It contains 100 numbered sections written in plain language and designed to support a 100‑page presentation or printed manual. Each numbered section below covers a single topic or screen, and includes an expanded narrative explanation, key UI elements (where applicable), typical user actions, recommended best practices, common troubleshooting tips, and notes you can use during your presentation.

How to use this file
- Read each numbered section aloud or paste it into a single slide or page for your presentation.
- No screenshots are included — leave space in your slides for images you prefer to add later.
- Sections 001–050 focus on Master Admin responsibilities and pages; 051–070 cover Client Admin; 071–100 cover Site Technician and supplemental operational guidance.

---

001. Master Admin — Dashboard
This is the central control page for the entire platform and the place a Master Admin starts each day. The dashboard provides a concise, at-a-glance summary of the entire system: how many clients are active, how many sites are being monitored, how many robots are online and operating, how many tickets are currently open, and whether any high-severity alerts require attention. Visually, the dashboard is divided into tiles and charts that are easy to read from a distance — ideal for briefing a team. Typical actions from this page include drilling into a client or site for details, acknowledging or escalating a critical alert, and launching quick actions such as creating a client account or opening an incident ticket. Best practice: use the dashboard each morning to triage urgent items and to confirm that scheduled tasks (timers, maintenance cycles, and batch jobs) completed overnight.

002. Master Admin — Clients Dashboard
The Clients Dashboard lists every client organization on the platform and provides an executive view of their health and billing status. For each client you can see the subscription tier, number of active sites, contact details for the client’s administrative users, and a short summary of outstanding items (open tickets, overdue maintenance, and low inventory warnings). From here a Master Admin can create a new client, assign a Project Admin, deactivate or reactivate a client account, and export client metadata for finance or legal review. During onboarding, this page is used to confirm contact details and to verify the initial list of sites assigned to a client. Best practice: keep an audit trail when making billing or role changes and confirm important updates with the client’s representative by email.

003. Master Admin — All Site Data
All Site Data is the global inventory of physical sites managed through the console. Each entry includes the site name, its client, GPS coordinates, associated gateways and robots, the date of the last cleaning session, and a short uptime/availability summary. Administrators commonly use this view to verify that all expected sites are registered and to bulk-correct coordinate or metadata errors. It is also the place to initiate a bulk import or export of site lists when moving data between systems. Best practice: validate a site import on a small subset first and keep backups of previous site metadata.

004. Master Admin — Site Management (per-site)
When you open a particular site, Site Management provides a detailed set of controls for that location — block definitions, robot assignments, downlink scheduling, and a debug log viewer for device-level investigation. This page is used to assign robots to blocks, to edit block-specific parameters, and to create or update downlink commands that the system will send to robots. It is also where you can examine raw logs for a given block if a robot reports an anomaly. Typical workflow: inspect the block layout, confirm assigned hardware, apply updates, and then test by issuing a controlled command. Best practice: document any manual changes to block assignments and keep stakeholders informed of operational changes.

005. Master Admin — Sites Coordinates
This specific page is dedicated to mapping and GIS adjustments: dropping pins, correcting coordinates, and handling bulk coordinate updates. For large facilities with many sub-blocks it is often quicker to upload a CSV with coordinates, preview changes, and then apply them in one operation. Administrators should confirm coordinate changes visually on the map before saving so automated processes (like geofenced punch-in or location-based cleaning) continue to function correctly.

006. Master Admin — All Site Cleaning Log
The cleaning log aggregator lists every cleaning session submitted by technicians and robots across all sites. Each log entry includes the robot or technician name, timestamp, block or row cleaned, photos or sensor evidence, and a verification status. Master Admins use this view to perform audits, to verify claims for client reports, and to detect unusual patterns in cleaning (for example, repeated failures in a block). If evidence is missing or suspicious, the admin can request clarification or open a service ticket to investigate.

007. Master Admin — Timers
Timers are the automation backbone for scheduled cleaning cycles. This page is where you create and manage recurring schedules (for example, daily runs at 10:00, or weather-triggered routines). A timer definition includes a name, a recurrence rule, targeted blocks or robots, and an optional payload or command. Master Admins can also run timers manually for testing or place timers into a disabled state globally for maintenance windows.

008. Master Admin — Timer Logs
Timer Logs show a running history of when timers triggered, whether the associated commands were acknowledged by devices, and any errors returned. This log is invaluable when a scheduled cleaning did not run as expected — the admin can correlate timer events with robot logs to determine whether the problem was scheduling, delivery, or device-level.

009. Master Admin — All Sites Gateways
Gateways (sometimes called routers) are the on-site network devices that connect robots and sensors to the cloud. This page lists gateway firmware versions, last-seen timestamps, and the set of blocks each gateway covers. Typical tasks include scheduling firmware updates and reassigning gateways to different sites during hardware consolidation.

010. Master Admin — All Site DPR
The Daily Progress Report (DPR) area collates the per-day handover reports and provides a way to sign off completion or to request additional evidence. DPRs often form the basis of monthly aggregated reports for clients and are therefore treated as quasi-official records. Administrators should review DPRs before they are included in a monthly client report.

011. Master Admin — Robots (Inventory)
This is the fleet inventory: every robot's serial, hardware id, LoRa module, firmware level, assigned site/block, and last telemetry. Common admin actions: add a new robot to the fleet, change a robot's assigned site, or decommission hardware. The page also supports bulk firmware rollouts for coordinated upgrades.

012. Master Admin — LoRa Configuration
LoRa profiles control the radio parameters used by devices. The LoRa Configuration area helps engineers and admins define profiles and apply them to robots or MDS devices. Because RF parameter changes are sensitive and can affect device connectivity, these actions are usually limited to senior ops staff and are logged for audit.

013. Master Admin — Replace LoRa (Active Robots)
Replacing a LoRa module is a physical activity that must be tracked in software. The replacement workflow guides the admin through selecting candidate robots, reserving a LoRa unit from inventory, recording the old and new serials, and generating a service ticket documenting the change. This preserves traceability if issues arise after hardware swaps.

014. Master Admin — Robot Battery & Temperature
Battery health and temperature are leading indicators of hardware reliability. This page offers charts and alerts that help admins schedule proactive battery replacement or cooling interventions before failures occur. Administrators should treat repeated temperature spikes as a priority and initiate inspections early.

015. Master Admin — Robot Commands
Master Admins have the ability to issue commands directly to robots for debugging and controlled interventions. Commands are sent via a form where admins can select devices and payload templates. For safety and compliance, every command is recorded along with the issuing user’s identity and timestamp.

016. Master Admin — Robot Log Details
Raw logs are here: telemetry frames, event histories, and structured error dumps. When a robot returns unexpected data, use the log viewer to find correlated events just before a failure; those timestamps typically guide technicians in reproducing and fixing the fault.

017. Master Admin — Weather Timer Notifications
This page manages triggers that run timers based on weather conditions (for example: postpone cleaning when rain probability exceeds a threshold). Admins can configure thresholds, recipients for notifications, and the automated behaviors that follow.

018. Master Admin — Timer Execution Notification View
When timers generate notifications (successful runs, failures, or conditions that suppressed execution) they are presented in this consolidated list. Admins can re-send notifications, examine delivery failures, and audit who acknowledged each event.

019. Master Admin — Weather Data Sitewise
For each site, the console stores the weather observations that informed decisions (temperature, humidity, wind, and the timestamp of the last fetch). Reviewing historical weather data alongside timer logs helps explain missed runs and refine trigger thresholds.

020. Master Admin — Users (Internal & External)
This area manages platform users, their roles, and security settings. Admins add and remove users, assign roles such as Project Admin or Technician, and enforce MFA settings. Role changes are logged and are a common audit window during security reviews.

021. Master Admin — Technician Attendance
Attendance records are used for payroll and performance metrics. The attendance page lists daily punches, exceptions, and allows approved corrections. Payroll exports are often generated from this page on a monthly cadence.

022. Master Admin — User Performance Dashboard
Performance metrics help managers identify high-performing technicians or those who may need support. This dashboard aggregates tickets closed, PMs completed, punctuality, and other KPIs into easy-to-read charts.

023. Master Admin — Chat
Chat provides both support and audit trails of conversations. Administrators can search chat transcripts, escalate conversations to support teams, and attach logs to conversations when needed.

024. Master Admin — Preventive Maintenance Dashboard
The PM dashboard shows scheduled checks, assignments, and completion rates. Admins create PM templates and assign them across sites to ensure consistent maintenance practices and compliance.

025. Master Admin — Project Handover
This page supports the formal handover of projects: uploading required documents, tracking checklists, and collecting sign-offs. A complete handover record makes audits and future service handoffs much smoother.

026. Master Admin — Micro-fiber Data
Micro-fiber data is generally used to train detection models. The data curation interface allows admins to approve or reject labeled images and to assemble datasets for retraining.

027. Master Admin — Thermal Image Data
Thermal images are treated as evidence for hardware or environmental anomalies. Admins can tag images, link them to tickets, and include them in forensic reviews.

028. Master Admin — ESP Firmware
Firmware management is critical. Admins stage firmware uploads, manage staged rollouts across subsets of devices, and have the ability to rollback quickly when issues are detected.

029. Master Admin — Inventories (Service)
The inventory module tracks parts and spares used by technicians. It includes reorder thresholds and vendor metadata so administrators can keep replacement parts on-hand.

030. Master Admin — Faulty Inventory
Faulty items are tracked separately so the team can record incident reasons, warranty claims, and final dispositions (repair or scrap). This keeps stock records accurate and helps with vendor claims.

031. Master Admin — ServiceTicket Fault Dashboard
This analytic view helps identify recurring faults and their frequency. It is used to prioritize engineering changes or to issue large-scale preventive maintenance if a pattern emerges.

032. Master Admin — Fault Analysis Checklist
Standardized checklists expedite troubleshooting and ensure technicians do not skip steps. Master Admins create and refine these checklists over time, based on recurring failure modes.

033. Master Admin — Monthly Sites Report
Monthly reporting aggregates site performance, DPRs, cleaning compliance, and uptime into a single package for clients. Admins can schedule these reports and deliver them automatically.

034. Master Admin — AI Model (Micro-Fiber)
This page manages model versions and test runs for micro-fiber detection. Admins can test new models against a validation set and, if acceptable, publish them.

035. Master Admin — Robots Position
Position tracking visualizes the paths robots take during cleaning cycles. Playback features are helpful when investigating coverage gaps or collisions.

036. Master Admin — Robots Tracker
The tracker shows live status, including speed, battery, and current action. It's the quickest way to spot a robot that has gone offline during a run.

037. Master Admin — MDS Tracker
MDS devices provide environmental monitoring; this tracker shows signal quality, last seen, and event frames for each unit.

038. Master Admin — Customer Feedback
A centralized feedback queue allows admins to triage complaints, identify service level issues, and close the loop with clients by logging responses.

039. Master Admin — Client Subscriptions
Subscription management allows admins to see plan entitlements, renewal dates, and invoice history. Administrators often coordinate upgrades and downgrades from here.

040. Master Admin — Pricing
Pricing lets an administrator design offering tiers and toggle features on or off at a plan level. This is typically used by commercial teams with audit logging.

041. Master Admin — Expenses
Expense claims originate here and route through approval workflows. Admins review receipts and approve reimbursements when appropriate.

042. Master Admin — Email Logs
Email logs provide deliverability details and template usage. They help troubleshoot missed notifications or template errors.

043. Master Admin — API Logger
This is used for troubleshooting integration issues. Every API call is captured with status codes and payloads to assist developers and support staff.

044. Master Admin — DB Dashboard
Database monitoring metrics are commonly restricted to senior staff. This page displays query performance and storage health and aids operational debugging.

045. Master Admin — System Info
The system info page is an at-a-glance reference for deployed versions, environment variables, and the status of connected services.

046. Master Admin — Opex Data
Opex data documents operational costs and evidence for expense cycles. Admins verify cycles and generate certificates when operations meet the required standards.

047. Master Admin — MQTT Dashboard
MQTT metrics show message throughput, topic health, and message frames; this is useful for diagnosing message loss and for validating device telemetry.

048. Master Admin — Site Analysis Dashboard
Site analysis is an investigative tool for detailed telemetry, signal metrics, and cleaning efficiency. It's used by analysts to recommend site-specific improvements.

049. Master Admin — Sprints Dashboard
For the internal product team, the sprint tracker documents ongoing work and assigned owners; this keeps delivery transparent across operations and engineering.

050. Master Admin — MIS Report
MIS reports are preconfigured or custom reports tailored for executive consumption; they are used to inform business decisions and strategic planning.

051. Client Admin — Dashboard
The Client Admin dashboard mirrors the Master Admin view but limited to a single client. It emphasizes items that matter to the client — site compliance, robot availability, and open tickets. Client administrators use this page to prepare their internal reports and to request support from the provider.

052. Client Admin — Statistics
Client statistics focus on measures like area cleaned, modules cleaned, robots assigned, and water saved. Visual charts such as pie charts and bar graphs make trends obvious and help prioritize site-specific interventions.

053. Client Admin — Robot Commands
Clients are allowed a limited set of robot commands for day-to-day operations. This ensures they can respond to local needs without risking platform-wide issues. The UI enforces confirmation and shows a brief execution history.

054. Client Admin — Client Tickets
Client tickets are the primary customer-facing support channel. Client Admins create tickets with images, priority, and site details and can track their lifecycle until resolution.

055. Client Admin — Site Management (All Site Data)
This view shows the client’s own site list; it is used to keep contact details current and to review assigned blocks and timers. Clients should not be able to change platform-level settings but can maintain site-specific meta.

056. Client Admin — Site Management (per-site)
Client Admins manage site-specific settings such as local contacts, timers, and on-site roles. They coordinate with Master Admins for hardware changes or gateway reassignments.

057. Client Admin — Timers
Client timers enable localized automation under the client’s control. Clients can create and manage timers for their own sites, but cannot alter system-wide or cross-client timers.

058. Client Admin — Preventive Maintenance Dashboard
The client PM dashboard lists scheduled checks that the client is responsible for or supervises. Client Admins can assign or confirm technicians and review completion evidence.

059. Client Admin — Cleaning Log (Sites)
Clients verify or comment on cleaning logs submitted for their sites. This helps them confirm service levels and raise disputes where appropriate.

060. Client Admin — Robots Tracking
This feature provides clients with visibility into robot locations and basic health metrics so they can audit operations and answer internal stakeholder queries.

061. Client Admin — External Users
Client Admins invite and manage external users who need access to site-specific data. They assign permissions and restrict access to only the relevant sites.

062. Client Admin — Chat
The chat interface lets client staff escalate issues and request support. Chats are stored and can be linked to tickets for traceability.

063. Client Admin — MDS Tracker
Clients that use MDS devices can monitor signal and battery levels through this interface. It is helpful for anticipating maintenance or repositioning devices.

064. Client Admin — Subscription View
Clients can view plan details, usage limits, and renewal dates. Billing actions may require interaction with the provider depending on contract terms.

065. Client Admin — Preventive Maintenance List
A detailed list of upcoming and completed PM tasks for client sites; useful for compliance and internal handoffs.

066. Client Admin — Client Ticket Pages (Detailed)
Complete ticket views allow clients to examine timelines, add comments, and upload follow-up evidence; transparency reduces back-and-forth.

067. Client Admin — MDS Operating Client
An operating view for MDS devices provides clients with a simple frame viewer and basic operational controls relevant to their deployments.

068. Client Admin — Subscription View Page (Detailed)
Detailed billing history and invoice downloads provide clients with financial records for reconciliation with internal accounting systems.

069. Client Admin — Statistics Details
Deep dives into chart data allow clients to prepare presentations and to analyze trends by block, robot, or time window.

070. Client Admin — Pricing & Subscriptions
While final billing changes are controlled by the provider, the client-facing pricing area shows available upgrades, add-ons, and feature details that can be requested.

071. Site Technician — Dashboard
Technicians see a concise task list tailored to their shift and assigned sites. The dashboard highlights urgent tickets, upcoming PM tasks, and provides quick links to the robot operating pages they need daily.

072. Site Technician — Robot Commands
On a technician's device, the robot command set is intentionally limited and designed for quick field interventions such as starting a local clean, pausing, or returning robots to dock.

073. Site Technician — All Site Data
Technicians access the subset of site data they need: block lists, assigned robots, and recent logs, enabling fast troubleshooting without exposing global configuration.

074. Site Technician — Site Management (Block-level)
Local toggles and notes let technicians mark blocks as temporarily unavailable, leave operator notes, or flag a block for follow-up during the next PM.

075. Site Technician — Timers (Site View)
Technicians can view timers that affect their site and, when permitted, trigger a timer manually for an immediate run (useful during testing or special operations).

076. Site Technician — Cleaning Log (Sites)
Each technician submits sessions to the cleaning log with an evidence photo, the number of rows cleaned, battery usage, and any anomalies noticed during the run.

077. Site Technician — Micro-fiber Data
Technicians capture images for the micro-fiber dataset and provide contextual metadata that improves label quality and model performance over time.

078. Site Technician — Service Tickets
Field technicians create and update tickets with photos and immediate notes; this is the primary mechanism for creating a service record that the remote team can act upon.

079. Site Technician — DPR (Daily Progress Report)
DPRs document shift activity and are used for handovers; technicians should be diligent in including photos and clear notes to minimize rework.

080. Site Technician — User Performance
Technicians can view their personal KPIs, which encourages ownership and highlights opportunities for coaching or recognition.

081. Site Technician — Inventory
Access to inventory helps technicians request and record spare usage. The system records the part, ticket reference, and remaining stock so reorders can occur timely.

082. Site Technician — Preventive Maintenance Dashboard
Technicians perform PMs using checklists that enforce a consistent process and provide documentation for compliance audits.

083. Site Technician — Punch In/Out
Geofenced punch-in reduces fraud and ties attendance to site activity. Punch correction workflows provide a controlled method to fix legitimate errors.

084. Site Technician — User Site Attendance
Team attendance pages allow supervision and quick verification of who was on-site during a shift for safety and payroll purposes.

085. Site Technician — Expenses
Expense submission mirrors standard forms: category, amount, receipt, and notes. Managers review and approve claims in a timely fashion.

086. Site Technician — Robots Tracker
Local tracking with playback helps technicians locate a missing robot or confirm whether a robot completed an assigned path.

087. Site Technician — Update Row Data (Row Data Viewer)
Raw rows and telemetry frames are sometimes required for low-level troubleshooting; technicians can link relevant rows to tickets for backend engineers to inspect.

088. Site Technician — Inventory Tab (Detailed)
Detailed inventory analytics help technicians anticipate shortages and plan site resupplies ahead of critical events.

089. Site Technician — Preventive Technician Notifications
Notifications ensure technicians are reminded of upcoming PMs and overdue tasks, improving on-time completion rates.

090. Site Technician — Common Workflows (SOP)
This section provides step-by-step SOPs for common tasks: starting a cleaning session, replacing a LoRa, creating a ticket, submitting DPRs, and completing PM checklists. Each SOP includes expected outcomes and escalation steps.

091. Supplement — Security & MFA
Security guidance recommends mandatory MFA for all admin roles, minimum password policies, session timeouts, and role-based escalation policies. Implementing these practices reduces risk and protects client data.

092. Supplement — Audit & Logging
A robust audit plan documents who performed sensitive actions, the prior state, and the new state after changes. Retention policies and restricted log access are essential for compliance.

093. Supplement — Permission Matrix
A clear RBAC matrix ensures each role has the right level of access: Master Admin (platform-wide), Client Admin (client-scoped), Site Technician (site-scoped operations). This minimizes accidental errors and simplifies training.

094. Supplement — API Endpoint Mapping
Technical teams will appreciate a short list of key endpoints for integration, including expected request/response shapes and required auth scopes. This supports automation and reporting tasks.

095. Supplement — UI Component Mapping
Developers and QA can map routes to component files and find the components responsible for major pages — useful when you are asking engineers about a specific UI behavior.

096. Supplement — Onboarding Checklist
Standard onboarding steps for each role: account creation, MFA setup, initial walk-through, sample ticket creation, and a small acceptance test to confirm access and basic workflows.

097. Supplement — Troubleshooting Guide
Common issues and triage steps are recorded here: robot offline, gateway down, timer failure, and API errors. For each problem there are quick checks and evidence to collect before escalating.

098. Supplement — Deployment Notes
A concise guide to deploying new releases, environment variables, and rolling back a failed release. Keep this with operations documentation for rapid recovery.

099. Supplement — Data Retention Policy
This section outlines recommended retention windows for logs, images, and user data, and suggests archival paths for older data to reduce storage costs while maintaining compliance.

100. Supplement — Next Steps & Publishing
Use these 100 sections to build your presentation: copy each section into a slide or a document page, add screenshots where you like, and run a rehearsal with stakeholder accounts. If you prefer, I can split this file into 100 separate markdown files for printing or web hosting.


074. Site Technician — Site Management (Block-level)
- Route: `/site-technician/site-management`
- Purpose: Limited site-level controls such as toggles and local notes.
- UI: block toggles, local notes, quick-start operations.
- Screenshot: `screenshots/074_site-technician_site-management.png`.

075. Site Technician — Timers (Site View)
- Route: `/site-technician/timers`
- Purpose: See timers applicable to technician's site and optionally trigger manual runs.
- UI: site timer list, last run status, disable checkbox (if permitted).
- Screenshot: `screenshots/075_site-technician_timers.png`.

076. Site Technician — Cleaning Log (Sites)
- Route: `/site-technician/cleaning-log-sites`
- Purpose: Submit cleaning session entries with evidence and metrics.
- UI: submission form (robot, row, distance, photos, battery start/end), list of recent entries.
- Workflow: complete session → upload photos → submit → link to DPR.
- Screenshot: `screenshots/076_site-technician_cleaning-log-sites.png`.

077. Site Technician — Micro-fiber Data
- Route: `/site-technician/micro-fiber-data`
- Purpose: Capture images for micro-fiber dataset and submit for AI labeling.
- UI: upload form, metadata (site/block/robot), submit queue.
- Screenshot: `screenshots/077_site-technician_micro-fiber-data.png`.

078. Site Technician — Service Tickets
- Route: `/site-technician/service-tickets`
- Purpose: Create, update, and resolve service tickets on the ground.
- UI: create form with photo, priority, site/block; ticket timeline.
- Workflow: create → attach logs → assign to support → close after fix.
- Screenshot: `screenshots/078_site-technician_service-tickets.png`.

079. Site Technician — DPR (Daily Progress Report)
- Route: `/site-technician/dpr`
- Purpose: Submit DPR entries with shift-wise data, photos and handover notes.
- UI: DPR form, attachments, previous DPR history for reference.
- Workflow: complete DPR → submit → notify shift lead.
- Screenshot: `screenshots/079_site-technician_dpr.png`.

080. Site Technician — User Performance
- Route: `/site-technician/user-performance`
- Purpose: Technician personal performance metrics and history.
- UI: tasks completed, tickets closed, PM completions, attendance correlation.
- Screenshot: `screenshots/080_site-technician_user-performance.png`.

081. Site Technician — Inventory
- Route: `/site-technician/inventory`
- Purpose: On-site spare parts list, request replenishment and issue parts to jobs.
- UI: inventory table, request form, consumption log.
- Workflow: issue spare → decrement → record ticket reference.
- Screenshot: `screenshots/081_site-technician_inventory.png`.

082. Site Technician — Preventive Maintenance Dashboard
- Route: `/site-technician/preventive-maintanance-dashboard`
- Purpose: Technician PM checklist execution and notifications.
- UI: assigned PMs, checklist items, attachments.
- Workflow: follow checklist → upload evidence → mark complete.
- Screenshot: `screenshots/082_site-technician_preventive-maintanance-dashboard.png`.

083. Site Technician — Punch In/Out
- Route: `/site-technician/punch-in-punch-out`
- Purpose: Record shift start and end times (geofence recommended).
- UI: punch button, geofence status, manual correction request.
- Workflow: punch in at site → start tasks → punch out at end.
- Screenshot: `screenshots/083_site-technician_punch-in-punch-out.png`.

084. Site Technician — User Site Attendance
- Route: `/site-technician/user-site-attendance`
- Purpose: View team attendance and request corrections.
- UI: team list, daily/weekly view, correction requests.
- Screenshot: `screenshots/084_site-technician_user-site-attendance.png`.

085. Site Technician — Expenses
- Route: `/site-technician/expenses`
- Purpose: Submit expense claims for approvals with receipts.
- UI: expense form, attachment upload, approval status.
- Workflow: submit claim → manager approves/rejects → finance processes payment.
- Screenshot: `screenshots/085_site-technician_expenses.png`.

086. Site Technician — Robots Tracker
- Route: `/site-technician/robots-tracker`
- Purpose: Local robot tracking and playback for troubleshooting.
- UI: map, robot list, playback controls.
- Screenshot: `screenshots/086_site-technician_robots-tracker.png`.

087. Site Technician — Update Row Data (Row Data Viewer)
- Route: `/site-technician/update-row-data`
- Purpose: Read-only access to raw telemetry/frames to support troubleshooting.
- UI: raw records, filter by robot/time, copy link to ticket.
- Screenshot: `screenshots/087_site-technician_update-row-data.png`.

088. Site Technician — Inventory Tab (Detailed)
- Route: `/site-technician/inventory-tab`
- Purpose: Detailed per-site inventory analytics, low-stock alerts, and replenishment status.
- UI: thresholds, reorder recommendations, vendor info.
- Screenshot: `screenshots/088_site-technician_inventory-tab.png`.

089. Site Technician — Preventive Technician Notifications
- Route: `/site-technician/preventive-technician-notifications`
- Purpose: Notifications list for upcoming/overdue PM tasks and acknowledgements.
- UI: notification list, ack button, link to PM checklist.
- Screenshot: `screenshots/089_site-technician_preventive-technician-notifications.png`.

090. Site Technician — Common Workflows (SOP)
- Purpose: Consolidated SOPs for common field tasks: Start/stop robot, replace LoRa, create ticket, submit DPR, perform PM.
- Format: step-by-step with expected results and rollback steps.
- Recommendation: include in-site quick help and link to videos.
- Screenshot: `screenshots/090_site-technician_common-workflows.png`.

091. Supplement — Security & MFA
- Purpose: Recommended security policies for all roles: enforce MFA for admins, session timeouts, password policies, and device use policies.
- Steps: enable MFA → enforce password complexity → enable session expiry.
- Screenshot: `screenshots/091_supplement_security-and-mfa.png`.

092. Supplement — Audit & Logging
- Purpose: Audit plan for critical actions: device control, billing operations, user role changes. Retention and access policies.
- Key lists: actions to log, retention period recommendations, access controls for logs.
- Screenshot: `screenshots/092_supplement_audit-and-logging.png`.

093. Supplement — Permission Matrix
- Purpose: Detailed RBAC mapping of capabilities across Master Admin, Client Admin, Site Technician, and other internal roles.
- Format: table (module × role) with CRUD indicators and notes.
- Screenshot: `screenshots/093_supplement_permission-matrix.png`.

094. Supplement — API Endpoint Mapping
- Purpose: Reference of primary API endpoints that correspond to UI actions (clients, sites, robots, timers, tickets), with sample requests.
- Example: POST `/api/tickets` (body example), GET `/api/robots/:id/logs`.
- Screenshot: `screenshots/094_supplement_api-endpoint-mapping.png`.

095. Supplement — UI Component Mapping
- Purpose: Map from routes to React component files in `src/` for developers and QA (helpful for linking screenshots to code).
- Format: route → component file path → key props/events.
- Screenshot: `screenshots/095_supplement_ui-component-mapping.png`.

096. Supplement — Onboarding Checklist
- Purpose: Step-by-step onboarding for new Master/Client Admins and Technicians: accounts, training, initial site verification.
- Items: create account, MFA setup, initial walkthrough, sample ticket creation, sample PM completion.
- Screenshot: `screenshots/096_supplement_onboarding-checklist.png`.

097. Supplement — Troubleshooting Guide
- Purpose: Common issues and step-by-step fixes: robot offline, gateway down, timer failure, DB issues.
- Format: issue → quick checks → escalation path → logs to collect.
- Screenshot: `screenshots/097_supplement_troubleshooting-guide.png`.

098. Supplement — Deployment Notes
- Purpose: Deployment checklist and environment variables for operations teams.
- Items: build steps, env config, database migrations, backup & rollback procedures.
- Screenshot: `screenshots/098_supplement_deployment-notes.png`.

099. Supplement — Data Retention Policy
- Purpose: Recommended retention for logs, images and user data; archival strategies and purge schedules.
- Items: retention windows, archival storage, GDPR/PIPL notes if applicable.
- Screenshot: `screenshots/099_supplement_data-retention-policy.png`.

100. Supplement — Next Steps & Publishing
- Purpose: How to convert this 100-section file into deliverables: per-page markdown files, add screenshots, host docs.
- Steps:
  1. Split this file into `docs/role-docs/001_...` through `100_...`.
  2. Capture screenshots per checklist and place under `docs/role-docs/screenshots/`.
  3. Run a review with two representative accounts (Client Admin and Technician) to validate flows.
  4. Export to PDF and provide client with a packaged manual and quick-start guide.
- Additional: I can split into per-page files and embed screenshots if you upload them or point me to paths.
- Screenshot: `screenshots/100_supplement_next-steps.png`.

---

If you want, I will now:
- Option A: Split this file into 100 separate markdown files under `c:/WebDevelopment/taypro-console-frontend/docs/role-docs/` (I can proceed now). 
- Option B: Keep a single file and embed screenshots you upload. 
- Option C: Produce a printable PDF of this file.

Which option do you prefer? Also tell me if you want me to start splitting into separate files now.
