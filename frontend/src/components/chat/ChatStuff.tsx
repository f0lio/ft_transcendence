import React, { useEffect, useState } from "react";

import { io } from "socket.io-client";

import { useChatContext } from "context/chat.context";

import ChatBox from "./ChatBox";
import ChatSidebar from "./ChatSidebar";
import { getToken } from "@utils/auth-token";
import basicFetch from "@utils/basicFetch";

const ChatStuff = () => {
  let [socketIO, setSocketIO] = useState(null);
  const {
    deleteBox,
    activeBoxes,
    activateBox,
    conversationsMetadata,
    showChatSidebar,
    setShowChatSidebar,
    setConversationsMetadata,
  } = useChatContext(socketIO);

  useEffect(() => {
    let socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
      withCredentials: true, // this is needed to send cookies
    });

    setSocketIO(socket);

    const getRoomInfo = async (id) => {
      const resp = await basicFetch.get(`/chat/room/${id}`);

      if (resp.status == 200) {
        return resp.json();
      }
    };

    if (socket) {
      socket.on("updateListConversations", async (obj) => {
        let targetedRoom = (await getRoomInfo(obj.room.room_id))[0];
        setConversationsMetadata((state) => {
          const newState = state.filter((item) => {
            console.log(item.isActiveBox);
            if (item.isActiveBox && item.room_id == obj.room.room_id) {
              socket.emit(
                "setRead",
                {
                  roomId: item.room_id,
                },
                () => {}
              );
              targetedRoom.unreadMessagesCount = 0;
              targetedRoom.isActiveBox = true;
            }
            return item.room_id != obj.room.room_id;
          });
          return [targetedRoom, ...newState];
        });
      });
    }
    return () => {
      socket.close();
    };
  }, [setSocketIO]); // a hack to stop infinite rendering

  return (
    <div className="absolute bottom-0 right-0  max-h-[calc(100vh-10rem)] px-6">
      <ChatSidebar
        showChatSidebar={showChatSidebar}
        setShowChatSidebar={setShowChatSidebar}
        onConversationClick={activateBox}
        conversationsMetadata={conversationsMetadata}
        onNewConversationClick={() => console.log("new conversation")}
        socket={socketIO}
      />
      <ul className="absolute bottom-0 flex right-80 gap-x-3">
        {activeBoxes?.map((item) => (
          <li key={item.id} className="w-full">
            <ChatBox
              conversationMetaData={item}
              onClose={() => deleteBox(item["id"])}
              socket={socketIO}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatStuff;
