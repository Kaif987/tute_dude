import Navbar from "@/components/custom/Navbar";
import FriendCard from "@/components/custom/FriendCard";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRegisteredUser();
  }, [searchQuery]);

  useEffect(() => {
    getSuggestedFriends();
    getFriends();
  }, []);

  const fetchRegisteredUser = async () => {
    const response = await api.post("/api/v1/friend/search/", {
      searchQuery,
    });
    setRegisteredUsers(response.data.data);
  };

  const getFriends = async () => {
    const response = await api.get("/api/v1/friend/my-friends");
    setMyFriends(response.data.data);
  };

  const getSuggestedFriends = async () => {
    const response = await api.get("/api/v1/recommendation/");
    setSuggestedFriends(response.data.data);
  };

  const onSearch = (value) => {
    setSearchQuery(value);
  };

  return (
    <div className="mx-auto py-4 container max-w-7xl">
      <Navbar onSearch={onSearch} searchQuery={searchQuery} />
      <div className="flex gap-9 mt-10">
        <div>
          <div className="">
            <h1 className="text-xl font-bold py-4">Other Users on this app</h1>
            <div className="flex flex-col gap-4 max-w-3xl overflow-x-scroll sm:flex-row">
              {registeredUsers &&
                registeredUsers.map((user) => (
                  <FriendCard
                    key={user._id}
                    user={user}
                    isFriend={false}
                    id={user._id}
                  />
                ))}
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-xl font-bold py-4">Suggested Friends</h1>
            <div className="flex flex-col gap-4 max-w-3xl overflow-x-scroll sm:flex-row">
              {suggestedFriends.length === 0 && <p>No suggested friends</p>}
              {suggestedFriends &&
                suggestedFriends.map((user) => (
                  <FriendCard key={user._id} user={user} isFriend={false} />
                ))}
            </div>
          </div>
        </div>
        <div>
          <h1 className="font-bold">My Friends</h1>
          <div className="flex flex-col gap-4">
            {myFriends.length === 0 && <p>No friends yet</p>}
            {myFriends &&
              myFriends.map((friend) => (
                <FriendCard
                  key={friend._id}
                  user={friend}
                  isFriend={true}
                  id={friend._id}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
