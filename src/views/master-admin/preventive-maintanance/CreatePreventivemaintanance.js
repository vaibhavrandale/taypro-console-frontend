// import React from "react";

// const CreatePreventivemaintanance = () => {
//   return <div>CreatePreventivemaintanance</div>;
// };

// export default CreatePreventivemaintanance;
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CRow,
  CCol,
} from "@coreui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreatePreventivemaintanance = () => {
  const [formData, setFormData] = useState({
    robot_no: "",
    robot_type: "",
    client_name: "",
    site_location: "",
    physical_condition_of_transPipe: { condition: "", image: "" },
    physical_condition_of_channel: { condition: "", image: "" },
    physical_condition_of_top_bottom_cover: { condition: "", image: "" },
    oiling_need_for_bearing: { condition: "", image: "" },
    oiling_need_for_coupling: { condition: "", image: "" },
    oiling_need_for_motors: { condition: "", image: "" },
    alignment: { mf_clothes: "", wheels: "" },
  });
  const authtoken = useSelector((state) => state.authtoken);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleObjectChange = (e, key) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/v1/preventivemaintenances",
        formData,
        {
          headers: { Authorization: `Bearer ${authtoken}` },
        }
      );
      console.log(response);

      toast.success(response.data.message);
      navigate("/master-admin/preventive-maintanance-dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <CCard className="max-w-3xl mx-auto p-4 shadow-lg rounded-lg">
      <CCardHeader>
        <h2>Create Preventive Maintenance</h2>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="gy-3">
            <CCol md={6}>
              <CFormLabel>Robot No</CFormLabel>
              <CFormInput
                type="text"
                name="robot_no"
                value={formData.robot_no}
                onChange={handleChange}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Robot Type</CFormLabel>
              <CFormInput
                type="text"
                name="robot_type"
                value={formData.robot_type}
                onChange={handleChange}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Client Name</CFormLabel>
              <CFormInput
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Site Location</CFormLabel>
              <CFormInput
                type="text"
                name="site_location"
                value={formData.site_location}
                onChange={handleChange}
                required
              />
            </CCol>
          </CRow>

          {/* Dynamic Object Inputs */}
          {[
            "physical_condition_of_transPipe",
            "physical_condition_of_channel",
            "physical_condition_of_top_bottom_cover",
            "oiling_need_for_bearing",
            "oiling_need_for_coupling",
            "oiling_need_for_motors",
          ].map((key) => (
            <CRow key={key} className="gy-3 mt-3">
              <CCol md={6}>
                <CFormLabel>{key.replace(/_/g, " ")}</CFormLabel>
                <CFormSelect
                  name="condition"
                  value={formData[key].condition}
                  onChange={(e) => handleObjectChange(e, key)}
                >
                  <option value="">Select Condition</option>
                  <option value="Good">Good</option>
                  <option value="Needs Repair">Needs Repair</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Image URL</CFormLabel>
                <CFormInput
                  type="text"
                  name="image"
                  value={formData[key].image}
                  onChange={(e) => handleObjectChange(e, key)}
                />
              </CCol>
            </CRow>
          ))}

          <CButton color="primary" type="submit" className="mt-4">
            Submit
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default CreatePreventivemaintanance;
