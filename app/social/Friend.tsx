import React from "react";
import Image from "next/image";
import profile from "./profile.jpg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaArrowRight, FaPlane, FaUserFriends } from "react-icons/fa";
import { TiHome } from "react-icons/ti";

interface FriendProps {
  name: string;
  isFriend: boolean;
  onAddFriend: () => void;
  onRemoveFriend: () => void;
}

const Friend: React.FC<FriendProps> = ({ name, isFriend, onAddFriend, onRemoveFriend }) => (
  <div className="flex flex-col gap-2 p-3 rounded-md w-[140px] h-fit text-center bg-white">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex flex-col">
            <Image
              src={profile}
              width={80}
              height={80}
              alt="Picture of the author"
              className="rounded-full self-center"
            />
            <p>{name}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col p-2">
            <div className="flex flex-row gap-4 max-w-[336px]">
              <Image
                src={profile}
                width={85}
                height={85}
                alt="Picture of the author"
                className="rounded-full self-start"
              />
              <div className="flex flex-col gap-3 text-left">
                <p className="font-semibold text-lg">{name}</p>
                <div className="flex flex-row gap-2 items-center">
                  <FaUserFriends size={24} />
                  <p>2 mutual friends: Bruh bruh and breh breh</p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <TiHome size={20} className="mx-[-1px]" />
                  <p>Home city is Los Angeles, CA</p>
                </div>
                <div className="flex flex-row items-center justify-between w-full">
                  <FaPlane size={17} className="ml-[1px] mr-[4px] -rotate-90" />
                  <div className="flex items-center gap-1">
                    <p>Booked</p>
                    <div
                      className="flex items-center gap-1 border-b-2 border-black cursor-pointer"
                      onClick={() => console.log("breh")}
                    >
                      <p className="font-semibold">Purdue</p>
                      <FaArrowRight size={12} />
                      <p className="font-semibold">LAX</p>
                    </div>
                  </div>
                  <p className="mr-2 text-gray-700 text-sm">2d ago</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-2 mt-4">
              <button className="py-2 bg-[#e5e7eb] rounded-md hover:opacity-80 w-full font-semibold transition-colors">
                Add to group
              </button>
              <button
                className={`py-2 rounded-md hover:opacity-80 w-full font-semibold transition-colors ${isFriend ? 'bg-red-300' : 'bg-green-300'}`}
                onClick={isFriend ? onRemoveFriend : onAddFriend}
              >
                {isFriend ? 'Delete' : 'Add'}
              </button>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <button
      className={`py-1 rounded-md transition-colors ${isFriend ? 'bg-red-300 hover:bg-red-400' : 'bg-green-300 hover:bg-green-400'}`}
      onClick={isFriend ? onRemoveFriend : onAddFriend}
    >
      {isFriend ? 'Delete' : 'Add'}
    </button>
  </div>
);

export default Friend;