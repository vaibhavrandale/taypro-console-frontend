// import React from "react";

// const CreateSprint = () => {
//   return <div>CreateSprint</div>;
// };

// export default CreateSprint;

import React, { useEffect, useReducer, useState } from "react";
import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CFormSelect,
} from "@coreui/react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_USER_REQUEST":
      return { ...state, userFetchLoading: true, error: "" };
    case "FETCH_USER_SUCCESS":
      return {
        ...state,
        userFetchLoading: false,
        users: action.payload,
      };

    case "FETCH_USER_FAIL":
      return { ...state, userFetchLoading: false, error: action.payload };

    case "CREATE_REQUEST":
      return { ...state, createLoading: true, createError: "" };
    case "CREATE_SUCCESS":
      return {
        ...state,
        createLoading: false,
      };

    case "CREATE_FAIL":
      return { ...state, createLoading: false, createError: action.payload };

    default:
      return state;
  }
};
const CreateSprint = () => {
  const [
    { userFetchLoading, users, error, createError, createLoading },
    dispatch,
  ] = useReducer(reducer, {
    users: [],

    userFetchLoading: false,

    userError: "",
    createError: "",
    createLoading: false,
  });
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [goal, setGoal] = useState("");
  const [tasks, setTasks] = useState([
    {
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      deadline: "",
      remarks: "",
      github_pull_request: "",
    },
  ]);

  useEffect(() => {
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
  }, [authtoken]); // Runs only once on mount

  // Handle input changes for tasks
  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  // Add new task
  const addTask = () => {
    setTasks([
      ...tasks,
      {
        title: "",
        description: "",
        assignee: "",
        priority: "medium",
        deadline: "",
        remarks: "",
        github_pull_request: "",
      },
    ]);
  };

  // Remove task
  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  // Submit sprint
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const body = {
  //       name,
  //       startDate,
  //       endDate,
  //       goal,
  //       tasks,
  //     };

  //     try {
  //       const response = await axios.post("/api/v1/sprint-tracking", body, {
  //         headers: { Authorization: `Bearer ${authtoken}` },
  //       });
  //       toast.success("Sprint created successfully!");
  //       console.log(response.data);
  //     } catch (error) {
  //       toast.error(error.response?.data?.message || "Failed to create sprint");
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "CREATE_REQUEST" });
    const tasksWithUserObj = tasks.map((task) => {
      const user = users.find((u) => u._id === task.assignee);
      let userDetials = {
        username: user?.username,
        email: user?.email,
        _id: user?._id,
        profile_image: user?.profile_image,
        designation: user?.designation,
      };

      return {
        ...task,
        assignee: userDetials || null, // now assignee is full user object
      };
    });

    const body = {
      name,
      startDate,
      endDate,
      goal,
      tasks: tasksWithUserObj,
    };

    try {
      const response = await axios.post("/api/v1/sprint-tracking", body, {
        headers: { Authorization: `Bearer ${authtoken}` },
      });
      dispatch({
        type: "CREATE_SUCCESS",
      });
      toast.success(response.data.message);
      console.log(response.data);
      navigate(-1);
    } catch (error) {
      dispatch({
        type: "FETCH_USER_SUCCESS",
        payload: error.response?.data?.message || error.response?.data?.error,
      });
      toast.error(error.response?.data?.message || error.response?.data?.error);
    }
  };

  return (
    <CCard className="bg-dark text-light shadow-sm">
      <CCardBody>
        <h4 className="text-info mb-4">Create New Sprint</h4>
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Sprint Name</CFormLabel>
              <CFormInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sprint name"
                required
                className=""
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Start Date</CFormLabel>
              <CFormInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className=""
                required
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>End Date</CFormLabel>
              <CFormInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className=""
                required
              />
            </CCol>
          </CRow>
          <CFormLabel>Goal</CFormLabel>
          <CFormTextarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Sprint goal..."
            rows={2}
            className="mb-4 bg-secondary text-light"
            required
          />
          <h5 className="text-info mb-3">Tasks</h5>{" "}
          {tasks.map((task, index) => (
            <CCard
              key={index}
              className="mb-3 bg-secondary bg-opacity-10 text-light shadow-sm"
            >
              <CCardBody>
                <CRow className="mb-2">
                  <CCol md={6}>
                    <CFormLabel>Title</CFormLabel>
                    <CFormInput
                      value={task.title}
                      onChange={(e) =>
                        handleTaskChange(index, "title", e.target.value)
                      }
                      placeholder="Task title"
                      required
                      className=""
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel>Assignee</CFormLabel>
                    {userFetchLoading ? (
                      <LoadingSpinner />
                    ) : error ? (
                      <p className="text-danger">{error}</p>
                    ) : (
                      <CFormSelect
                        value={task.assignee}
                        onChange={(e) =>
                          handleTaskChange(index, "assignee", e.target.value)
                        }
                        className="bg-dark text-light"
                      >
                        <option value="">Select assignee</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.username} ({user.email})
                          </option>
                        ))}
                      </CFormSelect>
                    )}
                  </CCol>
                </CRow>

                <CRow className="mb-2">
                  <CCol md={6}>
                    <CFormLabel>Description</CFormLabel>
                    <CFormTextarea
                      value={task.description}
                      onChange={(e) =>
                        handleTaskChange(index, "description", e.target.value)
                      }
                      rows={2}
                      className="bg-dark text-light"
                      placeholder="Task description"
                    />
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>Priority</CFormLabel>
                    <CFormSelect
                      value={task.priority}
                      onChange={(e) =>
                        handleTaskChange(index, "priority", e.target.value)
                      }
                      className="bg-dark text-light"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>Deadline</CFormLabel>
                    <CFormInput
                      type="date"
                      value={task.deadline}
                      onChange={(e) =>
                        handleTaskChange(index, "deadline", e.target.value)
                      }
                      className="bg-dark text-light"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-2">
                  <CCol md={8}>
                    <CFormLabel>Remarks</CFormLabel>
                    <CFormTextarea
                      value={task.remarks}
                      onChange={(e) =>
                        handleTaskChange(index, "remarks", e.target.value)
                      }
                      rows={1}
                      className="bg-dark text-light"
                      placeholder="Any remarks..."
                    />
                  </CCol>
                  <CCol md={4} className="d-flex align-items-end">
                    <CButton
                      color="danger"
                      onClick={() => removeTask(index)}
                      className="mt-2"
                    >
                      Remove
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          ))}
          <div className="d-flex justify-content-between align-items-center">
            <CButton
              color="success"
              size="sm"
              onClick={addTask}
              className="me-2"
            >
              {" "}
              Add Task
            </CButton>
            <CButton type="submit" color="primary" size="sm">
              {createLoading ? (
                <>
                  {" "}
                  Creating <LoadingSpinner />
                </>
              ) : (
                "Create Sprint"
              )}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default CreateSprint;
