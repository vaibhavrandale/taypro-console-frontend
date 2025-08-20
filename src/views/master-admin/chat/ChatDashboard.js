import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from "react";
import {
  CInputGroup,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import "./chart.css";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import { cilChatBubble, cilLoop, cilSend, cilX } from "@coreui/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_USER_REQUEST":
      return { ...state, usersloading: true, userError: "" };
    case "FETCH_USER_SUCCESS":
      return {
        ...state,
        usersloading: false,
        users: action.payload,
      };
    case "FETCH_USER_FAIL":
      return { ...state, usersloading: false, userError: action.payload };

    case "FETCH_CHAT_REQUEST":
      return { ...state, chatsloading: true, chatError: "" };
    case "FETCH_CHAT_SUCCESS":
      return {
        ...state,
        chatsloading: false,
        chats: action.payload,
      };
    case "FETCH_CHAT_FAIL":
      return {
        ...state,
        chatsloading: false,
        chatError: action.payload,
        subscriptiondata: action.subscriptiondata,
        subscriptionStatus: action.subscriptionStatus,
      };

    case "CREATE_CHAT_REQUEST":
      return { ...state, newchatloading: true, createError: "" };
    case "CREATE_CHAT_SUCCESS":
      return {
        ...state,
        newchatloading: false,
        chat: action.payload,
      };
    case "CREATE_CHAT_FAIL":
      return { ...state, newchatloading: false, createError: action.payload };
    case "NEW_CHAT_REQUEST":
      return {
        ...state,
        sendMessageLoading: true,
        error: "",
      };
    case "NEW_CHAT_SUCCESS":
      return {
        ...state,
        sendMessageLoading: false,
      };
    case "NEW_CHAT_FAIL":
      return { ...state, sendMessageLoading: false, error: "" };
    default:
      return state;
  }
};
export default function ChatDashboard() {
  const [
    {
      usersloading,
      users,
      chats,
      chatsloading,
      newchatloading,
      sendMessageLoading,
      chatError,
      userError,
      createError,
      subscriptiondata,
      subscriptionStatus,
    },
    dispatch,
  ] = useReducer(reducer, {
    users: [],
    chats: [],
    newchatloading: false,
    usersloading: false,
    chatsloading: false,
    createError: "",
    chatError: "",
    userError: "",
    subscriptiondata: {},
    subscriptionStatus: "",
  });
  const [selectedChat, setSelectedChat] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  // const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom of the chat

  const [showUserModal, setShowUserModal] = useState(false);
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);

  const fetchChats = useCallback(async () => {
    dispatch({ type: "FETCH_CHAT_REQUEST" });
    try {
      const result = await axios.get("/api/v1/chats/get-all-chats", {
        headers: { authorization: `Bearer ${authtoken}` },
      });

      dispatch({
        type: "FETCH_CHAT_SUCCESS",
        payload: result.data.data,
      });

      const savedChatId = localStorage.getItem("selectedChatId");
      if (savedChatId) {
        const found = result.data.data.find((chat) => chat._id === savedChatId);
        setSelectedChat(found || result.data.data[0]);
      } else {
        setSelectedChat(result.data.data[0]);
      }
    } catch (error) {
      dispatch({
        type: "FETCH_CHAT_FAIL",
        payload: error.response?.data?.error || error.response?.data?.message,
        subscriptiondata: error.response?.data?.data,
        subscriptionStatus: error.response?.data?.subscriptionStatus,
      });
      toast.error(error.response?.data?.error || error.response?.data?.message);
    }
  }, [authtoken]);

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch({ type: "FETCH_USER_REQUEST" });
      try {
        const result = await axios.get(
          "/api/v1/users/get-all-internal-users-without-pg",

          {
            headers: {
              authorization: `Bearer ${authtoken}`,
            },
          }
        ); // Replace with your API endpoint

        dispatch({
          type: "FETCH_USER_SUCCESS",
          payload: result.data.data,
        });
      } catch (error) {
        dispatch({
          type: "FETCH_USER_FAIL",
          payload: error.response?.data?.error || error.response?.data?.message,
        });
      }
    };

    fetchUsers();
    fetchChats();
  }, [authtoken, fetchChats]); // Runs only once on mount

  const renderLastMessage = (chatArray) => {
    const lastMsg = chatArray[chatArray.length - 1];
    return lastMsg ? lastMsg.message : "No messages yet";
  };

  const formatTimeinUserlist = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);

    localStorage.setItem("selectedChatId", chat._id); // Save selected chat to localStorage
  };

  const CreateChatRoom = async (user) => {
    dispatch({ type: "CREATE_CHAT_REQUEST" });
    try {
      const result = await axios.post(
        "/api/v1/chats",
        { id: user._id },
        {
          headers: { authorization: `Bearer ${authtoken}` },
        }
      );

      dispatch({
        type: "CREATE_CHAT_SUCCESS",
      });

      await fetchChats();

      // 👇 Optionally select the newly created chat
      const newChat = result.data.data; // if your API returns the new chat
      setSelectedChat(newChat);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response.data.error || error.response.data.message
      );
      dispatch({
        type: "CREATE_CHAT_FAIL",
        payload: error.response.data.error || error.response.data.message,
      });
      toast.error(error.response.data.error || error.response.data.message);
    }
  };

  // Scroll to the bottom when the chat is loaded

  const filteredUsers = users.filter(
    (user) =>
      (user.department === "Service" || user.department === "Project") &&
      user.designation !== "Site Technician"
  );

  const sendMessage = async (chat) => {
    dispatch({ type: "NEW_CHAT_REQUEST" });
    try {
      const result = await axios.put(
        `/api/v1/chats/${chat._id}`,
        { message: textMessage },
        {
          headers: { authorization: `Bearer ${authtoken}` },
        }
      );

      dispatch({ type: "NEW_CHAT_SUCCESS" });
      setTextMessage("");

      // Option 1: Refetch chats and update selected chat
      // await fetchChats(); // This updates the whole chat list

      const updatedChat = result.data.data; // Assuming this is the updated chat object
      setSelectedChat(updatedChat); // Update current chat
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch({
        type: "NEW_CHAT_FAIL",
        payload: "Failed to send message",
      });
    }
  };

  useEffect(() => {
    if (selectedChat) {
      // Scroll to the bottom when the chat is selected
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat]);

  // const subscriptionErrors = [
  //   "Subscription expired. Please renew your subscription.",
  //   "Please subscribe to use this feature.",
  //   "Payment for the last invoice is pending. Please complete the payment to continue using the service.",
  // ];

  const checkStatus = [
    "subscriptionSitesAssigned",
    "subscriptionFound",
    "subscriptionaRenewStatus",
    "subscriptionPaymentStatus",
    "subscriptionPlanAccess",
  ];

  return (
    <div>
      {chatsloading || newchatloading ? (
        <LoadingSpinner />
      ) : //  subscriptionErrors.includes(chatError || userError) ? (
      //   <SubscriptionExpiryCard data={subscriptiondata} subscriptionStatus={subscriptionStatus}  error={chatError} />
      // )
      checkStatus.includes(subscriptionStatus) ? (
        <SubscriptionExpiryCard
          data={subscriptiondata}
          subscriptionStatus={subscriptionStatus}
          error={chatError}
        />
      ) : (
        <>
          {(createError || userError || chatError) &&
            (createError || userError || chatError)}
          <CRow>
            <CCol md={4} className="border-end p-3 overflow-auto">
              <div className="border-bottom mx-3 d-flex justify-content-between align-items-center">
                <h5>Chats</h5>
                <CButton
                  className="my-2"
                  size="sm"
                  color="primary"
                  onClick={() => setShowUserModal(true)}
                >
                  New Chat{" "}
                  {/* <CIcon icon={cilPlaylistAdd} className="fw-bold" size="xl" /> */}
                </CButton>
              </div>

              <CModal
                size="lg"
                scrollable
                visible={showUserModal}
                onClose={() => setShowUserModal(false)}
              >
                <CModalHeader closeButton={false}>
                  <CModalTitle>Select a User</CModalTitle>
                  <button
                    type="button"
                    className=" border-0 ms-auto py-0 px-1"
                    onClick={() => setShowUserModal(false)}
                    style={{ background: "none" }}
                  >
                    <CIcon icon={cilX} size="lg" />
                  </button>
                </CModalHeader>
                <CModalBody>
                  {usersloading ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ minHeight: "100px" }}
                    >
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <CTable
                      bordered
                      hover
                      responsive
                      className="text-center bg-important"
                    >
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Profile</CTableHeaderCell>
                          <CTableHeaderCell>Username</CTableHeaderCell>
                          <CTableHeaderCell>Department</CTableHeaderCell>
                          <CTableHeaderCell>Designation</CTableHeaderCell>
                          <CTableHeaderCell>Action</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {filteredUsers.map((user, index) => (
                          <CTableRow key={user._id}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>
                              <img
                                src={user.profile_image}
                                alt="Profile"
                                className="rounded-circle"
                                width="30"
                                height="30"
                                style={{ objectFit: "cover" }}
                              />
                            </CTableDataCell>
                            <CTableDataCell>{user.username}</CTableDataCell>
                            <CTableDataCell>{user.department}</CTableDataCell>
                            <CTableDataCell>{user.designation}</CTableDataCell>
                            <CTableDataCell>
                              <CBadge
                                style={{
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                color="primary"
                                onClick={() => {
                                  CreateChatRoom(user);
                                  setShowUserModal(false);
                                }}
                              >
                                Start Chat &nbsp;
                                <CIcon icon={cilChatBubble} />
                              </CBadge>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  )}
                </CModalBody>
              </CModal>

              <div className="my-2" style={{ maxHeight: "360px" }}>
                {chats
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .map((chat) => {
                    const isLoggedInUserSender =
                      chat.send_user.user_id === userInfo._id;
                    const otherUser = isLoggedInUserSender
                      ? chat.receiver_user
                      : chat.send_user;

                    return (
                      <div
                        key={chat._id}
                        id="chat"
                        className={`p-2 d-flex align-items-center gap-3 cursor-pointer ${
                          selectedChat?._id === chat._id
                            ? "bg-body-secondary rounded text-body-emphasis"
                            : ""
                        }`}
                        onClick={() => handleSelectChat(chat)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={otherUser.profile_image}
                          alt="Profile"
                          className="rounded-circle"
                          width="30"
                          height="30"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold text-truncate">
                            {otherUser.name}
                          </div>
                          <div className="text-truncate small">
                            {renderLastMessage(chat.chat)}
                          </div>
                        </div>
                        <small className="text-nowrap">
                          {formatTimeinUserlist(chat.updatedAt)}
                        </small>
                      </div>
                    );
                  })}
              </div>
            </CCol>

            <CCol md={8} className="d-flex flex-column">
              {selectedChat ? (
                <>
                  <div className="border-bottom p-3 fw-semibold d-flex align-items-center gap-2">
                    {(() => {
                      const isSender =
                        selectedChat.send_user.user_id === userInfo._id;
                      const otherUser = isSender
                        ? selectedChat.receiver_user
                        : selectedChat.send_user;

                      return (
                        <>
                          <img
                            src={otherUser.profile_image}
                            alt="Profile"
                            className="rounded-circle"
                            width="30"
                            height="30"
                            style={{ objectFit: "cover" }}
                          />
                          <span>{otherUser.name}</span>
                        </>
                      );
                    })()}
                  </div>

                  {/* Add chat messages / input section here */}

                  <div
                    className="flex-grow-1 overflow-auto p-3"
                    style={{ maxHeight: "300px", minHeight: "300px" }}
                  >
                    {selectedChat.chat
                      .sort(
                        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                      )
                      .map((msg, idx) => (
                        <div
                          key={idx}
                          className={`d-flex mb-2 ${
                            msg.send_by.email === userInfo.email
                              ? "justify-content-end align-items-end" // Logged-in user's message to the right
                              : "justify-content-start align-items-start" // Other user's message to the left
                          }`}
                        >
                          {/* <CAvatar src={msg.send_by.profile_image} /> */}
                          <img
                            src={msg.send_by.profile_image}
                            alt="Profile"
                            className="rounded-circle"
                            width="30"
                            height="30"
                            style={{ objectFit: "cover", cursor: "pointer" }}
                          />
                          &nbsp;&nbsp;
                          <div
                            className="p-2 border rounded-2"
                            style={{
                              maxWidth: "55%",
                              backgroundColor:
                                msg.send_by.email === userInfo.email
                                  ? "var(--cui-primary-color)" // Right-aligned messages (logged-in user)
                                  : "var(--cui-body-bg)", // Left-aligned messages (other user)
                              color:
                                msg.send_by.email === userInfo.email
                                  ? "var(--cui-primary-color)" // Right-aligned messages (logged-in user)
                                  : "var(--cui-body-color)", // Left-aligned messages (other user)
                            }}
                          >
                            <div>{msg.message}</div>
                            <small
                              className="text-muted d-block text-end"
                              style={{ fontSize: "12px" }}
                            >
                              {formatTime(msg.timestamp)}
                            </small>
                          </div>
                          <div className="d-flex justify-content-end align-items-end">
                            {msg.read ? (
                              <span className="text-success">✔</span>
                            ) : null}
                          </div>
                        </div>
                      ))}

                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-top p-3">
                    <CForm>
                      <CInputGroup>
                        <CFormInput
                          placeholder="Type a message..."
                          value={textMessage}
                          onChange={(e) => setTextMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (!textMessage.trim()) return; // block empty Enter sends
                              sendMessage(selectedChat);
                            }
                          }}
                        />
                        <CButton
                          color="success"
                          disabled={sendMessageLoading || !textMessage.trim()}
                        >
                          {sendMessageLoading ? (
                            <>
                              <LoadingSpinner />
                            </>
                          ) : (
                            <CIcon
                              icon={cilSend}
                              onClick={() => sendMessage(selectedChat)}
                            />
                          )}
                        </CButton>
                        &nbsp;{" "}
                        <CButton
                          color="info"
                          onClick={fetchChats}
                          disabled={chatsloading}
                        >
                          {chatsloading ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            <CIcon icon={cilLoop}></CIcon>
                          )}
                        </CButton>
                      </CInputGroup>
                    </CForm>
                  </div>
                </>
              ) : (
                <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                  <p>Select a chat to start messaging</p>
                </div>
              )}
            </CCol>
          </CRow>
        </>
      )}
    </div>
  );
}
