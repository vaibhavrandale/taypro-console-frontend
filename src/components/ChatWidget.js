// import React, { useState } from "react";
// import { CButton, CAvatar } from "@coreui/react";
// import { MessageCircle, ArrowLeft } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// export default function ChatWidget() {
//   const [visible, setVisible] = useState(false);
//   const [activeChat, setActiveChat] = useState(null);

//   // Dummy users
//   const users = [
//     { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/50?img=1" },
//     { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/50?img=2" },
//     { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/50?img=3" },
//   ];

//   return (
//     <div>
//       {/* Floating Chat Button */}
//       <CButton
//         color="primary"
//         shape="rounded-circle"
//         size="lg"
//         className="shadow-lg position-fixed"
//         style={{ bottom: "20px", right: "20px", zIndex: 1050 }}
//         onClick={() => setVisible(!visible)}
//       >
//         <MessageCircle size={24} />
//       </CButton>

//       {/* Chat Widget */}
//       {visible && (
//         <div
//           className="position-fixed shadow-lg "
//           style={{
//             bottom: "80px",
//             right: "20px",
//             width: "500px",
//             height: "500px",
//             zIndex: 1050,
//             background: "#080f25",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           {/* Header */}
//           <div className="d-flex align-items-center justify-content-start p-2 border-bottom fw-bold">
//             {activeChat ? (
//               <>
//                 <ArrowLeft
//                   size={22}
//                   role="button"
//                   onClick={() => setActiveChat(null)}
//                 />
//                 <CAvatar src={activeChat.avatar} size="md" />
//                 <span className="ms-2">{activeChat.name}</span>
//               </>
//             ) : (
//               <span className="text-success">Chats</span>
//             )}
//           </div>

//           {/* User List OR Chat Window */}
//           <div className="flex-grow-1 overflow-auto">
//             {!activeChat ? (
//               // User List
//               <div>
//                 {users.map((user) => (
//                   <div
//                     key={user.id}
//                     className="d-flex align-items-center p-2 border-bottom hover:bg-light"
//                     style={{ cursor: "pointer" }}
//                     onClick={() => setActiveChat(user)}
//                   >
//                     <CAvatar src={user.avatar} size="md" />
//                     <span className="ms-2">{user.name}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               // Chat Window
//               <div
//                 className="d-flex flex-column p-2"
//                 style={{ height: "100%" }}
//               >
//                 <div
//                   className="flex-grow-1 overflow-auto mb-2"
//                   style={{ maxHeight: "380px" }}
//                 >
//                   {/* Example messages */}
//                   <div className="text-start mb-2">
//                     <span className="p-2 rounded ">Hello!</span>
//                   </div>
//                   <div className="text-end mb-2">
//                     <span className="p-2 rounded">Hi {activeChat.name}!</span>
//                   </div>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Type a message..."
//                   className="form-control"
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
import { CButton, CAvatar, CBadge } from "@coreui/react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [visible, setVisible] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  // Dummy users
  const users = [
    { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/50?img=1" },
    { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/50?img=2" },
    { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/50?img=3" },
  ];

  return (
    <div>
      {/* Floating Chat Button */}
      <CBadge
        color="info"
        shape="rounded-circle"
        size="lg"
        className="shadow-lg position-fixed p-2 cursor-pointer"
        style={{ bottom: "60px", right: "20px", zIndex: 1050 }}
        onClick={() => setVisible(!visible)}
      >
        <MessageCircle size={24} />
      </CBadge>

      {/* Chat Widget */}
      {visible && (
        <div
          className="position-fixed shadow-lg  border"
          style={{
            bottom: "100px",
            right: "20px",
            width: "40vw",
            height: "70vh",
            zIndex: 1050,
            background: "#080f25",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div className="d-flex justify-content-start align-items-center p-2 border-bottom fw-bold text-white">
            {activeChat ? (
              <>
                <ArrowLeft
                  size={22}
                  role="button"
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveChat(null)}
                />
                <CAvatar src={activeChat.avatar} size="md" className="ms-2" />
                <span className="ms-2">{activeChat.name}</span>
              </>
            ) : (
              <span className="text-success">My Chats</span>
            )}
          </div>

          {/* User List OR Chat Window with Animation */}
          <div className="flex-grow-1 position-relative">
            <AnimatePresence mode="wait">
              {!activeChat ? (
                // User List
                <motion.div
                  key="user-list"
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 200, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="position-absolute w-100 h-100 overflow-auto"
                >
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="d-flex align-items-center p-2 border-bottom text-white"
                      style={{ cursor: "pointer" }}
                      onClick={() => setActiveChat(user)}
                    >
                      <CAvatar src={user.avatar} size="md" />
                      <span className="ms-2">{user.name}</span>
                    </div>
                  ))}
                </motion.div>
              ) : (
                // Chat Window
                <motion.div
                  key="chat-window"
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="position-absolute w-100 h-100 d-flex flex-column p-2"
                >
                  <div className="flex-grow-1 overflow-auto mb-2 text-white">
                    <div className="text-start mb-2">
                      <span className="p-2 rounded bg-secondary text-white">
                        Hello!
                      </span>
                    </div>
                    <div className="text-end mb-2">
                      <span className="p-2 rounded bg-success text-white">
                        Hi {activeChat.name}!
                      </span>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="form-control"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
