import Friend from "@/app/social/Friend";
import type { UserWithFriendStatus } from '@/app/social/page';


type FriendsTabProps = {
    searchResults: UserWithFriendStatus[],
    onAddFriend: (id: number) => void,
    onRemoveFriend: (id: number) => void
}

export default function FriendsTab({ searchResults, onAddFriend, onRemoveFriend }: FriendsTabProps) {
    return (
        <div className="flex flex-row gap-3">
            {searchResults.length > 0 ? (
                searchResults.map((friend, index) => (
                    <Friend
                        key={index}
                        name={`${friend.firstName} ${friend.lastName}`}
                        isFriend={friend.isFriend}
                        onAddFriend={() => onAddFriend(friend.id)}
                        onRemoveFriend={() => onRemoveFriend(friend.id)}
                    />
                ))
            ) : (
                <p>No friends found.</p>
            )}
        </div>
    );
}
