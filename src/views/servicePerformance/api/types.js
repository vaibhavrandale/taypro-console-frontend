/**
 * Response shapes of /api/v1/engineer-performance. Every metric that the
 * backend cannot calculate is null or { status: "unavailable", reason }.
 *
 * @typedef {{ status: "unavailable", reason: string }} Unavailable
 *
 * @typedef {Object} ScoreKpi
 * @property {string} key
 * @property {"eligible"|"excluded"|"zeroed"|"informational"|"disabled"} status
 * @property {number|null} [score]
 * @property {number} weight
 * @property {string} [reason]
 *
 * @typedef {Object} Score
 * @property {number|null} overall_score
 * @property {number} eligible_kpi_count
 * @property {number} excluded_kpi_count
 * @property {"complete"|"partial"} score_completeness
 * @property {string} formula
 * @property {number} config_version
 * @property {ScoreKpi[]} kpis
 *
 * @typedef {Object} Sla
 * @property {number} met
 * @property {number} breached
 * @property {number} eligible
 * @property {number} [target_missing]
 * @property {number|null} compliance_percent
 * @property {"calculable"|"unavailable"} [status]
 * @property {string|null} [reason]
 *
 * @typedef {Object} TicketSummary
 * @property {number} created_in_period
 * @property {number} current_open
 * @property {number} resolved_in_period
 * @property {number|null} overdue_open
 * @property {number|null} average_resolution_days
 * @property {number|null} median_resolution_days
 * @property {Sla} sla
 * @property {number} delay_reason_missing
 * @property {{site_id:string, created:number, open:number, resolved:number}[]} by_site
 * @property {{fault_type:string, resolved:number, average_resolution_days:number|null}[]} [by_fault]
 *
 * @typedef {Object} UptimeSiteMonth
 * @property {string} site_id
 * @property {number} year
 * @property {number} month
 * @property {"available"|"missing"} status
 * @property {number|null} monthly_cleaning_uptime
 * @property {number|null} total_assigned_robots
 * @property {boolean} below_target
 *
 * @typedef {Object} Uptime
 * @property {"available"|"unavailable"} status
 * @property {"robot_weighted_mean_of_stored_monthly_percentages"|"unweighted"|"unavailable"} aggregation
 * @property {number|null} cleaning_uptime
 * @property {string[]} missing_sites
 * @property {string[]} below_target_sites
 * @property {UptimeSiteMonth[]} by_site
 * @property {string} note
 *
 * @typedef {Object} SiteConfiguration
 * @property {string} site_id
 * @property {boolean} configuration_complete
 * @property {"ready"|"configuration_incomplete"} configuration_status
 * @property {string[]} missing_fields
 * @property {boolean} warranty_inconsistent
 * @property {string|null} commissioning_date
 * @property {"in_warranty"|"out_of_warranty"|null} warranty_status
 * @property {string|null} warranty_date
 * @property {"PBT"|"MF"|"PBT+MF"|null} cloth_type
 * @property {"ground"|"rooftop"|null} mounting_type
 * @property {string} [analysis_status]
 * @property {string[]} [metrics_calculable]
 * @property {string[]} [metrics_unavailable]
 * @property {"available"|"missing"} [uptime_status]
 *
 * @typedef {Object} PerformanceReport
 * @property {{from:string, to:string, label:string}} period
 * @property {string} calculated_at
 * @property {string[]} limitations
 * @property {{sites: SiteConfiguration[], incomplete_count:number|null, note?:string}} configuration
 * @property {TicketSummary} service_tickets
 * @property {TicketSummary} client_tickets
 * @property {{created_in_period:number, current_open:number, resolved_in_period:number}} combined
 * @property {{completed:number, scheduled:Unavailable, pending:Unavailable, overdue:Unavailable, on_time_completion:Unavailable, by_site:{site_id:string, completed:number}[], note:string}} preventive_maintenance
 * @property {{created_in_period:number, awaiting_dispatch:number, delayed_beyond_threshold:number|null, threshold_days:number|null, on_time_percent:number|null, average_open_age_days:number|null, request_count:number, dispatch_date:Unavailable, transfer_date:Unavailable, ticket_link:Unavailable}} materials
 * @property {Uptime} uptime
 * @property {{status:string, percent:number|null, expected:number, matched:number, missing?:number, reason?:string}} consumption
 * @property {Score} score
 * @property {{user_id:string, username:string, email:string, assigned_site_count:number}|null} engineer
 * @property {string[]|null} site_ids
 *
 * @typedef {Object} TicketDetailRow
 * @property {string} _id Ticket record id, used by saveDelayReason.
 * @property {"service_ticket"|"client_ticket"} kind
 * @property {string} ticket_id
 * @property {string} site_id
 * @property {string} [fault_type]
 * @property {string} [status]
 * @property {string|null} created_at
 * @property {null} assignment_at
 * @property {string|null} resolved_at
 * @property {number|null} duration_days
 * @property {number|null} sla_target_days
 * @property {number|null} [sla_breach_days]
 * @property {boolean|null} resolved_late
 * @property {string|null} delay_reason_code
 * @property {string|null} delay_reason_remarks
 * @property {boolean} delay_reason_missing
 *
 * @typedef {Object} Page
 * @property {number} total
 * @property {number} page
 * @property {number} limit
 * @property {Array} data
 *
 * @typedef {Object} PerformanceConfig
 * @property {number} version
 * @property {"draft"|"active"|"archived"} status
 * @property {string|null} effective_from
 * @property {number|null} uptime_target
 * @property {number|null} client_ticket_sla_days
 * @property {number|null} material_delay_days
 * @property {{key:string, label:string, enabled:boolean}[]} categories
 * @property {{code:string, label:string, enabled:boolean}[]} delay_reason_codes
 * @property {{key:string, name:string, description?:string, category:string, enabled:boolean, strategy:string, target:number|null, threshold:number|null, weight:number, missing_data:"exclude"|"zero"}[]} kpis
 * @property {{name?:string, email?:string}} [created_by]
 * @property {string} [reason]
 * @property {string} [createdAt]
 *
 * @typedef {{ status: number|null, message: string, code?: string }} ApiError
 */
export {};
