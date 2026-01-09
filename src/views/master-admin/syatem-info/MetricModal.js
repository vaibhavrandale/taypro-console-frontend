// MetricModal.jsx
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
} from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import { RefreshCw, X } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { mapSystemLogsForCharts } from "./helper";
import { useEffect, useState } from "react";
import axios from "axios";

// const MetricModal = ({ visible, onClose, metric, labels, datasets }) => {
//   if (!metric) return null;

//   return (
//     <CModal
// alignment="center"
// visible={visible}
// size="xl"
// onClose={onClose}
// backdrop="static"
//     >
//       <CModalHeader
//         className="d-flex justify-content-between"
//         closeButton={false}
//       >
//         <CModalTitle>{metric.title}</CModalTitle>

//         <div className="d-flex gap-2">
//           <CButton size="sm" color="light">
//             5 minutes
//           </CButton>
//           <CButton size="sm" color="light">
//             Average
//           </CButton>
//           <CButton size="sm" color="primary">
//             1h
//           </CButton>
//           <CButton size="sm" color="light">
//             3h
//           </CButton>
//           <CButton size="sm" color="light">
//             1d
//           </CButton>

//           <CButton size="sm" color="light">
//             <RefreshCw size={16} />
//           </CButton>

//           <CButton size="sm" color="light" onClick={onClose}>
//             <X size={16} />
//           </CButton>
//         </div>
//       </CModalHeader>

//       <CModalBody>
//         <CChartLine
//           style={{ height: 420, width: "100%" }}
//           data={{ labels, datasets }}
//           options={{
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//               y: {
//                 title: {
//                   display: true,
//                   text: metric.unit || "Value",
//                 },
//               },
//             },
//           }}
//         />
//       </CModalBody>
//     </CModal>
//   );
// };
const MetricModal = ({ visible, onClose, metric }) => {
  const [range, setRange] = useState("10m");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const fetchLogs = async () => {
      setLoading(true);
      const res = await axios.get(`/api/v1/sysinfo-logs?range=${range}`);
      setLogs(res.data.data);
      setLoading(false);
    };

    fetchLogs();
  }, [visible, range]);

  if (!metric) return null;

  const metrics = mapSystemLogsForCharts(logs);

  return (
    <CModal
      alignment="top"
      visible={visible}
      size="xl"
      onClose={onClose}
      backdrop="static"
      scrollable
    >
      <CModalHeader
        closeButton={false}
        className="d-flex justify-content-between align-items-center"
      >
        <CModalTitle>{metric.title}</CModalTitle>

        <div className="d-flex gap-2 flex-wrap">
          {["10m", "1h", "3h", "1d"].map((r) => (
            <CButton
              key={r}
              size="sm"
              color={range === r ? "primary" : "light"}
              onClick={() => setRange(r)}
            >
              {r}
            </CButton>
          ))}
          <CButton size="sm" color="light" onClick={onClose}>
            <X size={16} />
          </CButton>
        </div>
      </CModalHeader>

      <CModalBody style={{ width: "100vw" }} className="">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <CChartLine
            style={{ height: "480px", width: "100%" }}
            data={{
              labels: metrics.labels,
              datasets: metric.datasets(metrics),
            }}
          />
        )}
      </CModalBody>
    </CModal>
  );
};

export default MetricModal;
