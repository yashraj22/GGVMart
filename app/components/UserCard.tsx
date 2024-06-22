import Image from "next/image";
import { useEffect, useState } from "react";

const UserCard = ({ userId, chatId, onUserCardClick, avatarOnly }: any) => {
  const [userData, setuserData] = useState<any>();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch("/api/user/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        setuserData(data);
        console.log("userdata");
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  const handleClick = () => {
    onUserCardClick(chatId, userId);
  };

  return (
    <div
      className={`flex ${avatarOnly ? "h-16 w-16" : "h-20 w-full"} bg-slate-100 border border-gray-300`}
      onClick={handleClick}
    >
      <div
        className={`flex items-center ${avatarOnly ? "justify-center w-full" : "ml-4"}`}
      >
        <Image
          src={userData && userData.user.raw_user_meta_data.picture}
          alt="User Avatar"
          width={avatarOnly ? 40 : 50}
          height={avatarOnly ? 40 : 50}
          className="rounded-full cursor-pointer"
        />
      </div>
      {!avatarOnly && (
        <div className="flex flex-col justify-center ml-4">
          <h1>{userData && userData.user.raw_user_meta_data.name}</h1>
        </div>
      )}
    </div>
  );
};

export default UserCard;
