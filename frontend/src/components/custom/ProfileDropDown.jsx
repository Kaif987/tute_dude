import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUserApi } from "@/lib/api";
import { LogOut } from "lucide-react";

export default function ProfileDropdown() {
  const handleLogout = async () => {
    console.log("Logging out...");
    await logoutUserApi();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="/placeholder.svg?height=32&width=32"
              alt="@username"
            />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
