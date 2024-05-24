import Image from "next/image";
import { useUserAuth } from "../context/AuthContext";

const UserCard = () => {
  const { user }: any = useUserAuth();
  return (
    <div className="flex h-20 w-full bg-slate-100 border border-gray-300 border-y-1 border-x-0">
      <div className="flex h-20 ml-4 items-center ">
        <Image
          src={user?.user_metadata?.picture}
          alt="User Avatar"
          width={50}
          height={50}
          className="rounded-full cursor-pointer"
        />
      </div>
      <div className="flex mt-5 ml-4">
        <h1>Gaurav Kumar</h1>
      </div>
    </div>
  );
};

export default UserCard;
