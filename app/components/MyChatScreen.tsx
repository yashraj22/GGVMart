"use client";
import ChatUi from "./ChatUi";
import UserCard from "./UserCard";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/rootReducer";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useUserAuth } from "../context/AuthContext";

const MyChatScreen = () => {
  const productdata = useSelector(
    (state: RootState) => state.data.product.data,
  );
  const chatdata = useSelector((state: RootState) => state.data.chat.data);
  const { user, loading: authLoading }: any = useUserAuth();
  const [chatsData, setchatsData] = useState<any[]>([]);
  const [userId, setuserId] = useState<string | undefined>();
  const [chatId, setchatId] = useState<string | undefined>();
  const [senderId, setsenderId] = useState<string | undefined>();
  const [isChatsLoading, setIsChatsLoading] = useState(true);

  useEffect(() => {
    if (chatdata) {
      setchatsData(chatdata);
      setchatId((currentChatId) => currentChatId ?? chatdata[0]?.id);
      setIsChatsLoading(false);
      return;
    }

    if (authLoading) {
      setIsChatsLoading(true);
      return;
    }

    if (!productdata || productdata.length === 0) {
      setchatsData([]);
      setchatId(undefined);
      setIsChatsLoading(false);
      return;
    }

    const fetchchatData = async () => {
      setIsChatsLoading(true);
      try {
        const response = await fetch("/api/chats/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productdata }),
        });
        const data = await response.json();
        const nextChats = data.userChats || [];
        setchatsData(nextChats);
        setchatId(nextChats[0]?.id);
        setuserId(nextChats[0]?.userId);
      } catch (error) {
        console.error("Error fetching products:", error);
        setchatsData([]);
        setchatId(undefined);
      } finally {
        setIsChatsLoading(false);
      }
    };

    fetchchatData();
  }, [authLoading, chatdata, productdata]);

  useEffect(() => {
    setuserId(user?.id);
  }, [user?.id]);

  const handleUserCardClick = (
    selectedChatId: string,
    selectedUserId: string,
  ) => {
    setchatId(selectedChatId);
    setsenderId(selectedUserId);
  };

  return (
    <div
      className="flex mx-auto max-w-7xl w-full border-x"
      style={{
        height: "calc(100vh - 56px)",
        borderColor: "var(--ds-gray-400)",
        background: "var(--ds-background-100)",
      }}
    >
      {/* Sidebar — full on md+ */}
      <div
        className="hidden md:flex flex-col w-72 flex-shrink-0"
        style={{ borderRight: "1px solid var(--ds-gray-400)" }}
      >
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid var(--ds-gray-200)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--ds-gray-800)" }}
          >
            Conversations
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isChatsLoading ? (
            <ChatListSkeleton />
          ) : chatsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 py-12 px-4 text-center">
              <MessageCircle
                size={24}
                style={{ color: "var(--ds-gray-500)" }}
              />
              <p className="text-sm" style={{ color: "var(--ds-gray-700)" }}>
                No conversations yet
              </p>
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
      <div
        className="flex md:hidden flex-col w-14 flex-shrink-0"
        style={{ borderRight: "1px solid var(--ds-gray-400)" }}
      >
        <div
          className="h-10"
          style={{ borderBottom: "1px solid var(--ds-gray-200)" }}
        />
        <div className="flex-1 overflow-y-auto">
          {isChatsLoading ? (
            <ChatListSkeleton avatarOnly />
          ) : (
            chatsData?.map((chat) => (
              <UserCard
                key={chat.id}
                userId={chat.userId}
                chatId={chat.id}
                isCurrentUser={chat.userId === userId}
                onUserCardClick={handleUserCardClick}
                avatarOnly
              />
            ))
          )}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex flex-1 min-w-0">
        <ChatUi
          params={{ slug: [chatId, userId, senderId] }}
          isParentLoading={isChatsLoading || authLoading}
        />
      </div>
    </div>
  );
};

const ChatListSkeleton = ({ avatarOnly = false }: { avatarOnly?: boolean }) => (
  <div>
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className={`flex items-center ${
          avatarOnly ? "justify-center p-3" : "gap-3 px-4 py-3"
        }`}
        style={{ borderBottom: "1px solid var(--ds-gray-200)" }}
      >
        <div className="skeleton w-9 h-9 rounded-full flex-shrink-0" />
        {!avatarOnly && <div className="skeleton h-3.5 w-28 rounded-md" />}
      </div>
    ))}
  </div>
);

export default MyChatScreen;
