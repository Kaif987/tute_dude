import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { UserPlus } from "lucide-react"

export default function Component() {
  return (
    <Card className="w-[250px]">
      <CardContent className="flex flex-col items-center pt-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User avatar" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <h2 className="mt-4 text-xl font-semibold">User Name</h2>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Send Friend Request
        </Button>
      </CardFooter>
    </Card>
  )
}