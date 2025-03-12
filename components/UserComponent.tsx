import { User } from "@/types/user";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import React from "react";

const UserComponent = ({
  user,
  anonymous,
}: {
  user: User | null;
  anonymous: boolean;
}) => {
  const image =
    user?.profileImageUrl && !anonymous ? (
      <Image
        src={
          "https://yt3.ggpht.com/yti/ANjgQV-pY3jaj_nJVR9Gr1yHMdeE7yw8vb24K64MgMhuiot3cU8=s88-c-k-c0x00ffffff-no-rj"
        }
        className="rounded-full"
        width={45}
        height={45}
        alt={`Image of ${user.name}`}
      />
    ) : (
      <CircleUserRound size={50} className="bg-gray-300 p-0 rounded-full" />
    );

  const name = (!anonymous && user?.name) || "Anonymous";

  return (
    <div className="flex items-center gap-2">
      {image}
      <p className="flex flex-col">
        <span className="text-xs text-gray-400">Recipe by</span>
        <span className="text-md text-gray-600">{name}</span>
      </p>
    </div>
  );
};

export default UserComponent;
