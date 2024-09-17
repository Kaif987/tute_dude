import Navbar from "@/components/custom/Navbar";
import FriendCard from "@/components/custom/FriendCard";

export default function HomePage() {
  return (
    <div className="mx-auto py-4 container max-w-7xl">
      <Navbar />
      <div className="flex gap-4">
        <div>
          <div className="">
            <h1 className="text-xl font-bold py-4">Other Users on this app</h1>
            <div className="flex gap-4">
              {new Array(5).fill(null).map((_, i) => (
                <FriendCard key={i} />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold py-4">Suggested Friends</h1>
            <div className="flex gap-4">
              {new Array(5).fill(null).map((_, i) => (
                <FriendCard key={i} />
              ))}
            </div>
          </div>
        </div>
        <div>
          <h1 className="font-bold">My Friends</h1>
          <div className="flex flex-col gap-4">
            {new Array(3).fill(null).map((_, i) => (
              <FriendCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
