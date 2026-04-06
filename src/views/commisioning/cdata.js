export const clients = [
  {
    _id: "67fe31d1c90eb5efca717400",

    client_id: "blupine_energy",
    client_name: "Blupine Energy",
    logo: "https://res.cloudinary.com/decyim6cd/image/upload/v1744712141/client-logo/djinllcces5zwqdvxrzw.png",
    is_delete: false,
    createdAt: "2025-04-15T10:15:45.377Z",
    updatedAt: "2025-04-15T10:15:45.377Z",

    __v: 0,
  },
  {
    _id: "67ff5c1f4cb2b1e5c8cb2897",
    client_id: "avaada_clean_projects_private_limited",
    client_name: "Avaada Clean Projects Private Limited",
    logo: "https://res.cloudinary.com/decyim6cd/image/upload/v1744788506/client-logo/xxne8my58xwnahz6xrqy.png",
    is_delete: false,
    createdAt: "2025-04-16T07:28:31.586Z",
    updatedAt: "2025-04-16T07:28:31.586Z",
    __v: 0,
  },
  {
    _id: "67ff5d524cb2b1e5c8cb29a5",
    client_id: "acme_solar_holdings_private_limited",
    client_name: "ACME Solar Holdings Private Limited",
    logo: "https://res.cloudinary.com/decyim6cd/image/upload/v1744788815/client-logo/lqamyg6qfzkznf5buiy6.png",
    is_delete: false,
    createdAt: "2025-04-16T07:33:38.275Z",
    updatedAt: "2025-04-16T07:33:38.275Z",
    __v: 0,
  },
  {
    _id: "67ff5f5c4cb2b1e5c8cb2b79",
    client_id: "_tata_power_green_energy_limited",
    client_name: " Tata Power Green Energy Limited",
    logo: "https://res.cloudinary.com/decyim6cd/image/upload/v1744789337/client-logo/yeqsukvkmmykv4rmazlf.png",
    createdAt: "2025-04-16T07:42:20.679Z",
    updatedAt: "2025-04-16T07:42:20.679Z",
    __v: 0,
  },
];

export const sites = [
  {
    _id: "67ff71ef95fb9f10f7b68f1d",
    site_id: "avaada_agar",
    site_type: "capex",
    siteName: "Avaada Clean Projects Private Limited",
    location: "Agar,MP",
    logo: "https://res.cloudinary.com/decyim6cd/image/upload/v1744788506/client-logo/xxne8my58xwnahz6xrqy.png",
    client_id: "avaada_clean_projects_private_limited",
    password: "avaada_agar@taypro",
    is_delete: false,

    createdAt: "2025-04-16T09:01:35.672Z",

    updatedAt: "2026-03-26T12:21:39.801Z",

    __v: 0,
    set_warehouse: "Avaada Agar MP - TPL",
    is_weather_cleaning_enabled: false,
  },
  {
    _id: "67ff728795fb9f10f7b69022",
    site_id: "avaada_bandha",
    site_type: "capex",
    siteName: "Avaada Clean Projects Private Limited",
    location: "Banda,UP",
    logo: "https://res.cloudinary.com/decyim6cd/image/upload/v1744788506/client-logo/xxne8my58xwnahz6xrqy.png",
    client_id: "avaada_clean_projects_private_limited",
    password: "avaada_bandha@taypro",
    is_delete: false,
    createdAt: "2025-04-16T09:04:07.900Z",
    updatedAt: "2026-03-30T11:14:08.650Z",
    __v: 0,
    set_warehouse: "Avaada Banda UP - TPL",
    is_weather_cleaning_enabled: false,
  },
];

export const robot_commissioning_doc = [
  {
    _id: "67ff7a9e95fb9f10f7b69b1c",

    // 🔹 Basic Info
    robot_no: "TAYPRO-001",
    site_id: "avaada_agar",
    client_id: "avaada_clean_projects_private_limited",
    client_name: "Avaada Clean Projects Private Limited",
    site_location: "Agar,MP",
    commissioning_date: null,
    block: "Block-1",
    status: "completed", // pending | in_progress | completed | failed
    commissioning_certificate_id: null,
    robot_type: "Automatic",
    // 🔹 Step-based Checklist
    checklist: {
      power_on: {
        status: true,
        timestamp: "2025-04-17T09:01:00.000Z",
        remarks: "Robot powered successfully",
      },

      portal_connectivity: {
        is_online: true,
        checked_at: "2025-04-17T09:03:00.000Z",
        signal_strength: "good",
        remarks: "Device visible in portal",
      },

      movement_test: {
        started: true,
        direction_check: {
          forward: true,
          reverse: true,
          left: true,
          right: true,
        },
        remarks: "Movement normal",
      },

      speed_and_alignment: {
        speed_ok: true,
        alignment_ok: true,
        deviation: "none", // or degrees/mm if needed
        remarks: "Aligned properly",
      },

      cleaning_test: {
        brush_rotation: true,
        cleaning_efficiency: "good", // poor | average | good
        remarks: "Cleaning working fine",
      },

      physical_inspection: {
        wheels: "good", // good | worn | damaged
        brushes: "good",
        pipes: "good",
        sensors: "good",
        frame: "good",
        issues_found: [],
      },

      safety_checks: {
        emergency_switch: true,
        obstacle_detection: true,
        auto_stop: true,
        remarks: "All safety checks passed",
      },
    },

    // 🔹 Final Result Summary
    summary: {
      overall_status: "pass", // pass | fail
      issues: [],
      recommendation: "Ready for deployment",
    },

    // 🔹 Activity Logs (Audit Trail)
    last_activity: [
      {
        name: "Vishwajeet Usnale",
        email: "vishwajeet.u@taypro.in",
        profile_image: "https://randomuser.me/api/portraits/men/2.jpg",
        timestamp: "2025-04-16T09:04:07.672Z",
        userId: "67c2f626e85ffe52171c3774",
        action: "created",
        details: "Commissioning document created",
      },
      {
        name: "Vishwajeet Usnale",
        action: "updated",
        details: "Checklist completed",
        timestamp: "2025-04-17T10:00:00.000Z",
      },
    ],

    createdAt: "2025-04-17T09:15:00.000Z",
    updatedAt: "2025-04-17T10:00:00.000Z",
    __v: 0,
  },
  {
    _id: "67ff7a9e95fb9f10f7b69b1d",

    // 🔹 Basic Info
    robot_no: "TAYPRO-002",
    site_id: "avaada_agar",
    client_id: "avaada_clean_projects_private_limited",
    client_name: "Avaada Clean Projects Private Limited",
    site_location: "Agar,MP",

    block: "Block-2",
    status: "submitted", // pending | in_progress | completed | failed
    commissioning_certificate_id: "67ff7a9e95fb9f10f7b69b1c",
    commissioning_date: "2025-04-17T09:00:00.000Z",
    robot_type: "Automatic",
    // 🔹 Step-based Checklist
    checklist: {
      power_on: {
        status: true,
        timestamp: "2025-04-17T09:01:00.000Z",
        remarks: "Robot powered successfully",
      },

      portal_connectivity: {
        is_online: true,
        checked_at: "2025-04-17T09:03:00.000Z",
        signal_strength: "good",
        remarks: "Device visible in portal",
      },

      movement_test: {
        started: true,
        direction_check: {
          forward: true,
          reverse: true,
          left: true,
          right: true,
        },
        remarks: "Movement normal",
      },

      speed_and_alignment: {
        speed_ok: true,
        alignment_ok: true,
        deviation: "none", // or degrees/mm if needed
        remarks: "Aligned properly",
      },

      cleaning_test: {
        brush_rotation: true,
        cleaning_efficiency: "good", // poor | average | good
        remarks: "Cleaning working fine",
      },

      physical_inspection: {
        wheels: "good", // good | worn | damaged
        brushes: "good",
        pipes: "good",
        sensors: "good",
        frame: "good",
        issues_found: [],
      },

      safety_checks: {
        emergency_switch: true,
        obstacle_detection: true,
        auto_stop: true,
        remarks: "All safety checks passed",
      },
    },

    // 🔹 Final Result Summary
    summary: {
      overall_status: "pass", // pass | fail
      issues: [],
      recommendation: "Ready for deployment",
    },

    // 🔹 Activity Logs (Audit Trail)
    last_activity: [
      {
        name: "Vishwajeet Usnale",
        email: "vishwajeet.u@taypro.in",
        profile_image: "https://randomuser.me/api/portraits/men/2.jpg",
        timestamp: "2025-04-16T09:04:07.672Z",
        userId: "67c2f626e85ffe52171c3774",
        action: "created",
        details: "Commissioning document created",
      },
      {
        name: "Vishwajeet Usnale",
        action: "updated",
        details: "Checklist completed",
        timestamp: "2025-04-17T10:00:00.000Z",
        email: "vishwajeet.u@taypro.in",
        profile_image: "https://randomuser.me/api/portraits/men/2.jpg",
        userId: "67c2f626e85ffe52171c3774",
      },
    ],

    createdAt: "2025-04-17T09:19:00.000Z",
    updatedAt: "2025-04-17T10:00:00.000Z",
    __v: 0,
  },
  {
    _id: "67ff7a9e95fb9f10f7b69b1e",

    // 🔹 Basic Info
    robot_no: "TAYPRO-003",
    site_id: "avaada_agar",
    client_id: "avaada_clean_projects_private_limited",
    client_name: "Avaada Clean Projects Private Limited",
    site_location: "Agar,MP",
    commissioning_date: "2025-04-17T09:00:00.000Z",
    status: "submitted", // pending | in_progress | completed | failed -> final -> submitted
    commissioning_certificate_id: "67ff7a9e95fb9f10f7b69b1c",
    block: "Block-3",
    robot_type: "Automatic",
    // 🔹 Step-based Checklist
    checklist: {
      power_on: {
        status: true,
        timestamp: "2025-04-17T09:01:00.000Z",
        remarks: "Robot powered successfully",
      },

      portal_connectivity: {
        is_online: true,
        checked_at: "2025-04-17T09:03:00.000Z",
        signal_strength: "good",
        remarks: "Device visible in portal",
      },

      movement_test: {
        started: true,
        direction_check: {
          forward: true,
          reverse: true,
          left: true,
          right: true,
        },
        remarks: "Movement normal",
      },

      speed_and_alignment: {
        speed_ok: true,
        alignment_ok: true,
        deviation: "none", // or degrees/mm if needed
        remarks: "Aligned properly",
      },

      cleaning_test: {
        brush_rotation: true,
        cleaning_efficiency: "good", // poor | average | good
        remarks: "Cleaning working fine",
      },

      physical_inspection: {
        wheels: "good", // good | worn | damaged
        brushes: "good",
        pipes: "good",
        sensors: "good",
        frame: "good",
        issues_found: [],
      },

      safety_checks: {
        emergency_switch: true,
        obstacle_detection: true,
        auto_stop: true,
        remarks: "All safety checks passed",
      },
    },

    // 🔹 Final Result Summary
    summary: {
      overall_status: "pass", // pass | fail
      issues: [],
      recommendation: "Ready for deployment",
    },

    // 🔹 Activity Logs (Audit Trail)
    last_activity: [
      {
        name: "Vishwajeet Usnale",
        email: "vishwajeet.u@taypro.in",
        profile_image: "https://randomuser.me/api/portraits/men/2.jpg",
        timestamp: "2025-04-16T09:04:07.672Z",
        userId: "67c2f626e85ffe52171c3774",
        action: "created",
        details: "Commissioning document created",
      },
      {
        name: "Vishwajeet Usnale",
        action: "updated",
        details: "Checklist completed",
        timestamp: "2025-04-17T10:00:00.000Z",
        email: "vishwajeet.u@taypro.in",
        profile_image: "https://randomuser.me/api/portraits/men/2.jpg",
        userId: "67c2f626e85ffe52171c3774",
      },
    ],

    createdAt: "2025-04-17T09:19:00.000Z",
    updatedAt: "2025-04-17T10:00:00.000Z",
    __v: 0,
  },
];

export const commissioning_certificates = [
  {
    _id: "67ff7a9e95fb9f10f7b69b1c",
    doc_no: "TPL-CC-01",
    certificate_no: "TPL-CC-2252601",
    robots: [
      {
        robot_no: "TAYPRO-001",
        commisioning_doc_id: "67ff7a9e95fb9f10f7b69b1c",
        robot_type: "Automatic",
        system_code: "TPL-AUTOMATIC-001",
        block: "Block-1",
      },
      {
        robot_no: "TAYPRO-002",
        commisioning_doc_id: "67ff7a9e95fb9f10f7b69b1d",
        robot_type: "Semi-Automatic",
        system_code: "TPL-SEMI-AUTOMATIC-001",
        block: "Block-2",
      },
      {
        robot_no: "TAYPRO-003",
        commisioning_doc_id: "67ff7a9e95fb9f10f7b69b1e",
        robot_type: "Automatic",
        system_code: "TPL-AUTOMATIC-001",
        block: "Block-3",
      },
    ],
    project_code: "TPL-AVAADA-AGAR",
    site_id: "avaada_agar",
    client_id: "avaada_clean_projects_private_limited",
    client_name: "Avaada Clean Projects Private Limited",
    site_location: "Agar,MP",
    signatures: [
      {
        for: "TAYPRO PVT LTD",
        name: "Vishwajeet Usnale",
        designation: "Site Engineer",
      },
      {
        for: "RECEIVER",
        name: "",
        designation: "",
      },
      {
        for: "RECEIVER",
        name: "",
        designation: "",
      },
    ],
    last_activity: [
      {
        name: "Vishwajeet Usnale",
        email: "vishwajeet.u@taypro.in",
        profile_image: "https://randomuser.me/api/portraits/men/2.jpg",
        timestamp: "2025-04-18T08:00:00.000Z",
        designation: "Site Engineer",
        userId: "67c2f626e85ffe52171c3774",
        details: "Certificate generated",
      },
      {
        name: "Vishwajeet Usnale",
        email: "vishwajeet.u@taypro.in",
        profile_image: "https://randomuser.me/api/portraits/men/2.jpg",
        timestamp: "2025-04-18T09:00:00.000Z",
        designation: "Site Engineer",
        userId: "67c2f626e85ffe52171c3774",
        details: "Robot No TAYPRO-001 added to certificate",
      },
      {
        name: "Vishwajeet Usnale",
        email: "vishwajeet.u@taypro.in",
        profile_image: "https://randomuser.me/api/portraits/men/2.jpg",
        timestamp: "2025-04-18T09:10:00.000Z",
        designation: "Site Engineer",
        userId: "67c2f626e85ffe52171c3774",
        details: "Robot No TAYPRO-002 added to certificate",
      },
    ],
  },
];
