import React, { useState } from "react";

const ViewDoc = () => {
  const [formData, setFormData] = useState({
    docNo: "",
    revNo: "",
    date: "",
    pageNo: "",
    approvedBy: "TEJAS HEMANT",
    projectCode: "",
    customerName: "",
    plantLocation: "",
    certificateDate: "",
    certificateNo: "",
    typeOfSystem: "",
    systemCode: "",
    systemQty: "",
    checklistItems: [
      {
        checked: false,
        text: "SYSTEM CONDITION / NO VISIBLE DAMAGE (MECHANICAL)",
      },
      { checked: false, text: "ALL TYRES INFLATED CONDITION (AIR TIGHTNESS)" },
      { checked: false, text: "CHECK BATTERY VOLTAGE" },
      { checked: false, text: "WORKING OF ON/OFF SWITCH" },
      { checked: false, text: "MOVEMENT OF BRUSH / MOTOR" },
      {
        checked: false,
        text: "POSITION OF ALL SUPPORTING WHEELS (TOP SIDE / BOTTOM SIDE)",
      },
      { checked: false, text: "WORKING OF DRIVE TRAIN" },
      { checked: false, text: "WORKING OF REMOTE CONTROL (WITH BATTERIES)" },
      { checked: false, text: "WORKING OF SENSORS (IF APPLY)" },
    ],
    robotSystems: Array(30).fill(""),
    checkedByPar: { sign: "", name: "", designation: "" },
    checkedByReceiver1: { sign: "", name: "", designation: "" },
    checkedByReceiver2: { sign: "", name: "", designation: "" },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChecklistToggle = (index) => {
    const updated = [...formData.checklistItems];
    updated[index].checked = !updated[index].checked;
    setFormData((prev) => ({ ...prev, checklistItems: updated }));
  };

  const handleRobotSystemChange = (index, value) => {
    const updated = [...formData.robotSystems];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, robotSystems: updated }));
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="border-2 border-gray-800">
          <div className="flex items-center justify-between bg-gray-200 border-b-2 border-gray-800 p-3">
            <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2 border-2 border-gray-800 font-bold text-xl">
                <span className="text-blue-600">TEN</span>
                <span className="text-gray-800">PRO</span>
              </div>
              <div className="text-center">
                <div className="font-bold text-sm">
                  SOLAR MODULE DRY CLEANING
                </div>
                <div className="font-bold text-sm">SYSTEM COMMISSIONING</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-gray-800 border-2 border-gray-800 text-xs">
              <div className="bg-white px-2 py-1 font-semibold">DOC NO:</div>
              <div className="bg-white px-2 py-1">
                {formData.docNo || "TP-L"}
              </div>
              <div className="bg-white px-2 py-1 font-semibold">
                REV NO & DATE:
              </div>
              <div className="bg-white px-2 py-1">
                {formData.revNo || "1.1-06-2024"}
              </div>
              <div className="bg-white px-2 py-1 font-semibold">PAGE NO:</div>
              <div className="bg-white px-2 py-1">{formData.pageNo || "1"}</div>
              <div className="bg-white px-2 py-1 font-semibold">
                APPROVED BY:
              </div>
              <div className="bg-white px-2 py-1">{formData.approvedBy}</div>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-2 gap-px bg-gray-800 border-b-2 border-gray-800">
            <div className="flex bg-white">
              <label className="bg-gray-200 px-3 py-2 font-semibold text-sm w-40 border-r border-gray-800">
                PROJECT CODE:
              </label>
              <input
                type="text"
                value={formData.projectCode}
                onChange={(e) =>
                  handleInputChange("projectCode", e.target.value)
                }
                className="flex-1 px-3 py-2 text-sm outline-none"
              />
            </div>
            <div className="flex bg-white border-l-2 border-gray-800">
              <label className="bg-gray-200 px-3 py-2 font-semibold text-sm w-32 border-r border-gray-800">
                DATE:
              </label>
              <input
                type="date"
                value={formData.certificateDate}
                onChange={(e) =>
                  handleInputChange("certificateDate", e.target.value)
                }
                className="flex-1 px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px bg-gray-800 border-b-2 border-gray-800">
            <div className="flex bg-white">
              <label className="bg-gray-200 px-3 py-2 font-semibold text-sm w-40 border-r border-gray-800">
                CUSTOMER NAME:
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  handleInputChange("customerName", e.target.value)
                }
                className="flex-1 px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px bg-gray-800 border-b-2 border-gray-800">
            <div className="flex bg-white">
              <label className="bg-gray-200 px-3 py-2 font-semibold text-sm w-40 border-r border-gray-800">
                PLANT LOCATION:
              </label>
              <input
                type="text"
                value={formData.plantLocation}
                onChange={(e) =>
                  handleInputChange("plantLocation", e.target.value)
                }
                className="flex-1 px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          {/* Certificate Section */}
          <div className="grid grid-cols-1 gap-px bg-gray-800 border-b-2 border-gray-800">
            <div className="flex bg-white">
              <label className="bg-gray-200 px-3 py-2 font-semibold text-sm w-40 border-r border-gray-800">
                CERTIFICATE NO.:
              </label>
              <input
                type="text"
                value={formData.certificateNo}
                onChange={(e) =>
                  handleInputChange("certificateNo", e.target.value)
                }
                className="flex-1 px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="bg-white px-3 py-2 text-xs border-b-2 border-gray-800">
            <p className="font-semibold mb-1">SYSTEM OVERVIEW:</p>
            <p className="text-justify leading-relaxed">
              THE SOLAR MODULE DRY CLEANING ROBOT / SYSTEM IS DESIGNED TO
              EFFICIENTLY CLEAN AND MAINTAIN SOLAR PANELS FOR MAXIMUM
              PERFORMANCE. THIS COMMISSIONING DOCUMENT OUTLINES THE CHECKS AND
              OBSERVATIONS MADE DURING THE COMMISSIONING PROCESS TO ENSURE THE
              SYSTEM OPERATES SAFELY AND EFFECTIVELY.
            </p>
          </div>

          {/* System Details */}
          <div className="grid grid-cols-3 gap-px bg-gray-800 border-b-2 border-gray-800">
            <div className="flex flex-col bg-white">
              <label className="bg-gray-200 px-3 py-2 font-semibold text-sm text-center border-b border-gray-800">
                TYPE OF SYSTEM
              </label>
              <input
                type="text"
                value={formData.typeOfSystem}
                onChange={(e) =>
                  handleInputChange("typeOfSystem", e.target.value)
                }
                className="flex-1 px-3 py-2 text-sm text-center outline-none"
              />
            </div>
            <div className="flex flex-col bg-white border-x-2 border-gray-800">
              <label className="bg-gray-200 px-3 py-2 font-semibold text-sm text-center border-b border-gray-800">
                SYSTEM CODE
              </label>
              <input
                type="text"
                value={formData.systemCode}
                onChange={(e) =>
                  handleInputChange("systemCode", e.target.value)
                }
                className="flex-1 px-3 py-2 text-sm text-center outline-none"
              />
            </div>
            <div className="flex flex-col bg-white">
              <label className="bg-gray-200 px-3 py-2 font-semibold text-sm text-center border-b border-gray-800">
                SYSTEM QTY.
              </label>
              <input
                type="text"
                value={formData.systemQty}
                onChange={(e) => handleInputChange("systemQty", e.target.value)}
                className="flex-1 px-3 py-2 text-sm text-center outline-none"
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-gray-200 px-3 py-2 font-bold text-sm text-center border-b-2 border-gray-800">
            SYSTEM COMMISSIONING CHECK LIST POINT
          </div>

          <div className="bg-white border-b-2 border-gray-800">
            {formData.checklistItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start px-3 py-2 border-b border-gray-300 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-semibold text-sm w-6">
                    {index + 1}.
                  </span>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleChecklistToggle(index)}
                    className="w-4 h-4 mt-0.5 cursor-pointer"
                  />
                  <span className="text-sm flex-1">{item.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Robot/System Numbers Table */}
          <div className="grid grid-cols-6 gap-px bg-gray-800">
            {/* Header Row */}
            <div className="bg-gray-200 px-2 py-2 font-semibold text-xs text-center border-b border-gray-800">
              SR. NO
            </div>
            <div className="bg-gray-200 px-2 py-2 font-semibold text-xs text-center border-b border-gray-800">
              ROBOT / SYSTEM NO
            </div>
            <div className="bg-gray-200 px-2 py-2 font-semibold text-xs text-center border-b border-gray-800">
              SR.NO
            </div>
            <div className="bg-gray-200 px-2 py-2 font-semibold text-xs text-center border-b border-gray-800">
              ROBOT / SYSTEM NO
            </div>
            <div className="bg-gray-200 px-2 py-2 font-semibold text-xs text-center border-b border-gray-800">
              SR.NO
            </div>
            <div className="bg-gray-200 px-2 py-2 font-semibold text-xs text-center border-b border-gray-800">
              ROBOT / SYSTEM NO
            </div>

            {/* Data Rows */}
            {[...Array(10)].map((_, i) => (
              <React.Fragment key={i}>
                {/* Column 1 */}
                <div className="bg-white px-2 py-1.5 text-xs text-center border-b border-gray-300">
                  {i + 1}
                </div>
                <div className="bg-white px-2 py-1.5 border-b border-gray-300">
                  <input
                    type="text"
                    value={formData.robotSystems[i]}
                    onChange={(e) => handleRobotSystemChange(i, e.target.value)}
                    className="w-full text-xs text-center outline-none"
                  />
                </div>
                {/* Column 2 */}
                <div className="bg-white px-2 py-1.5 text-xs text-center border-b border-gray-300">
                  {i + 11}
                </div>
                <div className="bg-white px-2 py-1.5 border-b border-gray-300">
                  <input
                    type="text"
                    value={formData.robotSystems[i + 10]}
                    onChange={(e) =>
                      handleRobotSystemChange(i + 10, e.target.value)
                    }
                    className="w-full text-xs text-center outline-none"
                  />
                </div>
                {/* Column 3 */}
                <div className="bg-white px-2 py-1.5 text-xs text-center border-b border-gray-300">
                  {i + 21}
                </div>
                <div className="bg-white px-2 py-1.5 border-b border-gray-300">
                  <input
                    type="text"
                    value={formData.robotSystems[i + 20]}
                    onChange={(e) =>
                      handleRobotSystemChange(i + 20, e.target.value)
                    }
                    className="w-full text-xs text-center outline-none"
                  />
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-3 gap-px bg-gray-800 border-t-2 border-gray-800">
            {/* Par TenPro */}
            <div className="bg-white">
              <div className="bg-gray-200 px-3 py-2 font-semibold text-xs border-b border-gray-800">
                CHECKED BY,
                <br />
                Par. TENPRO PVT LTD.
              </div>
              <div className="px-3 py-2 space-y-3">
                <div>
                  <label className="text-xs font-semibold">Sign:</label>
                  <div className="border-b border-gray-400 h-12"></div>
                </div>
                <div>
                  <label className="text-xs font-semibold">Name:</label>
                  <input
                    type="text"
                    className="w-full border-b border-gray-400 px-1 py-1 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">DESIGNATION:</label>
                  <input
                    type="text"
                    className="w-full border-b border-gray-400 px-1 py-1 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Receiver 1 */}
            <div className="bg-white border-x-2 border-gray-800">
              <div className="bg-gray-200 px-3 py-2 font-semibold text-xs border-b border-gray-800">
                CHECKED BY,
                <br />
                For RECEIVER
              </div>
              <div className="px-3 py-2 space-y-3">
                <div>
                  <label className="text-xs font-semibold">Sign:</label>
                  <div className="border-b border-gray-400 h-12"></div>
                </div>
                <div>
                  <label className="text-xs font-semibold">Name:</label>
                  <input
                    type="text"
                    className="w-full border-b border-gray-400 px-1 py-1 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">DESIGNATION:</label>
                  <input
                    type="text"
                    className="w-full border-b border-gray-400 px-1 py-1 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Receiver 2 */}
            <div className="bg-white">
              <div className="bg-gray-200 px-3 py-2 font-semibold text-xs border-b border-gray-800">
                CHECKED BY,
                <br />
                For RECEIVER
              </div>
              <div className="px-3 py-2 space-y-3">
                <div>
                  <label className="text-xs font-semibold">Sign:</label>
                  <div className="border-b border-gray-400 h-12"></div>
                </div>
                <div>
                  <label className="text-xs font-semibold">Name:</label>
                  <input
                    type="text"
                    className="w-full border-b border-gray-400 px-1 py-1 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">DESIGNATION:</label>
                  <input
                    type="text"
                    className="w-full border-b border-gray-400 px-1 py-1 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 bg-white rounded-lg p-6 shadow-lg">
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Print Document
            </button>
            <button
              onClick={() => {
                console.log("Form Data:", formData);
                alert("Form data logged to console");
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Save Data
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Reset Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDoc;
