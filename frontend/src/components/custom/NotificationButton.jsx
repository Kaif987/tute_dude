import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

// type Notification = {
//   id: string
//   message: string
// }

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState([
    { id: "1", message: "You have an incoming friend request from John Doe" },
  ]);

  const clearNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

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
                  variant="ghost"
                  size="sm"
                  onClick={() => clearNotification(notification.id)}
                >
                  Clear
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
