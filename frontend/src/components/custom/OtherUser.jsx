import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { useState } from "react";

export default function Component({
  user,
  id,
  onSendFriendRequest,
  onAcceptFriendRequest,
}) {
  const [friendRequestSent, setFriendRequestSent] = useState(
    user.friendRequestSent
  );
  const sendFriendRequest = async () => {
    await onSendFriendRequest(id);
    setFriendRequestSent(true);
  };

  const handleAcceptFriendRequest = async () => {
    await onAcceptFriendRequest(id);
  };

  return (
    <Card className="min-w-[250px]">
      <CardContent className="flex flex-col items-center pt-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/placeholder.svg" alt="User avatar" />
          <AvatarFallback>{user?.username || "UN"}</AvatarFallback>
        </Avatar>
        <h2 className="mt-4 text-xl font-semibold">{user?.username}</h2>
      </CardContent>
      <CardFooter>
        {user.friendRequestReceived ? (
          <Button onClick={handleAcceptFriendRequest} variant="secondary">
            Accept
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={sendFriendRequest}
            disabled={friendRequestSent}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {friendRequestSent ? "Friend Request Sent" : "Send Friend Request"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
