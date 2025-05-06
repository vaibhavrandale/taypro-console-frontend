import React, { useEffect, useReducer, useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormInput,
  CInputGroup,
} from "@coreui/react";
// import { robots } from "../../../data"; // Import robots data
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        //  robots: action.payload,
        robots: action.payload.data,
        totalPages: action.payload.totalPages, // Use API-provided totalPages
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const ClientSearchRobot = () => {
  const [
    { loading, error, robots, totalPages, hasNextPage, hasPrevPage },
    dispatch,
  ] = useReducer(reducer, {
    robots: [],
    loading: true,
    error: "",
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const authtoken = useSelector((state) => state.authtoken);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRobot, setFilteredRobot] = useState([]);

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const result = await axios.get(
          `/api/v1/robots/get-robots-no`,

          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );

        dispatch({
          type: "FETCH_SUCCESS",
          //  payload: data.data
          payload: result.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response.statusText,
        });
        toast.error(error.response.statusText);
      }
    };

    fetchRobots();
  }, [authtoken]);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = robots.filter((robot) =>
        robot.robot_no.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRobot(filtered);
    } else {
      setFilteredRobot([]);
    }
  };
  return (
    <div className="my-3">
      <CCard className="shadow border-0" style={{ minHeight: "73vh" }}>
        <CCardBody>
          <h5 className="text-primary text-center">Search Robots</h5>

          {/* Search Bar */}
          <CRow className="justify-content-center my-3">
            <CCol md={4}>
              <CInputGroup className="mb-3">
                <CFormInput
                  type="text"
                  placeholder="Search by Robot No..."
                  value={searchTerm}
                  className="form-control"
                  onChange={handleSearchChange}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          {/* Dropdown with Robot List */}
          <CRow className="justify-content-center">
            <CCol md={4}>
              <ul
                className={`text-center ${
                  searchTerm === "" ? `` : `shadow-sm`
                } p-3`}
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {loading ? (
                  <LoadingSpinner />
                ) : error ? (
                  <li style={{ listStyle: "none" }}>{error}</li>
                ) : searchTerm && filteredRobot.length === 0 ? (
                  <li style={{ listStyle: "none" }}>No robots found</li>
                ) : (
                  filteredRobot.map((robot, index) => (
                    <Link
                      key={index}
                      // ✅ Move the key to the <li> (not the <Link>)
                      to={`/client-admin/site-management/block-management/${robot.site_id}/${robot.block}/${robot.robot_no}`}
                      className="text-decoration-none w-100 "
                    >
                      <li
                        className="my-2 border p-2 rounded"
                        style={{ listStyle: "none" }}
                      >
                        {robot.robot_no}
                      </li>{" "}
                    </Link>
                  ))
                )}
              </ul>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ClientSearchRobot;
