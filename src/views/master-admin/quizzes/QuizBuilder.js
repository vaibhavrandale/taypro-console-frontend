import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
} from "@coreui/react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  QUESTION_TYPE_OPTIONS,
  QUIZ_AUDIENCE_ROLE_OPTIONS,
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
} from "../../quiz-portal/quizUtils";

const roleToRoute = (role) => {
  if (role === "Master Admin") return "master-admin";
  if (role === "Service Admin") return "service-admin";
  if (role === "Project Admin") return "project-admin";
  return "master-admin";
};

const emptyQuestion = () => ({
  questionType: "MCQ_SINGLE",
  questionText: "",
  description: "",
  marks: 1,
  negativeMarks: 0,
  multiScoringMode: "FORMULA",
  evaluationMode: "AUTO",
  required: true,
  options: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
  ],
  inputConfig: {
    inputType: "number",
    unit: "",
    exactAnswers: [""],
  },
});

const QuizBuilder = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const userInfo = useSelector((s) => s.userInfo);
  const base = `/${roleToRoute(userInfo?.role)}/quizzes`;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    audienceRoles: ["Site Technician"],
    durationMinutes: 30,
    startAt: "",
    endAt: "",
    passingMarks: 0,
    settings: {
      randomQuestions: false,
      randomOptions: false,
      allowBack: true,
      allowChangeAnswer: true,
      showLeaderboard: false,
      detectTabSwitch: false,
      maxViolations: 3,
      autoSubmitOnViolations: false,
    },
  });
  const [questions, setQuestions] = useState([]);
  const [draftQ, setDraftQ] = useState(emptyQuestion());

  useEffect(() => {
    if (!isEdit) return;
    axios
      .get(`/api/v1/quizzes/${id}`, { withCredentials: true })
      .then((r) => {
        const q = r.data.data;
        setForm({
          title: q.title,
          description: q.description || "",
          category: q.category || "",
          audienceRoles: q.audienceRoles || [],
          durationMinutes: q.durationMinutes,
          startAt: toDatetimeLocalValue(q.startAt),
          endAt: toDatetimeLocalValue(q.endAt),
          passingMarks: q.passingMarks || 0,
          settings: { ...form.settings, ...(q.settings || {}) },
        });
        setQuestions(q.questions || []);
      })
      .catch((e) => toast.error(e.response?.data?.message || "Load failed"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const toggleRole = (role) => {
    setForm((f) => ({
      ...f,
      audienceRoles: f.audienceRoles.includes(role)
        ? f.audienceRoles.filter((r) => r !== role)
        : [...f.audienceRoles, role],
    }));
  };

  const saveQuiz = async () => {
    if (!form.audienceRoles.length) {
      toast.error("Select at least one audience role");
      return;
    }
    try {
      setSaving(true);
      const body = {
        ...form,
        startAt: fromDatetimeLocalValue(form.startAt),
        endAt: fromDatetimeLocalValue(form.endAt),
        durationMinutes: Number(form.durationMinutes),
        passingMarks: Number(form.passingMarks),
      };
      if (!body.startAt || !body.endAt) {
        toast.error("Start and end date/time are required");
        return;
      }
      if (new Date(body.endAt) <= new Date(body.startAt)) {
        toast.error("End time must be after start time");
        return;
      }
      if (isEdit) {
        await axios.put(`/api/v1/quizzes/${id}`, body, { withCredentials: true });
        toast.success("Quiz saved");
      } else {
        const { data } = await axios.post("/api/v1/quizzes", body, {
          withCredentials: true,
        });
        toast.success("Quiz created");
        navigate(`${base}/${data.data._id}/edit`);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = async () => {
    if (!isEdit) {
      toast.error("Save quiz first");
      return;
    }
    try {
      const payload = {
        ...draftQ,
        marks: Number(draftQ.marks),
        negativeMarks: Number(draftQ.negativeMarks) || 0,
        options: (draftQ.options || [])
          .filter((o) => o.text?.trim())
          .map((o) => ({ text: o.text, isCorrect: Boolean(o.isCorrect) })),
        inputConfig: {
          ...draftQ.inputConfig,
          exactAnswers: (draftQ.inputConfig?.exactAnswers || []).filter(Boolean),
        },
      };
      const { data } = await axios.post(
        `/api/v1/quizzes/${id}/questions`,
        payload,
        { withCredentials: true },
      );
      setQuestions((qs) => [...qs, data.data]);
      setDraftQ(emptyQuestion());
      toast.success("Question added");
    } catch (e) {
      toast.error(e.response?.data?.message || "Add question failed");
    }
  };

  const removeQuestion = async (qid) => {
    try {
      await axios.delete(`/api/v1/quizzes/${id}/questions/${qid}`, {
        withCredentials: true,
      });
      setQuestions((qs) => qs.filter((q) => q._id !== qid));
      toast.success("Deleted");
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4 className="mb-0">{isEdit ? "Edit quiz" : "Create quiz"}</h4>
        <Link className="btn btn-secondary btn-sm" to={base}>
          Back
        </Link>
      </div>

      <CCard className="mb-3">
        <CCardHeader>Quiz information</CCardHeader>
        <CCardBody>
          <CRow className="g-3">
            <CCol md={6}>
              <label className="form-label">Title</label>
              <CFormInput
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </CCol>
            <CCol md={3}>
              <label className="form-label">Category</label>
              <CFormInput
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </CCol>
            <CCol md={3}>
              <label className="form-label">Duration (minutes)</label>
              <CFormInput
                type="number"
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm({ ...form, durationMinutes: e.target.value })
                }
              />
            </CCol>
            <CCol xs={12}>
              <label className="form-label">Description</label>
              <CFormTextarea
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </CCol>
            <CCol md={4}>
              <label className="form-label">Start</label>
              <CFormInput
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => setForm({ ...form, startAt: e.target.value })}
              />
            </CCol>
            <CCol md={4}>
              <label className="form-label">End</label>
              <CFormInput
                type="datetime-local"
                value={form.endAt}
                onChange={(e) => setForm({ ...form, endAt: e.target.value })}
              />
            </CCol>
            <CCol md={4}>
              <label className="form-label">Passing marks</label>
              <CFormInput
                type="number"
                value={form.passingMarks}
                onChange={(e) =>
                  setForm({ ...form, passingMarks: e.target.value })
                }
              />
            </CCol>
            <CCol xs={12}>
              <label className="form-label">Audience roles (dynamic)</label>
              <div className="d-flex flex-wrap gap-3">
                {QUIZ_AUDIENCE_ROLE_OPTIONS.map((role) => (
                  <CFormCheck
                    key={role}
                    label={role}
                    checked={form.audienceRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                  />
                ))}
              </div>
            </CCol>
            <CCol xs={12} className="d-flex flex-wrap gap-3">
              <CFormCheck
                label="Random question order"
                checked={form.settings.randomQuestions}
                onChange={(e) =>
                  setForm({
                    ...form,
                    settings: {
                      ...form.settings,
                      randomQuestions: e.target.checked,
                    },
                  })
                }
              />
              <CFormCheck
                label="Random option order"
                checked={form.settings.randomOptions}
                onChange={(e) =>
                  setForm({
                    ...form,
                    settings: {
                      ...form.settings,
                      randomOptions: e.target.checked,
                    },
                  })
                }
              />
              <CFormCheck
                label="Detect tab switch"
                checked={form.settings.detectTabSwitch}
                onChange={(e) =>
                  setForm({
                    ...form,
                    settings: {
                      ...form.settings,
                      detectTabSwitch: e.target.checked,
                    },
                  })
                }
              />
              <CFormCheck
                label="Show leaderboard"
                checked={form.settings.showLeaderboard}
                onChange={(e) =>
                  setForm({
                    ...form,
                    settings: {
                      ...form.settings,
                      showLeaderboard: e.target.checked,
                    },
                  })
                }
              />
            </CCol>
          </CRow>
          <CButton
            className="mt-3"
            color="primary"
            disabled={saving}
            onClick={saveQuiz}
          >
            {saving ? "Saving..." : "Save draft"}
          </CButton>
        </CCardBody>
      </CCard>

      {isEdit ? (
        <>
          <h5>Questions ({questions.length})</h5>
          {questions.map((q, i) => (
            <CCard key={q._id} className="mb-2">
              <CCardBody className="d-flex justify-content-between">
                <div>
                  <div className="small text-muted">
                    Q{i + 1} · {q.questionType} · {q.marks} marks
                    {q.questionType === "MCQ_MULTI"
                      ? ` · ${q.multiScoringMode}`
                      : ""}
                  </div>
                  <div>{q.questionText}</div>
                </div>
                <CButton
                  color="danger"
                  variant="outline"
                  size="sm"
                  onClick={() => removeQuestion(q._id)}
                >
                  Delete
                </CButton>
              </CCardBody>
            </CCard>
          ))}

          <CCard className="mt-3">
            <CCardHeader>Add question</CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                <CCol md={4}>
                  <label className="form-label small">Question type</label>
                  <CFormSelect
                    value={draftQ.questionType}
                    onChange={(e) =>
                      setDraftQ({ ...draftQ, questionType: e.target.value })
                    }
                  >
                    {QUESTION_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <label className="form-label small">Marks</label>
                  <CFormInput
                    type="number"
                    min={0}
                    value={draftQ.marks}
                    onChange={(e) =>
                      setDraftQ({ ...draftQ, marks: e.target.value })
                    }
                  />
                </CCol>
                <CCol md={2}>
                  <label className="form-label small">Negative marks</label>
                  <CFormInput
                    type="number"
                    min={0}
                    value={draftQ.negativeMarks}
                    onChange={(e) =>
                      setDraftQ({ ...draftQ, negativeMarks: e.target.value })
                    }
                  />
                </CCol>
                {draftQ.questionType === "MCQ_MULTI" ? (
                  <CCol md={4}>
                    <label className="form-label small">Multi scoring</label>
                    <CFormSelect
                      value={draftQ.multiScoringMode}
                      onChange={(e) =>
                        setDraftQ({
                          ...draftQ,
                          multiScoringMode: e.target.value,
                          evaluationMode:
                            e.target.value === "MANUAL" ? "MANUAL" : "AUTO",
                        })
                      }
                    >
                      <option value="FORMULA">Partial formula</option>
                      <option value="MANUAL">Manual evaluation</option>
                    </CFormSelect>
                  </CCol>
                ) : null}
                <CCol xs={12}>
                  <CFormInput
                    placeholder="Question text"
                    value={draftQ.questionText}
                    onChange={(e) =>
                      setDraftQ({ ...draftQ, questionText: e.target.value })
                    }
                  />
                </CCol>
                {["MCQ_SINGLE", "MCQ_MULTI"].includes(draftQ.questionType)
                  ? draftQ.options.map((o, idx) => (
                      <CCol xs={12} key={idx} className="d-flex gap-2">
                        <CFormInput
                          placeholder={`Option ${idx + 1}`}
                          value={o.text}
                          onChange={(e) => {
                            const options = [...draftQ.options];
                            options[idx] = { ...o, text: e.target.value };
                            setDraftQ({ ...draftQ, options });
                          }}
                        />
                        <CFormCheck
                          label="Correct"
                          checked={o.isCorrect}
                          onChange={(e) => {
                            let options = [...draftQ.options];
                            if (draftQ.questionType === "MCQ_SINGLE") {
                              options = options.map((opt, i) => ({
                                ...opt,
                                isCorrect: i === idx ? e.target.checked : false,
                              }));
                            } else {
                              options[idx] = {
                                ...o,
                                isCorrect: e.target.checked,
                              };
                            }
                            setDraftQ({ ...draftQ, options });
                          }}
                        />
                      </CCol>
                    ))
                  : null}
                {["MCQ_SINGLE", "MCQ_MULTI"].includes(draftQ.questionType) ? (
                  <CCol xs={12}>
                    <CButton
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setDraftQ({
                          ...draftQ,
                          options: [
                            ...draftQ.options,
                            { text: "", isCorrect: false },
                          ],
                        })
                      }
                    >
                      + Option
                    </CButton>
                  </CCol>
                ) : null}
                {draftQ.questionType === "INPUT" ? (
                  <>
                    <CCol md={3}>
                      <CFormSelect
                        value={draftQ.inputConfig.inputType}
                        onChange={(e) =>
                          setDraftQ({
                            ...draftQ,
                            inputConfig: {
                              ...draftQ.inputConfig,
                              inputType: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="decimal">Decimal</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}>
                      <CFormInput
                        placeholder="Unit"
                        value={draftQ.inputConfig.unit}
                        onChange={(e) =>
                          setDraftQ({
                            ...draftQ,
                            inputConfig: {
                              ...draftQ.inputConfig,
                              unit: e.target.value,
                            },
                          })
                        }
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        placeholder="Exact answer (auto score)"
                        value={draftQ.inputConfig.exactAnswers?.[0] || ""}
                        onChange={(e) =>
                          setDraftQ({
                            ...draftQ,
                            inputConfig: {
                              ...draftQ.inputConfig,
                              exactAnswers: [e.target.value],
                            },
                          })
                        }
                      />
                    </CCol>
                  </>
                ) : null}
              </CRow>
              <CButton className="mt-3" color="success" onClick={addQuestion}>
                Add question
              </CButton>
            </CCardBody>
          </CCard>
        </>
      ) : null}
    </div>
  );
};

export default QuizBuilder;
