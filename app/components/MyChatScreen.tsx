"use client";
import ChatUi from "./ChatUi";
import UserCard from "./UserCard";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/rootReducer";
import { useEffect, useState } from "react";
import supabase from "../util/supabaseClient";

const MyChatScreen = () => {
  const productdata = useSelector(
    (state: RootState) => state.data.product.data,
  );
  const chatdata = useSelector((state: RootState) => state.data.chat.data);
  const [chatsData, setchatsData] = useState<any[]>();
  const [userId, setuserId] = useState<string | undefined>();
  const [chatId, setchatId] = useState<string | undefined>();
  const [senderId, setsenderId] = useState<string | undefined>();

  // Effect to set productId based on data from Redux store
  // useEffect(() => {
  //   if (productdata.data[0]?.id) {
  //     setproductId(productdata.data[0].id);
  //   } else {
  //     navigate("/");
  //   }
  // }, [productdata]);

  // Effect to fetch chat data based on productId
  useEffect(() => {
    const fetchchatData = async () => {
      if (productdata)
        try {
          const response = await fetch("/api/chats/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ productdata }),
          });

          const data = await response.json();
          console.log("data");
          console.log(data);
          if (data.userChats.length > 0) {
            setchatsData(data.userChats);
            setchatId(data.userChats[0].id);
            setuserId(data.userChats[0].userId);
            console.log("chatsdata");
            console.log(chatsData);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
    };
    fetchchatData();
  }, [productdata]);

  // Effect to get user ID from Supabase
  useEffect(() => {
    const getIdFetch = async () => {
      const { data } = await supabase.auth.getSession();
      const id: string | undefined = data.session?.user.id;
      setuserId(id);
    };
    getIdFetch();
  }, []);

  useEffect(() => {
    if (chatdata) {
      setchatsData(chatdata);
    }
  }, [chatdata]);

  const handleUserCardClick = (
    selectedChatId: string,
    selectedUserId: string,
  ) => {
    setchatId(selectedChatId);
    setsenderId(selectedUserId);
  };

  return (
    <div className="flex h-4/5 w-screen">
      <div className="flex flex-col items-center w-1/3">
        {chatsData &&
          chatsData.map((chat) => {
            if (chat.userId !== userId) {
              return (
                <UserCard
                  key={chat.id}
                  userId={chat.userId}
                  chatId={chat.id}
                  onUserCardClick={handleUserCardClick}
                />
              );
            }
          })}
      </div>
      <div className="flex w-2/3">
        <ChatUi params={{ slug: [chatId, userId, senderId] }} />
      </div>
    </div>
  );
};

export default MyChatScreen;
