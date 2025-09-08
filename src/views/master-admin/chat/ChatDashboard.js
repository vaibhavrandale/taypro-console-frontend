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
import { cilArrowLeft, cilChatBubble, cilSend, cilX } from "@coreui/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";
import socket from "../../../components/Socket";

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
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom of the chat
  const [showUserModal, setShowUserModal] = useState(false);
  const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showChatWindow, setShowChatWindow] = useState(false);

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

  useEffect(() => {
    socket.on("updateOnlineUsers", (users) => {
      console.log(users);
      setOnlineUsers(users);
    });

    return () => {
      socket.off("updateOnlineUsers");
      socket.disconnect();
    };
  }, []);

  const isUserOnline = (userId) => onlineUsers.some((u) => u.id === userId);

  useEffect(() => {
    if (!userInfo?._id) return;

    const user = {
      _id: userInfo._id,
      username: userInfo.username,
      email: userInfo.email,
      profile_image: userInfo.profile_image,
    };

    const handleConnect = () => {
      socket.emit("join", user);
      console.log("✅ Joined socket as:", user.username);
    };

    // Always attach listener
    socket.on("connect", handleConnect);

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [userInfo]);

  useEffect(() => {
    if (chats.length > 0) {
      chats.forEach((chat) => {
        socket.emit("joinRoom", chat._id);
      });
    }
  }, [chats]);

  const handleChatClick = (chat) => {
    handleSelectChat(chat);
    if (window.innerWidth < 768) {
      setShowChatWindow(true);
    }
  };

  // Go back to list on mobile
  const handleBack = () => {
    setShowChatWindow(false);
  };

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
    localStorage.setItem("selectedChatId", chat._id);

    socket.emit("joinRoom", chat._id);
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
    (user) => user.designation !== "Site Technician"
  );

  const sendMessage = (chat) => {
    if (!textMessage.trim()) return;

    dispatch({ type: "NEW_CHAT_REQUEST" });

    // 1. Optimistic update
    const newMsg = {
      send_by: {
        name: userInfo.username,
        email: userInfo.email,
        profile_image: userInfo.profile_image,
      },
      message: textMessage,
      timestamp: new Date(),
    };

    setSelectedChat((prev) => ({
      ...prev,
      chat: [...prev.chat, newMsg],
    }));

    setTextMessage("");

    // 2. Emit to backend
    socket.emit("sendMessage", {
      chatId: chat._id,
      message: textMessage,
      user: userInfo,
    });

    dispatch({ type: "NEW_CHAT_SUCCESS" });
  };

  useEffect(() => {
    socket.on("receiveMessage", ({ chatId, message }) => {
      if (message.send_by.email === userInfo.email) return; // ignore own message
      setSelectedChat((prev) => {
        if (!prev || prev._id !== chatId) return prev;
        return { ...prev, chat: [...prev.chat, message] };
      });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      // Scroll to the bottom when the chat is selected
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat]);

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
      ) : checkStatus.includes(subscriptionStatus) ? (
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
            {/* Chat List */}
            <CCol
              md={4}
              className={`border-end p-3 overflow-auto ${
                showChatWindow ? "d-none d-md-block" : "d-block"
              }`}
            >
              <div className="border-bottom mx-3 d-flex justify-content-between align-items-center">
                <h5>Chats</h5>
                <CButton
                  className="my-2"
                  size="sm"
                  color="primary"
                  onClick={() => setShowUserModal(true)}
                >
                  New Chat{" "}
                </CButton>
              </div>

              {/* User Modal */}
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
                    <CTable bordered hover responsive className="text-center">
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

              {/* Chats list */}
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
                        className={`p-2 d-flex align-items-center gap-3 ${
                          selectedChat?._id === chat._id
                            ? "bg-body-secondary rounded"
                            : ""
                        }`}
                        onClick={() => handleChatClick(chat)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="position-relative">
                          <img
                            src={otherUser.profile_image}
                            alt="Profile"
                            className="rounded-circle"
                            width="30"
                            height="30"
                            style={{ objectFit: "cover" }}
                          />
                          {isUserOnline(otherUser.user_id) && (
                            <span
                              style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                width: "10px",
                                height: "10px",
                                backgroundColor: "green",
                                borderRadius: "50%",
                                border: "2px solid white",
                              }}
                            />
                          )}
                        </div>
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

            {/* Chat Window */}
            <CCol
              md={8}
              className={`d-flex flex-column ${
                showChatWindow ? "d-block" : "d-none d-md-flex"
              }`}
            >
              {selectedChat ? (
                <>
                  <div className="border-bottom p-3 fw-semibold d-flex align-items-center gap-2">
                    {/* Back button for mobile */}
                    <button
                      type="button"
                      className="border-0 d-md-none p-0 me-2"
                      onClick={handleBack}
                      style={{ background: "none" }}
                    >
                      <CIcon icon={cilArrowLeft} size="lg" />
                    </button>

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
                          <div>
                            <div>{otherUser.name}</div>
                            <small
                              className={`${
                                isUserOnline(otherUser.user_id)
                                  ? "text-success"
                                  : "text-muted"
                              }`}
                            >
                              {isUserOnline(otherUser.user_id)
                                ? "Online"
                                : "Offline"}
                            </small>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Messages */}
                  <div
                    className="flex-grow-1 overflow-auto p-3"
                    style={
                      window.innerWidth <= 767
                        ? {
                            minHeight: "calc(100vh - 140px)", // full screen minus header + input
                            maxHeight: "calc(100vh - 140px)",
                          }
                        : {
                            minHeight: "300px",
                            maxHeight: "300px",
                          }
                    }
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
                              ? "justify-content-end"
                              : "justify-content-start"
                          }`}
                        >
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
                                  ? "var(--cui-primary-color)"
                                  : "var(--cui-body-bg)",
                              color:
                                msg.send_by.email === userInfo.email
                                  ? "#fff"
                                  : "var(--cui-body-color)",
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
                        </div>
                      ))}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  {/* Input for Desktop/Tablet */}
                  <div className="border-top p-3 d-none d-md-block">
                    <CForm>
                      <CInputGroup>
                        <CFormInput
                          placeholder="Type a message..."
                          value={textMessage}
                          onChange={(e) => setTextMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (!textMessage.trim()) return;
                              sendMessage(selectedChat);
                            }
                          }}
                        />
                        <CButton
                          color="success"
                          disabled={sendMessageLoading || !textMessage.trim()}
                        >
                          {sendMessageLoading ? (
                            <LoadingSpinner />
                          ) : (
                            <CIcon
                              icon={cilSend}
                              onClick={() => sendMessage(selectedChat)}
                            />
                          )}
                        </CButton>
                      </CInputGroup>
                    </CForm>
                  </div>

                  {/* Input for Mobile (fixed at bottom) */}
                  <div
                    className="d-md-none position-fixed start-0 end-0 bg-dark border-top p-2"
                    style={{
                      bottom: 0,
                      left: 0,
                      right: 0,
                      zIndex: 1030,
                      margin: 0,
                      paddingBottom: "env(safe-area-inset-bottom, 0px)", // handles iOS notch too
                    }}
                  >
                    <CForm style={{ margin: 0 }}>
                      <CInputGroup>
                        <CFormInput
                          placeholder="Type a message..."
                          value={textMessage}
                          onChange={(e) => setTextMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (!textMessage.trim()) return;
                              sendMessage(selectedChat);
                            }
                          }}
                          style={{ margin: 0 }}
                        />
                        <CButton
                          color="success"
                          disabled={sendMessageLoading || !textMessage.trim()}
                        >
                          {sendMessageLoading ? (
                            <LoadingSpinner />
                          ) : (
                            <CIcon
                              icon={cilSend}
                              onClick={() => sendMessage(selectedChat)}
                            />
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
