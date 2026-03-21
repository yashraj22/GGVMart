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
      className={`flex items-center w-full text-left transition-colors duration-150 ${
        avatarOnly ? "justify-center p-3" : "gap-3 px-4 py-3"
      }`}
      style={{ borderBottom: "1px solid var(--ds-gray-200)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "var(--ds-gray-100)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <div
        className="relative flex-shrink-0 w-9 h-9 rounded-full overflow-hidden"
        style={{
          background: "var(--ds-gray-200)",
          boxShadow: "0 0 0 1px var(--ds-gray-400)",
        }}
      >
        {picture ? (
          <Image
            src={picture}
            alt={name || "User"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={16} style={{ color: "var(--ds-gray-600)" }} />
          </div>
        )}
      </div>
      {!avatarOnly && name && (
        <div className="min-w-0">
          <p
            className="text-sm font-medium truncate"
            style={{ color: "var(--ds-gray-900)" }}
          >
            {name}
          </p>
        </div>
      )}
    </button>
  );
};

export default UserCard;
