import React, { useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
} from "@coreui/react";
import { Factory, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import LastActivity from "../../components/LastActivity";
import ProductionAndOperationmodal from "./ProductionAndOperationmodal";
import toast from "react-hot-toast";
import axios from "axios";
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
export default function ProductionAndOperation({
  data,
  last_activity,
  createdAt,
  updatedAt,
  _id,

  refreshReports,
}) {
  const [{ loading, success, error }, dispatch] = useReducer(reducer, {
    loading: false,
    success: null,
    error: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [ProductionAndOperationData, setProductionAndOperationData] =
    useState(data);

  const handleSave = async (updatedData) => {
    dispatch({ type: "REQUEST_START" });

    try {
      // 🔥 Exclude non-updatable fields like last_activity
      const filteredData = Object.fromEntries(
        Object.entries(updatedData).filter(
          ([key]) => !["last_activity"].includes(key),
        ),
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
        department: "Production_and_operations",
        updates,
        is_filled: updatedData.is_filled ?? false,
      };

      const response = await axios.put(
        `/api/v1/mis-report-router/${_id}`,
        payload,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      setProductionAndOperationData(updatedData);
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
  const metrics = [
    { key: "units_manufactures", label: "Units Manufactured" },
    { key: "rejected_units", label: "Rejected Units" },
    { key: "production_cost_per_unit", label: "Production Cost / Unit" },
    { key: "factory_downtime", label: "Factory Downtime (hrs)" },
    {
      key: "cost_of_raw_material_available_in_store",
      label: "Raw Material Cost (Store)",
    },
    {
      key: "total_finished_goods_inventory_ready_for_dispatch",
      label: "Finished Goods Inventory",
    },
    { key: "total_manpower_available_at_factory", label: "Manpower Available" },
    { key: "total_shifts_operational", label: "Shifts Operational" },
    { key: "total_customer_visits", label: "Customer Visits" },
    { key: "robot_sent_for_pocs", label: "Robots Sent for POCs" },
    { key: "robot_received_from_pocs", label: "Robots Received from POCs" },
  ];

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
            <span className="flex items-center gap-2">
              <Factory size={22} className="text-green-300" /> Production &
              Operations
            </span>{" "}
            -{" "}
            <span className="text-success">
              {new Date(createdAt).toLocaleDateString("en-GB", {
                month: "long", // 👉 gives full month name
                year: "numeric",
              })}
            </span>
            <span className="text-success">
              {data.is_filled
                ? ` | Filled on: ${new Date(
                    data.is_filled_at,
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
            Edit Production & Operations
          </CButton>
        </CCardHeader>

        <ProductionAndOperationmodal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          data={ProductionAndOperationData}
          onSave={handleSave}
          loading={loading}
          success={success}
          error={error}
        />

        {/* Body */}
        <CCardBody className="p-6">
          {/* Metrics Grid */}
          <CRow className="gy-4">
            {metrics.map((m) => (
              <CCol key={m.key} xs={12} sm={5} md={3}>
                <div className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800 hover:border-green-500/40 transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300 font-semibold">
                      {m.label}
                    </span>
                    <TrendingUp size={18} className="text-green-400" />
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
                </div>
              </CCol>
            ))}
          </CRow>
          <LastActivity lastactivity={data.last_activity} />
        </CCardBody>
      </CCard>
    </motion.div>
  );
}
