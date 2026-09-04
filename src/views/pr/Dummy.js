import { CBadge, CCard, CCardBody, CCol, CImage, CRow } from "@coreui/react";
import axios from "axios";
import { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

const App = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, SetLoading] = useState(false);
  const searchUser = async (query) => {
    try {
      SetLoading(true);
      const res = await axios.post(
        "/api/v1/users/search",
        {},
        {
          params: {
            query,
          },
          withCredentials: true,
        },
      );
      setError(null);
      setUsers(res.data.data);
      SetLoading(false);
    } catch (error) {
      setError(
        error.response.data.error ||
          error.response.data.message ||
          "An error occurred while searching users.",
      );
      console.error("Error searching users:", error);
      SetLoading(false);
    }
  };

  const userCard = (user) => {
    return (
      <CCol key={user._id} xs={12} sm={6} md={3} lg={3} className="">
        <CCard className=" border-0 shadow-sm h-100">
          <CCardBody>
            <div className="d-flex justify-content-center align-items-center mb-2 border-bottom p-2">
              <CImage
                src={user.profile_image}
                height={100}
                width={100}
                style={{ objectFit: "cover", borderRadius: "50%" }}
                alt={user.username}
                className="border "
              />
            </div>
            <div className="d-flex flex-column justify-content-start gap-1">
              <span className="text-small shadow-lg">Email : {user.email}</span>
              <span className="text-small shadow-lg">
                Name : {user.username}
              </span>
              <span className="text-small shadow-lg">Role : {user.role}</span>
              {user.role === "Site Technician" ? (
                <span className="text-small shadow-lg">
                  Sites :
                  {user.assigned_sites && user.assigned_sites.length > 0
                    ? user.assigned_sites.map((site) => (
                        <span
                          key={site.site_id}
                          className="ms-1 badge bg-warning text-white"
                        >
                          {site.site_id}
                        </span>
                      ))
                    : "No assigned sites"}
                </span>
              ) : null}

              <span className="text-small shadow-lg">
                Login :{" "}
                {user.last_login ? (
                  new Date(user.last_login).toLocaleString()
                ) : (
                  <CBadge color="secondary">Never</CBadge>
                )}
              </span>

              <CBadge color={user.is_active ? "success" : "danger"}>
                {user.is_active ? "Active" : "Inactive"}
              </CBadge>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    );
  };

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  return (
    <>
      <h3>Users: {users.length}</h3>
      <input
        type="text"
        placeholder="Search users..."
        onChange={debounce((e) => searchUser(e.target.value), 500)}
        className="my-2"
      />
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-danger">Error: {error}</p>
      ) : users.length > 0 ? (
        <CRow className="g-3 my-2">{users.map((user) => userCard(user))}</CRow>
      ) : (
        <p className="text-muted">No users found.</p>
      )}
    </>
  );
};

export default App;
