import React, { useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
} from "@coreui/react";
import { FlaskConical } from "lucide-react";
import { motion } from "framer-motion";
import LastActivity from "../../components/LastActivity";
import axios from "axios";
import toast from "react-hot-toast";
import ResearchAndDevelopmentModal from "./ResearchAndDevelopmentModal";
function reducer(state, action) {
  switch (action.type) {
    case "REQUEST_START":
      return { ...state, loading: true, success: null, error: null };
    case "REQUEST_SUCCESS":
      return { ...state, loading: false, success: action.payload, error: null };
    case "REQUEST_ERROR":
      return { ...state, loading: false, error: action.payload, success: null };

    default:
      return state;
  }
}
export default function ResearchAndDevelopment({
  data,
  last_activity,
  createdAt,
  authtoken,
  refreshReports,
  updatedAt,
  _id,
}) {
  const [{ loading, success, error }, dispatch] = useReducer(reducer, {
    loading: false,
    success: null,
    error: null,
  });
  const metrics = [
    { key: "total_spend_on_rnd", label: "Total Spend on R&D" },
    {
      key: "active_development_projects",
      label: "Active Development Projects",
    },
    {
      key: "new_features_modules_released",
      label: "New Features/Modules Released",
    },
    { key: "design_revisions_completed", label: "Design Revisions Completed" },
    { key: "prototype_units_built", label: "Prototype Units Built" },
    { key: "time_to_prototype_days", label: "Time to Prototype (Days)" },
    { key: "test_cycles_conducted", label: "Test Cycles Conducted" },
    {
      key: "cross_department_sync_meetings_held",
      label: "Cross-Department Sync Meetings Held",
    },
    { key: "patents_ips_filed", label: "Patents/IPs Filed" },
    { key: "development_issues_logged", label: "Development Issues Logged" },
    { key: "issues_resolved", label: "Issues Resolved" },
    {
      key: "testing_validation_pass_rate",
      label: "Testing Validation Pass Rate (%)",
    },
    {
      key: "external_vendor_consultant_support_used",
      label: "External Vendor/Consultant Support Used",
    },
    { key: "compliance_tests_conducted", label: "Compliance Tests Conducted" },
    { key: "field_trials_completed", label: "Field Trials Completed" },
    { key: "rnd_manpower_utilization", label: "R&D Manpower Utilization" },
    {
      key: "innovation_improvement_ideas_proposed",
      label: "Innovation/Improvement Ideas Proposed",
    },
    {
      key: "approved_for_implementation",
      label: "Approved for Implementation",
    },
    {
      key: "development_tools_licenses_renewed",
      label: "Development Tools Licenses Renewed",
    },
    { key: "documentation_updated", label: "Documentation Updated" },
  ];
  const [modalVisible, setModalVisible] = useState(false);
  const [HRAndAdminData, setHRAndAdminData] = useState(data);

  const handleSave = async (updatedData) => {
    dispatch({ type: "REQUEST_START" });

    try {
      // 🔥 Exclude non-updatable fields like last_activity
      const filteredData = Object.fromEntries(
        Object.entries(updatedData).filter(
          ([key]) => !["last_activity"].includes(key)
        )
      );

      // Format updates for backend
      const updates = Object.entries(filteredData)
        .filter(([key, val]) => val && typeof val === "object")
        .map(([field, val]) => ({
          field,
          data: {
            current_month: Number(val.current_month) || 0,
            fy_td: Number(val.fy_td) || 0,
            Remarks: val.Remarks || null,
          },
        }));

      ["achievements", "issues", "action_plan"].forEach((f) => {
        if (filteredData[f]) updates.push({ field: f, data: filteredData[f] });
      });

      const payload = {
        department: "Research_and_development_and_product_development",
        updates,
        is_filled: updatedData.is_filled ?? false,
      };

      const response = await axios.put(
        `/api/v1/mis-report-router/${_id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );

      setHRAndAdminData(updatedData);
      dispatch({ type: "REQUEST_SUCCESS", payload: response.data.message });
      toast.success(response.data.message);
      setModalVisible(false);
      // 🔥 Refresh parent data after update
      if (refreshReports) refreshReports();
    } catch (err) {
      dispatch({
        type: "REQUEST_ERROR",
        payload: err.response?.data?.message || err.response?.data?.error,
      });
      toast.error(err.response?.data?.message || err.response?.data?.error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6"
    >
      <CCard className="my-2 rounded-3xl shadow-xl bg-gray-950 border border-gray-800 text-gray-100">
        {/* Header */}
        <CCardHeader className=" d-flex justify-content-between align-items-center">
          <div>
            Research & Development & Product Development Department-{" "}
            <span className="text-success">
              {new Date(createdAt).toLocaleDateString("en-GB", {
                month: "long", // 👉 gives full month name
                year: "numeric",
              })}
            </span>
            <span className="text-success">
              {data.is_filled
                ? ` | Filled on: ${new Date(
                    data.is_filled_at
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}`
                : " | Not yet filled"}
            </span>
          </div>
          <CButton
            onClick={() => setModalVisible(true)}
            color="success"
            size="sm"
          >
            Edit Research & Development
          </CButton>
        </CCardHeader>

        <ResearchAndDevelopmentModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          data={HRAndAdminData}
          onSave={handleSave}
          loading={loading}
          success={success}
          error={error}
        />
        {/* Body */}
        <CCardBody className="p-6">
          <CRow className="gy-4">
            {metrics.map((m) => (
              <CCol key={m.key} xs={12} sm={5} md={3}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300 font-semibold">
                      {m.label}
                    </span>
                    <FlaskConical size={18} className="text-purple-400" />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    {" "}
                    <div className="text-2xl font-bold text-amber-400">
                      C. month: {data[m.key]?.current_month ?? 0}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      FYTD:{" "}
                      <span className="text-gray-200 font-semibold">
                        {data[m.key]?.fy_td ?? 0}
                      </span>
                    </div>
                  </div>
                  {data[m.key]?.Remarks && (
                    <div className="text-justify pt-2">
                      <span className="text-success">Remarks: </span>{" "}
                      <span className=""> {data[m.key]?.Remarks}</span>
                    </div>
                  )}
                </motion.div>
              </CCol>
            ))}
          </CRow>
          <LastActivity lastactivity={data.last_activity} />
        </CCardBody>
      </CCard>
    </motion.div>
  );
}
