// import React, { useEffect, useReducer, useState } from "react";
// import {
//   CRow,
//   CCol,
//   CCard,
//   CCardBody,
//   CButton,
//   CTable,
//   CTableRow,
//   CTableBody,
//   CTableDataCell,
//   CDropdownMenu,
//   CDropdownItem,
//   CDropdown,
//   CDropdownToggle,
//   CTooltip,
//   CBadge,
// } from "@coreui/react";
// import "./management.css";
// import { useParams } from "react-router-dom";
// import "./management.css";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import { formatDistanceToNow } from "date-fns";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loading: true };

//     case "FETCH_SUCCESS":
//       return {
//         ...state,
//         downlinks: action.payload.data,
//         totalPages: action.payload.totalPages, // Use API-provided totalPages
//         hasNextPage: action.payload.hasNextPage,
//         hasPrevPage: action.payload.hasPrevPage,
//         loading: false,
//       };

//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };

//     case "FETCH_ROBOTS_REQUEST":
//       return { ...state, loadingRobots: true, error: "" };

//     case "FETCH_ROBOTS_SUCCESS":
//       return { ...state, loadingRobots: false, robots: action.payload };

//     case "FETCH_ROBOTS_FAIL":
//       return { ...state, loadingRobots: false, error: action.payload };

//     case "SEND_DOWNLINK_REQUEST":
//       return { ...state, sendingCommandloading: true, error: "" };

//     case "SEND_DOWNLINK_SUCCESS":
//       return { ...state, sendingCommandloading: false };

//     case "SEND_DOWNLINK_FAIL":
//       return { ...state, sendingCommandloading: false, error: action.payload };

//     case "FETCH_ROBOT_REQUEST":
//       return { ...state, loadingRobot: true, error: "" };

//     case "FETCH_ROBOT_SUCCESS":
//       return { ...state, loadingRobot: false, robot: action.payload };

//     case "FETCH_ROBOT_FAIL":
//       return { ...state, loadingRobot: false, error: action.payload };

//     default:
//       return state;
//   }
// };

// const SiteTechnicianRobotOperating = () => {
//   const { site_id, block, robot_no } = useParams();
//   const [siteRobots, setSiteRobots] = useState([]);
//   const authtoken = useSelector((state) => state.authtoken);

//   let start = "C1";
//   let stop = "CC";
//   let returntodock = "D1";
//   const [setLoadingRow] = useState(null); // Track the row index
//   const [commandButton, setCommandButton] = useState(null); // Track the row index

//   const [{ error, loadingRobots, robots, robot }, dispatch] = useReducer(
//     reducer,
//     {
//       robot: {},
//       robots: [],
//       loading: true,
//       error: "",
//       loadingRobots: true,
//       sendingCommandloading: false,
//     }
//   );

//   useEffect(() => {
//     const getRobots = async () => {
//       try {
//         dispatch({ type: "FETCH_ROBOTS_REQUEST" });
//         const response = await axios.get(
//           `/api/v1/robots/site/${site_id}/${block}`,
//           {
//             headers: { Authorization: `Bearer ${authtoken}` },
//           }
//         );
//         const robotsData = response.data.data; // Ensure correct data access

//         dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: robotsData });

//         // ✅ Filter robots assigned to this site
//         if (site_id) {
//           const extractNumber = (robotNo) =>
//             parseInt(robotNo.match(/\d+/g)?.join("") || "0", 10);

//           const filteredRobots = robotsData
//             .filter(
//               (robot) => robot.site_id === site_id && robot.block === block
//             )
//             .sort(
//               (a, b) => extractNumber(a.robot_no) - extractNumber(b.robot_no)
//             );

//           setSiteRobots(filteredRobots);
//         }
//       } catch (error) {
//         dispatch({
//           type: "FETCH_ROBOTS_FAIL",
//           payload: error.response ? error.response.data.message : error.message,
//         });
//       }
//     };

//     const getRobot = async () => {
//       try {
//         dispatch({ type: "FETCH_ROBOT_REQUEST" });
//         const response = await axios.get(
//           `/api/v1/robots/get-robot-using-robot-no/${robot_no}`,
//           {
//             headers: { Authorization: `Bearer ${authtoken}` },
//           }
//         );

//         dispatch({ type: "FETCH_ROBOT_SUCCESS", payload: response.data.data });
//       } catch (error) {
//         dispatch({
//           type: "FETCH_ROBOT_FAIL",
//           payload: error.response
//             ? error.response.data.message
//             : error.response.data.error,
//         });
//       }
//     };
//     getRobots();
//     getRobot();
//   }, [block, site_id, authtoken, robot_no]);

//   // ✅ Ensure robots exist before filtering
//   const Robotdata =
//     robots?.length > 0
//       ? robots.filter(
//           (robot) =>
//             robot.site_id === site_id &&
//             robot.block === block &&
//             robot.robot_no === robot_no
//         )
//       : [];
//   const blockwiserobots =
//     robots?.length > 0 ? robots.filter((robot) => robot.block === block) : [];

//   const sendsingleDownlink = async (command, index) => {
//     setLoadingRow(index);
//     setCommandButton(index);
//     //deveui,command,robot_no,site_id,lora_no
//     let robotdownlink = {
//       deveui: robot.deveui,
//       robot_no: robot.robot_no,
//       site_id: site_id,
//       command: command,
//       lora_no: robot.lora_no,
//     };
//     dispatch({ type: "SEND_DOWNLINK_REQUEST" });
//     try {
//       const data = await axios.post("/api/v1/robots/downlink", robotdownlink, {
//         headers: { Authorization: `Bearer ${authtoken}` },
//       });

//       toast.success(data.data.message);
//       dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
//     } catch (error) {
//       dispatch({
//         type: "SEND_DOWNLINK_FAIL",
//         payload: error.response?.data?.message,
//       });

//       toast.error(error.response.data.message || error.response.data.error);
//     }
//     setLoadingRow(null);
//     setCommandButton(null);
//   };

//   const sendMulticastDownlink = async (command, index) => {
//     let alldeveuis = blockwiserobots.map((robot) => robot.deveui); // Corrected arrow function syntax

//     setCommandButton(index);
//     //deveui,command,robot_no,site_id,lora_no
//     let robotdownlink = {
//       deveui: alldeveuis,
//       block: block,
//       site_id: site_id,
//       command: command,
//     };
//     dispatch({ type: "SEND_DOWNLINK_REQUEST" });
//     try {
//       const data = await axios.post(
//         "/api/v1/robots/multicast-downlink",
//         robotdownlink,
//         {
//           headers: { Authorization: `Bearer ${authtoken}` },
//         }
//       );

//       toast.success(data.data.message);
//       dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
//     } catch (error) {
//       dispatch({
//         type: "SEND_DOWNLINK_FAIL",
//         payload: error.response?.data?.message,
//       });

//       toast.error(error.response.data.message || error.response.data.error);
//     }

//     setCommandButton(null);
//   };

//   return (
//     <>
//       {loadingRobots ? (
//         <div className="loading-container">
//           <LoadingSpinner />
//         </div>
//       ) : error ? (
//         <h1>{error}</h1>
//       ) : (
//         <div className="">
//           {/* Page Header */}
//           <CRow>
//             <CCol>
//               <h4 className="fw-bold text-center">
//                 <span className="">{site_id} -&nbsp;</span>
//                 <span className="text-primary">{block}</span>
//                 &nbsp;-&nbsp;Robot's Configuration
//               </h4>
//             </CCol>
//           </CRow>

//           {/* Action Buttons */}
//           <CRow className="my-2">
//             <CCol>
//               <CButton
//                 className="btn btn-sm btn-secondary m-1 shadow-sm"
//                 onClick={() => sendMulticastDownlink(start, 1)}
//               >
//                 START ALL
//               </CButton>
//               <CButton
//                 className="btn btn-sm btn-secondary m-1 shadow-sm"
//                 onClick={() => sendMulticastDownlink(stop, 2)}
//               >
//                 STOP ALL
//               </CButton>
//               <CButton
//                 className="btn btn-sm btn-secondary m-1 shadow-sm"
//                 onClick={() => sendMulticastDownlink(returntodock, 3)}
//               >
//                 RETURN TO DOCK ALL
//               </CButton>

//               <CDropdown className="dropdown">
//                 {siteRobots.length > 1 ? (
//                   <CDropdownToggle
//                     size="sm"
//                     className="shadow-sm "
//                     color={`${robot.lora_state === 1 ? `success` : `danger`}`}
//                   >
//                     {robot.robot_no}
//                   </CDropdownToggle>
//                 ) : (
//                   <CButton
//                     className={`${
//                       robot.lora_state === 1 ? `` : `text-white`
//                     } shadow-sm`}
//                     color={`${robot.lora_state === 1 ? `success` : `danger`}`}
//                     size="sm"
//                   >
//                     {robot.robot_no}
//                   </CButton>
//                 )}

//                 <CDropdownMenu
//                   className="z-3 px-2 py-1 dropdown-menu-robot border"
//                   // style={{ width: "100px", maxHeight: "200px" }}
//                 >
//                   {siteRobots.length === 1
//                     ? ""
//                     : siteRobots.map((item, index) => (
//                         <CDropdownItem
//                           key={index}
//                           to={`${
//                             item.robot_no === robot_no
//                               ? `#`
//                               : `${item.robot_no}`
//                           }`}
//                           className={`dopdown-item ${
//                             item.lora_state === 1 ? `online` : `offline`
//                           }`}
//                         >
//                           {item.robot_no}
//                         </CDropdownItem>
//                       ))}
//                 </CDropdownMenu>
//               </CDropdown>
//             </CCol>
//           </CRow>
//           <CRow className="my-2">
//             <CCol></CCol>
//           </CRow>

//           <CRow className="">
//             {/* First Card */}
//             <CCol md={7} className="mt-2">
//               <CCard className="shadow border-0" style={{ height: "100%" }}>
//                 <CCardBody>
//                   <CTable borderless>
//                     <CTableBody>
//                       <CTableRow>
//                         <CTableDataCell>
//                           <span className=" " style={{ fontSize: "15px" }}>
//                             {robot.robot_no}
//                           </span>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           🔋: {robot.battery_voltage}%
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <span className="badge bg-success">
//                             {robot.version}
//                           </span>
//                         </CTableDataCell>
//                       </CTableRow>
//                       <CTableRow>
//                         <CTableDataCell className="text-danger">
//                           <span className=" " style={{ fontSize: "13px" }}>
//                             {" "}
//                           </span>
//                         </CTableDataCell>
//                         <CTableDataCell>Wheel Speed</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge
//                             className="badge bg-danger"
//                             shape="rounded-pill"
//                           >
//                             {robot.wheel_motor_speed}
//                           </CBadge>
//                         </CTableDataCell>
//                       </CTableRow>
//                       <CTableRow>
//                         <CTableDataCell>
//                           Deveui:
//                           <span className="text-danger">({robot.lora_no})</span>
//                           -<span className="text-success">{robot.deveui}</span>
//                         </CTableDataCell>
//                         <CTableDataCell>Brush Speed</CTableDataCell>
//                         <CTableDataCell>
//                           <CBadge
//                             className="badge bg-danger"
//                             shape="rounded-pill"
//                           >
//                             {robot.brush_motor_speed}
//                           </CBadge>
//                         </CTableDataCell>
//                       </CTableRow>
//                     </CTableBody>
//                   </CTable>
//                 </CCardBody>
//               </CCard>
//             </CCol>

//             {/* Second Card */}
//             <CCol md={5} className="mt-2">
//               <CCard className="shadow border-0 " style={{ height: "100%" }}>
//                 <CCardBody>
//                   <CTable borderless>
//                     <CTableBody>
//                       <CTableRow>
//                         <CTableDataCell>
//                           <span
//                             className={`text-${
//                               robot.lora_state === 1 ? `success` : `danger`
//                             }`}
//                           >
//                             {robot.lora_state === 1 ? `online` : `offline`}
//                           </span>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <span className=" ">{robot.last_status}</span>
//                         </CTableDataCell>
//                       </CTableRow>
//                       <CTableRow>
//                         <CTableDataCell>
//                           <span className="text-danger">
//                             SC : {robot.stuck_count}
//                           </span>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {!robot.last_uplink ||
//                           isNaN(new Date(robot.last_uplink).getTime()) ? (
//                             <CBadge
//                               className="badge bg-danger"
//                               shape="rounded-pill"
//                             >
//                               Robot is not activated
//                             </CBadge>
//                           ) : (
//                             <span>
//                               <CTooltip
//                                 content={new Date(
//                                   robot.last_uplink
//                                 ).toLocaleString()}
//                                 placement="top"
//                               >
//                                 <span>
//                                   {formatDistanceToNow(
//                                     new Date(robot.last_uplink),
//                                     {
//                                       addSuffix: true,
//                                     }
//                                   )}
//                                 </span>
//                               </CTooltip>
//                             </span>
//                           )}
//                         </CTableDataCell>
//                       </CTableRow>
//                     </CTableBody>
//                   </CTable>
//                 </CCardBody>
//               </CCard>
//             </CCol>
//           </CRow>

//           <CRow className="my-2">
//             {/* First Card - Cleaning Cycle */}
//             <CCol md={4} className="mt-2">
//               <CCard className="shadow border-0 " style={{ height: "100%" }}>
//                 <CCardBody>
//                   <p>Cleaning Cycle</p>
//                   <CButton
//                     className="btn btn-sm btn-secondary m-1 shadow"
//                     onClick={() => sendsingleDownlink(start, 1)}
//                   >
//                     {commandButton === 1 ? (
//                       <>
//                         START&nbsp;
//                         <LoadingSpinner />
//                       </>
//                     ) : (
//                       "START"
//                     )}
//                   </CButton>
//                   <CButton
//                     className="btn btn-sm btn-secondary m-1 shadow-sm"
//                     onClick={() => sendsingleDownlink(stop, 2)}
//                   >
//                     {commandButton === 2 ? (
//                       <>
//                         STOP&nbsp;
//                         <LoadingSpinner />
//                       </>
//                     ) : (
//                       "STOP"
//                     )}
//                   </CButton>
//                   <CButton
//                     className="btn btn-sm btn-secondary m-1 shadow-sm"
//                     onClick={() => sendsingleDownlink(returntodock, 3)}
//                   >
//                     {commandButton === 3 ? (
//                       <>
//                         RETURN&nbsp;
//                         <LoadingSpinner />
//                       </>
//                     ) : (
//                       "RETURN"
//                     )}
//                   </CButton>
//                 </CCardBody>
//               </CCard>
//             </CCol>

//             {/* Second Card - Set Wheel Speed */}
//             <CCol md={4} className="mt-2">
//               <CCard className="shadow border-0 " style={{ height: "100%" }}>
//                 <CCardBody>
//                   <p>Set Wheel Speed</p>
//                   <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
//                     LOW
//                   </CButton>
//                   <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
//                     MEDIUM
//                   </CButton>
//                   <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
//                     HIGH
//                   </CButton>
//                 </CCardBody>
//               </CCard>
//             </CCol>

//             {/* Third Card - Set Brush Speed */}
//             <CCol md={4} className="mt-2">
//               <CCard className="shadow border-0 " style={{ height: "100%" }}>
//                 <CCardBody>
//                   <p>Set Brush Speed</p>
//                   <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
//                     LOW
//                   </CButton>
//                   <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
//                     MEDIUM
//                   </CButton>
//                   <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
//                     HIGH
//                   </CButton>
//                 </CCardBody>
//               </CCard>
//             </CCol>
//           </CRow>
//         </div>
//       )}
//     </>
//   );
// };

// export default SiteTechnicianRobotOperating;

import React, { useEffect, useReducer, useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CTable,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CDropdownMenu,
  CDropdownItem,
  CDropdown,
  CDropdownToggle,
  CTooltip,
  CBadge,
} from "@coreui/react";
import "./management.css";
import { Link, useParams } from "react-router-dom";
import "./management.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        downlinks: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        loading: false,
      };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, error: "" };

    case "FETCH_ROBOTS_SUCCESS":
      return { ...state, loadingRobots: false, robots: action.payload };

    case "FETCH_ROBOTS_FAIL":
      return { ...state, loadingRobots: false, error: action.payload };

    case "SEND_DOWNLINK_REQUEST":
      return { ...state, sendingCommandloading: true, error: "" };

    case "SEND_DOWNLINK_SUCCESS":
      return { ...state, sendingCommandloading: false };

    case "SEND_DOWNLINK_FAIL":
      return { ...state, sendingCommandloading: false, error: action.payload };

    case "FETCH_ROBOT_REQUEST":
      return { ...state, loadingRobot: true, error: "" };

    case "FETCH_ROBOT_SUCCESS":
      return { ...state, loadingRobot: false, robot: action.payload };

    case "FETCH_ROBOT_FAIL":
      return { ...state, loadingRobot: false, error: action.payload };

    default:
      return state;
  }
};
const SiteTechnicianRobotOperating = () => {
  const { site_id, block, robot_no } = useParams();
  const [siteRobots, setSiteRobots] = useState([]);
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  let start = "11";

  let stop = "14";
  let returntodock = "15";
  // const [LoadingRow,setLoadingRow] = useState(null); // Track the row index
  const [commandButton, setCommandButton] = useState(null); // Track the row index

  const [{ error, loadingRobots, robots, robot }, dispatch] = useReducer(
    reducer,
    {
      robot: {},
      robots: [],
      loading: true,
      error: "",
      loadingRobots: true,
      sendingCommandloading: false,
    },
  );

  let adminroute = "";

  if (userInfo?.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo?.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo?.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Client Admin") {
    adminroute = "client-admin";
  } else if (userInfo?.role === "Site Incharge") {
    adminroute = "site-incharge";
  } else if (userInfo?.role === "Site Technician") {
    adminroute = "site-technician";
  } else if (userInfo?.role === "Client Site Technician") {
    adminroute = "client-site-technician";
  }

  useEffect(() => {
    const getRobots = async () => {
      try {
        dispatch({ type: "FETCH_ROBOTS_REQUEST" });
        const response = await axios.get(
          `/api/v1/robots/site/${site_id}/${block}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          },
        );
        const robotsData = response.data.data; // Ensure correct data access

        dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: robotsData });

        // ✅ Filter robots assigned to this site
        if (site_id) {
          const extractNumber = (robotNo) =>
            parseInt(robotNo.match(/\d+/g)?.join("") || "0", 10);

          const filteredRobots = robotsData
            .filter(
              (robot) => robot.site_id === site_id && robot.block === block,
            )
            .sort(
              (a, b) => extractNumber(a.robot_no) - extractNumber(b.robot_no),
            );

          setSiteRobots(filteredRobots);
        }
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOTS_FAIL",
          payload: error.response ? error.response.data.message : error.message,
        });
      }
    };

    const getRobot = async () => {
      try {
        dispatch({ type: "FETCH_ROBOT_REQUEST" });
        const response = await axios.get(
          `/api/v1/robots/get-robot-using-robot-no/${robot_no}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          },
        );

        dispatch({ type: "FETCH_ROBOT_SUCCESS", payload: response.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_ROBOT_FAIL",
          payload: error.response
            ? error.response.data.message
            : error.response.data.error,
        });
      }
    };
    getRobots();
    getRobot();
  }, [block, site_id, authtoken, robot_no]);

  // ✅ Ensure robots exist before filtering
  // const Robotdata =
  //   robots?.length > 0
  //     ? robots.filter(
  //         (robot) =>
  //           robot.site_id === site_id &&
  //           robot.block === block &&
  //           robot.robot_no === robot_no
  //       )
  //     : [];
  const blockwiserobots =
    robots?.length > 0 ? robots.filter((robot) => robot.block === block) : [];

  const sendsingleDownlink = async (command, index) => {
    setCommandButton(index);
    //deveui,command,robot_no,site_id,lora_no
    // let robotdownlink = {
    //   deveui: robot.deveui,
    //   robot_no: robot.robot_no,
    //   site_id: site_id,
    //   command: command,
    //   lora_no: robot.lora_no,
    // };
    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        "/api/v1/robots/send-mqtt-downlink",
        {
          deveui: robot.deveui,
          robot_no: robot.robot_no,
          site_id: site_id,
          payload: command,
          lora_no: robot.lora_no,
        },
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        },
      );
      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
      toast.success(data.data.message);
    } catch (error) {
      dispatch({
        type: "SEND_DOWNLINK_FAIL",
        payload: error.response?.data?.message || error.response.data.error,
      });

      toast.error(error.response.data.message || error.response.data.error);
    }
    // setLoadingRow(null);
    setCommandButton(null);
  };

  const sendMulticastDownlink = async (command, index) => {
    let alldeveuis = blockwiserobots.map((robot) => robot.deveui); // Corrected arrow function syntax
    let allrobotnos = blockwiserobots.map((robot) => robot.robot_no); // Corrected arrow function syntax

    setCommandButton(index);
    //deveui,command,robot_no,site_id,lora_no
    let robotdownlink = {
      deveui: alldeveuis,
      block: block,
      site_id: site_id,
      command: command,
      robot_no: allrobotnos,
    };
    dispatch({ type: "SEND_DOWNLINK_REQUEST" });
    try {
      const data = await axios.post(
        "/api/v1/robots/send-mqtt-multicast-downlink",
        robotdownlink,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        },
      );

      dispatch({ type: "SEND_DOWNLINK_SUCCESS" });
      toast.success(data.data.message);
    } catch (error) {
      dispatch({
        type: "SEND_DOWNLINK_FAIL",
        payload: error.response?.data?.message,
      });

      toast.error(error.response.data.message || error.response.data.error);
    }

    setCommandButton(null);
  };

  return (
    <>
      {loadingRobots ? (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <h1>{error}</h1>
      ) : (
        <div className="">
          {/* Page Header */}
          <CRow>
            <CCol>
              <h4 className="fw-bold text-center">
                <span className="">{site_id} -&nbsp;</span>
                <span className="text-primary">{block}</span>
                &nbsp;-&nbsp;Robot's Configuration
              </h4>
            </CCol>
          </CRow>

          {/* Action Buttons */}
          <CRow className="my-2">
            <CCol>
              <CButton
                className="btn btn-sm btn-secondary m-1 shadow-sm"
                disabled={commandButton === 1}
                onClick={() => sendMulticastDownlink(start, 1)}
              >
                {commandButton === 1 ? (
                  <>
                    START ALL&nbsp;
                    <LoadingSpinner />
                  </>
                ) : (
                  "START ALL"
                )}
              </CButton>
              <CButton
                disabled={commandButton === 2}
                className="btn btn-sm btn-secondary m-1 shadow-sm"
                onClick={() => sendMulticastDownlink(stop, 2)}
              >
                {commandButton === 2 ? (
                  <>
                    STOP ALL&nbsp;
                    <LoadingSpinner />
                  </>
                ) : (
                  "STOP ALL"
                )}
              </CButton>
              <CButton
                className="btn btn-sm btn-secondary m-1 shadow-sm"
                disabled={commandButton === 3}
                onClick={() => sendMulticastDownlink(returntodock, 3)}
              >
                {commandButton === 3 ? (
                  <>
                    RETURN TO DOCK ALL&nbsp;
                    <LoadingSpinner />
                  </>
                ) : (
                  "RETURN TO DOCK ALL"
                )}
              </CButton>
              <Link
                to={`/${adminroute}/site-management/block-management/${site_id}/${block}/${robot_no}/debug_logs`}
                className="btn btn-sm btn-secondary  btn-sm m-1 shadow-sm"
              >
                DEBUG LOG
              </Link>

              <CDropdown className="dropdown">
                {siteRobots.length > 1 ? (
                  <CDropdownToggle
                    size="sm"
                    className="shadow-sm "
                    color={`${robot.lora_state === 1 ? `success` : `danger`}`}
                  >
                    {robot.robot_no}
                  </CDropdownToggle>
                ) : (
                  <CButton
                    className={`${
                      robot.lora_state === 1 ? `` : `text-white`
                    } shadow-sm`}
                    color={`${robot.lora_state === 1 ? `success` : `danger`}`}
                    size="sm"
                  >
                    {robot.robot_no}
                  </CButton>
                )}

                <CDropdownMenu
                  className="z-3 px-2 py-1 dropdown-menu-robot border"
                  // style={{ width: "100px", maxHeight: "200px" }}
                >
                  {siteRobots.length === 1
                    ? ""
                    : siteRobots.map((item, index) => (
                        <CDropdownItem
                          key={index}
                          to={`${
                            item.robot_no === robot_no
                              ? `#`
                              : `${item.robot_no}`
                          }`}
                          className={`dopdown-item ${
                            item.lora_state === 1 ? `online` : `offline`
                          }`}
                        >
                          <Link
                            key={index}
                            to={
                              item.robot_no === robot_no
                                ? `#`
                                : `/${adminroute}/site-management/block-management/${site_id}/${block}/${item.robot_no}`
                            }
                            className="dopdown-item-robot text-dark"
                          >
                            {item.robot_no}
                          </Link>
                        </CDropdownItem>
                      ))}
                </CDropdownMenu>
              </CDropdown>
              <CBadge color="primary" className="m-1 p-2 ">
                <Link
                  to={`event-and-frames/${robot.deveui}`}
                  className=" text-decoration-none text-white"
                >
                  Frames
                </Link>
              </CBadge>
            </CCol>
          </CRow>
          <CRow className="my-2">
            <CCol></CCol>
          </CRow>

          <CRow className="">
            {/* First Card */}
            <CCol md={7} className="mt-2">
              <CCard className="shadow border-0" style={{ height: "100%" }}>
                <CCardBody>
                  <CTable borderless>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>
                          <span className=" " style={{ fontSize: "15px" }}>
                            {robot.robot_no}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          🔋: {robot.battery_voltage}%
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="badge bg-success">
                            {robot.version}
                          </span>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="text-danger">
                          <span className=" " style={{ fontSize: "13px" }}>
                            {" "}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>Wheel Speed</CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            className="badge bg-danger"
                            shape="rounded-pill"
                          >
                            {robot.wheel_motor_speed}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>
                          Deveui:
                          <span className="text-danger">({robot.lora_no})</span>
                          -<span className="text-success">{robot.deveui}</span>
                        </CTableDataCell>
                        <CTableDataCell>Brush Speed</CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            className="badge bg-danger"
                            shape="rounded-pill"
                          >
                            {robot.brush_motor_speed}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Second Card */}
            <CCol md={5} className="mt-2">
              <CCard className="shadow border-0 " style={{ height: "100%" }}>
                <CCardBody>
                  <CTable borderless>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>
                          <span
                            className={`text-${
                              robot.lora_state === 1 ? `success` : `danger`
                            }`}
                          >
                            {robot.lora_state === 1 ? `online` : `offline`}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className=" ">{robot.last_status}</span>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>
                          <span className="text-danger">
                            SC : {robot.stuck_count}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          {!robot.last_uplink ||
                          isNaN(new Date(robot.last_uplink).getTime()) ? (
                            <CBadge
                              className="badge bg-danger"
                              shape="rounded-pill"
                            >
                              Robot is not activated
                            </CBadge>
                          ) : (
                            <span>
                              <CTooltip
                                content={new Date(
                                  robot.last_uplink,
                                ).toLocaleString()}
                                placement="top"
                              >
                                <span>
                                  {formatDistanceToNow(
                                    new Date(robot.last_uplink),
                                    {
                                      addSuffix: true,
                                    },
                                  )}
                                </span>
                              </CTooltip>
                            </span>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CRow className="my-2">
            {/* First Card - Cleaning Cycle */}
            <CCol md={4} className="mt-2">
              <CCard className="shadow border-0 " style={{ height: "100%" }}>
                <CCardBody>
                  <p>Cleaning Cycle</p>
                  <CButton
                    className="btn btn-sm btn-secondary m-1 shadow"
                    disabled={commandButton === 1}
                    onClick={() => sendsingleDownlink(start, 1)}
                  >
                    {commandButton === 1 ? (
                      <>
                        START&nbsp;
                        <LoadingSpinner />
                      </>
                    ) : (
                      "START"
                    )}
                  </CButton>
                  <CButton
                    className="btn btn-sm btn-secondary m-1 shadow-sm"
                    disabled={commandButton === 2}
                    onClick={() => sendsingleDownlink(stop, 2)}
                  >
                    {commandButton === 2 ? (
                      <>
                        STOP&nbsp;
                        <LoadingSpinner />
                      </>
                    ) : (
                      "STOP"
                    )}
                  </CButton>
                  <CButton
                    className="btn btn-sm btn-secondary m-1 shadow-sm"
                    disabled={commandButton === 3}
                    onClick={() => sendsingleDownlink(returntodock, 3)}
                  >
                    {commandButton === 3 ? (
                      <>
                        RETURN&nbsp;
                        <LoadingSpinner />
                      </>
                    ) : (
                      "RETURN"
                    )}
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Second Card - Set Wheel Speed */}
            <CCol md={4} className="mt-2">
              <CCard className="shadow border-0 " style={{ height: "100%" }}>
                <CCardBody>
                  <p>Set Wheel Speed</p>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    LOW
                  </CButton>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    MEDIUM
                  </CButton>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    HIGH
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Third Card - Set Brush Speed */}
            <CCol md={4} className="mt-2">
              <CCard className="shadow border-0 " style={{ height: "100%" }}>
                <CCardBody>
                  <p>Set Brush Speed</p>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    LOW
                  </CButton>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    MEDIUM
                  </CButton>
                  <CButton className="btn btn-sm btn-secondary m-1 shadow-sm">
                    HIGH
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      )}
    </>
  );
};

export default SiteTechnicianRobotOperating;
