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
  CImage,
} from "@coreui/react";
import "./chart.css";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CIcon from "@coreui/icons-react";
import {
  cilArrowLeft,
  cilChatBubble,
  cilPaperclip,
  cilSend,
  cilX,
} from "@coreui/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import SubscriptionExpiryCard from "../../../components/SubscriptionExpiryCard";
import socket from "../../../components/Socket";
import PdfIcon from "../../../assets/images/pdf.png";

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
    case "UPLOAD_CHAT_ATTACHMENT_REQUEST":
      return {
        ...state,
        chatAttachmentUploadLoading: true,
        chatAttachmentUploadError: "",
      };
    case "UPLOAD_CHAT_ATTACHMENT_SUCCESS":
      return {
        ...state,
        chatAttachmentUploadLoading: false,
        chatAttachmentUploadError: "",
      };
    case "UPLOAD_CHAT_ATTACHMENT_FAIL":
      return {
        ...state,
        chatAttachmentUploadLoading: false,
        chatAttachmentUploadError: action.payload,
      };
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
      chatAttachmentUploadLoading,
      chatAttachmentUploadError,
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
    chatAttachmentUploadLoading: false,
    chatAttachmentUploadError: "",
  });
  const [selectedChat, setSelectedChat] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom of the chat
  const [showUserModal, setShowUserModal] = useState(false);
  // const authtoken = useSelector((state) => state.authtoken);
  const userInfo = useSelector((state) => state.userInfo);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [chatAttachment, setChatAttachment] = useState({
    file: "", //url
    type: "", //pdf,img,other
  });

  // function to count unread messages for a specific chat
  const getUnreadMessageCount = useCallback(
    (chat) => {
      if (!chat || !chat.chat) return 0;

      return chat.chat.filter(
        (message) =>
          message.send_by.email !== userInfo.email &&
          !message.read_status &&
          message._id,
      ).length;
    },
    [userInfo.email],
  );

  const fetchChats = useCallback(async () => {
    dispatch({ type: "FETCH_CHAT_REQUEST" });
    try {
      const result = await axios.get("/api/v1/chats/get-all-chats", {
        // headers: { authorization: `Bearer ${authtoken}` },
        withCredentials: true,
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
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch({ type: "FETCH_USER_REQUEST" });
      try {
        const result = await axios.get(
          "/api/v1/users/get-all-internal-users-without-pg",

          {
            // headers: {
            //   authorization: `Bearer ${authtoken}`,
            // },
            withCredentials: true,
          },
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
  }, [fetchChats]); // Runs only once on mount

  useEffect(() => {
    socket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("updateOnlineUsers");
      socket.disconnect();
    };
  }, []);

  const isUserOnline = (userId) =>
    onlineUsers.some((u) => u.id === userId && u.socketIds.length > 0);

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
          // headers: { authorization: `Bearer ${authtoken}` },
          withCredentials: true,
        },
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
        error.response.data.error || error.response.data.message,
      );
      dispatch({
        type: "CREATE_CHAT_FAIL",
        payload: error.response.data.error || error.response.data.message,
      });
      toast.error(error.response.data.error || error.response.data.message);
    }
  };

  const filteredUsers = users.filter(
    (user) => user.designation !== "Site Technician",
  );

  // const sendMessage = (chat) => {
  //   if (!textMessage.trim()) return;
  //   dispatch({ type: "NEW_CHAT_REQUEST" });

  //   // 1. Optimistically add to UI
  //   const newMsgId = `tmp-${Date.now()}`;
  //   let newMsg = {};

  //   newMsg = {
  //     _id: newMsgId,
  //     send_by: {
  //       name: userInfo.username,
  //       email: userInfo.email,
  //       profile_image: userInfo.profile_image,
  //     },
  //     message: textMessage,
  //     timestamp: new Date(),
  //     read_status: false,
  //     read_by: null,
  //   };

  //   setSelectedChat((prev) => ({
  //     ...prev,
  //     chat: [...prev.chat, newMsg],
  //   }));

  //   // **ADD THIS**: Also update the chats array optimistically
  //   dispatch({
  //     type: "FETCH_CHAT_SUCCESS",
  //     payload: chatsRef.current.map((c) =>
  //       c._id === chat._id
  //         ? {
  //             ...c,
  //             chat: [...c.chat, newMsg],
  //             updatedAt: new Date(),
  //           }
  //         : c
  //     ),
  //   });

  //   setTextMessage("");

  //   // 2. Emit to backend

  //   socket.emit("sendMessage", {
  //     chatId: chat._id,
  //     message: textMessage,
  //     attachment: { file: "", type: "" },
  //     user: userInfo,
  //   });

  //   dispatch({ type: "NEW_CHAT_SUCCESS" });
  // };

  const sendMessage = (chat) => {
    if (!textMessage.trim() && !chatAttachment.file) return;
    dispatch({ type: "NEW_CHAT_REQUEST" });

    // 1. Optimistically add to UI
    const newMsgId = `tmp-${Date.now()}`;
    let newMsg = {};

    // Create message structure that matches both text and attachments
    newMsg = {
      _id: newMsgId,
      send_by: {
        name: userInfo.username,
        email: userInfo.email,
        profile_image: userInfo.profile_image,
      },
      message: textMessage,
      attachment: chatAttachment.file ? chatAttachment : { file: "", type: "" },
      timestamp: new Date(),
      read_status: false,
      read_by: null,
    };

    setSelectedChat((prev) => ({
      ...prev,
      chat: [...prev.chat, newMsg],
    }));

    // Update chats array optimistically
    dispatch({
      type: "FETCH_CHAT_SUCCESS",
      payload: chatsRef.current.map((c) =>
        c._id === chat._id
          ? {
              ...c,
              chat: [...c.chat, newMsg],
              updatedAt: new Date(),
            }
          : c,
      ),
    });

    setTextMessage("");
    setChatAttachment({ file: "", type: "" });

    // 2. Emit to backend
    socket.emit("sendMessage", {
      chatId: chat._id,
      message: textMessage,
      attachment: chatAttachment,
      user: userInfo,
    });

    dispatch({ type: "NEW_CHAT_SUCCESS" });
  };

  useEffect(() => {
    socket.on("receiveMessage", ({ chatId, message }) => {
      if (message.send_by.email === userInfo.email) {
        // Handle own messages (optimistic updates)
        setSelectedChat((prev) => {
          if (!prev || prev._id !== chatId) return prev;
          const updatedChat = prev.chat.map((msg) => {
            const isOptimistic =
              msg.send_by.email === userInfo.email &&
              msg.message === message.message &&
              Math.abs(new Date(msg.timestamp) - new Date(message.timestamp)) <
                2000;
            return isOptimistic ? message : msg;
          });
          return { ...prev, chat: updatedChat };
        });

        // ipdate chats array for own messages
        dispatch({
          type: "FETCH_CHAT_SUCCESS",
          payload: chatsRef.current.map((chat) =>
            chat._id === chatId
              ? {
                  ...chat,
                  chat: chat.chat.map((msg) => {
                    const isOptimistic =
                      msg.send_by.email === userInfo.email &&
                      msg.message === message.message &&
                      Math.abs(
                        new Date(msg.timestamp) - new Date(message.timestamp),
                      ) < 2000;
                    return isOptimistic ? message : msg;
                  }),
                  updatedAt: message.timestamp,
                }
              : chat,
          ),
        });
        return;
      }

      // handle messages from other users
      setSelectedChat((prev) => {
        if (!prev || prev._id !== chatId) return prev;
        return { ...prev, chat: [...prev.chat, message] };
      });

      // update chats array for messages from other users
      dispatch({
        type: "FETCH_CHAT_SUCCESS",
        payload: chatsRef.current.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                chat: [...chat.chat, message],
                updatedAt: message.timestamp,
              }
            : chat,
        ),
      });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userInfo, dispatch]);

  const chatsRef = useRef(chats);
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  // const handleMessagesRead = ({ chatId, updates }) => {
  //   setSelectedChat((prev) => {
  //     if (!prev || prev._id !== chatId) return prev;
  //     const updatedChat = prev.chat.map((m) => {
  //       const update = updates.find(
  //         (u) => String(u.messageId) === String(m._id)
  //       );
  //       return update
  //         ? { ...m, read_status: true, read_by: update.read_by }
  //         : m;
  //     });
  //     return { ...prev, chat: updatedChat };
  //   });

  //   const updatedChats = chatsRef.current.map((c) =>
  //     c._id === chatId
  //       ? {
  //           ...c,
  //           chat: c.chat.map((m) => {
  //             const update = updates.find(
  //               (u) => String(u.messageId) === String(m._id)
  //             );
  //             return update
  //               ? { ...m, read_status: true, read_by: update.read_by }
  //               : m;
  //           }),
  //         }
  //       : c
  //   );

  //   dispatch({
  //     type: "FETCH_CHAT_SUCCESS",
  //     payload: updatedChats,
  //   });
  // };

  const handleMessagesRead = useCallback(
    ({ chatId, updates }) => {
      console.log("📨 Received messagesRead event:", { chatId, updates });

      setSelectedChat((prev) => {
        if (!prev || prev._id !== chatId) return prev;
        const updatedChat = prev.chat.map((m) => {
          const update = updates.find(
            (u) => String(u.messageId) === String(m._id),
          );
          return update
            ? { ...m, read_status: true, read_by: update.read_by }
            : m;
        });
        return { ...prev, chat: updatedChat };
      });

      // Update the chats array using functional update
      dispatch((prevState) => ({
        type: "FETCH_CHAT_SUCCESS",
        payload: prevState.chats.map((c) =>
          c._id === chatId
            ? {
                ...c,
                chat: c.chat.map((m) => {
                  const update = updates.find(
                    (u) => String(u.messageId) === String(m._id),
                  );
                  return update
                    ? { ...m, read_status: true, read_by: update.read_by }
                    : m;
                }),
              }
            : c,
        ),
      }));
    },
    [dispatch],
  ); // Add dispatch as dependency

  useEffect(() => {
    socket.on("messagesRead", handleMessagesRead);
    return () => socket.off("messagesRead", handleMessagesRead);
  }, [handleMessagesRead]); // Include handleMessagesRead as dependency

  const handleTyping = (e) => {
    setTextMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { chatId: selectedChat._id, user: userInfo });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stopTyping", { chatId: selectedChat._id, user: userInfo });
    }, 1000); // user stopped typing after 1 second of inactivity
  };

  useEffect(() => {
    socket.on("userTyping", ({ chatId, user }) => {
      if (selectedChat?._id === chatId && user.email !== userInfo.email) {
        setOtherTyping(true);
      }
    });
    socket.on("userStopTyping", ({ chatId, user }) => {
      if (selectedChat?._id === chatId && user.email !== userInfo.email) {
        setOtherTyping(false);
      }
    });
    return () => {
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [selectedChat, userInfo.email]);

  useEffect(() => {
    if (!selectedChat) return;

    const shouldMarkAsRead = window.innerWidth >= 768 || showChatWindow;

    if (shouldMarkAsRead) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

      const unreadIds = selectedChat.chat
        .filter(
          (m) => m.send_by.email !== userInfo.email && !m.read_status && m._id,
        )
        .map((m) => m._id);

      if (unreadIds.length > 0) {
        socket.emit("markMessagesRead", {
          chatId: selectedChat._id,
          messageIds: unreadIds,
          user: userInfo,
        });
      }
    }
  }, [selectedChat, userInfo, showChatWindow]); // Add showChatWindow to dependencies

  // const handleChatAttachment = async (e, chat) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const bodyFormData = new FormData();
  //   bodyFormData.append("file", file);

  //   try {
  //     dispatch({ type: "UPLOAD_CHAT_ATTACHMENT_REQUEST" });
  //     const { data } = await axios.post(
  //       "/api/v1/image-upload/chat-attachment",
  //       bodyFormData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${authtoken}`,
  //         },
  //       }
  //     );

  //     dispatch({ type: "UPLOAD_CHAT_ATTACHMENT_SUCCESS" });

  //     // Create the new attachment object
  //     const newAttachment = { file: data.url, type: file.type };
  //     setChatAttachment(newAttachment);

  //     toast.success("The file uploaded successfully");

  //     if (!newAttachment) return;

  //     dispatch({ type: "NEW_CHAT_REQUEST" });

  //     const newMsgId = `tmp-${Date.now()}`;
  //     let newMsg = {};

  //     newMsg = {
  //       _id: newMsgId,
  //       send_by: {
  //         name: userInfo.username,
  //         email: userInfo.email,
  //         profile_image: userInfo.profile_image,
  //       },
  //       attachment: newAttachment,
  //       timestamp: new Date(),
  //       read_status: false,
  //       read_by: null,
  //     };
  //     console.log(newMsg);
  //     setSelectedChat((prev) => ({
  //       ...prev,
  //       chat: [...prev.chat, newMsg],
  //     }));

  //     // **ADD THIS**: Also update the chats array optimistically
  //     dispatch({
  //       type: "FETCH_CHAT_SUCCESS",
  //       payload: chatsRef.current.map((c) =>
  //         c._id === chat._id
  //           ? {
  //               ...c,
  //               chat: [...c.chat, newMsg],
  //               updatedAt: new Date(),
  //             }
  //           : c
  //       ),
  //     });

  //     console.log(newMsg);
  //     console.log(chat);
  //     // setTextMessage("");
  //     setChatAttachment({ file: "", type: "" }); // Reset attachment after sending

  //     // Use newAttachment instead of chatAttachment
  //     socket.emit("sendMessage", {
  //       chatId: chat._id,
  //       message: "",
  //       attachment: newAttachment, // Use the fresh value
  //       user: userInfo,
  //     });
  //     console.log("new1:", newMsg);
  //     console.log("new2 :", chat);

  //     dispatch({ type: "NEW_CHAT_SUCCESS" });
  //   } catch (error) {
  //     dispatch({
  //       type: "FETCH_CHAT_FAIL",
  //       payload: error.response.data.error || error.response.data.message,
  //     });
  //     console.error(error);
  //   }
  // };

  const handleChatAttachment = async (e, chat) => {
    const file = e.target.files[0];
    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      dispatch({ type: "UPLOAD_CHAT_ATTACHMENT_REQUEST" });
      const { data } = await axios.post(
        "/api/v1/image-upload/chat-attachment",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${authtoken}`,
          },
          withCredentials: true,
        },
      );

      dispatch({ type: "UPLOAD_CHAT_ATTACHMENT_SUCCESS" });

      // Create the new attachment object
      const newAttachment = { file: data.url, type: file.type };
      setChatAttachment(newAttachment);

      toast.success("The file uploaded successfully");

      // Send the message with attachment immediately after upload
      dispatch({ type: "NEW_CHAT_REQUEST" });

      const newMsgId = `tmp-${Date.now()}`;
      let newMsg = {};

      newMsg = {
        _id: newMsgId,
        send_by: {
          name: userInfo.username,
          email: userInfo.email,
          profile_image: userInfo.profile_image,
        },
        message: "", // Empty message for attachment-only
        attachment: newAttachment,
        timestamp: new Date(),
        read_status: false,
        read_by: null,
      };

      setSelectedChat((prev) => ({
        ...prev,
        chat: [...prev.chat, newMsg],
      }));

      // Update chats array optimistically
      dispatch({
        type: "FETCH_CHAT_SUCCESS",
        payload: chatsRef.current.map((c) =>
          c._id === chat._id
            ? {
                ...c,
                chat: [...c.chat, newMsg],
                updatedAt: new Date(),
              }
            : c,
        ),
      });

      // Emit the message with attachment
      socket.emit("sendMessage", {
        chatId: chat._id,
        message: "",
        attachment: newAttachment,
        user: userInfo,
      });

      dispatch({ type: "NEW_CHAT_SUCCESS" });
    } catch (error) {
      dispatch({
        type: "UPLOAD_CHAT_ATTACHMENT_FAIL",
        payload: error.response?.data?.error || error.response?.data?.message,
      });
      console.error(error);
    }
  };

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
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">Chats</h5>
                </div>
                <CButton
                  className="my-2"
                  size="sm"
                  color="primary"
                  onClick={() => setShowUserModal(true)}
                >
                  New Chat
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
              <div className="" style={{ maxHeight: "360px" }}>
                {chats
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .map((chat) => {
                    const isLoggedInUserSender =
                      chat.send_user.user_id === userInfo._id;
                    const otherUser = isLoggedInUserSender
                      ? chat.receiver_user
                      : chat.send_user;

                    // Get unread message count for this chat
                    const unreadCount = getUnreadMessageCount(chat);

                    return (
                      <div
                        key={chat._id}
                        className={`p-2 d-flex align-items-center gap-3 ${
                          selectedChat?._id === chat._id
                            ? "bg-body-secondary rounded"
                            : ""
                        }`}
                        onClick={() => handleChatClick(chat)}
                        style={{
                          cursor: "pointer",
                          backgroundColor:
                            unreadCount > 0 && selectedChat?._id !== chat._id
                              ? "rgba(37, 211, 102, 0.05)"
                              : "",
                        }}
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
                                backgroundColor: "#25d366",
                                borderRadius: "50%",
                                border: "2px solid white",
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div
                            className="fw-semibold text-truncate"
                            style={{
                              fontWeight: unreadCount > 0 ? "600" : "500",
                            }}
                          >
                            {otherUser.name}
                          </div>
                          <div
                            className="text-truncate small"
                            style={{
                              color: unreadCount > 0 ? "#667781" : "#8696a0",
                              fontWeight: unreadCount > 0 ? "500" : "400",
                            }}
                          >
                            {renderLastMessage(chat.chat)}
                          </div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <small
                            className="text-nowrap"
                            style={{
                              color: unreadCount > 0 ? "#25d366" : "#8696a0",
                              fontWeight: unreadCount > 0 ? "600" : "400",
                            }}
                          >
                            {formatTimeinUserlist(chat.updatedAt)}
                          </small>
                          {/* Unread message count badge */}
                          {unreadCount > 0 && (
                            <CBadge
                              shape="rounded-pill"
                              className="mt-1"
                              style={{
                                backgroundColor: "#25d366",
                                color: "white",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                minWidth: "20px",
                                height: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "none",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                                animation: "pulse 0.5s ease-in-out",
                              }}
                            >
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </CBadge>
                          )}
                        </div>
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
                  <div className="border-bottom p-3 fw-semibold d-flex align-items-center gap-2 ">
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
                              {otherTyping
                                ? "typing..."
                                : isUserOnline(otherUser.user_id)
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
                    className="flex-grow-1 overflow-auto mt-2"
                    style={
                      window.innerWidth <= 767
                        ? {
                            maxHeight: "550px",
                          }
                        : {
                            minHeight: "350px",
                            maxHeight: "350px",
                          }
                    }
                  >
                    {selectedChat.chat
                      .sort(
                        (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
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
                            <div>
                              {msg.message ? (
                                msg.message
                              ) : (
                                <>
                                  {msg.attachment.type.startsWith("image/") ? (
                                    <img
                                      src={msg.attachment.file}
                                      alt="Attachment"
                                      className="img-fluid rounded"
                                      style={{ maxWidth: "200px" }}
                                    />
                                  ) : msg.attachment.type ===
                                    "application/pdf" ? (
                                    <a
                                      href={msg.attachment.file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ textDecoration: "none" }}
                                    >
                                      <CImage
                                        src={PdfIcon}
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          objectFit: "contain",
                                        }}
                                        alt="PDF Icon"
                                      />
                                    </a>
                                  ) : msg.attachment.type === "" ? (
                                    "No Attachment"
                                  ) : (
                                    <a
                                      href={msg.attachment.file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ textDecoration: "none" }}
                                    >
                                      <CIcon icon={cilPaperclip} size="lg" />{" "}
                                      View Attachment
                                    </a>
                                  )}
                                </>
                              )}
                            </div>
                            <small
                              className="d-block text-end"
                              style={{
                                fontSize: "12px",
                                color: "rgba(255,255,255,0.7)",
                              }}
                            >
                              {formatTime(msg.timestamp)}
                              {msg.send_by.email === userInfo.email && (
                                <span
                                  className="ms-2"
                                  style={{ fontSize: "0.75rem", lineHeight: 1 }}
                                >
                                  {msg.read_status ? (
                                    <span
                                      style={{
                                        color: "#0d6efd",
                                        letterSpacing: "-3px",
                                      }}
                                    >
                                      ✓✓
                                    </span>
                                  ) : (
                                    <span style={{ color: "gray" }}>✓</span>
                                  )}
                                </span>
                              )}
                            </small>
                          </div>
                        </div>
                      ))}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  {/* Input for Desktop/Tablet */}
                  <div className="border-top p-3 d-none d-md-block border">
                    <CForm>
                      <CInputGroup>
                        <CFormInput
                          placeholder="Type a message..."
                          value={textMessage}
                          onChange={handleTyping}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (!textMessage.trim()) return;
                              sendMessage(selectedChat);
                            }
                          }}
                        />
                        {/* File input button */}
                        <label
                          htmlFor="file-upload"
                          className="btn btn-light"
                          style={{ cursor: "pointer" }}
                          title="Attach file"
                        >
                          {chatAttachmentUploadLoading ? (
                            <LoadingSpinner />
                          ) : (
                            <CIcon icon={cilPaperclip} />
                          )}
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleChatAttachment(e, selectedChat)
                          }
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
                          onChange={handleTyping}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (!textMessage.trim()) return;
                              sendMessage(selectedChat);
                            }
                          }}
                          style={{ margin: 0 }}
                        />
                        {/* File input button */}
                        <label
                          htmlFor="file-upload"
                          className="btn btn-light"
                          style={{ cursor: "pointer" }}
                          title="Attach file"
                        >
                          {chatAttachmentUploadLoading ? (
                            <LoadingSpinner />
                          ) : (
                            <CIcon icon={cilPaperclip} />
                          )}
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleChatAttachment(e, selectedChat)
                          }
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
