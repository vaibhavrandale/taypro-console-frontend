import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from "@coreui/react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const UpdatePreventiveMaintenance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authtoken = useSelector((state) => state.authtoken);

  // Individual useState for each field
  const [pm_id, setPmId] = useState("");
  const [robot_no, setRobotNo] = useState("");
  const [robot_type, setRobotType] = useState("");
  const [client_name, setClientName] = useState("");
  const [doc_no, setDocNo] = useState("TPL/SR/F-01");
  const [revision_no, setRevisionNo] = useState("");
  const [revised_by, setRevisedBy] = useState("Abhay Singh");
  const [site_location, setSiteLocation] = useState("");
  const [physical_condition_of_transPipe, setPhysicalConditionOfTransPipe] =
    useState({});
  const [physical_condition_of_channel, setPhysicalConditionOfChannel] =
    useState({});
  const [
    physical_condition_of_top_bottom_cover,
    setPhysicalConditionOfTopBottomCover,
  ] = useState({});
  const [oiling_need_for_bearing, setOilingNeedForBearing] = useState({});
  const [oiling_need_for_coupling, setOilingNeedForCoupling] = useState({});
  const [oiling_need_for_motors, setOilingNeedForMotors] = useState({});
  const [alignment, setAlignment] = useState({});
  const [is_wheels_loose, setIsWheelsLoose] = useState("");
  const [is_nutbolt_loose, setIsNutBoltLoose] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [is_delete, setIsDelete] = useState(false);
  const [last_activity, setLastActivity] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await axios.get(
          `/api/v1/preventivemaintenances/${id}`,
          {
            headers: { Authorization: `Bearer ${authtoken}` },
          }
        );
        const data = response.data?.data || {};

        setPmId(data.pm_id || "");
        setRobotNo(data.robot_no || "");
        setRobotType(data.robot_type || "");
        setClientName(data.client_name || "");
        setDocNo(data.doc_no || "TPL/SR/F-01");
        setRevisionNo(data.revision_no || "");
        setRevisedBy(data.revised_by || "Abhay Singh");
        setSiteLocation(data.site_location || "");
        setPhysicalConditionOfTransPipe(
          data.physical_condition_of_transPipe || {}
        );
        setPhysicalConditionOfChannel(data.physical_condition_of_channel || {});
        setPhysicalConditionOfTopBottomCover(
          data.physical_condition_of_top_bottom_cover || {}
        );
        setOilingNeedForBearing(data.oiling_need_for_bearing || {});
        setOilingNeedForCoupling(data.oiling_need_for_coupling || {});
        setOilingNeedForMotors(data.oiling_need_for_motors || {});
        setAlignment(data.alignment || {});
        setIsWheelsLoose(data.is_wheels_loose || "");
        setIsNutBoltLoose(data.is_nutbolt_loose || "");
        setStartDate(data.start_date || "");
        setEndDate(data.end_date || "");
        setIsDelete(data.is_delete || false);
        setLastActivity(data.last_activity || []);

        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchMaintenance();
  }, [id, authtoken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/v1/preventivemaintenances/${id}`,
        {
          pm_id,
          robot_no,
          robot_type,
          client_name,
          doc_no,
          revision_no,
          revised_by,
          site_location,
          physical_condition_of_transPipe,
          physical_condition_of_channel,
          physical_condition_of_top_bottom_cover,
          oiling_need_for_bearing,
          oiling_need_for_coupling,
          oiling_need_for_motors,
          alignment,
          is_wheels_loose,
          is_nutbolt_loose,
          start_date,
          end_date,
        },
        { headers: { Authorization: `Bearer ${authtoken}` } }
      );

      toast.success("Preventive Maintenance updated successfully!");
      navigate("/master-admin/preventive-maintanance-dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to update maintenance"
      );
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error">{error}</p>;

  return (
    <CCard className="max-w-3xl mx-auto p-6 shadow-lg rounded-lg">
      <CCardHeader>
        <h2>Update Preventive Maintenance: {robot_no}</h2>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="gy-3">
            <CCol md={6}>
              <CFormLabel>PM ID</CFormLabel>
              <CFormInput
                value={pm_id}
                onChange={(e) => setPmId(e.target.value)}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Robot No</CFormLabel>
              <CFormInput
                value={robot_no}
                onChange={(e) => setRobotNo(e.target.value)}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Robot Type</CFormLabel>
              <CFormInput
                value={robot_type}
                onChange={(e) => setRobotType(e.target.value)}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Client Name</CFormLabel>
              <CFormInput
                value={client_name}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Site Location</CFormLabel>
              <CFormInput
                value={site_location}
                onChange={(e) => setSiteLocation(e.target.value)}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Start Date</CFormLabel>
              <CFormInput
                type="date"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>End Date</CFormLabel>
              <CFormInput
                type="date"
                value={end_date}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </CCol>
          </CRow>

          <CRow className="gy-3">
            {/* Physical Condition of Transmission Pipe */}
            <CCol md={6}>
              <CFormLabel>Physical Condition of TransPipe</CFormLabel>
              <CFormSelect
                value={physical_condition_of_transPipe.condition || ""}
                onChange={(e) =>
                  setPhysicalConditionOfTransPipe({
                    ...physical_condition_of_transPipe,
                    condition: e.target.value,
                  })
                }
              >
                <option value="">Select Condition</option>
                <option value="Good">Good</option>
                <option value="Needs Repair">Needs Repair</option>
              </CFormSelect>
            </CCol>

            {/* Physical Condition of Channel */}
            <CCol md={6}>
              <CFormLabel>Physical Condition of Channel</CFormLabel>
              <CFormSelect
                value={physical_condition_of_channel.condition || ""}
                onChange={(e) =>
                  setPhysicalConditionOfChannel({
                    ...physical_condition_of_channel,
                    condition: e.target.value,
                  })
                }
              >
                <option value="">Select Condition</option>
                <option value="Good">Good</option>
                <option value="Needs Repair">Needs Repair</option>
              </CFormSelect>
            </CCol>

            {/* Physical Condition of Top/Bottom Cover */}
            <CCol md={6}>
              <CFormLabel>Physical Condition of Top/Bottom Cover</CFormLabel>
              <CFormSelect
                value={physical_condition_of_top_bottom_cover.condition || ""}
                onChange={(e) =>
                  setPhysicalConditionOfTopBottomCover({
                    ...physical_condition_of_top_bottom_cover,
                    condition: e.target.value,
                  })
                }
              >
                <option value="">Select Condition</option>
                <option value="Good">Good</option>
                <option value="Needs Repair">Needs Repair</option>
              </CFormSelect>
            </CCol>

            {/* Oiling Need for Bearings */}
            <CCol md={6}>
              <CFormLabel>Oiling Need for Bearings</CFormLabel>
              <CFormSelect
                value={oiling_need_for_bearing.condition || ""}
                onChange={(e) =>
                  setOilingNeedForBearing({
                    ...oiling_need_for_bearing,
                    condition: e.target.value,
                  })
                }
              >
                <option value="">Select Need</option>
                <option value="Required">Required</option>
                <option value="Not Required">Not Required</option>
              </CFormSelect>
            </CCol>

            {/* Oiling Need for Coupling */}
            <CCol md={6}>
              <CFormLabel>Oiling Need for Coupling</CFormLabel>
              <CFormSelect
                value={oiling_need_for_coupling.condition || ""}
                onChange={(e) =>
                  setOilingNeedForCoupling({
                    ...oiling_need_for_coupling,
                    condition: e.target.value,
                  })
                }
              >
                <option value="">Select Need</option>
                <option value="Required">Required</option>
                <option value="Not Required">Not Required</option>
              </CFormSelect>
            </CCol>

            {/* Oiling Need for Motors */}
            <CCol md={6}>
              <CFormLabel>Oiling Need for Motors</CFormLabel>
              <CFormSelect
                value={oiling_need_for_motors.condition || ""}
                onChange={(e) =>
                  setOilingNeedForMotors({
                    ...oiling_need_for_motors,
                    condition: e.target.value,
                  })
                }
              >
                <option value="">Select Need</option>
                <option value="Required">Required</option>
                <option value="Not Required">Not Required</option>
              </CFormSelect>
            </CCol>

            {/* Alignment */}
            <CCol md={6}>
              <CFormLabel>Alignment</CFormLabel>
              <CFormInput
                type="text"
                value={alignment.mf_clothes || ""}
                placeholder="MF Clothes Condition"
                onChange={(e) =>
                  setAlignment({ ...alignment, mf_clothes: e.target.value })
                }
              />
              <CFormInput
                type="text"
                value={alignment.wheels || ""}
                placeholder="Wheels Condition"
                onChange={(e) =>
                  setAlignment({ ...alignment, wheels: e.target.value })
                }
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Are Wheels Loose?</CFormLabel>
              <CFormSelect
                value={is_wheels_loose}
                onChange={(e) => setIsWheelsLoose(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </CFormSelect>
            </CCol>

            {/* Is Nut Bolt Loose */}
            <CCol md={6}>
              <CFormLabel>Are Nut Bolts Loose?</CFormLabel>
              <CFormSelect
                value={is_nutbolt_loose}
                onChange={(e) => setIsNutBoltLoose(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CButton type="submit" color="primary" className="mt-3">
            Update Maintenance
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default UpdatePreventiveMaintenance;
