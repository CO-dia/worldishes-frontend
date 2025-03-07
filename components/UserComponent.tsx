import { User } from "@/types/user";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import React from "react";

const UserComponent = ({ user }: { user: User | null }) => {
  const image = user?.profileImageUrl ? (
    <Image
      src={
        "https://yt3.ggpht.com/yti/ANjgQV-pY3jaj_nJVR9Gr1yHMdeE7yw8vb24K64MgMhuiot3cU8=s88-c-k-c0x00ffffff-no-rj"
      }
      className="rounded-full"
      width={60}
      height={60}
      alt={`Image of ${user.name}`}
    />
  ) : (
    <CircleUserRound size={60} className="bg-gray-300 p-0 rounded-full" />
  );

  const name = user?.name || "Anonymous";

  return (
    <div className="flex items-center gap-2">
      {image}
      <span className="text-xl">{name}</span>
    </div>
  );
};

export default UserComponent;
