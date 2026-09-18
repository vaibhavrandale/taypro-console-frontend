import React, { useEffect, useReducer, useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CRow,
  CCol,
} from "@coreui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROBOTS_REQUEST":
      return { ...state, loadingRobots: true, error: "" };
    case "FETCH_ROBOTS_SUCCESS":
      return {
        ...state,
        loadingRobots: false,
        robots: action.payload.data,
      };
    case "FETCH_ROBOTS_FAIL":
      return {
        ...state,
        loadingRobots: false,
        error: action.payload,
        robots: [],
      };
    default:
      return state;
  }
};

const STEPS = [
  {
    key: "deactivate",
    label: "Deactivate",
    desc: "Remove current LoRa from LNS",
  },
  {
    key: "activate",
    label: "Activate",
    desc: "Add new LoRa and activate robot",
  },
];

const apiError = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  "Request failed";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ActiveRobots = () => {
  const [{ robots, loadingRobots }, dispatch] = useReducer(reducer, {
    robots: [],
    loadingRobots: false,
    error: "",
  });

  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [formData, setFormData] = useState({
    _id: "",
    robot_no: "",
    deveui: "",
    current_lora_no: "",
    old_lora_no: "",
    new_lora_no: "",
  });
  const [flowStarted, setFlowStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [stepStatus, setStepStatus] = useState({
    deactivate: "idle",
    activate: "idle",
  });
  const [stepError, setStepError] = useState("");
  const [failedStep, setFailedStep] = useState(null);
  const [confirmReplace, setConfirmReplace] = useState(false);

  const userInfo = useSelector((state) => state.userInfo);
  const canAct = !["Master User", "Project User", "Service User"].includes(
    userInfo?.role,
  );

  useEffect(() => {
    const query = search.trim();
    if (query.length < 3) {
      dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: { data: [] } });
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      dispatch({ type: "FETCH_ROBOTS_REQUEST" });
      try {
        const result = await axios.get(
          `/api/v1/robots/get-robot-using-robot-no/${encodeURIComponent(query)}`,
          { withCredentials: true, signal: controller.signal },
        );
        const raw = result.data?.data;
        const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const q = query.toLowerCase();
        dispatch({
          type: "FETCH_ROBOTS_SUCCESS",
          payload: {
            data: list.filter((robot) =>
              robot.robot_no?.toLowerCase().includes(q),
            ),
          },
        });
      } catch (error) {
        if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
          return;
        }
        dispatch({ type: "FETCH_ROBOTS_SUCCESS", payload: { data: [] } });
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, refreshKey]);

  const resetFlow = () => {
    setFlowStarted(false);
    setRunning(false);
    setStepStatus({ deactivate: "idle", activate: "idle" });
    setStepError("");
    setFailedStep(null);
    setConfirmReplace(false);
  };

  const closeModal = () => {
    if (running) return;
    setModalVisible(false);
    setSelectedRobot(null);
    resetFlow();
  };

  const openModal = (robot) => {
    setSelectedRobot(robot);
    setFormData({
      _id: robot._id,
      current_lora_no: robot.lora_no || "",
      old_lora_no: robot.old_lora_no || "",
      robot_no: robot.robot_no,
      deveui: robot.deveui,
      new_lora_no: "",
    });
    resetFlow();
    setModalVisible(true);
  };

  const runFrom = async (startStep) => {
    const newLora = formData.new_lora_no?.trim();
    if (startStep === "deactivate") {
      if (!newLora) {
        toast.error("Enter the new LoRa number");
        return;
      }
      if (newLora === String(formData.current_lora_no).trim()) {
        toast.error("New LoRa number must be different from the current one");
        return;
      }
    }

    setFlowStarted(true);
    setRunning(true);
    setStepError("");
    setFailedStep(null);

    let currentStep = startStep;
    try {
      if (startStep === "deactivate") {
        currentStep = "deactivate";
        setStepStatus((s) => ({ ...s, deactivate: "running" }));
        await axios.put(
          `/api/v1/robots/deactivate-and-delete-from-lns`,
          {
            _id: formData._id,
            robot_no: formData.robot_no,
            deveui: formData.deveui,
            current_lora_no: formData.current_lora_no,
            new_lora_no: newLora,
          },
          { withCredentials: true },
        );
        setStepStatus((s) => ({ ...s, deactivate: "done" }));
        await sleep(450);
      } else {
        setStepStatus((s) => ({ ...s, deactivate: "done" }));
      }

      currentStep = "activate";
      setStepStatus((s) => ({ ...s, activate: "running" }));
      await axios.put(
        `/api/v1/robots/activate-and-add-in-lns`,
        {
          robot_no: formData.robot_no,
        },
        { withCredentials: true },
      );
      setStepStatus((s) => ({ ...s, activate: "done" }));
      toast.success(`${formData.robot_no} LoRa replaced successfully`);
      setRefreshKey((k) => k + 1);
      await sleep(700);
      setRunning(false);
      setModalVisible(false);
      setSelectedRobot(null);
      resetFlow();
    } catch (error) {
      setStepStatus((s) => ({ ...s, [currentStep]: "error" }));
      setFailedStep(currentStep);
      setStepError(apiError(error));
      toast.error(apiError(error));
    } finally {
      setRunning(false);
    }
  };

  const askToReplace = (e) => {
    e.preventDefault();
    if (failedStep || running || flowStarted) return;
    const newLora = formData.new_lora_no?.trim();
    if (!newLora) {
      toast.error("Enter the new LoRa number");
      return;
    }
    if (newLora === String(formData.current_lora_no).trim()) {
      toast.error("New LoRa number must be different from the current one");
      return;
    }
    setConfirmReplace(true);
  };

  const colSpan = canAct ? 7 : 6;

  return (
    <div className="p-4">
      <h2>Replace Lora</h2>
      <CRow className="justify-content-end">
        <CCol md={4}>
          <CFormInput
            className="mb-3"
            autoFocus
            placeholder="Search robot no"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CCol>
      </CRow>

      <CTable bordered hover responsive className="text-center">
        <CTableHead color="secondary">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>Robot No</CTableHeaderCell>
            <CTableHeaderCell>Deveui</CTableHeaderCell>
            <CTableHeaderCell>Current Lora No</CTableHeaderCell>
            <CTableHeaderCell>Old Lora No</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            {canAct && <CTableHeaderCell>Action</CTableHeaderCell>}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loadingRobots ? (
            <CTableRow>
              <CTableDataCell colSpan={colSpan}>
                <LoadingSpinner />
              </CTableDataCell>
            </CTableRow>
          ) : robots.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={colSpan}>
                {search.trim().length < 3
                  ? "Type at least 3 characters"
                  : search.trim()
                    ? "No matching robots"
                    : "Search a robot number"}
              </CTableDataCell>
            </CTableRow>
          ) : (
            robots.map((robot, index) => (
              <CTableRow key={robot._id || index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{robot.robot_no}</CTableDataCell>
                <CTableDataCell>{robot.deveui}</CTableDataCell>
                <CTableDataCell>{robot.lora_no}</CTableDataCell>
                <CTableDataCell>{robot.old_lora_no}</CTableDataCell>
                <CTableDataCell>
                  {robot.activate ? (
                    <CBadge color="success">Active</CBadge>
                  ) : (
                    <CBadge color="danger">In Active</CBadge>
                  )}
                </CTableDataCell>
                {canAct && (
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      className="text-white"
                      size="sm"
                      onClick={() => openModal(robot)}
                    >
                      Replace Lora
                    </CButton>
                  </CTableDataCell>
                )}
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>

      {selectedRobot && (
        <CModal
          backdrop="static"
          size="lg"
          visible={modalVisible}
          onClose={closeModal}
        >
          <CModalHeader closeButton={false}>
            <CModalTitle>
              Replace Lora -{" "}
              <span className="badge bg-success">{selectedRobot.robot_no}</span>
            </CModalTitle>
            <button
              type="button"
              className="border-0 ms-auto py-0 px-1"
              onClick={closeModal}
              disabled={running}
              style={{ background: "none" }}
            >
              <CIcon icon={cilX} size="lg" />
            </button>
          </CModalHeader>
          <form onSubmit={askToReplace}>
            <CModalBody>
              <CFormInput
                className="mb-3"
                label="Robot No"
                value={formData.robot_no}
                readOnly
              />
              <CFormInput
                className="mb-3"
                label="Deveui"
                value={formData.deveui}
                readOnly
              />
              <CFormInput
                className="mb-3"
                label="Current Lora No"
                value={formData.current_lora_no}
                readOnly
              />
              <CFormInput
                className="mb-3"
                name="new_lora_no"
                label="New Lora No"
                value={formData.new_lora_no}
                disabled={
                  running || stepStatus.deactivate === "done" || confirmReplace
                }
                onChange={(e) =>
                  setFormData({ ...formData, new_lora_no: e.target.value })
                }
                required
              />

              {confirmReplace && !flowStarted && (
                <div
                  className="replace-lora-error mt-3"
                  style={{
                    background: "rgba(51, 153, 255, 0.12)",
                    color: "inherit",
                  }}
                >
                  Replace LoRa{" "}
                  <span className="badge bg-warning mx-1">
                    {formData.current_lora_no}
                  </span>{" "}
                  with new Lora
                  <span className=" badge bg-success mx-1 ">
                    {formData.new_lora_no.trim()}
                  </span>{" "}
                  on robot{" "}
                  <span className="text-success">{formData.robot_no}</span>?
                </div>
              )}

              {flowStarted && (
                <div className="replace-lora-steps mt-4">
                  {STEPS.map((step, index) => {
                    const status = stepStatus[step.key];
                    return (
                      <React.Fragment key={step.key}>
                        {index > 0 && (
                          <div
                            className={`replace-lora-line ${
                              stepStatus[STEPS[index - 1].key] === "done"
                                ? "is-done"
                                : ""
                            }`}
                          />
                        )}
                        <div className={`replace-lora-step is-${status}`}>
                          <div className="replace-lora-dot">
                            {status === "done" && "✓"}
                            {status === "error" && "!"}
                            {status === "running" && (
                              <span className="replace-lora-spinner" />
                            )}
                            {status !== "done" &&
                              status !== "error" &&
                              status !== "running" &&
                              index + 1}
                          </div>
                          <div>
                            <div className="fw-semibold">{step.label}</div>
                            <div className="small text-medium-emphasis">
                              {step.desc}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {stepError && (
                <div className="replace-lora-error mt-3">
                  Stopped at{" "}
                  <strong>
                    {failedStep === "deactivate" ? "Deactivate" : "Activate"}
                  </strong>
                  : {stepError}
                </div>
              )}
            </CModalBody>
            <CModalFooter>
              {confirmReplace && !flowStarted && !failedStep ? (
                <>
                  <CButton
                    color="secondary"
                    size="sm"
                    type="button"
                    onClick={() => setConfirmReplace(false)}
                  >
                    Back
                  </CButton>
                  <CButton
                    color="danger"
                    className="text-white"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setConfirmReplace(false);
                      runFrom("deactivate");
                    }}
                  >
                    Yes, replace
                  </CButton>
                </>
              ) : (
                <>
                  <CButton
                    color="secondary"
                    size="sm"
                    type="button"
                    disabled={running}
                    onClick={closeModal}
                  >
                    Cancel
                  </CButton>
                  {failedStep ? (
                    <CButton
                      color="warning"
                      className="text-white"
                      size="sm"
                      type="button"
                      disabled={running}
                      onClick={() => runFrom(failedStep)}
                    >
                      {running ? "Retrying..." : `Retry ${failedStep}`}
                    </CButton>
                  ) : (
                    <CButton
                      color="primary"
                      size="sm"
                      type="submit"
                      disabled={running || stepStatus.activate === "done"}
                    >
                      {running ? "Replacing..." : "Replace Lora"}
                    </CButton>
                  )}
                </>
              )}
            </CModalFooter>
          </form>
        </CModal>
      )}
    </div>
  );
};

export default ActiveRobots;
