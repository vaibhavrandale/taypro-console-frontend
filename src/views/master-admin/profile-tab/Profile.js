import React from "react";
import { useSelector } from "react-redux";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  // CTable,
  // CTableBody,
  // CTableDataCell,
  // CTableHead,
  // CTableHeaderCell,
  // CTableRow,
} from "@coreui/react";

const Profile = () => {
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  return (
    <div className=" mt-4">
      <CCard>
        <CCardHeader>Profile Details</CCardHeader>

        <CCardBody>
          <form onSubmit={(e) => e.preventDefault()}>
            <CRow>
              <CCol md="3">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">Name</CFormLabel>
                  <CFormInput
                    type="text"
                    className="form-control"
                    name="project_name"
                    value={userInfo.username || ""}
                  />
                </div>
              </CCol>

              <CCol md="3">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">Email</CFormLabel>
                  <CFormInput
                    type="text"
                    className="form-control"
                    name="prepared_by"
                    value={userInfo.email || ""}
                  />
                </div>
              </CCol>

              <CCol md="3">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">Phone</CFormLabel>
                  <CFormInput
                    type="text"
                    className="form-control"
                    name="project_location"
                    value={userInfo.phone || ""}
                  />
                </div>
              </CCol>

              <CCol md="3">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">User Id</CFormLabel>
                  <CFormInput
                    type="text"
                    className="form-control"
                    name="client_role"
                    value={userInfo._id || ""}
                  />
                </div>
              </CCol>

              <CCol md="3">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">Role</CFormLabel>
                  <CFormInput
                    type="text"
                    className="form-control"
                    name="project_approved_by"
                    value={userInfo.role || ""}
                  />
                </div>
              </CCol>

              <CCol md="3">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">
                    Designation
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    className="form-control"
                    name="client_name"
                    value={userInfo.designation || ""}
                  />
                </div>
              </CCol>

              <CCol md="3">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">User Type</CFormLabel>
                  <CFormInput
                    type="text"
                    className="form-control"
                    name="client_role"
                    value={userInfo.type || ""}
                  />
                </div>
              </CCol>

              <CCol md="3">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">
                    User Creation Date
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    className="form-control"
                    name="client_email"
                    value={
                      new Date(userInfo.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }) || ""
                    }
                  />
                </div>
              </CCol>

              <CCol md="12" xs="12">
                {userInfo?.assigned_sites?.length > 0 && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Assigned Sites</h6>
                    </div>
                    <ul>
                      {userInfo?.assigned_sites?.map((site, index) => (
                        <li
                          style={{ listStyle: "number" }}
                          key={site._id}
                          className="mb-2"
                        >
                          {site.site_id}
                        </li>
                      ))}
                    </ul>

                    {/* <CTable
                bordered
                    hover
                    responsive
                    className="text-center shadow-sm"
                  >
                    <CTableHead color="secondary">
                      <CTableRow>
                        <CTableHeaderCell>Sr No.</CTableHeaderCell>
                        <CTableHeaderCell>Site ID</CTableHeaderCell>
                        <CTableHeaderCell>Assigned At</CTableHeaderCell>
                        <CTableHeaderCell>Assigned By</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {userInfo?.assigned_sites?.map((site, index) => (
                        <CTableRow key={site._id}>
                          <CTableDataCell>
                            <CFormInput
                              type="text"
                              className="form-control"
                              value={index + 1}
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type="text"
                              className="form-control"
                              value={site.site_id}
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type="text"
                              className="form-control"
                              value={new Date(
                                site.assignedAt
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              type="text"
                              className="form-control"
                              value={site.assignedBy?.username}
                            />
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable> */}
                  </>
                )}
              </CCol>
              <CCol md="12" xs="12">
                <div className="mb-3">
                  <CFormLabel className="form-CFormLabel">
                    Auth Token
                  </CFormLabel>
                  <CFormTextarea
                    type="text"
                    className="form-control bg-important"
                    rows={3}
                    name="ds_setup"
                    value={authtoken}
                  ></CFormTextarea>
                </div>
              </CCol>
            </CRow>
          </form>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Profile;
