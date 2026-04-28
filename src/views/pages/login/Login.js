import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Tayprofordarkbg from "../../../assets/brand/logofordarkbg.png";
import Tayproforwhitebg from "../../../assets/brand/logoforwhitebg.png";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, authtoken } = useSelector((state) => state);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let adminroute = "";

  const theme = localStorage.getItem("theme");
  useEffect(() => {
    if (!userInfo && !authtoken) {
      navigate("/login");
    }
    setEmail("");
    setPassword("");
  }, [userInfo, , navigate]);

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const { data } = await axios.post("/api/v1/auth/sign-in", {
  //       email,
  //       password,
  //     });
  //     // ✅ Dispatch to Redux
  //     dispatch({
  //       type: "EMP_SIGNIN",
  //       payload: data.data.user,
  //       token: data.data.token,
  //     });
  //     localStorage.setItem("userInfo", JSON.stringify(data.data.user));
  //     localStorage.setItem("authtoken", JSON.stringify(data.data.token));

  //     if (data.data.user.role === "Master Admin") {
  //       adminroute = "master-admin";
  //     } else if (data.data.user.role === "Service Admin") {
  //       adminroute = "service-admin";
  //     } else if (data.data.user.role === "Project Admin") {
  //       adminroute = "project-admin";
  //     } else if (data.data.user.role === "Client Admin") {
  //       adminroute = "client-admin";
  //     } else if (data.data.user.role === "Site Incharge") {
  //       adminroute = "site-incharge";
  //     } else if (data.data.user.role === "Site Technician") {
  //       adminroute = "site-technician";
  //     } else if (data.data.user.role === "Client Site Technician") {
  //       adminroute = "client-site-technician";
  //     } else if (data.data.user.role === "Master User") {
  //       adminroute = "master-user";
  //     } else if (data.data.user.role === "Service User") {
  //       adminroute = "service-user";
  //     } else if (data.data.user.role === "Project User") {
  //       adminroute = "project-user";
  //     } else if (data.data.user.role === "Opex Client Admin") {
  //       adminroute = "opex-client-admin";
  //     } else if (data.data.user.role === "Opex Site Technician") {
  //       adminroute = "opex-site-technician";
  //     } else if (data.data.user.role === "Sales Admin") {
  //       adminroute = "sales-admin";
  //     } else if (data.data.user.role === "Hr Admin") {
  //       adminroute = "hr-admin";
  //     } else if (data.data.user.role === "Accounts Admin") {
  //       adminroute = "accounts-admin";
  //     } else if (
  //       data.data.user.role ===
  //       "Research And Development And Product Development Admin"
  //     ) {
  //       adminroute = "research-and-development-and-product-development-admin";
  //     } else if (data.data.user.role === "Supply Chain And Logistics Admin") {
  //       adminroute = "supply-chain-and-logistics-admin";
  //     } else if (data.data.user.role === "Production And Operations Admin") {
  //       adminroute = "production-and-operations-admin";
  //     } else if (data.data.user.role === "Quality Admin") {
  //       adminroute = "quality-admin";
  //     } else if (data.data.user.role === "Factory Admin") {
  //       adminroute = "factory-admin";
  //     }

  //     // "Opex Client Admin", "Opex Site Technician"

  //     // toast.success(`Login Successfull!`);
  //     toast.success(`Welcome Back!  ${data.data.user.username}`);
  //     navigate(`/${adminroute}/dashboard`);
  //   } catch (error) {
  //     toast.error(error.response.data.error);
  //   }
  //   setLoading(false);
  // };

  const ROLE_ROUTE_MAP = {
    "Master Admin": "master-admin",
    "Service Admin": "service-admin",
    "Project Admin": "project-admin",
    "Client Admin": "client-admin",
    "Site Incharge": "site-incharge",
    "Site Technician": "site-technician",
    "Client Site Technician": "client-site-technician",
    "Master User": "master-user",
    "Service User": "service-user",
    "Project User": "project-user",
    "Opex Client Admin": "opex-client-admin",
    "Opex Site Technician": "opex-site-technician",
    "Sales Admin": "sales-admin",
    "Hr Admin": "hr-admin",
    "Accounts Admin": "accounts-admin",
    "Research And Development And Product Development Admin":
      "research-and-development-and-product-development-admin",
    "Supply Chain And Logistics Admin": "supply-chain-and-logistics-admin",
    "Production And Operations Admin": "production-and-operations-admin",
    "Quality Admin": "quality-admin",
    "Factory Admin": "factory-admin",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/v1/auth/sign-in",
        { email, password },
        { withCredentials: true }, // ✅ required to send/receive cookies
      );

      const user = data.data.user;

      // ✅ Redux only — no localStorage
      dispatch({ type: "EMP_SIGNIN", payload: user });

      adminroute = ROLE_ROUTE_MAP[user.role];
      if (!adminroute) {
        toast.error("Unknown role. Please contact support.");
        return;
      }

      toast.success(`Welcome Back! ${user.username}`);
      navigate(`/${adminroute}/dashboard`);
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        // backgroundImage:
        //   "url('https://res.cloudinary.com/di0iwc8ql/image/upload/v1724749800/ium0a01kucfsimtbyesq.jpg')",
        backgroundImage:
          "url('https://res.cloudinary.com/decyim6cd/image/upload/v1756550699/profile-image/zue50f0h9pwdebxd745f.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        height: "100vh",
      }}
      className="d-flex flex-column justify-content-center align-items-center min-vh-100"
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={10} md={8} lg={4}>
            <CCardGroup>
              <CCard className="p-3 shadow-lg border-0">
                <CCardBody>
                  {/* ✅ Theme-based Logo */}
                  <div className="text-center mb-3">
                    {theme === "light" ? (
                      <img
                        src={Tayproforwhitebg}
                        alt="Taypro Logo"
                        className=""
                        style={{ height: "80px", width: "auto" }}
                      />
                    ) : (
                      <img
                        src={Tayprofordarkbg}
                        alt="Taypro Logo"
                        className=""
                        style={{ height: "80px", width: "auto" }}
                      />
                    )}
                  </div>

                  <CForm onSubmit={handleLogin} autoComplete="off">
                    <h4 className="text-center mb-4">Login</h4>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <CInputGroupText
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </CInputGroupText>
                    </CInputGroup>

                    {/* ✅ Fixed Disabled Button Condition */}
                    <CRow className="d-flex justify-content-between align-items-center">
                      <CCol xs="6">
                        <CButton
                          color="success"
                          className="px-4"
                          size="sm"
                          type="submit"
                          disabled={!email || !password || loading}
                        >
                          {loading ? <>Logging in...</> : "Login"}
                        </CButton>
                      </CCol>
                      <CCol xs="6" className="text-end">
                        <Link
                          to="/forgot-password"
                          color="link"
                          className="px-0"
                        >
                          Forgot password?
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
