import React, { useState, useEffect, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CInputGroup,
  CFormInput,
  CRow,
  CCol,
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CTooltip,
} from "@coreui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_BLOCKDATA_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_BLOCKDATA_SUCCESS":
      return {
        ...state,
        loading: false,
        robots: action.payload.robots,
        blocks: action.payload.blocks,
      };
    case "FETCH_BLOCKDATA_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const BlockManagement = () => {
  const [{ error, robots, blocks, loading }, dispatch] = useReducer(reducer, {
    robots: [],
    blocks: [],
    loading: false,
  });

  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const { site_id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const [sitename, setSitename] = useState("");
  const [sitelocation, setSitLocation] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_BLOCKDATA_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/robots/site-management/${site_id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_BLOCKDATA_SUCCESS",
          payload: {
            robots: result.data.data.robots || [],
            blocks: result.data.data.blocks || [],
          },
        });

        setSitename(result.data.data?.site_name || "Unknown");
        setSitLocation(result.data.data?.location || "Unknown");
      } catch (error) {
        dispatch({
          type: "FETCH_BLOCKDATA_FAIL",
          payload: error.message || "Failed to fetch data",
        });
        toast.error("Failed to fetch block data");
      }
    };

    fetchData();
  }, [authtoken, site_id]);

  const stopCommand = async () => {
    try {
      const response = await axios.post(
        `/api/v1/robots/stop-cleaning-by-site/${site_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      toast.success(
        response.data.message || "Stop Command sent to all Robots successfully"
      );
    } catch (error) {
      toast.error(error.message || "Failed to send stop command");
    }
  };

  const filteredRobots = Array.isArray(robots)
    ? robots.filter(
        (robot) =>
          robot.robot_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          robot.deveui?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          robot.block?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          robot.company?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  }

  return (
    <div className="min-vh-90 d-flex flex-column align-items-center">
      <h4 className="p-2 text-center text-primary">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <h4>{error}</h4>
        ) : (
          <span>
            {sitename}, {sitelocation}
          </span>
        )}
      </h4>
      <div className="p-2 d-flex justify-content-center">
        <div className="d-flex">
          <CButton
            className="btn btn-secondary btn-sm me-2"
            size="sm"
            onClick={() => setVisible(!visible)}
          >
            All Robot Data
          </CButton>
          <CButton
            className="btn btn-secondary btn-sm"
            size="sm"
            onClick={() => stopCommand()}
          >
            Stop Cleaning
          </CButton>
        </div>

        <CModal
          backdrop="static"
          size="xl"
          scrollable
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <CModalHeader closeButton={false}>
            <CModalTitle>
              <span className="text-primary">
                {sitename}, {sitelocation}
              </span>{" "}
              - Robots Details
            </CModalTitle>
            <button
              type="button"
              className=" border-0 ms-auto py-0 px-1"
              onClick={() => setVisible(false)}
              style={{ background: "none" }}
            >
              <CIcon icon={cilX} size="lg" />
            </button>
          </CModalHeader>
          <CModalBody>
            <CRow className="justify-content-end">
              <CCol xs={12} sm={10} md={6} lg={4}>
                <CInputGroup className="mb-3">
                  <CFormInput
                    type="text"
                    placeholder="Search Robot..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CInputGroup>
              </CCol>
            </CRow>
            <CTable responsive hover bordered>
              <CTableHead color="secondary">
                <CTableRow>
                  <CTableHeaderCell className="text-center">
                    Sr
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Robot No
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Deveui
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Status
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Block
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredRobots.length > 0 ? (
                  filteredRobots.map((robot, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-center">
                        {index + 1}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {robot.robot_no}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {robot.deveui}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {robot.lora_state === 1 ? "Online" : "Offline"}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {robot.block}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="5" className="text-center">
                      No matching robots found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CModalBody>
        </CModal>
      </div>
      <CContainer>
        <CRow className="mt-4 justify-content-center">
          {blocks.map((block, index) => {
            const robot = block.blockrobots ? block.blockrobots : null; // Handle single robot object

            return (
              <CCol md={4} className="my-2" key={index}>
                <CCard className="h-100 d-flex flex-column border-0 shadow-sm">
                  <CCardHeader className="text-center fw-bold border">
                    {block.block_name}
                  </CCardHeader>
                  <CCardBody className="d-flex flex-column flex-grow-1">
                    <div className="d-flex flex-row justify-content-between p-1">
                      <CCol md={3}>
                        <p className="text-center">Total</p>
                        <p className="text-primary fw-bold text-center">
                          {block.total_robot_count}
                        </p>
                      </CCol>
                      <CCol md={3}>
                        <p className="text-center">Online</p>
                        <p className="text-success fw-bold text-center">
                          {block.online}
                        </p>
                      </CCol>
                      <CCol md={3}>
                        <p className="text-center">Running</p>
                        <p className="text-success fw-bold text-center">
                          {block.running}
                        </p>
                      </CCol>
                      <CCol md={3}>
                        <p className="text-center">Offline</p>
                        <p className="text-danger fw-bold text-center">
                          {block.offline}
                        </p>
                      </CCol>
                    </div>

                    <div className="d-flex justify-content-center flex-wrap align-items-center flex-grow-1 mx-3">
                      {robot.map((item, index) => (
                        <CTooltip
                          key={index}
                          content={item.last_status}
                          placement="top"
                        >
                          <span
                            className={`tooltip-container m-1 badge p-1 rounded-1 ${
                              item.lora_state === 1 ? "bg-success" : "bg-danger"
                            }`}
                          >
                            <div
                              onClick={() =>
                                navigate(
                                  `/${adminroute}/site-management/block-management/${site_id}/${block.block_name}/${item.robot_no}`
                                )
                              }
                            >
                              {item.robot_no.slice(-3)}
                            </div>
                          </span>
                        </CTooltip>
                      ))}
                    </div>
                  </CCardBody>
                  <div className="p-2 d-flex justify-content-center">
                    {robot ? (
                      <Link
                        to={`/${adminroute}/site-management/block-management/${site_id}/${block.block_name}/${block.blockrobots[0].robot_no}`}
                        className="btn btn-sm btn-secondary"
                      >
                        MANAGE
                      </Link>
                    ) : (
                      <CButton disabled className="btn-sm btn-secondary">
                        No Robots
                      </CButton>
                    )}
                  </div>
                </CCard>
              </CCol>
            );
          })}
        </CRow>
      </CContainer>
    </div>
  );
};

export default BlockManagement;
