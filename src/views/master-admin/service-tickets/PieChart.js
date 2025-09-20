// import React, { useEffect, useReducer } from "react";
// import { CChartBar, CChartPie } from "@coreui/react-chartjs";
// import { CRow, CCol, CCard, CCardHeader } from "@coreui/react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import LoadingSpinner from "../../../components/LoadingSpinner";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_FAULT_REQUEST":
//       return { ...state, loading: true };
//     case "FETCH_FAULT_SUCCESS":
//       return {
//         ...state,
//         serviceticketsfaulycount: action.payload,
//         loading: false,
//       };
//     case "FETCH_FAULT_FAIL":
//       return { ...state, loading: false, error: action.payload };

//     case "FETCH_SITEWISE_TICKET_REQUEST":
//       return { ...state, loading: true };
//     case "FETCH_SITEWISE_TICKET_SUCCESS":
//       return {
//         ...state,
//         serviceticketssitewise: action.payload,
//         loading: false,
//       };
//     case "FETCH_SITEWISE_TICKET_FAIL":
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };

// const PieChart = () => {
//   const [
//     { loading, error, serviceticketsfaulycount, serviceticketssitewise },
//     dispatch,
//   ] = useReducer(reducer, {
//     serviceticketsfaulycount: [],
//     serviceticketssitewise: [],
//     loading: true,
//     error: "",
//   });

//   const authtoken = useSelector((state) => state.authtoken);

//   useEffect(() => {
//     const fetchFaultCounts = async () => {
//       try {
//         dispatch({ type: "FETCH_FAULT_REQUEST" });
//         const response = await axios.get("/api/v1/servicetickets/faultcount", {
//           headers: { Authorization: `Bearer ${authtoken}` },
//         });

//         let result = response.data.data; // Expecting array of objects { count, fault_type }

//         const faultData = result.reduce((acc, item) => {
//           acc[item.fault_type] = item.count;
//           return acc;
//         }, {});

//         dispatch({ type: "FETCH_FAULT_SUCCESS", payload: faultData });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_FAULT_FAIL",
//           payload: error.response.data.message || error.response.data.error,
//         });
//       }
//     };
//     fetchFaultCounts();
//     const fetchFSitewiseTickets = async () => {
//       try {
//         dispatch({ type: "FETCH_SITEWISE_TICKET_REQUEST" });
//         const response = await axios.get("/api/v1/servicetickets/siteresolve", {
//           headers: { Authorization: `Bearer ${authtoken}` },
//         });

//         dispatch({
//           type: "FETCH_SITEWISE_TICKET_SUCCESS",
//           payload: response.data.data,
//         });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_SITEWISE_TICKET_SUCCESS",
//           payload: error.response.data.message || error.response.data.error,
//         });
//       }
//     };
//     fetchFSitewiseTickets();
//   }, [authtoken]);

//   // Ensure serviceticketsfaulycount is not empty before accessing
//   const faultLabels = Object.keys(serviceticketsfaulycount || {});
//   const faultValues = faultLabels.map(
//     (fault) => serviceticketsfaulycount[fault]
//   );

//   const siteLabels = serviceticketssitewise?.map((site) => site.site_id) || [];
//   const siteData =
//     serviceticketssitewise?.map((site) => site.total_tickets) || [];

//   const siteTicketData = serviceticketssitewise?.reduce((acc, site) => {
//     acc[site.site_id] = {
//       open: site.unresolved_tickets,
//       resolved: site.resolved_tickets,
//     };
//     return acc;
//   }, {});

//   const faultColors = [
//     "#0b3955",
//     "#00627b",
//     "#008c8f",
//     "#24b68c",
//     "#91db7b",
//     "#f9f871",
//     "#394f75",
//     "#666593",
//     "#967aac",
//     "#c890c0",
//     "#f9a7cf",
//     "#446887",
//     "#d3f4ff",
//     "#e49d23",
//     "#007d50",
//     "#6bebb6",
//     "#27b281",
//     "#009cf9",
//     "#3b4856",
//     "#9eadbd",
//     "#463216",
//     "#786042",
//     "#0b3955",
//     "#7b392d",
//     "#005a47",
//     "#3b4856",
//     "#9eadbd",
//     "#00c6b4",
//     "#ea60da",
//     "#ff68a5",
//     "#ff9375",
//     "#ffc85b",
//     "#f9f871",
//     "#6c71fd",
//     "#00845c",
//     "#008a91",
//     "#0084ff",
//     "#3f8f94",
//     "#6bbaa3",
//     "#508072",
//     "#6bbaa3",
//     "#c8fceb",
//     "#474554",
//     "#aca9bb",
//     "#3a7679",
//     "#00168b",
//     "#4bbea0",
//     "#00c19d",
//     "#bc7000",
//     "#474554",
//     "#357175",
//   ];

//   const siteColors = [
//     "#0b3955",
//     "#00627b",
//     "#008c8f",
//     "#24b68c",
//     "#91db7b",
//     "#f9f871",
//     "#394f75",
//     "#666593",
//     "#967aac",
//     "#c890c0",
//     "#f9a7cf",
//     "#446887",
//     "#d3f4ff",
//     "#e49d23",
//     "#007d50",
//     "#6bebb6",
//     "#27b281",
//     "#009cf9",
//     "#3b4856",
//     "#9eadbd",
//     "#463216",
//     "#786042",
//     "#0b3955",
//     "#7b392d",
//     "#005a47",
//     "#3b4856",
//     "#9eadbd",
//     "#00c6b4",
//     "#ea60da",
//     "#ff68a5",
//     "#ff9375",
//     "#ffc85b",
//     "#f9f871",
//     "#6c71fd",
//     "#00845c",
//     "#008a91",
//     "#0084ff",
//     "#3f8f94",
//     "#6bbaa3",
//     "#508072",
//     "#6bbaa3",
//     "#c8fceb",
//     "#474554",
//     "#aca9bb",
//     "#3a7679",
//     "#00168b",
//     "#4bbea0",
//     "#00c19d",
//     "#bc7000",
//     "#474554",
//     "#357175",
//   ];

//   return (
//     <CRow className="justify-content-center">
//       <CCol xs={12} md={12}>
//         <CCard className="mb-4 shadow">
//           <CCardHeader>
//             <h5 className="text-center">All Sitewise Ticket Status</h5>
//           </CCardHeader>
//           <div className="container-fluid">
//             <div className="d-flex justify-content-center align-items-center">
//               {loading ? (
//                 <div className="py-5">
//                   <LoadingSpinner />
//                 </div>
//               ) : error ? (
//                 <div className="text-center text-danger py-5">{error}</div>
//               ) : siteLabels?.length > 0 ? (
//                 <div className=" w-100" style={{ borderRadius: "16px" }}>
//                   <div className="">
//                     <CChartBar
//                       style={{ height: "50vh", minHeight: "300px" }} // ✅ responsive height
//                       data={{
//                         labels: siteLabels.map((site) =>
//                           site.replace(/_/g, " ")
//                         ),
//                         datasets: [
//                           {
//                             data: siteData,
//                             backgroundColor: siteColors.slice(
//                               0,
//                               siteLabels.length
//                             ),
//                             hoverOffset: 8,
//                             barPercentage: 0.5,
//                             categoryPercentage: 0.7,
//                           },
//                         ],
//                       }}
//                       options={{
//                         maintainAspectRatio: false, // ✅ makes it fluid
//                         responsive: true,
//                         plugins: {
//                           legend: { display: false },
//                           tooltip: {
//                             backgroundColor: "#1e1e2f",
//                             titleColor: "#fff",
//                             bodyColor: "#ddd",
//                             padding: 12,
//                             callbacks: {
//                               label: function (tooltipItem) {
// const site = siteLabels[tooltipItem.dataIndex];
// return [
//   `📍 ${site.replace(/_/g, " ")}`,
//   `🛠 Open: ${siteTicketData[site].open}`,
//   `✅ Resolved: ${siteTicketData[site].resolved}`,
// ];
//                               },
//                             },
//                           },
//                         },
//                         legend: {
//                           position: "bottom",
//                         },
//                         scales: {
//                           y: {
//                             beginAtZero: true,
//                             ticks: {
//                               stepSize: 5,
//                               font: {
//                                 size: 12,
//                                 family: "Inter, sans-serif",
//                               },
//                             },
//                             grid: {
//                               color: "rgba(0,0,0,0.05)",
//                             },
//                             max: 50,
//                           },
//                           x: {
//                             ticks: { display: false },
//                             grid: { drawTicks: false },
//                           },
//                         },
//                       }}
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center py-5 text-muted">
//                   📊 No data available
//                 </div>
//               )}
//             </div>
//           </div>
//         </CCard>
//       </CCol>

//       <CCol xs={12} md={12}>
//         <CCard className="mb-4 shadow">
//           <CCardHeader>
//             <h5 className="text-center">All Site Fault Occurrences</h5>
//           </CCardHeader>
//           <div
//             className="d-flex justify-content-center align-items-center"
//             style={{ height: "350px" }}
//           >
//             {loading ? (
//               <LoadingSpinner />
//             ) : error ? (
//               error
//             ) : Object.keys(serviceticketsfaulycount || {}).length === 0 ? (
//               "No data available"
//             ) : (
//               <CChartPie
//                 style={{ height: "350px" }}
//                 data={{
//                   labels: faultLabels,
//                   datasets: [
//                     {
//                       data: faultValues,
//                       backgroundColor: faultColors.slice(0, faultLabels.length),
//                     },
//                   ],
//                 }}
//                 options={{
//                   plugins: {
//                     legend: {
//                       display: false, // ✅ This hides the legend
//                     },
//                   },
//                 }}
//               />
//             )}
//           </div>
//         </CCard>
//       </CCol>
//     </CRow>
//   );
// };

// export default PieChart;

import React, { useEffect, useReducer } from "react";
import { CChartBar, CChartLine, CChartDoughnut } from "@coreui/react-chartjs";
import { CRow, CCol, CCard, CCardHeader, CFormSelect } from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// ✅ Dynamic Chart Wrapper
const ChartWrapper = ({ type, labels, datasets, height = "50vh", options }) => {
  const props = {
    style: { height, minHeight: "300px" },
    data: { labels, datasets },
    options,
  };

  switch (type) {
    case "line":
      return <CChartLine {...props} />;
    case "doughnut":
      return <CChartDoughnut {...props} />;
    default:
      return <CChartBar {...props} />;
  }
};

const PieChart = () => {
  const [{ loading, error, data }, dispatch] = useReducer(reducer, {
    data: { sitewise: [], faults: {} },
    loading: true,
    error: "",
  });

  const authtoken = useSelector((state) => state.authtoken);

  // 🔹 states for dynamic chart type
  const [siteChartType, setSiteChartType] = React.useState("bar");
  const [faultChartType, setFaultChartType] = React.useState("bar");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const [sitewiseRes, faultRes] = await Promise.all([
          axios.get("/api/v1/servicetickets/siteresolve", {
            headers: { Authorization: `Bearer ${authtoken}` },
          }),
          axios.get("/api/v1/servicetickets/faultcount", {
            headers: { Authorization: `Bearer ${authtoken}` },
          }),
        ]);

        const sitewise = sitewiseRes.data.data;
        const faultData = faultRes.data.data.reduce((acc, item) => {
          acc[item.fault_type] = item.count;
          return acc;
        }, {});

        dispatch({
          type: "FETCH_SUCCESS",
          payload: { sitewise, faults: faultData },
        });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: err.response?.data?.message || "Error loading data",
        });
      }
    };

    fetchData();
  }, [authtoken]);

  const siteLabels = data.sitewise?.map((s) => s.site_id) || [];
  const siteData = data.sitewise?.map((s) => s.total_tickets) || [];

  // Keep open and closed values accessible for tooltips
  const siteTicketData =
    data.sitewise?.reduce((acc, s) => {
      acc[s.site_id] = {
        total: s.total_tickets,
        open: s.unresolved_tickets || 0,
        closed: s.resolved_tickets || 0, // depends on your API field name
      };
      return acc;
    }, {}) || {};

  // ✅ Standard chart options
  const baseOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e1e2f",
        titleColor: "#fff",
        bodyColor: "#ddd",
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
          // font: { size: 12, family: "Inter, sans-serif" },
        },
        grid: {
          color: "rgba(255,255,255,0.1)", // light white with transparency
        },
        max: 150,
      },
      x: {
        ticks: { display: false },
        grid: {
          color: "rgba(255,255,255,0.1)", // light white with transparency
        },
      },
    },
  };

  const siteOptions = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      legend: {
        display: false,
        position: "bottom",
        labels: {
          color: "#fff",
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "#1e1e2f",
        titleColor: "#fff",
        bodyColor: "#ddd",
        padding: 12,
        callbacks: {
          label: function (context) {
            const site = context.label;
            const info = siteTicketData[site];
            if (!info) return "";

            return `📊 Total: ${info.total}
            🛠 Open: ${info.open} 
            ✅ Closed: ${info.closed}`;
          },
        },
      },
    },
    scales: {
      ...baseOptions.scales,
      x: {
        ticks: {
          display: false,
          autoSkip: false,
          font: { size: 11 },
        },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  const maxDataValue = Math.max(...siteData);
  const adjustedMax = Math.ceil(maxDataValue / 10) * 10 + 10; // round up to next 10 + padding

  const dynamicSiteOptions = {
    ...siteOptions,
    scales: {
      ...siteOptions.scales,
      y: {
        ...siteOptions.scales.y,
        max: adjustedMax,
      },
    },
  };

  // Fault chart options → legend OFF
  const faultOptions = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      legend: { display: false },
    },
    scales: {
      ...baseOptions.scales,
      x: {
        ticks: {
          display: false,
          autoSkip: false,
          font: { size: 11 },
        },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  const dynamicfaultOptions = {
    ...faultOptions,
    scales: {
      ...faultOptions.scales,
      y: {
        ...faultOptions.scales.y,
        max: adjustedMax,
      },
    },
  };

  const siteColors = [
    "#0b3955",
    "#00627b",
    "#008c8f",
    "#24b68c",
    "#91db7b",
    "#f9f871",
    "#394f75",
    "#666593",
    "#967aac",
    "#c890c0",
    "#f9a7cf",
    "#446887",
    "#d3f4ff",
    "#e49d23",
    "#007d50",
    "#6bebb6",
    "#27b281",
    "#009cf9",
    "#3b4856",
    "#9eadbd",
    "#463216",
    "#786042",
    "#7b392d",
    "#00c6b4",
    "#ea60da",
    "#ff68a5",
    "#ff9375",
    "#ffc85b",
    "#6c71fd",
    "#00845c",
    "#008a91",
    "#0084ff",
    "#3f8f94",
    "#6bbaa3",
    "#508072",
  ];

  const faultLabels = Object.keys(data.faults || {});
  const faultValues = faultLabels.map((f) => data.faults[f]);

  const faultColors = [
    "#0b3955",
    "#00627b",
    "#008c8f",
    "#24b68c",
    "#91db7b",
    "#f9f871",
    "#394f75",
    "#666593",
    "#967aac",
    "#c890c0",
    "#f9a7cf",
    "#446887",
    "#d3f4ff",
    "#e49d23",
    "#007d50",
    "#6bebb6",
    "#27b281",
    "#009cf9",
    "#3b4856",
    "#9eadbd",
    "#463216",
    "#786042",
    "#7b392d",
    "#00c6b4",
    "#ea60da",
    "#ff68a5",
    "#ff9375",
    "#ffc85b",
    "#6c71fd",
    "#00845c",
    "#008a91",
    "#0084ff",
    "#3f8f94",
    "#6bbaa3",
    "#508072",
  ];

  return (
    <CRow className="justify-content-center">
      {/* Sitewise Tickets */}
      <CCol xs={12} md={12}>
        <CCard className="mb-4 shadow">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">All Sitewise Ticket Status</h5>
            <CFormSelect
              value={siteChartType}
              onChange={(e) => setSiteChartType(e.target.value)}
              className="w-auto"
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="doughnut">Doughnut</option>
            </CFormSelect>
          </CCardHeader>

          <div className="container-fluid py-3">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center text-danger py-5">{error}</div>
            ) : siteLabels.length > 0 ? (
              <ChartWrapper
                type={siteChartType}
                labels={siteLabels}
                datasets={[
                  {
                    data: siteData,
                    backgroundColor: siteColors.slice(0, siteLabels.length),
                    hoverOffset: 8,
                    borderColor: "#fff",
                    borderWidth: 1,
                  },
                ]}
                options={dynamicSiteOptions}
              />
            ) : (
              <div className="text-center py-5 text-muted">
                📊 No data available
              </div>
            )}
          </div>
        </CCard>
      </CCol>

      {/* Faults */}
      <CCol xs={12} md={12}>
        <CCard className="mb-4 shadow">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">All Site Fault Occurrences</h5>

            <CFormSelect
              value={faultChartType}
              onChange={(e) => setFaultChartType(e.target.value)}
              className="w-auto"
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="doughnut">Doughnut</option>
            </CFormSelect>
          </CCardHeader>

          <div className="container-fluid py-3">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : faultLabels.length === 0 ? (
              "No data available"
            ) : (
              <ChartWrapper
                type={faultChartType}
                labels={faultLabels}
                datasets={[
                  {
                    data: faultValues,
                    backgroundColor: faultColors.slice(0, faultLabels.length),
                    hoverOffset: 8,
                    borderColor: "#fff",
                    borderWidth: 1,
                  },
                ]}
                options={dynamicfaultOptions}
              />
            )}
          </div>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default PieChart;
