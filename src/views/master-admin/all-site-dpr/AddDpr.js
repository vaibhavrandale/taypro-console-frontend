import React, { useEffect, useReducer, useState } from "react";
import {
  CForm,
  CRow,
  CCol,
  CFormInput,
  CSpinner,
  CButton,
  CTableDataCell,
  CAvatar,
  CFormCheck,
  CTableHeaderCell,
  CTableRow,
  CTableBody,
  CTable,
  CTableHead,
  CFormSelect,
  CBadge,
  CModalBody,
  CModalTitle,
  CModalHeader,
  CModal,
  CModalFooter,
} from "@coreui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SITEID_REQUEST":
      return { ...state, loadingSiteIds: true, sitesError: "" };
    case "FETCH_SITEID_SUCCESS":
      return { ...state, loadingSiteIds: false, siteIds: action.payload };
    case "FETCH_SITEID_FAIL":
      return { ...state, loadingSiteIds: false, sitesError: action.payload };

    case "FETCH_TECHNICIAN_REQUEST":
      return { ...state, loadingTechnicians: true };

    case "FETCH_TECHNICIAN_SUCCESS":
      return {
        ...state,
        loadingTechnicians: false,
        technicians: action.payload,
      };

    case "FETCH_TECHNICIAN_FAIL":
      return {
        ...state,
        loadingTechnicians: false,
      };

    case "SET_ROBOTS_LOADING":
      return { ...state, loadingRobots: true };

    case "SET_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingRobots: false,
        availableRobots: action.payload,
      };

    case "ADD_BREAKDOWN_REASON":
      return {
        ...state,
        breakdown_reasons: [...state.breakdown_reasons, action.payload],
      };

    case "UPDATE_BREAKDOWN_REASON":
      return {
        ...state,
        breakdown_reasons: state.breakdown_reasons.map((r, i) =>
          i === action.index ? { ...r, ...action.payload } : r,
        ),
      };

    case "REMOVE_BREAKDOWN_REASON":
      return {
        ...state,
        breakdown_reasons: state.breakdown_reasons.filter(
          (_, i) => i !== action.index,
        ),
      };

    case "ADD_ROBOT_TO_BREAKDOWN": {
      const updated = [...state.breakdown_reasons];
      updated[action.reasonIndex].robots.push(action.payload);
      updated[action.reasonIndex].count =
        updated[action.reasonIndex].robots.length;

      return { ...state, breakdown_reasons: updated };
    }

    case "REMOVE_ROBOT_FROM_BREAKDOWN": {
      const updated = [...state.breakdown_reasons];
      updated[action.reasonIndex].robots = updated[
        action.reasonIndex
      ].robots.filter((_, i) => i !== action.robotIndex);

      updated[action.reasonIndex].count =
        updated[action.reasonIndex].robots.length;

      return { ...state, breakdown_reasons: updated };
    }

    default:
      return state;
  }
};

const AddDpr = () => {
  const [state, dispatch] = useReducer(reducer, {
    technicians: [],
    breakdown_reasons: [],
    loadingTechnicians: false,
    availableRobots: [],
    loadingRobots: false,
    siteIds: [],
    loadingSiteIds: true,
    sitesError: "",
  });
  const {
    technicians,
    loadingTechnicians,
    availableRobots,
    loadingRobots,
    breakdown_reasons,
    loadingSiteIds,
    siteIds,
    sitesError,
  } = state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [summarizingComments, setSummarizingComments] = useState("");

  const userInfo = useSelector((state) => state.userInfo);
  let adminroute = "";

  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo?.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo?.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo?.role === "Project User") {
    adminroute = "project-user";
  }
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [selectedBreakdownIndex, setSelectedBreakdownIndex] = useState(-1);

  const [site_id, setSiteId] = useState("all");

  useEffect(() => {
    const fetchSiteIds = async () => {
      dispatch({ type: "FETCH_SITEID_REQUEST" });
      try {
        const result = await axios.get("/api/v1/sites", {
          // headers: { Authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        });
        dispatch({ type: "FETCH_SITEID_SUCCESS", payload: result.data.data });
      } catch (err) {
        const msg = err.response?.data?.error || err.response?.data?.message;
        dispatch({ type: "FETCH_SITEID_FAIL", payload: msg });
        toast.error(msg);
      }
    };
    fetchSiteIds();
  }, []);
  const [formData, setFormData] = useState({
    site_id: "",
    total_running_robots: 0,
    total_failed_robots: 0,
    robots_run_by: "",
    total_robots: 0,
    comments: "",

    robots_operational_details: {
      ready_for_operational: 0,
      online_operational: 0,
      manual_operational: 0,
      unoperational: 0,
      // robots_uptime: 0, // ✅ FIXED (required field)
    },

    preventive_maintenance_status: {
      automatic: { attempted: 0, completed: 0, robots: [] },
      semi_automatic: { attempted: 0, completed: 0, robots: [] },
      total_pm_done: 0,
    },

    ticket_details: {
      total_raised: 0,
      total_closed: 0,
      total_pending: 0,
    },

    breakdown_reasons: [],
    technician_present: [],
  });
  // ---------- FETCH ----------
  const fetchSiteTechnicians = async (siteId) => {
    if (!siteId) return;

    dispatch({ type: "FETCH_TECHNICIAN_REQUEST" });

    try {
      const result = await axios.get(
        `/api/v1/users/role/sitetechnician/${siteId}`,
        { withCredentials: true },
      );

      dispatch({
        type: "FETCH_TECHNICIAN_SUCCESS",
        payload: result.data.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_TECHNICIAN_FAIL",
        payload: error.response?.data?.error,
      });
    }
  };
  const fetchRobots = async () => {
    try {
      dispatch({ type: "SET_ROBOTS_LOADING" });

      const res = await axios.get(
        `/api/v1/robots/get-all-robots-sitewise/${site_id}`,
        { withCredentials: true },
      );

      dispatch({
        type: "SET_ROBOTS_SUCCESS",
        payload: res.data.data,
      });
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchInitialData();
    fetchSiteTechnicians(site_id); // ✅ FIXED
  }, [site_id]);

  const breakdownReasons = [
    "Oxidation",
    "Offline",
    "Transit Online to Offline",
    "Battery Dead",
    "Vegetation",
    "Client Reasons",
    "Service Reasons",
    "Timer",
    "Breakdown",
    "Material Unavailability",
  ];
  const openBreakdownModal = async (index) => {
    setSelectedBreakdownIndex(index);
    setShowBreakdownModal(true);
    await fetchRobots();
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const pmRes = await axios.post(
        `/api/v1/techniciandprs/get-pm-robots-details`,
        { withCredentials: true }, // ✅ FIXED
      );

      setFormData((prev) => ({
        ...prev,
        preventive_maintenance_status:
          pmRes.data.data.preventive_maintenance_status,
        ticket_details: pmRes.data.data.ticketDetails,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleChange = (e, path) => {
    const { name, value } = e.target;

    if (!path) {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData((prev) => {
        const updated = { ...prev };
        let ref = updated;

        for (let i = 0; i < path.length - 1; i++) {
          ref = ref[path[i]];
        }

        ref[path[path.length - 1]][name] = Number(value);
        return updated;
      });
    }
  };

  const summarizeComments = async () => {
    const text = formData.comments;
    if (!text?.trim()) {
      toast.error("Please enter some comments to improve.");
      return;
    }

    setSummarizingComments(true);

    try {
      const result = await axios.post(
        "/api/v1/openai/summarize",
        { text },
        { withCredentials: true },
      );

      const improved = result.data?.summarizedText;

      if (improved) {
        setFormData((prev) => ({ ...prev, comments: improved }));
        toast.success("Comments improved successfully!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to improve comments.",
      );
    } finally {
      setSummarizingComments(false);
    }
  };

  // ✅ BUILD FINAL PAYLOAD
  const buildPayload = () => {
    const pm = formData.preventive_maintenance_status;

    return {
      ...formData,
      robots_operational_details: {
        ...formData.robots_operational_details,
        robots_uptime:
          formData.robots_operational_details.online_operational || 0,
      },
      preventive_maintenance_status: {
        ...pm,
        total_pm_done:
          (pm.automatic.completed || 0) + (pm.semi_automatic.completed || 0),
      },
      ticket_details: {
        ...formData.ticket_details,
        total_pending:
          (formData.ticket_details.total_raised || 0) -
          (formData.ticket_details.total_closed || 0),
      },
      report_date: new Date(),
      breakdown_reasons: state.breakdown_reasons, // ✅ ADD THIS
    };
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = buildPayload(); // ✅ FIXED

      await axios.post("/api/v1/techniciandprs", payload, {
        withCredentials: true,
      });

      toast.success("DPR Submitted Successfully");
      navigate(`/${adminroute}/all-site-dpr`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const addBreakdownReason = () => {
    dispatch({
      type: "ADD_BREAKDOWN_REASON",
      payload: {
        reason: breakdownReasons[0],
        count: 0,
        robots: [],
      },
    });
  };

  console.log(state.breakdown_reasons);

  const updateBreakdownReason = (index, field, value) => {
    dispatch({
      type: "UPDATE_BREAKDOWN_REASON",
      index: index,
      payload: { [field]: value },
    });
  };

  const removeBreakdownReason = (index) => {
    dispatch({
      type: "REMOVE_BREAKDOWN_REASON",
      index: index,
    });
  };

  const addRobotToBreakdown = (reasonIndex, robot) => {
    dispatch({
      type: "ADD_ROBOT_TO_BREAKDOWN",
      reasonIndex: reasonIndex,
      payload: {
        robot_no: robot.robot_no,
        block: robot.block,
        robot_id: robot._id,
      },
    });
  };

  const removeRobotFromBreakdown = (reasonIndex, robotIndex) => {
    dispatch({
      type: "REMOVE_ROBOT_FROM_BREAKDOWN",
      reasonIndex: reasonIndex,
      robotIndex: robotIndex,
    });
  };

  return (
    <div>
      {loading ? (
        <div className="text-center">
          <CSpinner />
        </div>
      ) : (
        <CForm>
          <div className="card">
            <CRow className="g-2 align-items-center">
              <CCol xs="auto">
                <CFormSelect
                  size="sm"
                  value={site_id}
                  onChange={(e) => {
                    setSiteId(e.target.value);

                    setFormData((prev) => ({
                      ...prev,
                      site_id: e.target.value,
                    }));
                  }}
                  style={{ minWidth: 120 }}
                >
                  {loadingSiteIds ? (
                    <option>Loading…</option>
                  ) : (
                    <>
                      <option value="all">All Sites</option>
                      {siteIds?.map((s) => (
                        <option key={s.site_id} value={s.site_id}>
                          {s.site_id}
                        </option>
                      ))}
                    </>
                  )}
                </CFormSelect>
              </CCol>
            </CRow>
            {/* OPERATIONAL */}
            <div className="card-header ">
              <h6 className="text-primary">Operational Details</h6>
            </div>
            <div className="card-body">
              <CRow>
                {Object.keys(formData.robots_operational_details).map((key) => (
                  <CCol md={4} key={key}>
                    <CFormInput
                      label={key.replaceAll("_", " ")}
                      name={key}
                      value={formData.robots_operational_details[key]}
                      onChange={(e) =>
                        handleChange(e, ["robots_operational_details"])
                      }
                    />
                  </CCol>
                ))}
              </CRow>
            </div>
          </div>

          <div className="card my-2">
            <div className="card-header ">
              {/* PM STATUS */}
              <h6 className="text-primary">Preventive Maintenance </h6>
              <p className="ms-1 text-warning">
                Please do not fill in the details, as this information is
                retrieved from the Preventive Maintenance records.
              </p>
            </div>
            <div className="card-body">
              <CRow>
                <CCol md={3}>
                  <CFormInput
                    readOnly
                    label="Auto Attempted"
                    name="attempted"
                    value={
                      formData.preventive_maintenance_status.automatic.attempted
                    }
                    onChange={(e) =>
                      handleChange(e, [
                        "preventive_maintenance_status",
                        "automatic",
                      ])
                    }
                  />
                </CCol>

                <CCol md={3}>
                  <CFormInput
                    readOnly
                    label="Auto Completed"
                    name="completed"
                    value={
                      formData.preventive_maintenance_status.automatic.completed
                    }
                    onChange={(e) =>
                      handleChange(e, [
                        "preventive_maintenance_status",
                        "automatic",
                      ])
                    }
                  />
                </CCol>

                <CCol md={3}>
                  <CFormInput
                    readOnly
                    label="Semi Attempted"
                    name="attempted"
                    value={
                      formData.preventive_maintenance_status.semi_automatic
                        .attempted
                    }
                    onChange={(e) =>
                      handleChange(e, [
                        "preventive_maintenance_status",
                        "semi_automatic",
                      ])
                    }
                  />
                </CCol>

                <CCol md={3}>
                  <CFormInput
                    readOnly
                    label="Semi Completed"
                    name="completed"
                    value={
                      formData.preventive_maintenance_status.semi_automatic
                        .completed
                    }
                    onChange={(e) =>
                      handleChange(e, [
                        "preventive_maintenance_status",
                        "semi_automatic",
                      ])
                    }
                  />
                </CCol>
              </CRow>
            </div>
          </div>

          {/* TICKETS */}

          <div className="card my-2">
            <div className="card-header">
              <h6 className="text-primary">Tickets</h6>
              <p className="ms-1 text-warning">
                Please do not fill in the details, as this information is
                retrieved from the Service TIckets.
              </p>
            </div>
            <div className="card-body">
              <CRow>
                {Object.keys(formData.ticket_details).map((key) => (
                  <CCol md={4} key={key}>
                    <CFormInput
                      readOnly
                      label={key}
                      name={key}
                      value={formData.ticket_details[key]}
                      onChange={(e) => handleChange(e, ["ticket_details"])}
                    />
                  </CCol>
                ))}
              </CRow>
            </div>
          </div>

          <CRow className="mb-4">
            <CCol md="12">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <h4 className="text-primary mb-0">
                  Breakdown / Unoperational Reasons
                </h4>
                <CButton color="primary" size="sm" onClick={addBreakdownReason}>
                  Add Breakdown Reason
                </CButton>
              </div>
            </CCol>
            <CCol md="12">
              {breakdown_reasons.map((breakdown, index) => (
                <div key={index} className="card mb-3 border">
                  <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Breakdown Reason #{index + 1}</h6>
                    <CButton
                      color="light"
                      size="sm"
                      onClick={() => removeBreakdownReason(index)}
                    >
                      Remove
                    </CButton>
                  </div>
                  <div className="card-body">
                    <CRow>
                      {/* <CCol md="6">
                          <div className="mb-3">
                            <label className="form-label">Reason</label>
                            <CFormSelect
                              value={breakdown.reason}
                              onChange={(e) =>
                                updateBreakdownReason(
                                  index,
                                  "reason",
                                  e.target.value
                                )
                              }
                            >
                              {breakdownReasons.map((reason) => (
                                <option key={reason} value={reason}>
                                  {reason}
                                </option>
                              ))}
                            </CFormSelect>
                          </div>
                        </CCol> */}
                      <CCol xs="12" sm="6" md="6">
                        <div className="mb-3">
                          <label className="form-label">Reason</label>
                          <CFormSelect
                            value={breakdown.reason}
                            onChange={(e) =>
                              updateBreakdownReason(
                                index,
                                "reason",
                                e.target.value,
                              )
                            }
                            className="w-50"
                          >
                            {breakdownReasons.map((reason) => (
                              <option key={reason} value={reason}>
                                {reason}
                              </option>
                            ))}
                          </CFormSelect>
                        </div>
                      </CCol>

                      <CCol md="3">
                        <div className="mb-3">
                          <label className="form-label">Count</label>
                          <input
                            type="number"
                            className="form-control"
                            value={breakdown.count}
                            onChange={(e) =>
                              updateBreakdownReason(
                                index,
                                "count",
                                e.target.value,
                              )
                            }
                            style={{ backgroundColor: "#f8f9fa" }}
                            min="0"
                          />
                        </div>
                      </CCol>
                      <CCol md="3">
                        <div className="mb-3">
                          <label className="form-label">Actions</label>
                          <CButton
                            color="danger"
                            size="sm"
                            className="d-block"
                            onClick={() => openBreakdownModal(index)}
                            disabled={site_id === "all"}
                          >
                            Add Robots
                          </CButton>
                        </div>
                      </CCol>
                    </CRow>
                    {breakdown.robots && breakdown.robots.length > 0 && (
                      <div>
                        <small className="text-muted">Selected Robots:</small>
                        <div className="mt-2">
                          {breakdown.robots.map((robot, robotIndex) => (
                            <div
                              key={robotIndex}
                              className="d-inline-block me-2 mb-2"
                            >
                              <CBadge
                                color="danger"
                                className="d-flex align-items-center"
                              >
                                {robot.robot_no} - {robot.block}
                                <CButton
                                  color="light"
                                  size="sm"
                                  variant="ghost"
                                  className="ms-1 p-0"
                                  style={{
                                    fontSize: "12px",
                                    width: "20px",
                                    height: "20px",
                                  }}
                                  onClick={() =>
                                    removeRobotFromBreakdown(index, robotIndex)
                                  }
                                >
                                  ×
                                </CButton>
                              </CBadge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CCol>
          </CRow>

          <CCol md="12">
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label mb-0">Comments</label>
                <CButton
                  color="info"
                  size="sm"
                  variant="outline"
                  onClick={summarizeComments}
                  disabled={summarizingComments || !formData.comments?.trim()}
                  title="Improve text using AI"
                  className="m-1"
                >
                  {summarizingComments ? (
                    <>
                      Improving... <LoadingSpinner />
                    </>
                  ) : (
                    "✨ Improve with AI"
                  )}
                </CButton>
              </div>
              <textarea
                type="textarea"
                className="form-control m-1"
                name="comments"
                rows={4}
                value={formData.comments}
                onChange={handleChange}
                placeholder="Enter comments..."
              ></textarea>
            </div>
          </CCol>

          {/* ---------- TECHNICIANS ---------- */}
          <CRow className="mb-4">
            <CCol md="12">
              <h4 className="text-primary mb-3">Technicians Present</h4>
            </CCol>

            <CCol md="12">
              {loadingTechnicians ? (
                <div className="text-center">
                  <LoadingSpinner />
                  <p>Loading technicians...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <CTable striped bordered className="mt-2">
                    <CTableHead color="secondary">
                      <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Present</CTableHeaderCell>
                        <CTableHeaderCell>Image</CTableHeaderCell>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>

                    <CTableBody>
                      {technicians.map((tech, index) => (
                        <CTableRow key={index}>
                          <CTableHeaderCell>{index + 1}</CTableHeaderCell>

                          <CTableDataCell>
                            <CFormCheck
                              checked={formData.technician_present.some(
                                (t) => t.technician_id === tech._id,
                              )}
                              onChange={(e) => {
                                const updatedList = e.target.checked
                                  ? [
                                      ...formData.technician_present,
                                      {
                                        name: tech.username,
                                        email: tech.email,
                                        technician_id: tech._id,
                                        _id: tech._id,
                                        role: tech.role,
                                        profile_image: tech.profile_image,
                                      },
                                    ]
                                  : formData.technician_present.filter(
                                      (t) => t.technician_id !== tech._id,
                                    );

                                // ✅ FIXED (IMPORTANT)
                                setFormData((prev) => ({
                                  ...prev,
                                  technician_present: updatedList,
                                }));
                              }}
                            />
                          </CTableDataCell>

                          <CTableDataCell>
                            <CAvatar src={tech.profile_image} />
                          </CTableDataCell>

                          <CTableDataCell>
                            {tech.username} - {tech.email}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              )}
            </CCol>
          </CRow>

          {/* SUBMIT BUTTON */}
          <div className="text-end m-1">
            <CButton
              color="primary"
              size="sm"
              disabled={!formData.comments.trim()}
              onClick={handleSubmit}
            >
              Submit DPR
            </CButton>
          </div>
        </CForm>
      )}

      <CModal
        visible={showBreakdownModal}
        onClose={() => setShowBreakdownModal(false)}
        size="lg"
        fullscreen="sm-down"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Select Robots for Breakdown</CModalTitle>
          <button
            type="button"
            className=" border-0 ms-auto py-0 px-1"
            onClick={() => setShowBreakdownModal(false)}
            style={{ background: "none" }}
          >
            <CIcon icon={cilX} size="lg" />
          </button>
        </CModalHeader>
        <CModalBody>
          {state.loadingRobots ? (
            <div className="text-center">
              <LoadingSpinner />
              <p>Loading robots...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Robot No</CTableHeaderCell>
                    <CTableHeaderCell>Block</CTableHeaderCell>
                    {/* <CTableHeaderCell>DevEUI</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell> */}
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {state.availableRobots.map((robot, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{robot.robot_no}</CTableDataCell>
                      <CTableDataCell>{robot.block}</CTableDataCell>
                      {/* <CTableDataCell>{robot.deveui}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    color={
                      robot.lora_state === "online" ? "success" : "danger"
                    }
                  >
                    {robot.lora_state || "Unknown"}
                  </CBadge>
                </CTableDataCell> */}
                      <CTableDataCell>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => {
                            addRobotToBreakdown(selectedBreakdownIndex, robot);
                            toast.success(
                              `Added ${robot.robot_no} to breakdown reason`,
                            );
                          }}
                          disabled={
                            selectedBreakdownIndex >= 0 &&
                            formData.breakdown_reasons[
                              selectedBreakdownIndex
                            ]?.robots?.some((r) => r.robot_id === robot._id)
                          }
                        >
                          {selectedBreakdownIndex >= 0 &&
                          formData.breakdown_reasons[
                            selectedBreakdownIndex
                          ]?.robots?.some((r) => r.robot_id === robot._id)
                            ? "Added"
                            : "Add"}
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            size="sm"
            onClick={() => setShowBreakdownModal(false)}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AddDpr;
