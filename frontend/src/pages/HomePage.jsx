import Navbar from "@/components/custom/Navbar";
import FriendCard from "@/components/custom/FriendCard";
import OtherUser from "@/components/custom/OtherUser";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/lib/utils";
import toast from "react-hot-toast";

export default function HomePage() {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery);

  const onSearch = (value) => {
    setSearchQuery(value);
  };

  useEffect(() => {
    fetchRegisteredUser();
  }, [debouncedSearch]);

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

  const sendFriendRequest = async (id) => {
    const response = await api.get(`/api/v1/friend/send/${id}`);
    const data = response.data;

    if (data.success) {
      console.log("Friend request sent successfully");
      toast("Friend request sent successfully", {
        icon: "👋",
      });
    }
  };

  const unfriend = async (id) => {
    const response = await api.get(`/api/v1/friend/unfriend/${id}`);
    const data = response.data;
    if (data.success) {
      toast("Unfriended Successfully", {
        icon: "👋",
      });
    }

    setMyFriends((prev) => prev.filter((friend) => friend._id !== id));
  };

  const acceptFriendRequest = async (id) => {
    const response = await api.get(`/api/v1/friend/accept/${id}`);
    const data = response.data;
    if (data.success) {
      toast("Friend Request Accepted", {
        icon: "👋",
      });

      setMyFriends((prev) => [...prev, data.data]);
      setRegisteredUsers((prev) => prev.filter((user) => user._id !== id));
    }
  };

  return (
    <div className="mx-auto py-4 container max-w-7xl">
      <Navbar onSearch={onSearch} searchQuery={searchQuery} />
      {/* <Navbar /> */}
      <div className="flex gap-9 mt-10">
        <div>
          <div className="">
            <h1 className="text-xl font-bold py-4">Other Users on this app</h1>
            <div className="flex flex-col gap-4 max-w-3xl overflow-x-scroll sm:flex-row">
              {registeredUsers.length === 0 && <p>No registered users found</p>}
              {registeredUsers &&
                registeredUsers.map((user) => (
                  <OtherUser
                    key={user._id}
                    user={user}
                    id={user._id}
                    onSendFriendRequest={sendFriendRequest}
                    onAcceptFriendRequest={acceptFriendRequest}
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
                  <OtherUser
                    key={user._id}
                    user={user}
                    onSendFriendRequest={sendFriendRequest}
                  />
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
                  id={friend._id}
                  onUnfriend={unfriend}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
