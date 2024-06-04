import Image from "next/image";
import { useEffect, useState } from "react";

const UserCard = ({ prop, chatId, onUserCardClick }: any) => {
  const [userData, setuserData] = useState<any>();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`/api/user/${prop}`);
        const data = await response.json();
        setuserData(data);
        console.log("userdata");
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

    if (prop) {
      fetchUserDetail();
    }
  }, [prop]);

  const handleClick = () => {
    onUserCardClick(chatId, prop);
  };

  return (
    <div
      className="flex h-20 w-full bg-slate-100 border border-gray-300 border-y-1 border-x-0"
      onClick={handleClick}
    >
      <div className="flex h-20 ml-4 items-center ">
        <Image
          src={userData && userData.user.raw_user_meta_data.picture}
          alt="User Avatar"
          width={50}
          height={50}
          className="rounded-full cursor-pointer"
        />
      </div>
      <div className="flex mt-5 ml-4">
        <h1>{userData && userData.user.raw_user_meta_data.name}</h1>
      </div>
    </div>
  );
};

export default UserCard;
