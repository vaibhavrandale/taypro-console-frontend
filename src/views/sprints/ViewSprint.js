import React, { useEffect, useReducer, useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert,
  CBadge,
  CProgress,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CTabs,
  CTabContent,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CTabList,
  CTab,
  CTabPanel,
  CFormSelect,
  CFormTextarea,
} from "@coreui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { cilCalendar, cilCommentSquare, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import LastActivity from "../../components/LastActivity";

// reducer for fetching sprint
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SPRINT_REQUEST":
      return { ...state, loading: true, error: "", sprint: null };
    case "FETCH_SPRINT_SUCCESS":
      return { ...state, loading: false, sprint: action.payload };
    case "FETCH_SPRINT_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "PROGRESS_UPDATE_REQUEST":
      return { ...state, loadingProgress: true, errorProgress: "" };
    case "PROGRESS_UPDATE_SUCCESS":
      return { ...state, loadingProgress: false, successProgress: true };
    case "PROGRESS_UPDATE_FAIL":
      return {
        ...state,
        loadingProgress: false,
        errorProgress: action.payload,
      };

    // For task info update
    case "TASK_UPDATE_REQUEST":
      return { ...state, UpdateLoadingTask: true, UpdateErrorTask: "" };
    case "TASK_UPDATE_SUCCESS":
      return { ...state, UpdateLoadingTask: false, successTask: true };
    case "TASK_UPDATE_FAIL":
      return {
        ...state,
        UpdateLoadingTask: false,
        UpdateErrorTask: action.payload,
      };

    // For task info update
    case "TASK_ADD_REQUEST":
      return { ...state, AddLoadingTask: true, addErrorTask: "" };
    case "TASK_ADD_SUCCESS":
      return { ...state, AddLoadingTask: false, AddTaskSuccess: true };
    case "TASK_ADD_FAIL":
      return {
        ...state,
        AddLoadingTask: false,
        addErrorTask: action.payload,
      };

    case "FETCH_USER_REQUEST":
      return { ...state, userFetchLoading: true, userError: "" };
    case "FETCH_USER_SUCCESS":
      return {
        ...state,
        userFetchLoading: false,
        users: action.payload,
      };

    case "FETCH_USER_FAIL":
      return { ...state, userFetchLoading: false, userError: action.payload };

    default:
      return state;
  }
};

const statusColors = {
  assigned: "primary",
  in_progress: "warning",
  under_review: "info",
  completed: "success",
  approved: "success", // ✅ new status
  rejected: "danger",
};

const ViewSprint = () => {
  const { id } = useParams();
  const authtoken = useSelector((state) => state.authtoken);
  const userId = useSelector((state) => state.userInfo?._id); // current logged-in user

  const [
    {
      sprint,
      loading,
      error,
      loadingProgress,
      successProgress,
      errorProgress,
      UpdateLoadingTask,
      successTask,
      UpdateErrorTask,
      AddTaskSuccess,
      AddLoadingTask,
      addErrorTask,
      userFetchLoading,
      users,
      userError,
    },
    dispatch,
  ] = useReducer(reducer, {
    sprint: null,
    loading: false,
    error: "",
    loadingProgress: false,
    successProgress: false,
    errorProgress: "",
    UpdateLoadingTask: false,
    successTask: false,
    UpdateErrorTask: "",
    userFetchLoading: false,
    users: [],
    userError: "",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [deadline, setDeadline] = useState("");
  const [Addremark, setAddRemark] = useState("");
  const [Addtitle, setAddTitle] = useState("");
  const [Adddescription, setAddDescription] = useState("");
  const [Adddeadline, setAddDeadline] = useState("");
  const [Addpriority, setAddPriority] = useState("");
  const [taskNo, setTaskNo] = useState(0);
  useEffect(() => {
    const fetchSprint = async () => {
      dispatch({ type: "FETCH_SPRINT_REQUEST" });
      try {
        const { data } = await axios.get(`/api/v1/sprint-tracking/${id}`, {
          headers: { Authorization: `Bearer ${authtoken}` },
        });

        dispatch({ type: "FETCH_SPRINT_SUCCESS", payload: data.data });
      } catch (error) {
        dispatch({
          type: "FETCH_SPRINT_FAIL",
          payload: error.response?.data?.message || error.response?.data?.error,
        });
        toast.error(
          error.response?.data?.message || error.response?.data?.error
        );
      }
    };
    if (successProgress || successTask || AddTaskSuccess) {
      fetchSprint();
    } else {
      fetchSprint();
    }
    const fetchUsers = async () => {
      dispatch({ type: "FETCH_USER_REQUEST" });
      try {
        const result = await axios.get(
          "/api/v1/users/get-all-internal-users-without-pg",

          {
            headers: {
              authorization: `Bearer ${authtoken}`,
            },
          }
        ); // Replace with your API endpoint

        dispatch({
          type: "FETCH_USER_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_USER_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
      }
    };

    fetchUsers();
  }, [id, authtoken, successProgress, successTask, AddTaskSuccess]);

  // group tasks by status
  // const getTasksByStatus = (status) =>
  //   sprint?.tasks.filter((task) => task.status === status).sort(_id:-1) || [];
  // Group tasks by status and sort by _id descending (newest first)
  const getTasksByStatus = (status) =>
    sprint?.tasks
      ?.filter((task) => task.status === status)
      ?.sort((a, b) => (a._id < b._id ? 1 : -1)) || [];

  // open modal
  const openTaskModal = (task) => {
    setSelectedTask(task);
    setVisible(true);
    setTaskNo(task.taskNumber);
    setProgress(task.progress);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status); // initialize status
    setRemark(task.remarks); // initialize remark
  };

  const handleProgressUpdate = async () => {
    dispatch({ type: "PROGRESS_UPDATE_REQUEST" });
    try {
      const response = await axios.put(
        `/api/v1/sprint-tracking/update-sprint/${selectedTask._id}/${sprint._id}`,
        { progress, status: status, remarks: remark },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      dispatch({ type: "PROGRESS_UPDATE_SUCCESS", successProgress: true });
      toast.success(response.data.message);
      setVisible(false);
    } catch (error) {
      dispatch({
        type: "PROGRESS_UPDATE_FAIL",
        payload: error.response?.data?.message || "Failed to update progress",
      });
      toast.error(error.response?.data?.message || "Failed to update progress");
    }
  };

  const handleTaskUpdate = async () => {
    dispatch({ type: "TASK_UPDATE_REQUEST" });
    try {
      // Send all fields (optional fields can remain the same)
      const response = await axios.put(
        `/api/v1/sprint-tracking/update-sprint/${selectedTask._id}/${sprint._id}`,
        {
          progress,
          status: status,
          remarks: remark,
          title: title,
          description: description,
        },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      dispatch({ type: "TASK_UPDATE_SUCCESS", successTask: true });
      toast.success(response.data.message);
      setVisible(false);
    } catch (error) {
      dispatch({
        type: "TASK_UPDATE_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  const handleAddTask = async () => {
    if (!title) {
      toast.error("Please enter a task title.");
      return;
    }
    const user = users.find((u) => u._id === assignee);
    let userDetials = {
      username: user?.username,
      email: user?.email,
      _id: user?._id,
      profile_image: user?.profile_image,
      designation: user?.designation,
    };
    dispatch({ type: "TASK_ADD_REQUEST" });
    try {
      const data = await axios.post(
        `/api/v1/sprint-tracking/add-task/${sprint._id}`,
        {
          title: Addtitle,
          description: Adddescription,
          assignee: userDetials,
          priority: Addpriority,
          deadline: Adddeadline,
          remarks: Addremark,
          github_pull_request: "",
        },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );
      console.log(data);
      dispatch({
        type: "TASK_ADD_SUCCESS",
        payload: data.data,
        AddTaskSuccess: true,
      });
      toast.success(data.data.message);
      setShowAddModal(false);
    } catch (error) {
      dispatch({
        type: "TASK_ADD_FAIL",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  // Check if current user is assignee or creator
  const isAssignee = selectedTask?.assignee?._id === userId;
  const isCreator = selectedTask?.last_activity?.[0]?.userId === userId;

  return (
    <>
      <div className="px-2">
        {loading && <LoadingSpinner />}
        {error && <CAlert color="danger">{error}</CAlert>}
        <div className="text-end mb-3">
          <CButton
            color="success"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            Add New Task
          </CButton>
        </div>

        {/* Add Task Modal */}
        <CModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          size="lg"
          backdrop="static"
          alignment="top"
          scrollable
        >
          <CModalHeader closeButton={false}>
            <CModalTitle className="text-success fw-semibold">
              <CIcon icon={cilCommentSquare} className="me-2 text-info" />
              Add New Task
            </CModalTitle>
            <button
              type="button"
              className="border-0 ms-auto py-0 px-1 bg-transparent"
              onClick={() => setShowAddModal(false)}
            >
              <CIcon icon={cilX} size="lg" className="text-light" />
            </button>
          </CModalHeader>

          <CModalBody className="bg-dark text-light rounded">
            <CForm>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Assignee</CFormLabel>
                  {userFetchLoading ? (
                    <LoadingSpinner />
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : (
                    <>
                      {userError && (
                        <CAlert color="danger" className="mt-3">
                          {userError}
                        </CAlert>
                      )}
                      <CFormSelect
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        className="bg-dark text-light"
                      >
                        <option value="">Select assignee</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.username} ({user.email})
                          </option>
                        ))}
                      </CFormSelect>
                    </>
                  )}
                </CCol>
                <CCol>
                  <CFormLabel>Task Title</CFormLabel>
                  <CFormInput
                    type="text"
                    placeholder="Enter task title"
                    value={Addtitle}
                    onChange={(e) => setAddTitle(e.target.value)}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <CFormLabel>Description</CFormLabel>
                  <CFormTextarea
                    rows={5}
                    placeholder="Describe the task..."
                    value={Adddescription}
                    onChange={(e) => setAddDescription(e.target.value)}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Priority</CFormLabel>
                  <CFormSelect
                    value={Addpriority}
                    onChange={(e) => setAddPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Deadline</CFormLabel>
                  <CFormInput
                    type="date"
                    value={Adddeadline}
                    onChange={(e) => setAddDeadline(e.target.value)}
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol>
                  <CFormLabel>Remarks</CFormLabel>
                  <CFormTextarea
                    rows={3}
                    placeholder="Any notes or remarks"
                    value={Addremark}
                    onChange={(e) => setAddRemark(e.target.value)}
                  />
                </CCol>
              </CRow>

              {addErrorTask && (
                <CAlert color="danger" className="mt-3">
                  {addErrorTask}
                </CAlert>
              )}

              <div className="d-flex justify-content-end border-top mt-3 pt-3">
                <CButton
                  color="success"
                  onClick={handleAddTask}
                  disabled={AddLoadingTask}
                >
                  {AddLoadingTask ? (
                    <>
                      <LoadingSpinner /> Adding...
                    </>
                  ) : (
                    "Add Task"
                  )}
                </CButton>
              </div>
            </CForm>
          </CModalBody>
        </CModal>

        {sprint && (
          <>
            <div className="mb-4 text-center p-3 rounded shadow-sm bg-dark text-light">
              <h2 className="text-success  mb-2">{sprint.name}</h2>
              <p className="text-white mb-1">{sprint.goal}</p>
              <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
                <span className="badge bg-success text-dark px-3 py-2">
                  {new Date(sprint.startDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="text-secondary fw-semibold">–</span>
                <span className="badge bg-success text-dark px-3 py-2">
                  {new Date(sprint.endDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <CRow className="g-3">
              {[
                "assigned",
                "in_progress",
                "under_review",
                //  "completed",
                "approved",
                "rejected",
              ].map((status) => (
                <CCol md={3} key={status} className="mb-3">
                  <CCard className="shadow-sm h-100 border ">
                    <CCardHeader
                      className={`text-center fw-bold text-white bg-${statusColors[status]}`}
                    >
                      {status.replace("_", " ")} (
                      {getTasksByStatus(status).length})
                    </CCardHeader>
                    <CCardBody
                      style={{ maxHeight: "70vh", overflowY: "auto" }}
                      className="p-2"
                    >
                      {getTasksByStatus(status).length === 0 && (
                        <p className="text-center text-muted small">
                          No {status} tasks.
                        </p>
                      )}
                      {getTasksByStatus(status).map((task) => (
                        <div
                          key={task._id}
                          onClick={() => openTaskModal(task)}
                          style={{ cursor: "pointer" }}
                          className="p-2 shadow-sm border border-warning my-2"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-success">
                              #Task: {task.taskNumber}
                            </span>
                            <CBadge
                              color={
                                task.priority === "high" ? "danger" : "success"
                              }
                            >
                              {task.priority}
                            </CBadge>
                          </div>

                          <p className="mb-2 small text-muted">{task.title}</p>

                          <CProgress
                            thin
                            color="info"
                            value={task.progress}
                            className="mb-2"
                          />
                          <small className="text-muted ">
                            {task.progress}%
                          </small>

                          <div className="d-flex align-items-center my-2">
                            <img
                              src={task.assignee.profile_image}
                              alt="Profile"
                              className="rounded-circle"
                              width="30"
                              height="30"
                              style={{
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                            />
                            <div className="flex-grow-1 mx-2">
                              <p className="mb-1 fw-semibold d-flex justify-content-between">
                                <span className="fw-semibold">
                                  {task.assignee.username}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>

            {/* Task Modal */}
            {selectedTask && (
              <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                size="xl"
                alignment="top"
                autoFocus={false} // Prevent focus before modal is fully visible
                backdrop="static"
                scrollable
              >
                <CModalHeader closeButton={false}>
                  <CModalTitle className="d-flex flex-column">
                    <span className=" text-success">Task #{taskNo}</span>
                    <span
                      className="text-truncate"
                      style={{ maxWidth: "400px" }}
                    >
                      {selectedTask.title}
                    </span>
                  </CModalTitle>
                  <button
                    type="button"
                    className="border-0 ms-auto py-0 px-1"
                    onClick={() => setVisible(false)}
                    style={{ background: "none" }}
                  >
                    <CIcon icon={cilX} size="lg" />
                  </button>
                </CModalHeader>
                <CModalBody>
                  <CTabs defaultActiveItemKey="details">
                    <CTabList variant="tabs">
                      <CTab itemKey="details">Details</CTab>
                      <CTab
                        itemKey="update"
                        disabled={!(isAssignee || isCreator)}
                      >
                        {isAssignee ? "Update Progress" : "Update Task"}
                      </CTab>
                    </CTabList>

                    <CTabContent>
                      <CTabPanel itemKey="details">
                        <div className="task-details-container p-4 bg-dark text-light rounded shadow-sm">
                          {/* Description */}
                          <CRow className="mb-4">
                            <CCol>
                              <h5 className="text-info mb-2">Assigned to</h5>
                              {/* Avatar */}
                              <div className="d-flex align-items-center">
                                <img
                                  src={
                                    selectedTask.assignee?.profile_image ||
                                    "placeholder.jpg"
                                  }
                                  alt={
                                    selectedTask.assignee?.username || "Profile"
                                  }
                                  className="rounded-circle border"
                                  width="50"
                                  height="50"
                                  style={{
                                    objectFit: "cover",
                                    cursor: "pointer",
                                    borderWidth: "2px",
                                    borderColor: "#17a2b8", // info color
                                  }}
                                />

                                {/* Name & Email */}
                                <div className="d-flex flex-column ms-2">
                                  <span className="fw-bold text-light">
                                    {selectedTask.assignee?.username ||
                                      "Unknown User"}
                                  </span>
                                  <span
                                    className="text-muted"
                                    style={{ fontSize: "0.85rem" }}
                                  >
                                    {selectedTask.assignee?.email || "-"}
                                  </span>
                                </div>
                              </div>
                            </CCol>
                            <CCol
                              md={12}
                              className="mt-4 p-2 rounded border border-secondary shadow-sm h-100 d-flex flex-column"
                            >
                              <h5 className="text-info mb-2">Description</h5>
                              <p
                                className="mb-0"
                                dangerouslySetInnerHTML={{
                                  __html: selectedTask.description.replace(
                                    /, /g,
                                    ",<br>"
                                  ),
                                }}
                              >
                                {/* {selectedTask.description ||
                                  "No description provided."} */}
                              </p>
                            </CCol>
                          </CRow>

                          {/* Priority & Progress */}
                          <CRow className="mb-4 g-4 align-items-center">
                            {/* Priority */}
                            <CCol
                              xs={12}
                              md={3}
                              className="d-flex align-items-center"
                            >
                              <div className="p-3  rounded  shadow-lg h-100 d-flex flex-column">
                                <span className="">Priority</span>
                                <CBadge
                                  color={
                                    selectedTask.priority === "high"
                                      ? "danger"
                                      : selectedTask.priority === "medium"
                                      ? "warning"
                                      : "success"
                                  }
                                  className="px-3 py-1 my-2"
                                >
                                  {selectedTask.priority.toUpperCase()}
                                </CBadge>
                              </div>
                            </CCol>

                            {/* Progress */}
                            <CCol xs={12} md={6}>
                              <span className="d-block mb-1">Progress</span>
                              <div
                                className="progress rounded-pill"
                                style={{
                                  height: "12px",
                                  backgroundColor: "#2c2c2c",
                                }}
                              >
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: `${selectedTask.progress}%`,
                                    background:
                                      "linear-gradient(90deg, #0dcaf0, #0d6efd)",
                                  }}
                                />
                              </div>
                              <small>{selectedTask.progress}% completed</small>
                            </CCol>
                            <CCol xs={12} md={3}>
                              <div className="p-2 rounded border border-secondary shadow-sm h-100 d-flex flex-column">
                                <div className="d-flex align-items-center justify-content-start mb-2">
                                  <CIcon
                                    icon={cilCalendar}
                                    className="text-warning me-2"
                                    size="lg"
                                  />

                                  <h6 className="mb-0 text-warning">
                                    Deadline
                                  </h6>
                                </div>
                                <p className="mb-0 text-light">
                                  {selectedTask.deadline
                                    ? new Date(
                                        selectedTask.deadline ||
                                          selectedTask.deadline
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                    : "Not set"}
                                </p>
                              </div>
                            </CCol>
                          </CRow>

                          {/* Remarks & Deadline */}
                          <CRow className="g-4">
                            {/* Remarks */}
                            <CCol xs={12} md={12}>
                              <div className="p-3 bg-dark rounded border border-secondary shadow-sm h-100 d-flex flex-column">
                                <div className="d-flex align-items-center mb-2">
                                  <CIcon
                                    icon={cilCommentSquare}
                                    className="text-info me-2"
                                    size="lg"
                                  />

                                  <h6 className="mb-0 text-info">Remarks</h6>
                                </div>
                                <p
                                  className="mb-0 text-light"
                                  dangerouslySetInnerHTML={{
                                    __html: selectedTask.remarks.replace(
                                      /, /g,
                                      ",<br>"
                                    ),
                                  }}
                                >
                                  {/* {selectedTask.remarks || "No remarks"} */}
                                </p>
                              </div>
                            </CCol>

                            {/* Deadline */}
                          </CRow>
                        </div>

                        <div className="mt-3">
                          <span className="d-block mb-2">
                            Activity Timeline
                          </span>
                          <LastActivity
                            lastactivity={selectedTask.last_activity}
                          />
                          {/* <div
                          style={{
                            maxHeight: "180px",
                            overflowY: "auto",
                            paddingLeft: "10px",
                            borderLeft: "2px solid #dee2e6",
                          }}
                        >
                          {selectedTask.last_activity
                            .map((act, i) => (
                              <div
                                key={i}
                                className="d-flex mb-3 position-relative"
                              >
                                <img
                                  src={act.profile_image}
                                  alt={act.name}
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    border: "2px solid #dee2e6",
                                    marginRight: 10,
                                  }}
                                />
                                <div>
                                  <small
                                    dangerouslySetInnerHTML={{
                                      __html: act.details,
                                    }}
                                    className="d-block"
                                  />
                                  <small className="text-muted">
                                    {new Date(
                                      act.timestamp.$date || act.timestamp
                                    ).toLocaleString()}
                                  </small>
                                </div>
                              </div>
                            ))
                            .reverse()}
                        </div> */}
                        </div>
                      </CTabPanel>

                      <CTabPanel itemKey="update">
                        {isAssignee || isCreator ? (
                          isAssignee ? (
                            <div>
                              <CForm className="mt-2">
                                <CRow>
                                  <CCol>
                                    {/* Status Dropdown */}
                                    <CFormLabel>Status</CFormLabel>
                                    <CFormSelect
                                      value={status}
                                      onChange={(e) =>
                                        setStatus(e.target.value)
                                      }
                                    >
                                      <option value="assigned">assigned</option>
                                      <option value="in_progress">
                                        In Progress
                                      </option>
                                      <option value="under_review">
                                        Under Review
                                      </option>
                                      {/* <option value="completed">
                                        Completed
                                      </option> */}
                                    </CFormSelect>
                                  </CCol>
                                  <CCol>
                                    {/* Progress Input */}
                                    <CFormLabel className="">
                                      Progress (%)
                                    </CFormLabel>{" "}
                                    <CFormInput
                                      type="number"
                                      value={progress}
                                      min={0}
                                      max={100}
                                      onChange={(e) =>
                                        setProgress(e.target.value)
                                      }
                                    />
                                  </CCol>
                                </CRow>

                                {/* Remark Input */}
                                <CFormLabel className="mt-2">Remark</CFormLabel>
                                <CFormTextarea
                                  value={remark}
                                  onChange={(e) => setRemark(e.target.value)}
                                  placeholder="Enter remark"
                                  rows={6}
                                ></CFormTextarea>

                                {errorProgress && (
                                  <CAlert color="danger" className="mt-2">
                                    {errorProgress}
                                  </CAlert>
                                )}

                                <div className="d-flex justify-content-end border-top mt-3 pt-3">
                                  {/* Update Button */}
                                  <CButton
                                    type="button"
                                    color="success"
                                    size="sm"
                                    className="mt-2 btn btn-sm"
                                    disabled={loadingProgress}
                                    onClick={handleProgressUpdate}
                                  >
                                    {loadingProgress ? (
                                      <>
                                        <LoadingSpinner /> Updating...
                                      </>
                                    ) : (
                                      "Update Progress"
                                    )}
                                  </CButton>
                                </div>
                              </CForm>
                            </div>
                          ) : (
                            <div>
                              <CForm className="mt-2">
                                <CFormLabel>Title</CFormLabel>
                                <CFormInput
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                />
                                <CFormLabel className="mt-2">
                                  Description
                                </CFormLabel>
                                <CFormTextarea
                                  value={description}
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                  rows={6}
                                ></CFormTextarea>
                                <CRow>
                                  <CCol>
                                    <CFormLabel className="mt-2">
                                      Status
                                    </CFormLabel>
                                    <CFormSelect
                                      className=""
                                      value={status}
                                      onChange={(e) =>
                                        setStatus(e.target.value)
                                      }
                                    >
                                      <option value="assigned">Assigned</option>
                                      <option value="in_progress">
                                        In Progress
                                      </option>
                                      <option value="under_review">
                                        Under Review
                                      </option>
                                      {/* <option value="completed">
                                        Completed
                                      </option> */}
                                      <option value="approved">Approved</option>
                                      <option value="rejected">Rejected</option>
                                    </CFormSelect>
                                  </CCol>
                                  <CCol>
                                    {/* Progress Input */}
                                    <CFormLabel className="mt-2">
                                      Progress (%)
                                    </CFormLabel>
                                    <CFormInput
                                      type="number"
                                      value={progress}
                                      min={0}
                                      max={100}
                                      onChange={(e) =>
                                        setProgress(e.target.value)
                                      }
                                    />
                                  </CCol>
                                </CRow>

                                {/* Remark Input */}
                                <CFormLabel className="mt-2">Remark</CFormLabel>
                                <CFormTextarea
                                  value={remark}
                                  onChange={(e) => setRemark(e.target.value)}
                                  placeholder="Enter remark"
                                  rows={6}
                                ></CFormTextarea>

                                {UpdateErrorTask && (
                                  <CAlert color="danger" className="mt-2">
                                    {UpdateErrorTask}
                                  </CAlert>
                                )}
                                <div className="d-flex justify-content-end border-top mt-3 pt-3">
                                  <CButton
                                    color="primary"
                                    type="button"
                                    className="mt-2"
                                    size="sm"
                                    onClick={handleTaskUpdate}
                                  >
                                    {UpdateLoadingTask ? (
                                      <>
                                        <LoadingSpinner /> Updating...
                                      </>
                                    ) : (
                                      "Update Task"
                                    )}
                                  </CButton>
                                </div>
                              </CForm>
                            </div>
                          )
                        ) : (
                          <p className="text-muted p-3">
                            You don’t have permission to update.
                          </p>
                        )}
                      </CTabPanel>
                    </CTabContent>
                  </CTabs>
                </CModalBody>
              </CModal>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ViewSprint;
