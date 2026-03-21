"use client";
import ChatUi from "./ChatUi";
import UserCard from "./UserCard";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/rootReducer";
import { useEffect, useState } from "react";
import supabase from "../util/supabaseClient";
import { MessageCircle } from "lucide-react";

const MyChatScreen = () => {
  const productdata = useSelector(
    (state: RootState) => state.data.product.data,
  );
  const chatdata = useSelector((state: RootState) => state.data.chat.data);
  const [chatsData, setchatsData] = useState<any[]>();
  const [userId, setuserId] = useState<string | undefined>();
  const [chatId, setchatId] = useState<string | undefined>();
  const [senderId, setsenderId] = useState<string | undefined>();

  useEffect(() => {
    const fetchchatData = async () => {
      if (productdata)
        try {
          const response = await fetch("/api/chats/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productdata }),
          });
          const data = await response.json();
          if (data.userChats.length > 0) {
            setchatsData(data.userChats);
            setchatId(data.userChats[0].id);
            setuserId(data.userChats[0].userId);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
    };
    fetchchatData();
  }, [productdata]);

  useEffect(() => {
    const getIdFetch = async () => {
      const { data } = await supabase.auth.getSession();
      const id: string | undefined = data.session?.user.id;
      setuserId(id);
    };
    getIdFetch();
  }, []);

  useEffect(() => {
    if (chatdata) setchatsData(chatdata);
  }, [chatdata]);

  const handleUserCardClick = (
    selectedChatId: string,
    selectedUserId: string,
  ) => {
    setchatId(selectedChatId);
    setsenderId(selectedUserId);
  };

  return (
    <div
      className="flex mx-auto max-w-7xl w-full border-x border-[#e2e2e2] bg-white"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* Sidebar — full on md+ */}
      <div className="hidden md:flex flex-col w-72 border-r border-[#e2e2e2] flex-shrink-0">
        <div className="px-4 py-3 border-b border-[#f2f2f2]">
          <p className="text-xs font-semibold text-[#6f6f6f] uppercase tracking-wide">
            Conversations
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {!chatsData || chatsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 py-12 px-4 text-center">
              <MessageCircle size={24} className="text-[#c9c9c9]" />
              <p className="text-sm text-[#8f8f8f]">No conversations yet</p>
            </div>
          ) : (
            chatsData.map((chat) => (
              <UserCard
                key={chat.id}
                userId={chat.userId}
                chatId={chat.id}
                isCurrentUser={chat.userId === userId}
                onUserCardClick={handleUserCardClick}
              />
            ))
          )}
        </div>
      </div>

      {/* Sidebar — icon only on mobile */}
      <div className="flex md:hidden flex-col w-14 border-r border-[#e2e2e2] flex-shrink-0">
        <div className="h-10 border-b border-[#f2f2f2]" />
        <div className="flex-1 overflow-y-auto">
          {chatsData?.map((chat) => (
            <UserCard
              key={chat.id}
              userId={chat.userId}
              chatId={chat.id}
              isCurrentUser={chat.userId === userId}
              onUserCardClick={handleUserCardClick}
              avatarOnly
            />
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex flex-1 min-w-0">
        <ChatUi params={{ slug: [chatId, userId, senderId] }} />
      </div>
    </div>
  );
};

export default MyChatScreen;
