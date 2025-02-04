// import React, { useState } from 'react';
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CButton,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormInput,
//   CRow,
//   CCol,
//   CForm,
// } from '@coreui/react';
// import { clients } from '../../../data'; // Import clients data
// import { Link } from 'react-router-dom';

// const Clients = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [formData, setFormData] = useState({
//     client_name: '',
//     client_id: '',
//     logo: '',
//   });

//   // Filter clients based on search term
//   const filteredClients = clients.filter((client) =>
//     client.client_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Open modal with selected client data
//   const openModal = (client) => {
//     setSelectedClient(client);
//     setFormData(client);
//     setModalVisible(true);
//   };

//   const openAddclientModal =()=>{

//   }

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle update
//   const handleUpdate = () => {
//     console.log('Updated Client Data:', formData);
//     setModalVisible(false);
//   };

//   return (
//     <div className="p-4">
//       <div className="d-flex justify-content-between">
//         <h2>All Clients</h2>
//         <Link className="btn btn-sm btn-primary my-2"  onClick={() => openAddclientModal}>Add new</Link>
//       </div>
//       <CRow className="justify-content-end">
//         <CCol md={4} lg={4}>
//           <CFormInput
//             type="text"
//             placeholder="Search by Client Name or client id"
//             className="mb-3"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </CCol>
//       </CRow>

//       {/* Clients Table */}
//       <CTable bordered hover responsive className="text-center">
//         <CTableHead color="dark">
//           <CTableRow>
//             <CTableHeaderCell>Sr</CTableHeaderCell>
//             <CTableHeaderCell>Client Name</CTableHeaderCell>
//             <CTableHeaderCell>Client ID</CTableHeaderCell>
//             <CTableHeaderCell>Logo</CTableHeaderCell>
//             <CTableHeaderCell>Action</CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         {/* <CTableBody>
//           {filteredClients.map((client, index) => (
//             <CTableRow key={index}>
//               <CTableDataCell>{client.sr}</CTableDataCell>
//               <CTableDataCell>{client.client_name}</CTableDataCell>
//               <CTableDataCell>{client.client_id}</CTableDataCell>
//               <CTableDataCell>
//                 <img
//                   src={client.logo}
//                   alt="Client Logo"
//                   className="img-thumbnail border-0"
//                   width="100"
//                   height="50"
//                 />
//               </CTableDataCell>
//               <CTableDataCell>
//                 <CButton
//                   color="primary"
//                   size="sm"
//                   onClick={() => openModal(client)}
//                 >
//                   Update
//                 </CButton>
//               </CTableDataCell>
//             </CTableRow>
//           ))}
//         </CTableBody> */}
//         <CTableBody>
//           {filteredClients.length > 0 ? (
//             filteredClients.map((client, index) => (
//               <CTableRow key={index}>
//                 <CTableDataCell>{client.sr}</CTableDataCell>
//                 <CTableDataCell>{client.client_name}</CTableDataCell>
//                 <CTableDataCell>{client.client_id}</CTableDataCell>
//                 <CTableDataCell>
//                   <img
//                     src={client.logo}
//                     alt="Client Logo"
//                     className="img-thumbnail border-0"
//                     width="100"
//                     height="50"
//                   />
//                 </CTableDataCell>
//                 <CTableDataCell>
//                   <CButton
//                     color="primary"
//                     size="sm"
//                     onClick={() => openModal(client)}
//                   >
//                     Update
//                   </CButton>
//                 </CTableDataCell>
//               </CTableRow>
//             ))
//           ) : (
//             <CTableRow>
//               <CTableDataCell colSpan="5" className="text-center">
//                 <strong>results not found</strong>
//               </CTableDataCell>
//             </CTableRow>
//           )}
//         </CTableBody>
//       </CTable>

//   {/* Update Modal */}
//   <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
//     <CModalHeader>
//       <CModalTitle>
//         Update Client :{' '}
//         <span className="badge bg-success">{formData.client_id}</span>
//       </CModalTitle>
//     </CModalHeader>
//     <CModalBody>
//       {selectedClient && (
//         <CForm>
//           <CFormInput
//             type="text"
//             name="client_name"
//             value={formData.client_name}
//             label="Client Name"
//             onChange={handleChange}
//             className="mb-3"
//           />
//           <CFormInput
//             type="text"
//             name="client_id"
//             value={formData.client_id}
//             label="Client ID"
//             disabled
//             className="mb-3"
//           />
//           <img
//             src={formData.logo}
//             alt="Client Logo"
//             className="img-thumbnail border-0"
//             width="100"
//             height="50"
//           />
//           <br />
//           <CFormInput
//             type="file"
//             name="logo"
//             label="Upload new Logo"
//             onChange={handleChange}
//             className="mb-3"
//           />
//         </CForm>
//       )}
//     </CModalBody>
//     <CModalFooter>
//       <CButton
//         size="sm"
//         color="secondary"
//         onClick={() => setModalVisible(false)}
//       >
//         Cancel
//       </CButton>
//       <CButton size="sm" color="primary" onClick={handleUpdate}>
//         Save Changes
//       </CButton>
//     </CModalFooter>
//   </CModal>
//     </div>
//   );
// };

// export default Clients;

import React, { useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CRow,
  CCol,
  CForm,
} from '@coreui/react';
import { clients as initialClients } from '../../../data'; // Import clients data
import { Link } from 'react-router-dom';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [clients, setClients] = useState(initialClients);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_id: '',
    logo: '',
  });

  // Function to generate client_id from client_name
  const generateClientID = (name) => {
    return name
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^\w_]/g, ''); // Remove special characters
  };

  // Open modal for updating client
  const openModal = (client) => {
    setSelectedClient(client);
    setFormData(client);
    setModalVisible(true);
  };

  // Open "Add Client" modal
  const openAddClientModal = () => {
    setFormData({ client_name: '', client_id: '', logo: '' });
    setAddModalVisible(true);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    // Generate `client_id` dynamically based on `client_name`
    if (name === 'client_name') {
      newFormData.client_id = generateClientID(value);
    }

    setFormData(newFormData);
  };

  // Handle update client
  const handleUpdate = () => {
    setClients(
      clients.map((client) =>
        client.client_id === formData.client_id ? formData : client
      )
    );
    setModalVisible(false);
  };

  // Handle add new client
  const handleAddClient = () => {
    if (!formData.client_name || !formData.logo) {
      alert('Please fill in all fields');
      return;
    }

    const newClient = {
      sr: clients.length + 1,
      ...formData,
    };

    setClients([...clients, newClient]);
    setAddModalVisible(false);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>All Clients</h2>
        <CButton color="primary" size="sm" onClick={openAddClientModal}>
          Add New
        </CButton>
      </div>

      <CRow className="justify-content-end">
        <CCol md={4} lg={4}>
          <CFormInput
            type="text"
            placeholder="Search by Client Name or Client ID"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CCol>
      </CRow>

      {/* Clients Table */}
      <CTable bordered hover responsive className="text-center">
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell>Sr</CTableHeaderCell>
            <CTableHeaderCell>Client Name</CTableHeaderCell>
            <CTableHeaderCell>Client ID</CTableHeaderCell>
            <CTableHeaderCell>Logo</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {clients.length > 0 ? (
            clients.map((client, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{client.sr}</CTableDataCell>
                <CTableDataCell>{client.client_name}</CTableDataCell>
                <CTableDataCell>{client.client_id}</CTableDataCell>
                <CTableDataCell>
                  <img
                    src={client.logo}
                    alt="Client Logo"
                    className="img-thumbnail border-0"
                    width="100"
                    height="50"
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <Link
                    className="m-1 btn btn-sm btn-primary"
                    color="primary"
                    size="sm"
                    to={`clients-data/${client.client_id}`}
                  >
                    view assigned sites
                  </Link>
                  <CButton
                    className="m-1"
                    color="warning"
                    size="sm"
                    onClick={() => openModal(client)}
                  >
                    Update
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="5" className="text-center">
                <strong>No results found</strong>
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* Add New Client Modal */}
      <CModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Add New Client</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              name="client_name"
              value={formData.client_name}
              label="Client Name"
              onChange={handleChange}
              className="mb-3"
            />
            <CFormInput
              type="text"
              name="client_id"
              value={formData.client_id}
              label="Client ID (Auto-generated)"
              disabled
              className="mb-3"
            />
            <CFormInput
              type="file"
              name="logo"
              label="Upload Logo"
              onChange={handleChange}
              className="mb-3"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            size="sm"
            color="secondary"
            onClick={() => setAddModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton size="sm" color="primary" onClick={handleAddClient}>
            Add Client
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Update Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>
            Update Client :{' '}
            <span className="badge bg-success">{formData.client_id}</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedClient && (
            <CForm>
              <CFormInput
                type="text"
                name="client_name"
                value={formData.client_name}
                label="Client Name"
                onChange={handleChange}
                className="mb-3"
              />
              <CFormInput
                type="text"
                name="client_id"
                value={formData.client_id}
                label="Client ID"
                disabled
                className="mb-3"
              />
              <img
                src={formData.logo}
                alt="Client Logo"
                className="img-thumbnail border-0"
                width="100"
                height="50"
              />
              <br />
              <CFormInput
                type="file"
                name="logo"
                label="Upload new Logo"
                onChange={handleChange}
                className="mb-3"
              />
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            size="sm"
            color="secondary"
            onClick={() => setModalVisible(false)}
          >
            Cancel
          </CButton>
          <CButton size="sm" color="primary" onClick={handleUpdate}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Clients;
