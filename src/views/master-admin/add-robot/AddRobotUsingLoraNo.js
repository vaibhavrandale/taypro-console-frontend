// import React from 'react';

// const AddRobotUsingLoraNo = () => {
//   return <div>Add Robot</div>;
// };

// export default AddRobotUsingLoraNo;

import React, { useState } from 'react';
import {
  CForm,
  CFormSelect,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  //   CCardHeader,
  CRow,
  CCol,
} from '@coreui/react';
import { lora_configuration, robots } from '../../../data'; // Import lora config
import toast from 'react-hot-toast';

const AddRobotUsingLoraNo = () => {
  const [formData, setFormData] = useState({
    lora_no: '',
    robot_no: '',
    formatted_deveui: '',
    site_id: '',
  });

  // Get only available lora_no (not already in robots array)
  const assignedLoraNos = robots.map((robot) => robot.lora_no);
  const availableLoraConfig = lora_configuration.filter(
    (lora) => !assignedLoraNos.includes(lora.serial) // `serial` as unique lora_no
  );

  // Handle Lora selection
  const handleLoraChange = (e) => {
    const selectedLoraNo = e.target.value;
    const selectedLora = lora_configuration.find(
      (lora) => lora.serial.toString() === selectedLoraNo
    );

    if (selectedLora) {
      setFormData({
        lora_no: selectedLora.serial,
        robot_no: selectedLora.robot_no,
        formatted_deveui: selectedLora.formatted_deveui,
        site_id: selectedLora.site_id,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.lora_no) {
      alert('Please select a valid Lora No.');
      return;
    }

    // Add new robot to the array (this should be managed via state or Redux)
    robots.push({
      ...formData,
      activate: 0, // Assuming newly added robots are active
      battery_percentage: 10, // Example default values
      last_update: new Date().toISOString(),
    });

    toast.success(`Robot ${formData.robot_no}  added successfully!`);
    setFormData({
      lora_no: '',
      robot_no: '',
      formatted_deveui: '',
      site_id: '',
    });
  };
  console.log(robots);

  return (
    <CCard className="p-4">
      <>
        <h4>Add Robot</h4>
      </>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6}>
              <label>Lora No</label>
              <CFormSelect
                name="lora_no"
                value={formData.lora_no}
                onChange={handleLoraChange}
              >
                <option value="">Select Lora No</option>
                {availableLoraConfig.map((lora) => (
                  <option key={lora.serial} value={lora.serial}>
                    {lora.serial}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            {formData.robot_no && (
              <CCol md={6}>
                <label>Robot No</label>
                <CFormInput
                  type="text"
                  name="robot_no"
                  disabled
                  value={formData.robot_no}
                  readOnly
                />
              </CCol>
            )}
          </CRow>

          <CRow className="mb-3">
            {formData.formatted_deveui && (
              <CCol md={6}>
                <label>Deveui</label>
                <CFormInput
                  type="text"
                  name="deveui"
                  disabled
                  value={formData.formatted_deveui}
                  readOnly
                />
              </CCol>
            )}

            {formData.site_id && (
              <CCol md={6}>
                <label>Site ID</label>
                <CFormInput
                  type="text"
                  name="site_id"
                  disabled
                  value={formData.site_id}
                  readOnly
                />
              </CCol>
            )}
          </CRow>

          <CButton type="submit" size="sm" color="primary">
            Add Robot
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default AddRobotUsingLoraNo;
