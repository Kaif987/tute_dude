import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl items-center space-x-2"
    >
      <Input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
