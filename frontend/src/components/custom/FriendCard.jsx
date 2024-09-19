import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";

export default function Component({ user, id, onUnfriend }) {
  const [unfriendStatus, setUnfriendStatus] = useState(false);

  const unfriend = async () => {
    await onUnfriend(id);
    setUnfriendStatus(true);
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
        <Button className="w-full" onClick={unfriend} disabled={unfriendStatus}>
          {unfriendStatus ? "Unfriended" : "Unfriend"}
        </Button>
      </CardFooter>
    </Card>
  );
}
