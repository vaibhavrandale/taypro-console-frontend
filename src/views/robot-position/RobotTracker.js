import React, { useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import Robot from "./Robot";
import RobotSidebar from "./RobotSidebar";
import { smoothScroll } from "./helpers";
import socket from "../../components/Socket";
import LoadingSpinner from "../../components/LoadingSpinner";
import { CBadge, CCol, CFormInput, CFormSelect, CRow } from "@coreui/react";
import SubscriptionExpiryCard from "../../components/SubscriptionExpiryCard";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, robots: action.payload };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        robots: state.robots.filter((r) => r._id !== action.payload), // remove deleted robot
      };

    case "FETCH_SITES_REQUEST":
      return { ...state, loadingSites: true, sitesError: "" };
    case "FETCH_SITES_SUCCESS":
      return { ...state, loadingSites: false, sites: action.payload };
    case "FETCH_SITES_FAIL":
      return { ...state, loadingSites: false, sitesError: action.payload };

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    default:
      return state;
  }
};

const RobotTracker = () => {
  const [
    {
      error,
      robots,
      loading,
      loadingDelete,
      loadingSites,
      sites,
      sitesError,
      subscriptiondata,
      subscriptionStatus,
    },
    dispatch,
  ] = useReducer(reducer, {
    robots: [],
    loading: true,
    error: "",
    loadingDelete: false,
    sites: [],
    loadingSites: true,
    sitesError: "",
    subscriptiondata: {},
    subscriptionStatus: "",
  });
  const scrollRefs = useRef({});
  const robotsRef = useRef([]);
  const [site_id, setSiteId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [selectedRobotId, setSelectedRobotId] = useState(null);
  // const [selectedRobot, setSelectedRobot] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const mergeLastActivity = (existing, incoming) => {
    const existingKeys = new Set(
      existing.map((a) => new Date(a.timestamp).getTime())
    );
    const newItems = (incoming || []).filter(
      (a) => !existingKeys.has(new Date(a.timestamp).getTime())
    );
    return [...existing, ...newItems];
  };

  useEffect(() => {
    const fetchSites = async () => {
      dispatch({ type: "FETCH_SITES_REQUEST" });
      try {
        const res = await axios.get(`/api/v1/sites`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        const siteData = res.data.data || [];
        dispatch({ type: "FETCH_SITES_SUCCESS", payload: siteData });

        // ✅ Immediately set siteId after fetching if user is External
        if (siteData.length > 0) {
          setSiteId(siteData[0].site_id);
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.error || err.response?.data?.message;
        dispatch({ type: "FETCH_SITES_FAIL", payload: errorMsg });
        toast.error(errorMsg);
      }
    };
    fetchSites();
  }, [authtoken]);
  useEffect(() => {
    if (site_id) {
      socket.emit("join_site_id_room", site_id);
      console.log("Joined site:", site_id);
    }
    return () => socket.emit("leave_site_id_room", site_id);
  }, [site_id]);

  // Fetch robot tracking data
  useEffect(() => {
    if (!site_id) return; // ❌ Exit if no site selected yet

    const fetchRobotTracking = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.post(
          "/api/v1/robot-tracking/sitewise/fetch-by-sites-and-date",
          {
            site_id: site_id,
            date: date,
          },
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
          subscriptiondata: error.response?.data?.data,
          subscriptionStatus: error.response?.data?.subscriptionStatus,
        });
        toast.error(
          error.response?.data?.error || error.response?.data?.message
        );
      }
    };
    fetchRobotTracking();
  }, [authtoken, date, site_id]);

  // useEffect(() => {
  //   const fetchSites = async () => {
  //     dispatch({ type: "FETCH_SITES_REQUEST" });
  //     try {
  //       const res = await axios.get(
  //         `/api/v1/sites`,

  //         {
  //           headers: { Authorization: `Bearer ${authtoken}` },
  //         }
  //       );
  //       dispatch({ type: "FETCH_SITES_SUCCESS", payload: res.data.data });
  //     } catch (err) {
  //       dispatch({
  //         type: "FETCH_SITES_FAIL",
  //         payload: err.response?.data?.error || err.response?.data?.message,
  //       });
  //       toast.error(err.response?.data?.error || err.response?.data?.message);
  //     }
  //   };
  //   fetchSites();
  // }, [authtoken]);

  robotsRef.current = robots;
  useEffect(() => {
    const handleUpdate = ({ tracking }) => {
      const newPoint = parseInt(tracking.uplink.data, 10);
      toast.success(`${tracking.robot_no}'s Update Sent!`, {
        position: "top-right",
      });

      // Update robot state and add new robot if not exists
      dispatch({
        type: "FETCH_SUCCESS",
        payload: (() => {
          const exists = robotsRef.current.some((r) => r._id === tracking._id);
          if (exists) {
            // Update existing robot
            return robotsRef.current.map((r) =>
              r._id === tracking._id
                ? {
                    ...r,
                    uplink: { ...r.uplink, ...tracking.uplink },
                    // last_activity: [
                    //   ...r.last_activity,
                    //   ...(tracking.last_activity || []),
                    // ],
                    last_activity: mergeLastActivity(
                      r.last_activity,
                      tracking.last_activity
                    ),

                    comments: tracking.comments,
                    cleaning: { ...r.cleaning, ...tracking.cleaning },
                    track_details: [
                      ...r.track_details,
                      ...(tracking.track_details || []),
                    ],
                    updatedAt: new Date().toISOString(),
                  }
                : r
            );
          } else {
            // Push new robot into array
            return [...robotsRef.current, tracking];
          }
        })(),
      });

      // Smooth scroll update
      const robot = robotsRef.current.find((r) => r._id === tracking._id);
      const el = scrollRefs.current[tracking._id];

      if (robot && el) {
        const L = robot.row_length || 1;
        let segmentPct = 0;

        if (newPoint >= 19 && newPoint <= 29) {
          segmentPct = (newPoint - 19) / (29 - 19);
        } else if (newPoint >= 31 && newPoint <= 40) {
          segmentPct = (newPoint - 31) / (40 - 31);
        } else {
          segmentPct = newPoint / L;
        }

        const iconOffsetPx = segmentPct * L * 25; // 25px per point
        const halfWidth = el.clientWidth / 2;

        let targetScroll =
          newPoint >= 19 && newPoint <= 29
            ? iconOffsetPx - el.clientWidth * 0.25
            : newPoint >= 31 && newPoint <= 40
            ? iconOffsetPx - el.clientWidth * 0.75
            : iconOffsetPx - halfWidth;

        targetScroll = Math.max(
          0,
          Math.min(targetScroll, el.scrollWidth - el.clientWidth)
        );

        smoothScroll(el, targetScroll, 400);
      }
    };

    // Remove old listener before adding
    socket.off("robotPositionUpdate", handleUpdate);
    socket.on("robotPositionUpdate", handleUpdate);

    return () => socket.off("robotPositionUpdate", handleUpdate);
  }, [dispatch]);

  const handleRobotClick = (robot) => {
    setSelectedRobotId(robot._id);
    setSidebarVisible(true); // ✅ open sidebar
  };

  const handleSidebarClose = () => setSidebarVisible(false);
  const selectedRobot = robots.find((r) => r._id === selectedRobotId);
  // Delete handler
  const deleteHandler = async (e, id) => {
    e.preventDefault();
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this robot tracking (${id})?`
    );
    if (!confirmDelete) return; // Exit if user cancels

    dispatch({ type: "DELETE_REQUEST" });
    try {
      const response = await axios.delete(`/api/v1/robot-tracking/${id}`, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({ type: "DELETE_SUCCESS", payload: id });
      toast.success(response.data.message);
    } catch (error) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error(error.response?.data?.error || error.response?.data?.message);
    }
  };

  const checkStatus = [
    "subscriptionSitesAssigned",
    "subscriptionFound",
    "subscriptionaRenewStatus",
    "subscriptionPaymentStatus",
    "subscriptionPlanAccess",
  ];
  return (
    <div className="custom-scrollbar">
      {(loadingSites || loading) && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh", // centers spinner vertically
          }}
        >
          <LoadingSpinner />
        </div>
      )}

      {!loadingSites && !loading && (
        <>
          {sitesError || error ? (
            <CBadge color="danger" className="p-2">
              {sitesError || error}
            </CBadge>
          ) : (
            <CRow className="m-2 align-items-center">
              <CCol md={4}>
                <h4 className="text-light text-center text-success">
                  Live Robot Tracking
                </h4>
              </CCol>
              <CCol md={3}></CCol>
              <CCol md={3}>
                <CFormSelect
                  id="siteSelect"
                  className="p-2"
                  value={site_id}
                  onChange={(e) => setSiteId(e.target.value)}
                >
                  <option value="">Select Site</option>
                  {sites?.map((site, index) => (
                    <option key={index} value={site.site_id}>
                      {site.site_id}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormInput
                  type="date"
                  className="p-1"
                  placeholder="Search by Category..."
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </CCol>
            </CRow>
          )}

          <div className="custom-scrollbar">
            {checkStatus.includes(subscriptionStatus) ? (
              <SubscriptionExpiryCard
                data={subscriptiondata}
                subscriptionStatus={subscriptionStatus}
                error={sitesError}
              />
            ) : (
              <div
                style={{
                  overflowX: "auto",
                  height: "auto",
                  overflowY: "hidden",
                }}
              >
                {robots.length > 0 ? (
                  robots.map((robot) => (
                    <div className="col-md-12 my-3" key={robot._id}>
                      <Robot
                        robot={robot}
                        handleRobotClick={handleRobotClick}
                        deleteHandler={(e) => deleteHandler(e, robot._id)}
                        loadingDelete={loadingDelete}
                      />
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50vh", // centers spinner vertically
                    }}
                  >
                    <div className="alert alert-danger w-50 text-center">
                      No Robots Tracking Found Today
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Sidebar and Footer remain exactly the same */}
      {/* Sidebar */}
      {selectedRobot && (
        <RobotSidebar
          deleteHandler={deleteHandler}
          robot={selectedRobot}
          visible={sidebarVisible}
          onClose={handleSidebarClose}
          userInfo={userInfo}
        />
      )}
      {/*footer */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          padding: "5px 5px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "15px",
          backgroundColor: "#080f25",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#FFA000",
            }}
          ></div>
          <span>Running</span>
        </div>
        |
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#4CAF50",
            }}
          ></div>
          <span>At Dock/Cleaning Completed</span>
        </div>
        |
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#ff0000ab",
            }}
          ></div>
          <span>Cancelled/Stuck/Battery Dead</span>
        </div>
      </div>
    </div>

    //   <div className="custom-scrollbar">
    //   {loadingSites ? (
    //     <div><LoadingSpinner /></div>
    //   ) : sitesError ? (
    //     <CBadge color="danger" className="p-2">
    //       {sitesError}
    //     </CBadge>
    //   ) : (
    //     <CRow className="m-2  align-items-center">
    //       <CCol md={4}>
    //         <h4 className="text-light text-center text-success">
    //           Live Robot Tracking
    //         </h4>
    //       </CCol>
    //       <CCol md={3}></CCol>
    //       <CCol md={3}>
    //         <CFormSelect
    //           id="siteSelect"
    //           className="p-2"
    //           value={site_id}
    //           onChange={(e) => {
    //             setSiteId(e.target.value);
    //           }}
    //         >
    //           <option value="">Select Site</option>
    //           {sites?.map((site, index) => (
    //             <option key={index} value={site.site_id}>
    //               {site.site_id}
    //             </option>
    //           ))}
    //         </CFormSelect>
    //       </CCol>
    //       <CCol md={2}>
    //         <CFormInput
    //           type="date"
    //           className="p-1"
    //           placeholder="Search by Category..."
    //           value={date}
    //           onChange={(e) => setDate(e.target.value)}
    //         />
    //       </CCol>
    //     </CRow>
    //   )}
    //   <div className=" custom-scrollbar">
    //     {loading ? (
    //      <div className=""><LoadingSpinner /></div>
    //     ) : checkStatus.includes(subscriptionStatus) ? (
    //       <SubscriptionExpiryCard
    //         data={subscriptiondata}
    //         subscriptionStatus={subscriptionStatus}
    //         error={sitesError}
    //       />
    //     ) : (
    //       <div
    //         style={{ overflowX: "auto", height: "auto", overflowY: "hidden" }}
    //       >
    //         {robots.length > 0 ? (
    //           robots.map((robot) => (
    //             <div className="col-md-12 my-3" key={robot._id}>
    //               <Robot
    //                 robot={robot}
    //                 handleRobotClick={handleRobotClick} // ✅ pass function
    //                 deleteHandler={(e) => deleteHandler(e, robot._id)}
    //                 loadingDelete={loadingDelete}
    //               />
    //             </div>
    //           ))
    //         ) : (
    //           <div className="alert alert-danger w-50">
    //             No Robots Tracking Found Today
    //           </div>
    //         )}
    //       </div>
    //     )}
    //   </div>

    //   {selectedRobot && (
    //     <RobotSidebar
    //       deleteHandler={deleteHandler}
    //       robot={selectedRobot}
    //       visible={sidebarVisible}
    //       onClose={handleSidebarClose}
    //       userInfo={userInfo}
    //     />
    //   )}

    //   <div
    //     style={{
    //       position: "sticky",
    //       bottom: 0,
    //       padding: "5px 5px",
    //       display: "flex",
    //       justifyContent: "flex-end",
    //       alignItems: "center",
    //       gap: "15px",
    //       backgroundColor: "#080f25",
    //     }}
    //   >
    //     <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    //       <div
    //         style={{
    //           width: "10px",
    //           height: "10px",
    //           backgroundColor: "#FFA000",
    //         }}
    //       ></div>
    //       <span>Running</span>
    //     </div>
    //     |
    //     <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    //       <div
    //         style={{
    //           width: "10px",
    //           height: "10px",
    //           backgroundColor: "#4CAF50",
    //         }}
    //       ></div>
    //       <span>At Dock/Cleaning Completed</span>
    //     </div>
    //     |
    //     <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    //       <div
    //         style={{
    //           width: "10px",
    //           height: "10px",
    //           backgroundColor: "#ff0000ab",
    //         }}
    //       ></div>
    //       <span>Cancelled/Stuck/Battery Dead</span>
    //     </div>
    //   </div>
    // </div>
  );
};

export default RobotTracker;
