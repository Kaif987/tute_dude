import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { UserPlus, UserCheck, UserMinus } from "lucide-react";

// type UserProfileProps = {
//   username: string
//   hobbies: string[]
//   email: string
//   phoneNumber: string
//   avatarUrl?: string
// }

export default function UserProfile({
  username,
  hobbies,
  email,
  phoneNumber,
  avatarUrl,
}) {
  const [friendStatus, setFriendStatus] = useState("none");

  const handleFriendAction = () => {
    switch (friendStatus) {
      case "none":
        setFriendStatus("pending");
        break;
      case "pending":
        setFriendStatus("friend");
        break;
      case "friend":
        setFriendStatus("none");
        break;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex items-center">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={avatarUrl || "/placeholder.svg?height=96&width=96"}
            alt={username}
          />
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <span className="font-semibold">Username:</span> {username}
        </div>
        <div>
          <span className="font-semibold">Hobbies:</span> {hobbies.join(", ")}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {email}
        </div>
        <div>
          <span className="font-semibold">Phone number:</span>{" "}
          {phoneNumber.replace(/\d(?=\d{4})/g, "*")}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleFriendAction}
          variant={friendStatus === "friend" ? "destructive" : "default"}
          className="w-full"
        >
          {friendStatus === "none" && (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Send Friend Request
            </>
          )}
          {friendStatus === "pending" && (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Accept Friend Request
            </>
          )}
          {friendStatus === "friend" && (
            <>
              <UserMinus className="mr-2 h-4 w-4" />
              Unfriend
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
