"use client";
import ChatUi from "./ChatUi";
import UserCard from "./UserCard";

const MyChatScreen = (prop: any) => {
  const props = { slug: "" };
  const ownerId = prop;
  console.log(prop);
  return (
    <div className="flex h-4/5 w-screen">
      <div className="flex flex-col items-center w-1/3">
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
      </div>
      <div className="flex w-2/3 ">
        <ChatUi params={props} />
      </div>
    </div>
  );
};

export default MyChatScreen;
