import React, { useState, useReducer, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CFormSelect,
  CAlert,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, creating: true, error: "" };
    case "CREATE_SUCCESS":
      return { ...state, creating: false, success: true };
    case "CREATE_FAIL":
      return { ...state, creating: false, error: action.payload };
    default:
      return state;
  }
};

const OpexTemplateCreate = () => {
  const navigate = useNavigate();
  const { site_id } = useParams();
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    creating: false,
    error: "",
    success: false,
    data: null,
  });

  const [formData, setFormData] = useState({
    site_id,
    total_modules: "",
    cycle_frequency: "Monthly",
    days_to_complete_one_cycle: "",
    modules_cleaned_per_day: "",
    total_manpower: "",
    total_blocks: "",
    total_robots: "",
    total_trolley: "",
    blocks_data: [],
  });

  let adminroute = "";
  if (userInfo.role === "Master Admin") {
    adminroute = "master-admin";
  } else if (userInfo.role === "Service Admin") {
    adminroute = "service-admin";
  } else if (userInfo.role === "Project Admin") {
    adminroute = "project-admin";
  } else if (userInfo.role === "Master User") {
    adminroute = "master-user";
  } else if (userInfo.role === "Service User") {
    adminroute = "service-user";
  } else if (userInfo.role === "Project User") {
    adminroute = "project-user";
  } else if (userInfo.role === "Opex Client Admin") {
    adminroute = "opex-client-admin";
  } else if (userInfo.role === "Opex Site Technician") {
    adminroute = "opex-site-technician";
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Handle blocks update when total_blocks changes
      if (name === "total_blocks") {
        const blockCount = parseInt(value) || 0;
        const currentBlocks = prev.blocks_data.length;

        if (blockCount > currentBlocks) {
          // Add new blocks
          const newBlocks = Array.from(
            { length: blockCount - currentBlocks },
            (_, i) => ({
              block_no: `Block-${currentBlocks + i + 1}`,
              no_of_robots: "",
              no_of_manpower: "",
            }),
          );
          newData.blocks_data = [...prev.blocks_data, ...newBlocks];
        } else if (blockCount < currentBlocks) {
          // Remove excess blocks
          newData.blocks_data = prev.blocks_data.slice(0, blockCount);
        }
      }

      return newData;
    });
  };

  // Handle block data changes
  const handleBlockChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedBlocks = [...prev.blocks_data];
      updatedBlocks[index][field] = value;
      return { ...prev, blocks_data: updatedBlocks };
    });
  };

  // Calculate totals whenever blocks data changes
  useEffect(() => {
    if (formData.blocks_data.length > 0) {
      const totals = formData.blocks_data.reduce(
        (acc, block) => {
          acc.robots += parseInt(block.no_of_robots || 0);
          acc.manpower += parseInt(block.no_of_manpower || 0);
          return acc;
        },
        { robots: 0, manpower: 0 },
      );

      setFormData((prev) => ({
        ...prev,
        total_robots: totals.robots.toString(),
        total_manpower: totals.manpower.toString(),
      }));
    }
  }, [formData.blocks_data]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: "CREATE_REQUEST" });

    try {
      const response = await axios.post("/api/v1/opex", formData, {
        headers: {
          // Authorization: `Bearer ${authtoken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response.data.message);

      dispatch({ type: "CREATE_SUCCESS" });
      toast.success(response.data.message);
      navigate(`/${adminroute}/opexdata/${site_id}`);
    } catch (error) {
      dispatch({
        type: "CREATE_FAIL",
        payload: error.response.data.message || error.response.data.error,
      });

      toast.error(error.response.data.message || error.response.data.error);
    }
  };

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h5>Create OPEX Template</h5>
      </CCardHeader>
      <CCardBody>
        {state.error && <CAlert color="danger">{state.error}</CAlert>}

        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Cycle Frequency</CFormLabel>
              <CFormSelect
                name="cycle_frequency"
                value={formData.cycle_frequency}
                onChange={handleInputChange}
                required
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={4}>
              <CFormLabel>Total Modules</CFormLabel>
              <CFormInput
                type="number"
                name="total_modules"
                value={formData.total_modules}
                onChange={handleInputChange}
                required
                min="1"
              />
            </CCol>
            {/* <CCol md={4}>
              <CFormLabel>Total Cycles</CFormLabel>
              <CFormInput
                type="number"
                name="total_cycles"
                value={formData.total_cycles}
                onChange={handleInputChange}
                required
                min="1"
              />
            </CCol> */}
            <CCol md={4}>
              <CFormLabel>Days to Complete One Cycle</CFormLabel>
              <CFormInput
                type="number"
                name="days_to_complete_one_cycle"
                value={formData.days_to_complete_one_cycle}
                onChange={handleInputChange}
                required
                min="1"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Modules Cleaned Per Day</CFormLabel>
              <CFormInput
                type="number"
                name="modules_cleaned_per_day"
                value={formData.modules_cleaned_per_day}
                onChange={handleInputChange}
                required
                min="1"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Total Trolleys</CFormLabel>
              <CFormInput
                type="number"
                name="total_trolley"
                value={formData.total_trolley}
                onChange={handleInputChange}
                required
                min="0"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Total Blocks</CFormLabel>
              <CFormInput
                type="number"
                name="total_blocks"
                value={formData.total_blocks}
                onChange={handleInputChange}
                required
                min="1"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Calculated Total Robots</CFormLabel>
              <CFormInput
                type="number"
                name="total_robots"
                value={formData.total_robots}
                readOnly
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Calculated Total Manpower</CFormLabel>
              <CFormInput
                type="number"
                name="total_manpower"
                value={formData.total_manpower}
                readOnly
              />
            </CCol>
          </CRow>

          {formData.total_blocks > 0 && (
            <>
              <h5 className="mt-4">Blocks Configuration</h5>
              <CTable bordered hover responsive className="mt-3">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Block No</CTableHeaderCell>
                    <CTableHeaderCell>Number of Robots</CTableHeaderCell>
                    <CTableHeaderCell>Number of Manpower</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {formData.blocks_data.map((block, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <CFormInput
                          type="text"
                          value={block.block_no}
                          onChange={(e) =>
                            handleBlockChange(index, "block_no", e.target.value)
                          }
                          required
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="number"
                          value={block.no_of_robots}
                          onChange={(e) =>
                            handleBlockChange(
                              index,
                              "no_of_robots",
                              e.target.value,
                            )
                          }
                          required
                          min="0"
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="number"
                          value={block.no_of_manpower}
                          onChange={(e) =>
                            handleBlockChange(
                              index,
                              "no_of_manpower",
                              e.target.value,
                            )
                          }
                          required
                          min="0"
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </>
          )}

          <div className="d-flex justify-content-end mt-4">
            <CButton
              color="secondary"
              className="btn btn-sm btn-primary me-2"
              onClick={() => navigate(-1)}
              disabled={state.creating}
            >
              Cancel
            </CButton>
            <CButton
              className="btn btn-sm btn-primary"
              type="submit"
              color="primary"
              disabled={state.creating}
            >
              {state.creating ? (
                <>
                  Creating <LoadingSpinner />
                </>
              ) : (
                "Create Template"
              )}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default OpexTemplateCreate;
