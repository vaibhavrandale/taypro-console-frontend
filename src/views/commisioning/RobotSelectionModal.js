import React, { useEffect, useReducer, useState } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CAlert,
  CTabs,
  CTabList,
  CTab,
  CTabContent,
  CTabPanel,
} from "@coreui/react";

import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import toast from "react-hot-toast";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import { add } from "date-fns";
// import { set } from "core-js/core/dict";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, FetchRoboterror: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingRobots: false,
        robots: action.payload,
      };
    case "FETCH_ROBOTS_FAIL":
      return {
        ...state,
        loadingRobots: false,
        FetchRoboterror: action.payload,
      };

    case "ADD_ROBOTS_REQUEST":
      return {
        ...state,
        addLoading: true,
        addError: "",
      };

    case "ADD_ROBOTS_SUCCESS":
      return {
        ...state,
        addLoading: false,
      };

    case "ADD_ROBOTS_FAIL":
      return {
        ...state,
        addLoading: false,
        addError: action.payload,
      };
    case "REMOVE_ROBOTS_REQUEST":
      return {
        ...state,
        removeRobotLoading: true,
        removeRobotError: "",
      };

    case "REMOVE_ROBOTS_SUCCESS":
      return {
        ...state,
        removeRobotLoading: false,
      };

    case "REMOVE_ROBOTS_FAIL":
      return {
        ...state,
        removeRobotLoading: false,
        removeRobotError: action.payload,
      };

    default:
      return state;
  }
};

const RobotSelectionModal = ({
  visible,
  onClose,
  // onSelect,
  site_id,
  commisioning_doc_id,
  certificate_robots,
  fetchCertificates,
}) => {
  const [
    {
      robots,
      loadingRobots,
      FetchRoboterror,
      addLoading,
      addError,
      removeRobotLoading,
      removeRobotError,
    },
    dispatch,
  ] = useReducer(reducer, {
    robots: [],
    loadingRobots: false,
    FetchRoboterror: "",
    addLoading: false,
    addError: "",
  });

  const [selectedrobots, setSelectedRobots] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [removeSelected, setRemoveSelected] = useState([]);
  // // ✅ Filter only completed robots
  // const robots = robot_commissioning_doc.filter(
  //   (r) => r.status === "completed",
  // );
  const fetchRobots = async () => {
    if (!site_id) return;
    dispatch({ type: "FETCH_ROBOTS_REQUEST" });
    try {
      const result = await axios.get(
        `/api/v1/commisioning-docs/commisioned-sitewise-not-incertificates-robots/${site_id}`,
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      dispatch({
        type: "FETCH_ROBOTS_SUCCESS",

        payload: result.data.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_ROBOTS_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };
  useEffect(() => {
    fetchRobots();
  }, []);

  const handleToggle = (robot) => {
    setSelectedRobots((prev) =>
      prev.some((r) => r.commisioning_doc_id === robot._id)
        ? prev.filter((r) => r.commisioning_doc_id !== robot._id)
        : [
            ...prev,
            {
              commisioning_doc_id: robot._id,
              robot_no: robot.robot_no,
              robot_type: robot.robot_type,
              block: robot.block,
              system_code:
                robot.robot_type === "Automatic"
                  ? "TPL-AUTOMATIC-1"
                  : "TPL-SEMI-AUTOMATIC-1",
            },
          ],
    );
  };

  // const handleSubmit = () => {
  //   setSelectedRobots(selectedrobots);

  //   toast.success("Added");
  //   console.log("Selected robots:", selectedrobots);
  //   onClose();
  // };
  const addRobotsHandler = async () => {
    try {
      dispatch({ type: "ADD_ROBOTS_REQUEST" });

      const res = await axios.put(
        `/api/v1/commisioning-certificates/add-robots/${commisioning_doc_id}`,
        { robots: selectedrobots },
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      dispatch({ type: "ADD_ROBOTS_SUCCESS" });
      console.log(res);
      // navigate(`/${adminroute}/commissioning/view/${res.data.data._id}`);
      toast.success(res.data.message);
      setSelectedRobots([]);
      onClose();
      fetchRobots();
      fetchCertificates();
    } catch (error) {
      dispatch({
        type: "ADD_ROBOTS_FAIL",
        payload:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed",
      });

      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  const removeRobotsHandler = async () => {
    try {
      dispatch({ type: "REMOVE_ROBOTS_REQUEST" });

      const res = await axios.put(
        `/api/v1/commisioning-certificates/remove-robots/${commisioning_doc_id}`,
        { robot_nos: removeSelected }, // ✅ multiple remove
        {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
      );

      dispatch({ type: "REMOVE_ROBOTS_SUCCESS" });

      toast.success(res.data.message);
      onClose();
      setRemoveSelected([]);

      fetchRobots(); // refresh data
      fetchCertificates();
    } catch (error) {
      dispatch({
        type: "REMOVE_ROBOTS_FAIL",
        payload:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed",
      });

      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRobots(
        robots.map((robot) => ({
          commisioning_doc_id: robot._id,
          robot_no: robot.robot_no,
          robot_type: robot.robot_type,
          block: robot.block,
          system_code:
            robot.robot_type === "Automatic"
              ? "TPL-AUTOMATIC-1"
              : "TPL-SEMI-AUTOMATIC-1",
        })),
      );
    } else {
      setSelectedRobots([]);
    }
  };

  const handleSelectAllToremove = (checked) => {
    if (checked) {
      setRemoveSelected(certificate_robots.map((robot) => robot.robot_no));

      console.log("existing robots: ", certificate_robots);
      console.log("remove selected: ", removeSelected);
    } else {
      setRemoveSelected([]);
    }
  };

  const handleRemoveToggle = (robot_no) => {
    setRemoveSelected((prev) =>
      prev.includes(robot_no)
        ? prev.filter((r) => r !== robot_no)
        : [...prev, robot_no],
    );
  };
  return (
    // <CModal visible={visible} onClose={onClose} size="lg" backdrop="static">
    //   <CModalHeader
    //     closeButton={false}
    //     className="d-flex justify-content-between align-items-center"
    //   >
    //     <CModalTitle>Select Robots</CModalTitle>
    //     <button
    //       type="button"
    //       className="border-0 ms-auto py-0 px-1"
    //       onClick={onClose}
    //       style={{ background: "none" }}
    //       disabled={!visible}
    //     >
    //       <CIcon icon={cilX} size="lg" />
    //     </button>
    //   </CModalHeader>

    //   <CModalBody>
    //     <CTable bordered hover responsive className="text-center">
    //       <CTableHead color="secondary">
    //         <CTableRow>
    //           <CTableHeaderCell>
    // <CFormCheck
    //   checked={
    //     robots.length > 0 && selectedrobots.length === robots.length
    //   }
    //   indeterminate={
    //     selectedrobots.length > 0 &&
    //     selectedrobots.length < robots.length
    //   }
    //   onChange={(e) => handleSelectAll(e.target.checked)}
    // />
    //           </CTableHeaderCell>{" "}
    //           <CTableHeaderCell>Robot No</CTableHeaderCell>
    //           <CTableHeaderCell>Block</CTableHeaderCell>
    //           <CTableHeaderCell>Type</CTableHeaderCell>
    //           <CTableHeaderCell>Site</CTableHeaderCell>
    //         </CTableRow>
    //       </CTableHead>

    //       <CTableBody>
    //         {loadingRobots ? (
    //           <CTableRow>
    //             <CTableDataCell colSpan={5} className="text-center">
    //               <LoadingSpinner />{" "}
    //             </CTableDataCell>
    //           </CTableRow>
    //         ) : FetchRoboterror ? (
    //           <CTableRow>
    //             <CTableDataCell colSpan={5} className="text-center">
    //               {FetchRoboterror}{" "}
    //             </CTableDataCell>
    //           </CTableRow>
    //         ) : robots.length > 0 ? (
    //           robots.map((robot) => (
    //             <CTableRow key={robot._id}>
    //               <CTableDataCell>
    // <CFormCheck
    //   checked={selectedrobots.some(
    //     (r) => r.commisioning_doc_id === robot._id,
    //   )}
    //   onChange={() => handleToggle(robot)}
    // />
    //               </CTableDataCell>

    //               <CTableDataCell>{robot.robot_no}</CTableDataCell>
    //               <CTableDataCell>{robot.block}</CTableDataCell>
    //               <CTableDataCell>{robot.robot_type}</CTableDataCell>
    //               <CTableDataCell>{robot.site_location}</CTableDataCell>
    //             </CTableRow>
    //           ))
    //         ) : (
    //           <CTableRow>
    //             <CTableDataCell colSpan={5}>No robots available</CTableDataCell>
    //           </CTableRow>
    //         )}
    //       </CTableBody>
    //     </CTable>
    //   </CModalBody>

    //   <CModalFooter>
    //     {addError && (
    //       <CAlert className="text-danger me-auto">{addError}</CAlert>
    //     )}
    //     <CButton size="sm" color="secondary" onClick={onClose}>
    //       Cancel
    //     </CButton>

    //     {selectedrobots.length > 0 && (
    //       <CButton size="sm" color="primary" onClick={addRobotsHandler}>
    //         {addLoading ? (
    //           <LoadingSpinner />
    //         ) : (
    //           `Add Selected (${selectedrobots.length})`
    //         )}
    //       </CButton>
    //     )}
    //   </CModalFooter>
    // </CModal>

    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static">
      <CModalHeader
        closeButton={false}
        className="d-flex justify-content-between align-items-center"
      >
        <CModalTitle>Select Robots</CModalTitle>
        <button
          type="button"
          className="border-0 ms-auto py-0 px-1"
          onClick={onClose}
          style={{ background: "none" }}
          disabled={!visible}
        >
          <CIcon icon={cilX} size="lg" />
        </button>
      </CModalHeader>

      {/* BODY */}
      <CModalBody>
        <CTabs activeItemKey={activeTab} onActiveItemChange={setActiveTab}>
          <CTabList variant="tabs">
            <CTab itemKey="available">Robots to Add in Certificate</CTab>
            <CTab itemKey="added">Existing Robots in Certificate</CTab>
          </CTabList>

          <CTabContent>
            {/* ================= AVAILABLE TAB ================= */}
            <CTabPanel itemKey="available" className="p-3">
              <CTable bordered hover responsive className="text-center">
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>
                      <CFormCheck
                        checked={
                          robots.length > 0 &&
                          selectedrobots.length === robots.length
                        }
                        indeterminate={
                          selectedrobots.length > 0 &&
                          selectedrobots.length < robots.length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "200px" }}>
                      Robot No
                    </CTableHeaderCell>
                    <CTableHeaderCell>Block</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Site</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {loadingRobots ? (
                    <CTableRow>
                      <CTableDataCell colSpan={5}>
                        <LoadingSpinner />
                      </CTableDataCell>
                    </CTableRow>
                  ) : FetchRoboterror ? (
                    <CTableRow>
                      <CTableDataCell colSpan={5}>
                        {FetchRoboterror}
                      </CTableDataCell>
                    </CTableRow>
                  ) : robots.length > 0 ? (
                    robots.map((robot) => (
                      <CTableRow key={robot._id}>
                        <CTableDataCell>
                          <CFormCheck
                            checked={selectedrobots.some(
                              (r) => r.commisioning_doc_id === robot._id,
                            )}
                            onChange={() => handleToggle(robot)}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{robot.robot_no}</CTableDataCell>
                        <CTableDataCell>{robot.block}</CTableDataCell>
                        <CTableDataCell>{robot.robot_type}</CTableDataCell>
                        <CTableDataCell>{robot.site_location}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={5}>
                        No robots available
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CTabPanel>

            {/* ================= ADDED TAB ================= */}
            <CTabPanel itemKey="added" className="p-3">
              <CTable bordered hover responsive className="text-center">
                <CTableHead color="secondary">
                  <CTableRow>
                    <CTableHeaderCell>
                      {/* <CFormCheck
                        checked={
                          certificate_robots?.length > 0 &&
                          removeSelected.length === certificate_robots.length
                        }
                        indeterminate={
                          removeSelected.length > 0 &&
                          removeSelected.length < certificate_robots.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRemoveSelected(
                              certificate_robots.map((r) => r.robot_no),
                            );
                          } else {
                            setRemoveSelected([]);
                          }
                        }}
                      /> */}
                      {/* <CFormCheck
                        checked={
                          certificate_robots.length > 0 &&
                          removeSelected.length === certificate_robots.length
                        }
                        indeterminate={
                          removeSelected.length > 0 &&
                          removeSelected.length < certificate_robots.length
                        }
                        onChange={(e) =>
                          handleSelectAllToremove(e.target.checked)
                        }
                      /> */}

                      <CFormCheck
                        checked={
                          certificate_robots.length > 0 &&
                          removeSelected.length === certificate_robots.length
                        }
                        indeterminate={
                          removeSelected.length > 0 &&
                          removeSelected.length < certificate_robots.length
                        }
                        onChange={(e) =>
                          handleSelectAllToremove(e.target.checked)
                        }
                      />
                    </CTableHeaderCell>
                    <CTableHeaderCell style={{ minWidth: "200px" }}>
                      Robot No
                    </CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Block</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {certificate_robots?.length > 0 ? (
                    certificate_robots.map((robot, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          <CFormCheck
                            checked={removeSelected.includes(robot.robot_no)}
                            onChange={() => handleRemoveToggle(robot.robot_no)}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{robot.robot_no}</CTableDataCell>
                        <CTableDataCell>{robot.robot_type}</CTableDataCell>
                        <CTableDataCell>{robot.block}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={4}>
                        No robots in certificate
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </CModalBody>

      {/* FOOTER */}
      <CModalFooter>
        {addError && <CAlert color="danger">{addError}</CAlert>}
        {removeRobotError && <CAlert color="danger">{removeRobotError}</CAlert>}

        <CButton size="sm" color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        {/* i want delete button for added robots tab    still not coming after selectin add button is coming but not delete   */}
        {removeSelected.length > 0 && (
          <CButton
            size="sm"
            color="danger"
            onClick={removeRobotsHandler}
            disabled={removeSelected.length === 0 || removeRobotLoading}
          >
            {removeRobotLoading ? (
              <LoadingSpinner />
            ) : (
              `Remove (${removeSelected.length})`
            )}
          </CButton>
        )}
        {/* ADD BUTTON */}
        {selectedrobots.length > 0 && (
          <CButton size="sm" color="primary" onClick={addRobotsHandler}>
            {addLoading ? <LoadingSpinner /> : `Add (${selectedrobots.length})`}
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  );
};

export default RobotSelectionModal;
