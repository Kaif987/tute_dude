import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState([]);

  const clearNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const acceptFriendRequest = async (id) => {
    const response = await api.get(`/api/v1/friend/accept/${id}`);
    if (response.success) {
      toast("Friend request accepted successfully", {
        icon: "👋",
      });
    }
    clearNotification(id);
  };

  const declineFriendRequest = async (id) => {
    const response = await api.get(`/api/v1/friend/decline/${id}`);
    if (response.success) {
      toast("Friend request declined successfully", {
        icon: "👋",
      });
    }
    clearNotification(id);
  };

  const fetchFriendRequests = async () => {
    const response = await api.get("/api/v1/friend/friend-request");
    const data = response.data;

    if (data.success) {
      if (!data) {
        return;
      }

      const notificationObject = data.data.map((item) => {
        return {
          id: item._id,
          message: "Incoming friend request from" + item.username,
        };
      });
      console.log(notificationObject);
      setNotifications(notificationObject);
    }
  };

  useEffect(() => {
    const internal = setInterval(() => {
      fetchFriendRequests();
    }, 5000);

    return () => {
      clearInterval(internal);
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-center justify-between p-4"
              >
                <span className="mr-2">{notification.message}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => acceptFriendRequest(notification.id)}
                >
                  Accept
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => declineFriendRequest(notification.id)}
                >
                  Decline
                </Button>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No new notifications
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
