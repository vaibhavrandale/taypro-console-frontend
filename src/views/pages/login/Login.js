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
import LoadingSpinner from "../../../components/LoadingSpinner";
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

  const theme = localStorage.getItem("theme");
  useEffect(() => {
    if (!userInfo && !authtoken) {
      navigate("/login");
    }
  }, [userInfo, authtoken, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/v1/auth/sign-in", {
        email,
        password,
      });
      // ✅ Dispatch to Redux
      dispatch({
        type: "EMP_SIGNIN",
        payload: data.data.user,
        token: data.data.token,
      });
      localStorage.setItem("userInfo", JSON.stringify(data.data.user));
      localStorage.setItem("authtoken", JSON.stringify(data.data.token));
      navigate("/user-dashboard");
      // toast.success(`Login Successfull!`);
      toast.success(`Welcome Back!  ${data.data.user.username}`);
    } catch (error) {
      toast.error(error.response.data.error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/di0iwc8ql/image/upload/v1724749800/ium0a01kucfsimtbyesq.jpg')",
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
                    <h2 className="text-center mb-4">Login</h2>

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
                          className="px-4 py-1"
                          type="submit"
                          disabled={!email || !password || loading}
                        >
                          {loading ? (
                            <>
                              Login.... <LoadingSpinner />
                            </>
                          ) : (
                            "Login"
                          )}
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
