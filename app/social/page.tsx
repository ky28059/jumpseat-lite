"use client";

import { useState, useEffect, useMemo } from "react";
import type { User } from '@prisma/client';

// Components
import FriendsTab from "@/app/social/FriendsTab";
import GroupsTab from "@/app/social/GroupsTab";
import { Input } from "@/components/ui/input";

// Icons
import { CiSearch } from "react-icons/ci";

// Utils
import { createFriend, deleteFriend, getFriends } from '@/lib/db/friends';
import { getUsers } from "@/lib/db/user";

export type UserWithFriendStatus = User & {
  isFriend: boolean
}

export default function Social() {
  const [tab, setTab] = useState("friends");
  const [query, setQuery] = useState("");
  const [friends, setFriends] = useState<UserWithFriendStatus[]>([]);
  const [allUsers, setAllUsers] = useState<UserWithFriendStatus[]>([]);

  useEffect(() => {
        void fetchFriends();
  }, []);

  async function fetchFriends() {
    try {
      const friendsRes = await getFriends(9);
      if (friendsRes.error) return console.error("Failed to fetch friends:", friendsRes.error);

      const friendsWithStatus = friendsRes.friends!.map((friend) => ({
        ...friend,
        isFriend: true,
      }));
      setFriends(friendsWithStatus);

      const usersRes = await getUsers();
      const updatedUsers = usersRes.map(user => ({
        ...user,
        isFriend: friendsWithStatus.some(friend => friend.id === user.id),
      }));

      setAllUsers(updatedUsers);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  }

  const filteredUsers = useMemo(() => {
    if (query === "") {
      return friends;
    } else {
      return allUsers.filter(user =>
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        (user.firstName ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (user.lastName ?? "").toLowerCase().includes(query.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query.toLowerCase())
      );
    }
  }, [query, friends, allUsers]);

  async function addFriend(friendId: number) {
    try {
      await createFriend(9, friendId);
      await fetchFriends();
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  }

  async function removeFriend(friendId: number) {
    try {
      const res = await deleteFriend(9, friendId);
      if (res.error) return console.error("Error removing friend:", res.error);
      await fetchFriends();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  }

  return (
    <div className="flex flex-col items-center w-full h-[80svh] bg-[#f6f9fc]">
      <div className="max-w-6xl">
        <div className="flex flex-row justify-between align-center w-[896px] h-fit mt-20 mb-2">
          <h1 className="font-semibold text-2xl h-fit self-center">Social</h1>
          <div className="flex flex-row items-center relative bg-white w-48 border-2 focus-within:border-[#ffd95b] rounded-md">
            <CiSearch className="absolute left-1" />
            <Input
              className="bg-white ml-3"
              placeholder="Find friends..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-row w-full gap-4 border-b-[1px] mb-4">
          <div
            className={`${tab === "friends"
              ? "border-b-2 border-[#ffd95b] text-[#ffd95b] mb-[-1px]"
              : ""
              } px-2 cursor-pointer py-1`}
            onClick={() => setTab("friends")}
          >
            <span
              className={`${tab === "friends"
                ? "hover:bg-[#fff0bd]/25"
                : "hover:bg-[#f6f9fc]"
                } px-2 cursor-pointer mb-1 py-1 rounded-md`}
            >
              Friends
            </span>
          </div>
          <div
            className={`${tab === "groups"
              ? "border-b-2 border-[#ffd95b] text-[#ffd95b] mb-[-1px]"
              : ""
              } px-2 cursor-pointer py-1`}
            onClick={() => setTab("groups")}
          >
            <span
              className={`${tab === "groups"
                ? "hover:bg-[#fff0bd]/25"
                : "hover:bg-[#f6f9fc]"
                } px-2 cursor-pointer mb-1 py-1 rounded-md`}
            >
              Groups
            </span>
          </div>
        </div>
        {tab === "friends" ? (
          <FriendsTab
            searchResults={filteredUsers}
            onAddFriend={addFriend}
            onRemoveFriend={removeFriend}
          />
        ) : (
          <GroupsTab />
        )}
      </div>
    </div>
  );
}
