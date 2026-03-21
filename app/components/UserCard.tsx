import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchUserDetail } from "../util/actions";
import { User } from "lucide-react";

const UserCard = ({ userId, chatId, onUserCardClick, avatarOnly }: any) => {
  const [userData, setuserData] = useState<any>();

  useEffect(() => {
    if (userId) {
      fetchUserDetail(userId).then((data) => {
        setuserData(data);
      });
    }
  }, [userId]);

  const handleClick = () => {
    onUserCardClick(chatId, userId);
  };

  const picture = userData?.user?.raw_user_meta_data?.picture;
  const name = userData?.user?.raw_user_meta_data?.name;

  return (
    <button
      onClick={handleClick}
      className={`flex items-center w-full text-left transition-colors duration-150 hover:bg-[#fafafa] border-b border-[#f2f2f2] ${
        avatarOnly ? "justify-center p-3" : "gap-3 px-4 py-3"
      }`}
    >
      <div className="relative flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-[#f2f2f2] ring-1 ring-[#e2e2e2]">
        {picture ? (
          <Image
            src={picture}
            alt={name || "User"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={16} className="text-[#a8a8a8]" />
          </div>
        )}
      </div>
      {!avatarOnly && name && (
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#171717] truncate">{name}</p>
        </div>
      )}
    </button>
  );
};

export default UserCard;
