// import React, { useState } from 'react';
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CForm,
//   CFormSelect,
//   CFormInput,
//   CFormTextarea,
//   CButton,
//   CRow,
//   CCol,
// } from '@coreui/react';
// import { robots, service_tickets_faults } from '../../../data'; // Import robots & fault types

// const CreateServiceTicket = () => {
//   const [formData, setFormData] = useState({
//     robot_no: '',
//     deveui: '',
//     site_id: '',
//     company: '',
//     lora_no: '',
//     fault_type: '',
//     notes: '',
//     images: [],
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // 📌 Handle robot selection to auto-fill details
//   const handleRobotSelect = (e) => {
//     const selectedRobot = robots.find((r) => r.robot_no === e.target.value);
//     if (selectedRobot) {
//       setFormData({
//         ...formData,
//         robot_no: selectedRobot.robot_no,
//         deveui: selectedRobot.deveui,
//         site_id: selectedRobot.site_id,
//         company: selectedRobot.company,
//         lora_no: selectedRobot.lora_no,
//       });
//     }
//   };

//   // 📌 Handle image upload
//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     setFormData({ ...formData, images: [...formData.images, ...files] });
//   };

//   // 📌 Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('New Service Ticket:', formData);
//     alert('Service Ticket Created Successfully!');
//     setFormData({
//       robot_no: '',
//       deveui: '',
//       site_id: '',
//       company: '',
//       lora_no: '',
//       fault_type: '',
//       notes: '',
//       images: [],
//     });
//   };

//   return (
//     <CRow className="justify-content-center">
//       <CCol xs={12} md={8}>
//         <CCard className="shadow">
//           <CCardHeader>
//             <h5>Create New Service Ticket</h5>
//           </CCardHeader>
//           <CCardBody>
//             <CForm onSubmit={handleSubmit}>
//               {/* 📌 Select Robot */}
//               <CFormSelect
//                 name="robot_no"
//                 onChange={handleRobotSelect}
//                 className="mb-3"
//               >
//                 <option value="">Select Robot</option>
//                 {robots.map((robot) => (
//                   <option key={robot.robot_no} value={robot.robot_no}>
//                     {robot.robot_no} - {robot.site_id}
//                   </option>
//                 ))}
//               </CFormSelect>

//               <CRow>
//                 <CCol md={6}>
//                   <CFormInput
//                     type="text"
//                     name="deveui"
//                     value={formData.deveui}
//                     label="Deveui"
//                     disabled
//                     className="mb-3"
//                   />
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormInput
//                     type="text"
//                     name="site_id"
//                     value={formData.site_id}
//                     label="Site ID"
//                     disabled
//                     className="mb-3"
//                   />
//                 </CCol>
//               </CRow>

//               <CRow>
//                 <CCol md={6}>
//                   <CFormInput
//                     type="text"
//                     name="company"
//                     value={formData.company}
//                     label="Company"
//                     disabled
//                     className="mb-3"
//                   />
//                 </CCol>
//                 <CCol md={6}>
//                   <CFormInput
//                     type="text"
//                     name="lora_no"
//                     value={formData.lora_no}
//                     label="Lora No"
//                     disabled
//                     className="mb-3"
//                   />
//                 </CCol>
//               </CRow>

//               {/* 📌 Select Fault Type */}
//               <CFormSelect
//                 name="fault_type"
//                 value={formData.fault_type}
//                 onChange={handleChange}
//                 className="mb-3"
//               >
//                 <option value="">Select Fault Type</option>
//                 {service_tickets_faults.map((fault, index) => (
//                   <option key={index} value={fault}>
//                     {fault.replace(/-/g, ' ')}
//                   </option>
//                 ))}
//               </CFormSelect>

//               {/* 📌 Notes */}
//               <CFormTextarea
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 rows={3}
//                 placeholder="Add any additional notes..."
//                 className="mb-3"
//               />

//               {/* 📌 Upload Images */}
//               <CFormInput
//                 type="file"
//                 multiple
//                 onChange={handleImageUpload}
//                 className="mb-3"
//               />

//               {/* 📌 Display Uploaded Images */}
//               {formData.images.length > 0 && (
//                 <div className="mb-3">
//                   <strong>Uploaded Images:</strong>
//                   <div className="d-flex flex-wrap mt-2">
//                     {formData.images.map((img, index) => (
//                       <img
//                         key={index}
//                         src={URL.createObjectURL(img)}
//                         alt={`Upload ${index}`}
//                         className="img-thumbnail me-2"
//                         width="80"
//                         height="80"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* 📌 Submit Button */}
//               <CButton type="submit" color="primary" className="w-100">
//                 Create Ticket
//               </CButton>
//             </CForm>
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   );
// };

// export default CreateServiceTicket;

import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormSelect,
  CFormInput,
  CFormTextarea,
  CButton,
  CRow,
  CCol,
  CListGroup,
  CListGroupItem,
} from '@coreui/react';
import { robots, service_tickets_faults } from '../../../data'; // Import robots & fault types

const CreateServiceTicket = () => {
  const [formData, setFormData] = useState({
    robot_no: '',
    deveui: '',
    site_id: '',
    company: '',
    lora_no: '',
    fault_type: '',
    notes: '',
    images: [],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRobots, setFilteredRobots] = useState([]);

  // 📌 Handle robot selection to auto-fill details
  const handleRobotSelect = (e) => {
    const selectedRobot = robots.find((r) => r.robot_no === e.target.value);
    if (selectedRobot) {
      setFormData({
        ...formData,
        robot_no: selectedRobot.robot_no,
        deveui: selectedRobot.deveui,
        site_id: selectedRobot.site_id,
        company: selectedRobot.company,
        lora_no: selectedRobot.lora_no,
      });
      setSearchTerm(''); // Clear search input
      setFilteredRobots([]); // Hide suggestions
    }
  };

  // 📌 Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = robots.filter(
        (robot) =>
          robot.robot_no.toLowerCase().includes(value.toLowerCase()) ||
          robot.site_id.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRobots(filtered);
    } else {
      setFilteredRobots([]);
    }
  };

  // 📌 Handle selecting a robot from search results
  const selectRobotFromSearch = (robot) => {
    setFormData({
      ...formData,
      robot_no: robot.robot_no,
      deveui: robot.deveui,
      site_id: robot.site_id,
      company: robot.company,
      lora_no: robot.lora_no,
    });
    setSearchTerm(''); // Clear search input
    setFilteredRobots([]); // Hide suggestions
  };

  // 📌 Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  // 📌 Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Service Ticket:', formData);
    alert('Service Ticket Created Successfully!');
    setFormData({
      robot_no: '',
      deveui: '',
      site_id: '',
      company: '',
      lora_no: '',
      fault_type: '',
      notes: '',
      images: [],
    });
  };

  return (
    <CRow className="justify-content-center">
      <CCol xs={12} md={12}>
        <CCard className="shadow">
          <CCardHeader>
            <h5>Create New Service Ticket</h5>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {/* 📌 Search for Robot */}
              <CFormInput
                type="text"
                placeholder="Search Robot No or Site ID..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-3"
              />

              {/* 📌 Display Search Suggestions */}
              {filteredRobots.length > 0 && (
                <CListGroup className="mb-3">
                  {filteredRobots.map((robot) => (
                    <CListGroupItem
                      id="robot_no"
                      style={{ cursor: 'pointer' }}
                      key={robot.robot_no}
                      action
                      onClick={() => selectRobotFromSearch(robot)}
                    >
                      {robot.robot_no} - {robot.site_id}
                    </CListGroupItem>
                  ))}
                </CListGroup>
              )}

              {/* 📌 Select Robot (Dropdown) */}
              <CFormSelect
                name="robot_no"
                onChange={handleRobotSelect}
                value={formData.robot_no}
                className="mb-3"
              >
                <option value="">Select Robot</option>
                {robots.map((robot) => (
                  <option key={robot.robot_no} value={robot.robot_no}>
                    {robot.robot_no} - {robot.site_id}
                  </option>
                ))}
              </CFormSelect>

              <CRow>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="deveui"
                    value={formData.deveui}
                    label="Deveui"
                    disabled
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="site_id"
                    value={formData.site_id}
                    label="Site ID"
                    disabled
                    className="mb-3"
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="company"
                    value={formData.company}
                    label="Company"
                    disabled
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    name="lora_no"
                    value={formData.lora_no}
                    label="Lora No"
                    disabled
                    className="mb-3"
                  />
                </CCol>
              </CRow>

              {/* 📌 Select Fault Type */}
              <CFormSelect
                name="fault_type"
                value={formData.fault_type}
                onChange={(e) =>
                  setFormData({ ...formData, fault_type: e.target.value })
                }
                className="mb-3"
              >
                <option value="">Select Fault Type</option>
                {service_tickets_faults.map((fault, index) => (
                  <option key={index} value={fault}>
                    {fault.replace(/-/g, ' ')}
                  </option>
                ))}
              </CFormSelect>

              {/* 📌 Notes */}
              <CFormTextarea
                name="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                placeholder="Add any additional notes..."
                className="mb-3"
              />

              {/* 📌 Upload Images */}
              <CFormInput
                type="file"
                multiple
                onChange={handleImageUpload}
                className="mb-3"
              />

              {/* 📌 Display Uploaded Images */}
              {formData.images.length > 0 && (
                <div className="mb-3">
                  <strong>Uploaded Images:</strong>
                  <div className="d-flex flex-wrap mt-2">
                    {formData.images.map((img, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(img)}
                        alt={`Upload ${index}`}
                        className="img-thumbnail me-2"
                        width="80"
                        height="80"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 📌 Submit Button */}
              <CButton type="submit" color="primary" className="w-100">
                Create Ticket
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CreateServiceTicket;
