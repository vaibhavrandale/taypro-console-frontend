import React from "react";
import { useSelector } from "react-redux";
import { CCard, CCardBody, CCardImage, CCol, CRow } from "@coreui/react";
import LastActivity from "../../../components/LastActivity";

const Profile = () => {
  const userInfo = useSelector((state) => state.userInfo);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const isInternal = userInfo.type?.toLowerCase() === "internal";

  return (
    <div className="d-flex justify-content-center">
      <CCard className="shadow-lg w-100 w-md-75 ">
        {/* Header */}
        <div className="bg-primary text-white text-center py-3  mb-3">
          <h5 className="mb-0 text-uppercase">Profile Summary</h5>
        </div>

        {/* Responsive Layout */}
        <CRow className="g-0 flex-column flex-md-row align-items-start">
          {/* Profile Image */}
          <CCol xs={12} md={4} className="text-center mb-4 mb-md-0">
            <div
              className="border border-dark rounded-circle overflow-hidden mx-auto"
              style={{ width: "180px", height: "180px" }}
            >
              <CCardImage
                src={userInfo.profile_image}
                alt="User"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>
          </CCol>

          {/* Info */}
          <CCol xs={12} md={8}>
            <CCardBody className="pt-0">
              <div className="text-start" style={{ fontSize: "14px" }}>
                {/* Common Fields */}
                <CRow className="mb-2">
                  <CCol xs={5}>
                    <strong>Name</strong>
                  </CCol>
                  <CCol xs={7}>{userInfo.username}</CCol>
                </CRow>

                <CRow className="mb-2">
                  <CCol xs={5}>
                    <strong>Role</strong>
                  </CCol>
                  <CCol xs={7}>{userInfo.role}</CCol>
                </CRow>

                <CRow className="mb-2">
                  <CCol xs={5}>
                    <strong>Email</strong>
                  </CCol>
                  <CCol xs={7}>{userInfo.email}</CCol>
                </CRow>

                <CRow className="mb-2">
                  <CCol xs={5}>
                    <strong>User ID</strong>
                  </CCol>
                  <CCol xs={7}>{userInfo._id}</CCol>
                </CRow>

                <CRow className="mb-2">
                  <CCol xs={5}>
                    <strong>Created</strong>
                  </CCol>
                  <CCol xs={7}>{formatDate(userInfo.createdAt)}</CCol>
                </CRow>

                {/* Internal Users – Extra Fields */}
                {isInternal && (
                  <>
                    <CRow className="mb-2">
                      <CCol xs={5}>
                        <strong>Salutation</strong>
                      </CCol>
                      <CCol xs={7}>{userInfo.salutation || "N/A"}</CCol>
                    </CRow>
                    <CRow className="mb-2">
                      <CCol xs={5}>
                        <strong>Department</strong>
                      </CCol>
                      <CCol xs={7}>{userInfo.department || "N/A"}</CCol>
                    </CRow>
                    <CRow className="mb-2">
                      <CCol xs={5}>
                        <strong>Designation</strong>
                      </CCol>
                      <CCol xs={7}>{userInfo.designation || "N/A"}</CCol>
                    </CRow>
                    <CRow className="mb-2">
                      <CCol xs={5}>
                        <strong>Phone</strong>
                      </CCol>
                      <CCol xs={7}>{userInfo.phone || "N/A"}</CCol>
                    </CRow>
                    <CRow className="mb-2">
                      <CCol xs={5}>
                        <strong>Employee ID</strong>
                      </CCol>
                      <CCol xs={7}>{userInfo.employee_id || "N/A"}</CCol>
                    </CRow>
                    <CRow className="mb-2">
                      <CCol xs={5}>
                        <strong>Last Login</strong>
                      </CCol>
                      <CCol xs={7}>
                        {userInfo.last_login
                          ? new Date(userInfo.last_login).toLocaleString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              }
                            )
                          : "N/A"}
                      </CCol>
                    </CRow>
                  </>
                )}
              </div>
              {/* Assigned Sites (if any) */}
              {userInfo?.assigned_sites?.length > 0 && (
                <>
                  <hr className="my-3" />
                  <div className="text-start mb-2 fw-bold">Assigned Sites</div>
                  <ol className="ps-3 mb-0 small">
                    {userInfo.assigned_sites.map((site) => (
                      <li key={site._id} className="mb-1">
                        {site.site_id}
                      </li>
                    ))}
                  </ol>
                </>
              )}{" "}
              <LastActivity lastactivity={userInfo.last_activity} />
            </CCardBody>
          </CCol>
        </CRow>
      </CCard>
    </div>
  );
};

export default Profile;
