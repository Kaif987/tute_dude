import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { api } from "@/lib/api";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function Component({ user, isFriend, id }) {
  const sendFriendRequest = async () => {
    const response = await api.get(`/api/v1/friend/send/${id}`);
    const data = response.data;

    if (data.success) {
      console.log("Friend request sent successfully");
      toast("Friend request sent successfully", {
        icon: "👋",
      });
    }
  };

  const unfriend = async () => {
    const response = await api.get(`/api/v1/friend/unfriend/${id}`);
    const data = response.data;
    if (data.success) {
      toast("Unfriended Successfully", {
        icon: "👋",
      });
    }
  };

  return (
    <Card className="w-[250px]">
      <CardContent className="flex flex-col items-center pt-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/placeholder.svg" alt="User avatar" />
          <AvatarFallback>{user?.username || "UN"}</AvatarFallback>
        </Avatar>
        <h2 className="mt-4 text-xl font-semibold">{user?.username}</h2>
      </CardContent>
      <CardFooter>
        {isFriend ? (
          <Button className="w-full" onClick={unfriend}>
            Unfriend
          </Button>
        ) : (
          <Button className="w-full" onClick={sendFriendRequest}>
            <UserPlus className="mr-2 h-4 w-4" />
            Send Friend Request
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
